import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Armchair,
  User,
  Phone,
  Mail,
  Download,
  Ticket,
} from "lucide-react";
import {
  formatPrice,
  formatTime,
  formatDateLong,
  formatDuration,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  params,
}: {
  params: { code: string };
}) {
  const booking = await prisma.booking.findUnique({
    where: { bookingCode: params.code },
    include: {
      schedule: { include: { bus: true, route: true } },
    },
  });

  if (!booking) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <section className="container-padded py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 animate-fade-in">
                <CheckCircle2
                  className="h-12 w-12 text-brand-600"
                  strokeWidth={2}
                />
              </div>
              <h1 className="mt-6 font-display text-3xl md:text-4xl font-bold text-ink-900">
                You're booked, safe travels!
              </h1>
              <p className="mt-3 text-ink-600">
                We've sent a copy to{" "}
                <span className="font-semibold text-ink-900">
                  {booking.passengerEmail}
                </span>
                . Your booking code is{" "}
                <span className="font-mono font-bold text-brand-700">
                  {booking.bookingCode}
                </span>
                .
              </p>
            </div>

            {/* Ticket */}
            <div className="mt-10 relative overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
              <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="h-6 w-6" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-80">
                      E-Ticket
                    </div>
                    <div className="font-display font-bold">
                      {booking.schedule.bus.operator}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest opacity-80">
                    Code
                  </div>
                  <div className="font-mono font-bold">
                    {booking.bookingCode}
                  </div>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-ink-50" />
                <span className="absolute -right-3 top-0 h-6 w-6 rounded-full bg-ink-50" />
              </div>

              <div className="p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Detail
                    icon={<MapPin className="h-4 w-4" />}
                    label="Route"
                    value={`${booking.schedule.route.fromCity} → ${booking.schedule.route.toCity}`}
                  />
                  <Detail
                    icon={<Calendar className="h-4 w-4" />}
                    label="Date"
                    value={formatDateLong(booking.schedule.departureTime)}
                  />
                  <Detail
                    icon={<Clock className="h-4 w-4" />}
                    label="Time"
                    value={`${formatTime(
                      booking.schedule.departureTime
                    )} → ${formatTime(
                      booking.schedule.arrivalTime
                    )} · ${formatDuration(
                      booking.schedule.route.durationMinutes
                    )}`}
                  />
                  <Detail
                    icon={<Armchair className="h-4 w-4" />}
                    label="Seats"
                    value={booking.seatNumbers.join(", ")}
                  />
                  <Detail
                    icon={<User className="h-4 w-4" />}
                    label="Passenger"
                    value={booking.passengerName}
                  />
                  <Detail
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={booking.passengerPhone}
                  />
                </div>

                <div className="mt-6 border-t border-dashed border-ink-200 pt-5 flex items-center justify-between">
                  <span className="text-sm text-ink-600">Total paid</span>
                  <span className="font-display text-2xl font-bold text-brand-700">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/dashboard/bookings" className="btn-primary">
                View all bookings
              </Link>
              <Link href="/" className="btn-secondary">
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 shrink-0">
        {icon}
      </span>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-ink-400">
          {label}
        </div>
        <div className="font-medium text-ink-900">{value}</div>
      </div>
    </div>
  );
}
