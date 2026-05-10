"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Snowflake,
  Wifi,
  BatteryCharging,
  Tv,
  Coffee,
  Bed,
  Droplet,
  MapPin as MapPinIcon,
  Star,
  ArrowRight,
  Bus as BusIcon,
} from "lucide-react";
import { formatPrice, formatTime, formatDuration } from "@/lib/utils";

const amenityIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  ac: Snowflake,
  wifi: Wifi,
  charging: BatteryCharging,
  tv: Tv,
  snacks: Coffee,
  blanket: Bed,
  water: Droplet,
  tracking: MapPinIcon,
};

type Props = {
  schedule: {
    id: string;
    departureTime: Date | string;
    arrivalTime: Date | string;
    price: number;
    availableSeats: number;
    bus: {
      operator: string;
      busNumber: string;
      type: string;
      totalSeats: number;
      amenities: string[];
      rating: number;
    };
    route: {
      fromCity: string;
      toCity: string;
      durationMinutes: number;
    };
  };
};

export default function BusCard({ schedule }: Props) {
  const { bus, route } = schedule;
  const dep = new Date(schedule.departureTime);
  const arr = new Date(schedule.arrivalTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group rounded-2xl border border-ink-100 bg-white shadow-soft transition-all hover:shadow-lg hover:border-brand-200"
    >
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-4">
          <div className="flex flex-wrap items-start gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
              <BusIcon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-semibold text-ink-900">
                  {bus.operator}
                </h3>
                <span className="badge-brand">
                  {bus.type.replace("_", " ")}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-600">
                  <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                  {bus.rating.toFixed(1)}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-ink-500">
                Bus #{bus.busNumber} · {bus.totalSeats} seats
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <div className="font-display text-2xl font-bold text-ink-900 tabular-nums">
                {formatTime(dep)}
              </div>
              <div className="text-xs text-ink-500">{route.fromCity}</div>
            </div>
            <div className="flex-1 relative px-2">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent" />
              <div className="relative grid place-items-center">
                <span className="rounded-full border border-ink-200 bg-white px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-600">
                  {formatDuration(route.durationMinutes)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold text-ink-900 tabular-nums">
                {formatTime(arr)}
              </div>
              <div className="text-xs text-ink-500">{route.toCity}</div>
            </div>
          </div>

          {bus.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {bus.amenities.slice(0, 5).map((a) => {
                const Icon = amenityIcon[a] ?? Snowflake;
                return (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-ink-50 px-2.5 py-1 text-xs text-ink-700 capitalize"
                  >
                    <Icon className="h-3.5 w-3.5 text-brand-600" />
                    {a}
                  </span>
                );
              })}
              {bus.amenities.length > 5 && (
                <span className="inline-flex items-center rounded-lg bg-ink-50 px-2.5 py-1 text-xs text-ink-500">
                  +{bus.amenities.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="md:border-l md:border-ink-100 md:pl-6 flex md:flex-col items-center md:items-end justify-between gap-4 md:min-w-[180px]">
          <div className="md:text-right">
            <div className="text-[10px] uppercase tracking-wider text-ink-400">
              Starting from
            </div>
            <div className="font-display text-2xl md:text-3xl font-bold text-brand-700">
              {formatPrice(schedule.price)}
            </div>
            <div className="mt-1 text-xs text-ink-500">
              <span
                className={
                  schedule.availableSeats < 5
                    ? "text-rose-600 font-semibold"
                    : "text-emerald-600 font-semibold"
                }
              >
                {schedule.availableSeats}
              </span>{" "}
              seats left
            </div>
          </div>
          <Link
            href={`/booking/${schedule.id}`}
            className="btn-primary group/btn"
          >
            Select seats
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
