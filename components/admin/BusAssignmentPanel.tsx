"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Bus, Plus, Trash2, Loader2, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Distribution = {
  id: string;
  name: string;
  city: string;
  travellers: number;
  bookingsCount: number;
};

type BusOption = {
  id: string;
  busNumber: string;
  type: string;
  totalSeats: number;
};

type SuggestionOption = {
  label: string;
  buses: {
    busId: string;
    busNumber: string;
    capacity: number;
    pickups: Distribution[];
  }[];
  totalCapacity: number;
  notes: string;
};

type Assignment = {
  id: string;
  busId: string;
  pickupPointIds: string[];
  bus: BusOption;
};

export default function BusAssignmentPanel({
  tourPackageId,
  totalTravellers,
  distribution,
  buses,
  assignments,
  suggestions,
}: {
  tourPackageId: string;
  totalTravellers: number;
  distribution: Distribution[];
  buses: BusOption[];
  assignments: Assignment[];
  suggestions: SuggestionOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newBusId, setNewBusId] = useState(buses[0]?.id ?? "");
  const [newPickupIds, setNewPickupIds] = useState<string[]>(
    distribution.map((d) => d.id),
  );

  const togglePickup = (id: string) => {
    setNewPickupIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  };

  const addAssignment = () => {
    if (!newBusId || newPickupIds.length === 0) {
      toast.error("Select a bus and at least one pickup point");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/admin/bus-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourPackageId,
          busId: newBusId,
          pickupPointIds: newPickupIds,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Couldn't assign bus");
        return;
      }
      toast.success("Bus assigned");
      router.refresh();
    });
  };

  const removeAssignment = (id: string) => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/bus-assignments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Couldn't remove");
        return;
      }
      toast.success("Removed");
      router.refresh();
    });
  };

  const applySuggestion = (option: SuggestionOption) => {
    startTransition(async () => {
      // Sequentially assign — keeps it simple, transactions are per-call
      for (const b of option.buses) {
        await fetch("/api/admin/bus-assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tourPackageId,
            busId: b.busId,
            pickupPointIds: b.pickups.map((p) => p.id),
          }),
        });
      }
      toast.success("Suggestion applied");
      router.refresh();
    });
  };

  const maxTravellers = Math.max(1, ...distribution.map((d) => d.travellers));

  return (
    <div className="space-y-6">
      {/* Pickup distribution chart */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-brand-600" />
          <h2 className="font-display font-semibold text-ink-900">
            Pickup distribution
          </h2>
          <span className="ml-auto text-sm text-ink-600">
            <span className="font-bold text-ink-900 tabular-nums">
              {totalTravellers}
            </span>{" "}
            total travellers
          </span>
        </div>
        {distribution.length === 0 ? (
          <p className="text-sm text-ink-500">No pickup points configured.</p>
        ) : (
          <ul className="space-y-3">
            {distribution.map((d) => {
              const pct = (d.travellers / maxTravellers) * 100;
              return (
                <li key={d.id} className="flex items-center gap-4">
                  <div className="w-40 shrink-0">
                    <div className="text-sm font-semibold text-ink-900 truncate">
                      {d.name}
                    </div>
                    <div className="text-[11px] text-ink-500">{d.city}</div>
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-32 shrink-0 text-right">
                    <span className="text-sm font-bold text-ink-900 tabular-nums">
                      {d.travellers}
                    </span>
                    <span className="text-xs text-ink-500 ml-1">
                      ({d.bookingsCount}{" "}
                      {d.bookingsCount === 1 ? "booking" : "bookings"})
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Smart suggestions */}
      {suggestions.length > 0 && totalTravellers > 0 && (
        <div className="rounded-2xl border border-accent-200 bg-accent-50/40 p-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-accent-600" />
            <h2 className="font-display font-semibold text-ink-900">
              Smart bus suggestions
            </h2>
          </div>
          <p className="text-sm text-ink-600 mb-4">
            Based on current bookings, here's how to dispatch your fleet.
          </p>
          <div className="space-y-3">
            {suggestions.map((opt, i) => (
              <div
                key={i}
                className="rounded-xl bg-white p-4 border border-accent-100"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-ink-900">
                      {opt.label}
                    </div>
                    <p className="text-xs text-ink-500 mt-0.5">{opt.notes}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => applySuggestion(opt)}
                    disabled={isPending}
                    className="btn-secondary text-xs !py-2"
                  >
                    Apply suggestion
                  </button>
                </div>
                <div className="mt-3 grid gap-2">
                  {opt.buses.map((b) => (
                    <div
                      key={b.busId}
                      className="rounded-lg bg-ink-50/60 p-3 text-sm"
                    >
                      <div className="font-semibold text-ink-900">
                        🚌 {b.busNumber} ({b.capacity} seats)
                      </div>
                      <div className="mt-1 text-xs text-ink-600">
                        Pickups:{" "}
                        {b.pickups.map((p) => p.name).join(" → ") || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current assignments */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Bus className="h-5 w-5 text-brand-600" />
          <h2 className="font-display font-semibold text-ink-900">
            Assigned buses
          </h2>
        </div>
        {assignments.length === 0 ? (
          <p className="text-sm text-ink-500">No buses assigned yet.</p>
        ) : (
          <ul className="space-y-2">
            {assignments.map((a) => {
              const pickups = distribution.filter((d) =>
                a.pickupPointIds.includes(d.id),
              );
              const load = pickups.reduce(
                (s, p) => s + p.travellers,
                0,
              );
              const utilization = (load / a.bus.totalSeats) * 100;
              return (
                <li
                  key={a.id}
                  className="rounded-xl border border-ink-100 bg-ink-50/30 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-ink-900">
                        {a.bus.busNumber}{" "}
                        <span className="text-xs font-normal text-ink-500">
                          {a.bus.type.replace("_", " ")} · {a.bus.totalSeats}{" "}
                          seats
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-ink-600">
                        Pickups:{" "}
                        {pickups.length > 0
                          ? pickups.map((p) => p.name).join(" · ")
                          : "—"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAssignment(a.id)}
                      disabled={isPending}
                      className="grid h-8 w-8 place-items-center rounded-md text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        utilization > 100
                          ? "bg-rose-500"
                          : utilization > 90
                            ? "bg-accent-500"
                            : "bg-brand-500",
                      )}
                      style={{ width: `${Math.min(100, utilization)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-ink-500 text-right">
                    {load} / {a.bus.totalSeats} seats ·{" "}
                    {Math.round(utilization)}%
                    {utilization > 100 && (
                      <span className="ml-2 font-bold text-rose-600">
                        Overloaded!
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Manual add */}
        <div className="mt-5 border-t border-ink-100 pt-5">
          <h3 className="text-sm font-semibold text-ink-700 mb-3">
            Manually add a bus assignment
          </h3>
          <div className="space-y-3">
            <select
              value={newBusId}
              onChange={(e) => setNewBusId(e.target.value)}
              className="input-field cursor-pointer"
            >
              {buses.length === 0 ? (
                <option>No buses in fleet</option>
              ) : (
                buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.busNumber} · {b.type.replace("_", " ")} ·{" "}
                    {b.totalSeats} seats
                  </option>
                ))
              )}
            </select>
            <div>
              <div className="text-xs font-semibold text-ink-700 mb-2">
                Pickup points covered
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {distribution.map((d) => {
                  const checked = newPickupIds.includes(d.id);
                  return (
                    <label
                      key={d.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border-2 px-3 py-2 cursor-pointer transition-colors",
                        checked
                          ? "border-brand-500 bg-brand-50"
                          : "border-ink-200 bg-white hover:border-brand-300",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePickup(d.id)}
                        className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink-900 truncate">
                          {d.name}
                        </div>
                        <div className="text-xs text-ink-500">
                          {d.travellers} travellers
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={addAssignment}
              disabled={isPending || buses.length === 0}
              className="btn-primary"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Assigning…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Assign bus
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
