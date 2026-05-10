import Link from "next/link";
import {
  Compass,
  Bus,
  Ticket,
  Wallet,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  getDashboardStats,
  getToursNeedingAttention,
} from "@/lib/admin";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [stats, flagged] = await Promise.all([
    getDashboardStats(),
    getToursNeedingAttention(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">
          Admin overview
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Manage tours, monitor bookings, assign buses.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<Compass className="h-5 w-5" />}
          label="Active tours"
          value={String(stats.activeTours)}
          tone="brand"
        />
        <Stat
          icon={<Ticket className="h-5 w-5" />}
          label="Total bookings"
          value={String(stats.totalBookings)}
          tone="accent"
        />
        <Stat
          icon={<Wallet className="h-5 w-5" />}
          label="Revenue"
          value={formatPrice(stats.totalRevenue)}
          tone="violet"
        />
        <Stat
          icon={<Bus className="h-5 w-5" />}
          label="Buses in fleet"
          value={String(stats.fleetSize)}
          tone="sky"
        />
      </div>

      {flagged.length > 0 && (
        <div className="rounded-2xl border border-accent-200 bg-accent-50/50 p-6">
          <div className="flex items-center gap-2 text-accent-800 font-semibold">
            <AlertCircle className="h-5 w-5" />
            Tours needing attention
          </div>
          <p className="mt-1 text-sm text-accent-700">
            These tours depart in the next 14 days and need a decision.
          </p>
          <div className="mt-4 space-y-2">
            {flagged.map((t) => (
              <Link
                key={t.id}
                href={`/admin/tours/${t.id}`}
                className="flex items-center justify-between rounded-xl bg-white p-4 hover:shadow-md transition-shadow"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-ink-900 truncate">
                    {t.title}
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5">
                    {formatDate(t.departureDate)} · {t.booked}/{t.capacity}{" "}
                    booked
                  </div>
                </div>
                <span
                  className={`badge text-[10px] ${
                    t.belowMinimum
                      ? "bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200"
                      : "bg-brand-100 text-brand-700 ring-1 ring-inset ring-brand-200"
                  }`}
                >
                  {t.belowMinimum ? "Below minimum" : "Almost full"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/tours/new"
          className="group rounded-2xl border border-ink-100 bg-white p-6 shadow-soft hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
            Create a new tour
          </h3>
          <p className="mt-1 text-sm text-ink-600">
            Add destination, spots, pickup points, and pricing.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
            Start <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/admin/fleet"
          className="group rounded-2xl border border-ink-100 bg-white p-6 shadow-soft hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-700 text-white">
            <Bus className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
            Manage bus fleet
          </h3>
          <p className="mt-1 text-sm text-ink-600">
            Add buses, set capacity and amenities.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
            Open <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "brand" | "accent" | "violet" | "sky";
}) {
  const palette = {
    brand: "from-brand-500 to-brand-700",
    accent: "from-accent-400 to-accent-600",
    violet: "from-violet-500 to-purple-700",
    sky: "from-sky-500 to-indigo-700",
  }[tone];
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${palette} text-white shadow-md`}
      >
        {icon}
      </div>
      <div className="mt-4 font-display text-2xl font-bold text-ink-900 tabular-nums">
        {value}
      </div>
      <div className="text-xs font-semibold text-ink-700">{label}</div>
    </div>
  );
}
