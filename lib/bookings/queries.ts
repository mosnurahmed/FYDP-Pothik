import { prisma } from "../prisma";
import { NotFoundError } from "../shared/errors";

export async function getMyBookings(userId: string) {
  return prisma.tourBooking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      tourPackage: {
        select: {
          id: true,
          slug: true,
          title: true,
          coverImage: true,
          destinationCity: true,
          durationDays: true,
          departureDate: true,
          returnDate: true,
          status: true,
        },
      },
      pickupPoint: {
        select: { name: true, city: true, pickupTime: true, returnTime: true },
      },
    },
  });
}

export async function getBookingByCode(bookingCode: string, userId?: string) {
  const where = userId ? { bookingCode, userId } : { bookingCode };
  const booking = await prisma.tourBooking.findFirst({
    where,
    include: {
      tourPackage: {
        include: {
          spots: { orderBy: [{ dayNumber: "asc" }, { orderIndex: "asc" }] },
        },
      },
      pickupPoint: true,
    },
  });
  if (!booking) throw new NotFoundError("Booking");
  return booking;
}

export async function getUpcomingBookingForUser(userId: string) {
  return prisma.tourBooking.findFirst({
    where: {
      userId,
      status: "CONFIRMED",
      tourPackage: { departureDate: { gte: new Date() } },
    },
    orderBy: { tourPackage: { departureDate: "asc" } },
    include: {
      tourPackage: {
        select: {
          slug: true,
          title: true,
          coverImage: true,
          destinationCity: true,
          durationDays: true,
          departureDate: true,
        },
      },
      pickupPoint: {
        select: { name: true, city: true, pickupTime: true },
      },
    },
  });
}

/**
 * Pickup distribution for the bus assignment dashboard.
 * Returns one row per pickup point with total travellers counted.
 */
export async function getPickupDistribution(tourPackageId: string) {
  const points = await prisma.pickupPoint.findMany({
    where: { tourPackageId },
    orderBy: { orderIndex: "asc" },
    include: {
      bookings: {
        where: { status: { in: ["CONFIRMED", "PENDING"] } },
        select: { adultsCount: true, childrenCount: true, infantsCount: true },
      },
    },
  });

  return points.map((p) => {
    const travellers = p.bookings.reduce(
      (acc, b) => acc + b.adultsCount + b.childrenCount + b.infantsCount,
      0,
    );
    return {
      id: p.id,
      name: p.name,
      city: p.city,
      pickupTime: p.pickupTime,
      travellers,
      bookingsCount: p.bookings.length,
    };
  });
}
