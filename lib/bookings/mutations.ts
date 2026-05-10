import { prisma } from "../prisma";
import {
  CapacityExceededError,
  NotFoundError,
  ValidationError,
} from "../shared/errors";
import { generateBookingCode } from "../utils";
import { createBookingSchema, type CreateBookingInput } from "./schemas";

/**
 * Atomic booking creation. Verifies capacity inside a transaction
 * so two concurrent users can never push the tour past its limit.
 */
export async function createBooking(input: CreateBookingInput, userId: string) {
  const data = createBookingSchema.parse(input);

  const totalRequested =
    data.adultsCount + data.childrenCount + data.infantsCount;

  if (totalRequested === 0) {
    throw new ValidationError("Add at least one traveller");
  }
  if (data.travellers.length !== totalRequested) {
    throw new ValidationError(
      `Provide details for all ${totalRequested} travellers`,
    );
  }

  return prisma.$transaction(async (tx) => {
    const tour = await tx.tourPackage.findUnique({
      where: { id: data.tourPackageId },
      select: {
        id: true,
        status: true,
        capacity: true,
        adultPrice: true,
        childPrice: true,
        pickupPoints: { where: { id: data.pickupPointId }, select: { id: true } },
      },
    });
    if (!tour) throw new NotFoundError("Tour");
    if (tour.status !== "PUBLISHED") {
      throw new ValidationError("This tour isn't open for bookings");
    }
    if (tour.pickupPoints.length === 0) {
      throw new ValidationError("Selected pickup point doesn't belong to this tour");
    }

    const counts = await tx.tourBooking.aggregate({
      where: {
        tourPackageId: tour.id,
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      _sum: {
        adultsCount: true,
        childrenCount: true,
        infantsCount: true,
      },
    });
    const taken =
      (counts._sum.adultsCount ?? 0) +
      (counts._sum.childrenCount ?? 0) +
      (counts._sum.infantsCount ?? 0);
    const remaining = tour.capacity - taken;
    if (totalRequested > remaining) {
      throw new CapacityExceededError(remaining);
    }

    const totalAmount =
      data.adultsCount * tour.adultPrice +
      data.childrenCount * tour.childPrice;

    return tx.tourBooking.create({
      data: {
        bookingCode: generateBookingCode(),
        userId,
        tourPackageId: tour.id,
        pickupPointId: data.pickupPointId,
        adultsCount: data.adultsCount,
        childrenCount: data.childrenCount,
        infantsCount: data.infantsCount,
        travellers: data.travellers,
        totalAmount,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        specialRequest: data.specialRequest,
        status: "CONFIRMED",
        paymentStatus: "PAID",
      },
    });
  });
}

export async function cancelBooking(bookingCode: string, userId: string) {
  const booking = await prisma.tourBooking.findFirst({
    where: { bookingCode, userId },
  });
  if (!booking) throw new NotFoundError("Booking");
  if (booking.status === "CANCELLED") return booking;

  return prisma.tourBooking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED", paymentStatus: "REFUNDED" },
  });
}
