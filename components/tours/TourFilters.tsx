"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const REGIONS = [
  { value: "", label: "All regions" },
  { value: "COASTAL", label: "Coastal" },
  { value: "HILL_TRACTS", label: "Hill Tracts" },
  { value: "HISTORIC", label: "Historic" },
  { value: "RIVERINE", label: "Riverine" },
  { value: "TEA_COUNTRY", label: "Tea Country" },
  { value: "FOREST", label: "Forest" },
  { value: "URBAN", label: "Urban" },
];

const DURATION_TYPES = [
  { value: "", label: "Any duration" },
  { value: "DAY_TRIP", label: "Day trip (1 day)" },
  { value: "MULTI_DAY", label: "Multi-day" },
];

export default function TourFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  const search = params.get("search") ?? "";
  const region = params.get("region") ?? "";
  const duration = params.get("duration") ?? "";

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-ink-700">
        <Filter className="h-4 w-4 text-brand-600" />
        Filter tours
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            defaultValue={search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Search by destination or title…"
            className="input-field !pl-10"
          />
        </div>

        <select
          value={region}
          onChange={(e) => update("region", e.target.value)}
          className="input-field cursor-pointer"
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <select
          value={duration}
          onChange={(e) => update("duration", e.target.value)}
          className="input-field cursor-pointer"
        >
          {DURATION_TYPES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className={cn(
          "mt-2 text-[11px] text-ink-400 transition-opacity",
          isPending ? "opacity-100" : "opacity-0",
        )}
      >
        Updating…
      </div>
    </div>
  );
}
