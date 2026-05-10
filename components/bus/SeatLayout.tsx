"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Steering } from "./icons/Steering";
import { cn } from "@/lib/utils";

export type SeatInfo = {
  seatNumber: string;
  status: "AVAILABLE" | "BOOKED" | "LOCKED";
};

type Props = {
  totalSeats: number;
  seats: SeatInfo[];
  selected: string[];
  onToggle: (seat: string) => void;
  maxSelectable?: number;
};

/**
 * Standard 2x2 layout with last row 2x3 (5 seats).
 * Generates seat numbers like A1, B1 (left side), C1, D1 (right side), back row LB1..LB5.
 */
function buildLayout(totalSeats: number) {
  const rows = Math.floor((totalSeats - 5) / 4);
  const layout: Array<Array<string | null>> = [];

  for (let r = 0; r < rows; r++) {
    const rowNum = r + 1;
    layout.push([
      `A${rowNum}`,
      `B${rowNum}`,
      null,
      `C${rowNum}`,
      `D${rowNum}`,
    ]);
  }
  // back row 5 seats
  layout.push(["LB1", "LB2", "LB3", "LB4", "LB5"]);
  return layout;
}

export default function SeatLayout({
  totalSeats,
  seats,
  selected,
  onToggle,
  maxSelectable = 6,
}: Props) {
  const layout = useMemo(() => buildLayout(totalSeats), [totalSeats]);
  const seatMap = useMemo(() => {
    const m = new Map<string, SeatInfo["status"]>();
    seats.forEach((s) => m.set(s.seatNumber, s.status));
    return m;
  }, [seats]);

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      {/* legend */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
        <Legend swatch="bg-white border-2 border-ink-300" label="Available" />
        <Legend swatch="bg-brand-500 border-2 border-brand-600" label="Selected" />
        <Legend swatch="bg-ink-300 border-2 border-ink-300" label="Booked" />
        <Legend
          swatch="bg-amber-200 border-2 border-amber-400"
          label="Held"
        />
      </div>

      {/* bus body */}
      <div className="relative mx-auto max-w-md rounded-[2.5rem] border-[3px] border-ink-200 bg-gradient-to-b from-ink-50 via-white to-ink-50 px-6 pt-8 pb-6 shadow-inner">
        {/* driver section */}
        <div className="flex items-center justify-between border-b border-dashed border-ink-200 pb-4 mb-5">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink-100">
            <Steering className="h-5 w-5 text-ink-500" />
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">
            Front · Driver
          </div>
          <div className="h-3 w-3 rounded-full bg-ink-200" />
        </div>

        {/* seat grid */}
        <div className="space-y-2.5">
          {layout.map((row, ri) => {
            const isLastRow = ri === layout.length - 1;
            return (
              <div
                key={ri}
                className={cn(
                  "grid items-center gap-2",
                  isLastRow
                    ? "grid-cols-5"
                    : "grid-cols-[1fr_1fr_0.6fr_1fr_1fr]"
                )}
              >
                {row.map((seatNum, ci) => {
                  if (seatNum === null) {
                    return (
                      <div
                        key={ci}
                        className="text-center text-[9px] font-semibold uppercase tracking-wider text-ink-300"
                      >
                        aisle
                      </div>
                    );
                  }
                  const status = seatMap.get(seatNum) ?? "AVAILABLE";
                  const isSelected = selected.includes(seatNum);
                  return (
                    <Seat
                      key={seatNum}
                      number={seatNum}
                      status={status}
                      selected={isSelected}
                      disabled={
                        !isSelected &&
                        selected.length >= maxSelectable &&
                        status === "AVAILABLE"
                      }
                      onClick={() => {
                        if (status !== "AVAILABLE") return;
                        if (
                          !isSelected &&
                          selected.length >= maxSelectable
                        )
                          return;
                        onToggle(seatNum);
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* exit */}
        <div className="mt-5 border-t border-dashed border-ink-200 pt-3 text-center text-[10px] font-semibold uppercase tracking-widest text-ink-400">
          Rear · Exit
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-ink-600">
      <span className={cn("h-4 w-4 rounded", swatch)} />
      {label}
    </span>
  );
}

function Seat({
  number,
  status,
  selected,
  disabled,
  onClick,
}: {
  number: string;
  status: SeatInfo["status"];
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const base =
    "relative aspect-square w-full max-w-[52px] mx-auto rounded-lg border-2 text-[11px] font-bold transition-all select-none flex items-center justify-center";
  let cls = "";

  if (status === "BOOKED") {
    cls = "bg-ink-300 border-ink-300 text-white cursor-not-allowed";
  } else if (status === "LOCKED") {
    cls = "bg-amber-200 border-amber-400 text-amber-900 cursor-not-allowed";
  } else if (selected) {
    cls =
      "bg-brand-500 border-brand-600 text-white shadow-md scale-105 cursor-pointer";
  } else if (disabled) {
    cls = "bg-white border-ink-200 text-ink-300 cursor-not-allowed";
  } else {
    cls =
      "bg-white border-ink-300 text-ink-700 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 cursor-pointer";
  }

  return (
    <motion.button
      type="button"
      whileTap={status === "AVAILABLE" && !disabled ? { scale: 0.92 } : {}}
      onClick={onClick}
      disabled={status !== "AVAILABLE" || disabled}
      aria-label={`Seat ${number}, ${status.toLowerCase()}`}
      className={cn(base, cls)}
    >
      <span
        className="absolute inset-x-1 top-0.5 h-1 rounded-full bg-current opacity-30"
        aria-hidden
      />
      {number}
    </motion.button>
  );
}
