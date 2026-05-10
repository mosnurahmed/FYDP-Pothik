import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  Wallet,
  Ticket,
  ArrowRight,
  Sparkles,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getMyBookings,
  getUpcomingBookingForUser,
} from "@/lib/bookings";
import { getFeaturedTours } from "@/lib/tours";
import {
  formatPrice,
  formatDate,
  formatTime,
  formatDateLong,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const session = await requireUser();
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [bookings, upcoming, featured, totalSpent, upcomingCount] =
    await Promise.all([
      getMyBookings(session.id),
      getUpcomingBookingForUser(session.id),
      getFeaturedTours(3),
      prisma.tourBooking.aggregate({
        where: { userId: session.id, paymentStatus: "PAID" },
        _sum: { totalAmount: true },
      }),
      prisma.tourBooking.count({
        where: {
          userId: session.id,
          status: "CONFIRMED",
          tourPackage: { departureDate: { gte: now } },
        },
      }),
    ]);

  const recentBookings = bookings.slice(0, 4);
  const firstName = session.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {session.role === "ADMIN" && (
        <Link
          href="/admin"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-accent-200 bg-gradient-to-r from-accent-50 to-amber-50 p-4 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-md">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <div className="font-semibold text-ink-900">
                You have admin access
              </div>
              <div className="text-xs text-ink-600">
                Open the admin panel to manage tours, bookings, and the bus fleet.
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-700 group-hover:underline">
            Open admin <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      )}

      {/* Welcome banner */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 p-8 md:p-10 text-white shadow-soft">
        <div className="absolute inset-0 -z-10 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />

        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent-300" />
              {upcomingCount > 0
                ? `${upcomingCount} tour${upcomingCount > 1 ? "s" : ""} coming up`
                : "No upcoming tours yet"}
            </span>
            <h1 className="mt-4 font-display text-3xl md:text-4xl font-bold leading-tight">
              {greeting}, {firstName} 👋
            </h1>
            <p className="mt-2 text-brand-100 max-w-lg">
              Browse new tours, manage bookings, or revisit past trips. The
              road awaits.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-5 py-2.5 font-semibold text-ink-900 shadow-md transition-all hover:bg-accent-300 hover:shadow-lg active:scale-[0.98]"
              >
                <Compass className="h-4 w-4" />
                Find a tour
              </Link>
              <Link
                href="/dashboard/bookings"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 font-semibold backdrop-blur transition-colors hover:bg-white/20"
              >
                <Ticket className="h-4 w-4" />
                My tours
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <Plane className="h-32 w-32 text-white/15 -rotate-12" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<Ticket className="h-5 w-5" />}
          label="Total tours"
          value={String(bookings.length)}
          tone="brand"
          hint="All-time bookings with Pothik"
        />
        <Stat
          icon={<MapPin className="h-5 w-5" />}
          label="Upcoming"
          value={String(upcomingCount)}
          tone="accent"
          hint={
            upcomingCount > 0 ? "On the calendar" : "Plan your next journey"
          }
        />
        <Stat
          icon={<Wallet className="h-5 w-5" />}
          label="Total spent"
          value={formatPrice(totalSpent._sum.totalAmount ?? 0)}
          tone="violet"
          hint="Across confirmed tours"
        />
      </section>

      {/* Next tour + Recent bookings */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Next tour */}
        <div className="rounded-2xl border border-ink-100 bg-white shadow-soft overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-100 text-brand-700">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="font-display text-base font-semibold text-ink-900">
                Your next tour
              </h2>
            </div>
          </div>

          {upcoming ? (
            <div>
              <div className="relative h-40">
                <Image
                  src={upcoming.tourPackage.coverImage}
                  alt={upcoming.tourPackage.title}
                  fill
                  sizes="600px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="font-display text-xl font-bold leading-tight">
                    {upcoming.tourPackage.title}
                  </div>
                  <div className="text-xs opacity-90">
                    {upcoming.tourPackage.destinationCity}
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Cell
                    icon={<Calendar className="h-3.5 w-3.5" />}
                    label="Departure"
                    value={formatDate(upcoming.tourPackage.departureDate)}
                  />
                  <Cell
                    icon={<Clock className="h-3.5 w-3.5" />}
                    label="Pickup"
                    value={`${formatTime(upcoming.pickupPoint.pickupTime)} · ${
                      upcoming.pickupPoint.name
                    }`}
                  />
                </div>
                <div className="border-t border-dashed border-ink-200 pt-3 flex items-center justify-between">
                  <div className="text-xs text-ink-500">
                    Booking{" "}
                    <span className="font-mono font-bold text-ink-900">
                      {upcoming.bookingCode}
                    </span>
                  </div>
                  <Link
                    href={`/tours/${upcoming.tourPackage.slug}/book/success/${upcoming.bookingCode}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
                  >
                    View ticket <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
                <Plane className="h-6 w-6" />
              </div>
              <p className="mt-4 font-medium text-ink-900">
                No tours on the horizon
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Once you book a tour, the trip details will live here.
              </p>
              <Link href="/tours" className="btn-primary mt-5">
                <Compass className="h-4 w-4" /> Browse tours
              </Link>
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="rounded-2xl border border-ink-100 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-display text-base font-semibold text-ink-900">
              Recent bookings
            </h2>
            <Link
              href="/dashboard/bookings"
              className="text-sm font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
            >
              All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-10 text-center text-ink-500 text-sm">
              No bookings yet.
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recentBookings.map((b) => (
                <li
                  key={b.id}
                  className="px-5 py-4 hover:bg-ink-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-ink-900 truncate">
                        {b.tourPackage.title}
                      </div>
                      <div className="mt-0.5 text-xs text-ink-500 truncate">
                        {formatDate(b.tourPackage.departureDate)} ·{" "}
                        {b.pickupPoint.name}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display text-sm font-bold text-brand-700">
                        {formatPrice(b.totalAmount)}
                      </div>
                      <div className="mt-0.5">
                        <StatusBadge status={b.status} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Suggestions */}
      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-ink-900">
              Where to next?
            </h2>
            <Link
              href="/tours"
              className="text-sm font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
            >
              All tours <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((t) => (
              <Link
                key={t.id}
                href={`/tours/${t.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-ink-100 shadow-soft hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="relative h-36">
                  <Image
                    src={t.coverImage}
                    alt={t.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-900/30 to-transparent" />
                  <span className="absolute top-3 left-3 badge bg-white/90 text-ink-900 backdrop-blur">
                    {t.durationDays === 1
                      ? "Day trip"
                      : `${t.durationDays} days`}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="font-display text-base font-bold leading-tight line-clamp-1">
                      {t.title}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">
                      {formatPrice(t.adultPrice)} /adult ·{" "}
                      {formatDate(t.departureDate)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "brand" | "accent" | "violet";
  hint?: string;
}) {
  const palette = {
    brand: "from-brand-500 to-brand-700",
    accent: "from-accent-400 to-accent-600",
    violet: "from-violet-500 to-purple-700",
  }[tone];

  return (
    <div className="group rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${palette} text-white shadow-md transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>
      <div className="mt-4 font-display text-2xl md:text-3xl font-bold text-ink-900 tabular-nums">
        {value}
      </div>
      <div className="mt-0.5 text-xs font-semibold text-ink-700">{label}</div>
      {hint && <div className="mt-1 text-[11px] text-ink-500">{hint}</div>}
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
    <div className="rounded-xl bg-ink-50/60 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-medium text-ink-900 text-sm">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "CONFIRMED"
      ? "bg-brand-50 text-brand-700 ring-brand-200"
      : status === "CANCELLED"
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : status === "COMPLETED"
          ? "bg-ink-100 text-ink-700 ring-ink-200"
          : "bg-accent-50 text-accent-700 ring-accent-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${cls}`}
    >
      {status}
    </span>
  );
}
