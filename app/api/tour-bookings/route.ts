import { apiHandler } from "@/lib/shared/api";
import { requireUser } from "@/lib/auth";
import { createBooking } from "@/lib/bookings";

export const POST = (req: Request) =>
  apiHandler(async () => {
    const user = await requireUser();
    const body = await req.json();
    const booking = await createBooking(body, user.id);
    return { id: booking.id, bookingCode: booking.bookingCode };
  });
