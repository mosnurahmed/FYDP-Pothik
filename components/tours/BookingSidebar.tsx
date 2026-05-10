import Link from "next/link";
import { ArrowRight, Calendar, Users, Sparkles } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

type Props = {
  slug: string;
  adultPrice: number;
  childPrice: number;
  capacity: number;
  booked: number;
  departureDate: Date;
  durationDays: number;
  highlights: string[];
};

export default function BookingSidebar({
  slug,
  adultPrice,
  childPrice,
  capacity,
  booked,
  departureDate,
  durationDays,
  highlights,
}: Props) {
  const remaining = Math.max(0, capacity - booked);
  const isFull = remaining === 0;
  const isAlmostFull = remaining > 0 && remaining <= 5;
  const utilization = Math.min(100, Math.round((booked / capacity) * 100));

  return (
    <aside className="lg:sticky lg:top-24 space-y-4">
      <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-brand-700">
              {formatPrice(adultPrice)}
            </span>
            <span className="text-sm text-ink-500">/adult</span>
          </div>
          <div className="mt-1 text-sm text-ink-600">
            Children (5–12): {formatPrice(childPrice)} · Infants free
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <Row
            icon={<Calendar className="h-4 w-4" />}
            label="Departure"
            value={`${formatDate(departureDate)} · ${
              durationDays === 1 ? "Day trip" : `${durationDays} days`
            }`}
          />
          <Row
            icon={<Users className="h-4 w-4" />}
            label="Availability"
            value={
              isFull
                ? "Sold out"
                : `${remaining} of ${capacity} seats left`
            }
            highlight={isAlmostFull || isFull}
          />
        </div>

        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className={`h-full rounded-full transition-all ${
                isFull
                  ? "bg-rose-500"
                  : isAlmostFull
                    ? "bg-accent-400"
                    : "bg-brand-500"
              }`}
              style={{ width: `${utilization}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-ink-500 text-right">
            {utilization}% booked
          </div>
        </div>

        {isFull ? (
          <button
            disabled
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-200 px-5 py-3 text-sm font-semibold text-ink-500 cursor-not-allowed"
          >
            Sold out
          </button>
        ) : (
          <Link
            href={`/tours/${slug}/book`}
            className="btn-primary w-full mt-5"
          >
            Book this tour
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        <p className="mt-3 text-[11px] text-ink-500 text-center">
          Free cancellation up to 48 hours before departure.
        </p>
      </div>

      {highlights.length > 0 && (
        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
          <h3 className="font-display font-semibold text-ink-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-500" />
            What's included
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-ink-700">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

function Row({
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
    <div className="flex items-start justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-ink-500">
        <span className="text-brand-500">{icon}</span>
        {label}
      </span>
      <span
        className={
          highlight
            ? "font-semibold text-rose-600 text-right"
            : "font-medium text-ink-900 text-right"
        }
      >
        {value}
      </span>
    </div>
  );
}
