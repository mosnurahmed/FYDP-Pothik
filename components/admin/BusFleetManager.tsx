"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, Loader2, Bus, Star } from "lucide-react";

type BusRow = {
  id: string;
  busNumber: string;
  operatorName: string;
  type: string;
  totalSeats: number;
  amenities: string[];
  rating: number;
  notes: string | null;
};

const TYPES = ["AC", "NON_AC", "SLEEPER", "DOUBLE_DECKER", "MINIBUS"];
const AMENITIES = [
  "ac",
  "wifi",
  "charging",
  "snacks",
  "blanket",
  "tv",
  "water",
  "tracking",
];

export default function BusFleetManager({ initial }: { initial: BusRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    busNumber: "",
    operatorName: "Pothik Fleet",
    type: "AC",
    totalSeats: 40,
    amenities: ["ac", "charging", "water"],
    rating: 4.5,
    notes: "",
  });

  const toggleAmenity = (a: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await fetch("/api/admin/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          notes: form.notes || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Couldn't add bus");
        return;
      }
      toast.success("Bus added");
      setShowAdd(false);
      setForm({
        busNumber: "",
        operatorName: "Pothik Fleet",
        type: "AC",
        totalSeats: 40,
        amenities: ["ac", "charging", "water"],
        rating: 4.5,
        notes: "",
      });
      router.refresh();
    });
  };

  const remove = (id: string) => {
    if (!confirm("Remove this bus from the fleet?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/buses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Couldn't remove");
        return;
      }
      toast.success("Bus removed");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">
            Bus fleet
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            {initial.length} bus{initial.length === 1 ? "" : "es"} available for
            tours.
          </p>
        </div>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> {showAdd ? "Cancel" : "Add bus"}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={submit}
          className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Bus number">
              <input
                type="text"
                required
                value={form.busNumber}
                onChange={(e) =>
                  setForm({ ...form, busNumber: e.target.value })
                }
                placeholder="PTK-101"
                className="input-field"
              />
            </Field>
            <Field label="Operator">
              <input
                type="text"
                required
                value={form.operatorName}
                onChange={(e) =>
                  setForm({ ...form, operatorName: e.target.value })
                }
                className="input-field"
              />
            </Field>
            <Field label="Type">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field cursor-pointer"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Total seats">
              <input
                type="number"
                required
                min={1}
                max={80}
                value={form.totalSeats}
                onChange={(e) =>
                  setForm({
                    ...form,
                    totalSeats: parseInt(e.target.value) || 0,
                  })
                }
                className="input-field"
              />
            </Field>
            <Field label="Rating (0–5)">
              <input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={form.rating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rating: parseFloat(e.target.value) || 0,
                  })
                }
                className="input-field"
              />
            </Field>
            <Field label="Notes (optional)">
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field"
              />
            </Field>
          </div>
          <Field label="Amenities">
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => {
                const on = form.amenities.includes(a);
                return (
                  <button
                    type="button"
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      on
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-ink-200 bg-white text-ink-600 hover:border-brand-300"
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </Field>
          <div className="flex justify-end">
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Add bus"
              )}
            </button>
          </div>
        </form>
      )}

      {initial.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-600">
            <Bus className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
            No buses in the fleet
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Add a bus before assigning it to a tour.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {initial.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shrink-0">
                    <Bus className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-ink-900 truncate">
                      {b.busNumber}
                    </div>
                    <div className="text-xs text-ink-500 truncate">
                      {b.operatorName}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => remove(b.id)}
                  disabled={isPending}
                  className="grid h-8 w-8 place-items-center rounded-md text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="badge-brand">
                  {b.type.replace("_", " ")}
                </span>
                <span className="badge-accent">
                  <Star className="h-3 w-3 fill-current" />
                  {b.rating.toFixed(1)}
                </span>
                <span className="inline-flex items-center rounded-full bg-ink-100 px-2.5 py-0.5 font-semibold text-ink-700">
                  {b.totalSeats} seats
                </span>
              </div>
              {b.amenities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {b.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-md bg-ink-50 px-2 py-0.5 text-[10px] capitalize text-ink-600"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
              {b.notes && (
                <p className="mt-3 text-xs text-ink-500 italic">{b.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-700 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
