import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

type Props = {
  tour: {
    slug: string;
    title: string;
    coverImage: string;
    destinationCity: string;
    region: string;
    durationDays: number;
    departureDate: Date | string;
    adultPrice: number;
    capacity: number;
    _count?: { bookings: number; spots?: number; pickupPoints?: number };
  };
};

const regionLabel: Record<string, string> = {
  COASTAL: "Coastal",
  HILL_TRACTS: "Hill Tracts",
  HISTORIC: "Historic",
  RIVERINE: "Riverine",
  URBAN: "Urban",
  FOREST: "Forest",
  TEA_COUNTRY: "Tea Country",
};

export default function TourCard({ tour }: Props) {
  const booked = tour._count?.bookings ?? 0;
  const remaining = Math.max(0, tour.capacity - booked);
  const isAlmostFull = remaining <= 5 && remaining > 0;
  const isFull = remaining === 0;
  const durationLabel =
    tour.durationDays === 1 ? "Day trip" : `${tour.durationDays} days`;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={tour.coverImage}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-900/20 to-transparent" />

        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-ink-900 backdrop-blur shadow-sm">
          <Clock className="h-3 w-3 text-brand-600" />
          {durationLabel}
        </span>

        {(isFull || isAlmostFull) && (
          <span
            className={`absolute top-3 right-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold backdrop-blur shadow-sm ${
              isFull
                ? "bg-rose-500 text-white"
                : "bg-accent-400 text-ink-900"
            }`}
          >
            {isFull ? "Sold out" : `${remaining} left`}
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-90">
            <MapPin className="h-3 w-3" />
            {regionLabel[tour.region] ?? tour.region} · {tour.destinationCity}
          </div>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight line-clamp-2">
            {tour.title}
          </h3>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col">
        <div className="grid grid-cols-2 gap-3 text-xs text-ink-600">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-brand-500" />
            {formatDate(tour.departureDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-brand-500" />
            {booked}/{tour.capacity} booked
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-ink-100 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-400">
              From
            </div>
            <div className="font-display text-xl font-bold text-brand-700">
              {formatPrice(tour.adultPrice)}
              <span className="text-xs font-medium text-ink-500"> /adult</span>
            </div>
          </div>
          <span className="text-sm font-semibold text-brand-700 group-hover:underline">
            View tour →
          </span>
        </div>
      </div>
    </Link>
  );
}
