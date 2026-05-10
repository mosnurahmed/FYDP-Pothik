import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBookingCode } from "@/lib/utils";

const schema = z.object({
  scheduleId: z.string(),
  seatNumbers: z.array(z.string()).min(1).max(6),
  passengerName: z.string().min(2),
  passengerPhone: z.string().min(6),
  passengerEmail: z.string().email(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { scheduleId, seatNumbers, passengerName, passengerPhone, passengerEmail } =
    parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.findUnique({
        where: { id: scheduleId },
        include: { seats: true },
      });
      if (!schedule) throw new Error("Schedule not found");

      // verify all requested seats are available
      const requested = schedule.seats.filter((s) =>
        seatNumbers.includes(s.seatNumber)
      );
      if (requested.length !== seatNumbers.length) {
        throw new Error("Some seats no longer exist");
      }
      const unavailable = requested.filter((s) => s.status !== "AVAILABLE");
      if (unavailable.length > 0) {
        throw new Error(
          `Seats ${unavailable.map((s) => s.seatNumber).join(", ")} are no longer available`
        );
      }

      const totalAmount = schedule.price * seatNumbers.length;
      const bookingCode = generateBookingCode();

      const booking = await tx.booking.create({
        data: {
          bookingCode,
          userId: (session.user as any).id,
          scheduleId,
          seatNumbers,
          totalAmount,
          status: "CONFIRMED",
          paymentStatus: "PAID",
          passengerName,
          passengerPhone,
          passengerEmail,
        },
      });

      await tx.seat.updateMany({
        where: {
          scheduleId,
          seatNumber: { in: seatNumbers },
        },
        data: {
          status: "BOOKED",
          bookingId: booking.id,
        },
      });

      await tx.schedule.update({
        where: { id: scheduleId },
        data: {
          availableSeats: { decrement: seatNumbers.length },
        },
      });

      return booking;
    });

    return NextResponse.json(
      { id: result.id, bookingCode: result.bookingCode },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Booking failed" },
      { status: 400 }
    );
  }
}
