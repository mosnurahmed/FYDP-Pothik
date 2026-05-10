import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { getMyBookings } from "@/lib/bookings";
import {
  formatPrice,
  formatDate,
  formatTime,
} from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Ticket,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const session = await requireUser();
  const bookings = await getMyBookings(session.id);

  const now = new Date();
  const upcoming = bookings.filter(
    (b) =>
      b.status !== "CANCELLED" &&
      new Date(b.tourPackage.departureDate) >= now,
  );
  const past = bookings.filter(
    (b) =>
      b.status === "CANCELLED" ||
      new Date(b.tourPackage.departureDate) < now,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">
          My Tours
        </h1>
        <p className="text-ink-600 text-sm mt-1">
          Every trip you've booked with Pothik.
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
            When you book your first tour, it'll show up here.
          </p>
          <Link href="/tours" className="btn-primary mt-5">
            Find a tour
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <BookingSection title="Upcoming" bookings={upcoming} />
          )}
          {past.length > 0 && (
            <BookingSection title="Past tours" bookings={past} muted />
          )}
        </>
      )}
    </div>
  );
}

function BookingSection({
  title,
  bookings,
  muted,
}: {
  title: string;
  bookings: Awaited<ReturnType<typeof getMyBookings>>;
  muted?: boolean;
}) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-ink-900 mb-4">
        {title}{" "}
        <span className="text-sm font-medium text-ink-500">
          ({bookings.length})
        </span>
      </h2>
      <div className="space-y-4">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} muted={muted} />
        ))}
      </div>
    </section>
  );
}

function BookingCard({
  booking,
  muted,
}: {
  booking: Awaited<ReturnType<typeof getMyBookings>>[number];
  muted?: boolean;
}) {
  const total =
    booking.adultsCount + booking.childrenCount + booking.infantsCount;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft hover:shadow-md transition-shadow ${
        muted ? "opacity-90" : ""
      }`}
    >
      <div className="grid md:grid-cols-[200px_1fr]">
        <div className="relative h-40 md:h-full">
          <Image
            src={booking.tourPackage.coverImage}
            alt={booking.tourPackage.title}
            fill
            sizes="200px"
            className="object-cover"
          />
          {booking.status === "CANCELLED" && (
            <div className="absolute inset-0 bg-rose-900/40 backdrop-blur-[1px] grid place-items-center">
              <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
                CANCELLED
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-ink-400">
                {booking.tourPackage.destinationCity} ·{" "}
                {booking.tourPackage.durationDays === 1
                  ? "Day trip"
                  : `${booking.tourPackage.durationDays} days`}
              </div>
              <h3 className="mt-1 font-display text-lg font-bold text-ink-900">
                {booking.tourPackage.title}
              </h3>
              <div className="mt-1 text-xs text-ink-500">
                Booking{" "}
                <span className="font-mono font-bold text-ink-700">
                  {booking.bookingCode}
                </span>
              </div>
            </div>
            <span
              className={`badge text-[10px] ${
                booking.status === "CONFIRMED"
                  ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200"
                  : booking.status === "CANCELLED"
                    ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
                    : "bg-ink-100 text-ink-700 ring-1 ring-inset ring-ink-200"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <Cell
              icon={<Calendar className="h-3.5 w-3.5" />}
              label="Departs"
              value={formatDate(booking.tourPackage.departureDate)}
            />
            <Cell
              icon={<Clock className="h-3.5 w-3.5" />}
              label="Pickup"
              value={formatTime(booking.pickupPoint.pickupTime)}
            />
            <Cell
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="From"
              value={booking.pickupPoint.name}
            />
            <Cell
              icon={<Users className="h-3.5 w-3.5" />}
              label="Travellers"
              value={`${total}`}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="font-display text-lg font-bold text-brand-700">
              {formatPrice(booking.totalAmount)}
            </div>
            <Link
              href={`/tours/${booking.tourPackage.slug}/book/success/${booking.bookingCode}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
            >
              View ticket <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-ink-400">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-ink-900 truncate">
        {value}
      </div>
    </div>
  );
}
