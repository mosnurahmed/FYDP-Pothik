import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  formatDate,
  formatTime,
  formatDuration,
} from "@/lib/utils";
import { MapPin, Clock, Armchair, Ticket } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string;

  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { schedule: { include: { route: true, bus: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">
          My Bookings
        </h1>
        <p className="text-ink-600 text-sm mt-1">
          Every trip you've ever taken with Pothik.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-600">
            <Ticket className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
            No bookings yet
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Once you book a bus, it'll show up here.
          </p>
          <Link href="/search" className="btn-primary mt-5">
            Find buses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft hover:shadow-lg transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-bold text-ink-900">
                    {b.schedule.route.fromCity} → {b.schedule.route.toCity}
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5">
                    {b.schedule.bus.operator} · Booking{" "}
                    <span className="font-mono font-bold">
                      {b.bookingCode}
                    </span>
                  </div>
                </div>
                <span
                  className={
                    b.status === "CONFIRMED"
                      ? "badge-brand"
                      : b.status === "CANCELLED"
                        ? "badge bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                        : "badge-accent"
                  }
                >
                  {b.status}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-4">
                <Cell
                  icon={<MapPin className="h-4 w-4" />}
                  label="Date"
                  value={formatDate(b.schedule.departureTime)}
                />
                <Cell
                  icon={<Clock className="h-4 w-4" />}
                  label="Time"
                  value={`${formatTime(
                    b.schedule.departureTime
                  )} · ${formatDuration(
                    b.schedule.route.durationMinutes
                  )}`}
                />
                <Cell
                  icon={<Armchair className="h-4 w-4" />}
                  label="Seats"
                  value={b.seatNumbers.join(", ")}
                />
                <Cell
                  icon={<Ticket className="h-4 w-4" />}
                  label="Total"
                  value={formatPrice(b.totalAmount)}
                  highlight
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Cell({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600 shrink-0">
        {icon}
      </span>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-ink-400">
          {label}
        </div>
        <div
          className={
            highlight
              ? "font-display font-bold text-brand-700"
              : "font-medium text-ink-900"
          }
        >
          {value}
        </div>
      </div>
    </div>
  );
}
