"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightLeft, MapPin, Calendar, Users, Search } from "lucide-react";
import { CITIES } from "@/lib/constants";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "hero" | "compact";
};

export default function SearchBar({ variant = "hero" }: Props) {
  const router = useRouter();
  const today = format(new Date(), "yyyy-MM-dd");
  const [from, setFrom] = useState("Dhaka");
  const [to, setTo] = useState("Sylhet");
  const [date, setDate] = useState(today);
  const [passengers, setPassengers] = useState(1);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from,
      to,
      date,
      passengers: String(passengers),
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "relative grid gap-3 rounded-2xl border border-white/40 bg-white/95 p-3 shadow-2xl backdrop-blur-xl",
        "md:grid-cols-[1fr_auto_1fr_1fr_auto_auto] md:items-center md:gap-2 md:p-2",
        variant === "compact" && "shadow-soft"
      )}
    >
      <Field label="From" icon={<MapPin className="h-4 w-4" />}>
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="bg-transparent w-full font-semibold text-ink-900 outline-none cursor-pointer"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="button"
        onClick={swap}
        aria-label="Swap origin and destination"
        className="hidden md:grid place-items-center h-10 w-10 mx-auto rounded-full border border-ink-200 bg-white text-ink-600 transition-all hover:border-brand-400 hover:text-brand-600 hover:rotate-180 hover:scale-110"
      >
        <ArrowRightLeft className="h-4 w-4" />
      </button>

      <Field label="To" icon={<MapPin className="h-4 w-4" />}>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="bg-transparent w-full font-semibold text-ink-900 outline-none cursor-pointer"
        >
          {CITIES.filter((c) => c !== from).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Date" icon={<Calendar className="h-4 w-4" />}>
        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-transparent w-full font-semibold text-ink-900 outline-none cursor-pointer"
        />
      </Field>

      <Field label="Passengers" icon={<Users className="h-4 w-4" />} compact>
        <select
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          className="bg-transparent font-semibold text-ink-900 outline-none cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        className="btn-primary !px-6 !py-3.5 md:!h-full md:rounded-xl group"
      >
        <Search className="h-4 w-4" />
        <span>Search</span>
      </button>
    </form>
  );
}

function Field({
  label,
  icon,
  children,
  compact,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <label
      className={cn(
        "group flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors hover:bg-brand-50 cursor-pointer",
        compact ? "min-w-0" : "min-w-0"
      )}
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors shrink-0">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-400">
          {label}
        </span>
        {children}
      </span>
    </label>
  );
}
