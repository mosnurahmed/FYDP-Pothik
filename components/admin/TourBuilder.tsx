"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  MapPin,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Spot = {
  name: string;
  description: string;
  image: string;
  dayNumber: number;
  orderIndex: number;
  startTime: string;
  stayMinutes: number;
  entryFeeIncluded: boolean;
};

type PickupPoint = {
  name: string;
  city: string;
  address: string;
  landmark: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:MM
  returnDate: string;
  returnTime: string;
  orderIndex: number;
};

type Initial = {
  id?: string;
  title?: string;
  description?: string;
  region?: string;
  destinationCity?: string;
  durationDays?: number;
  departureDate?: string;
  returnDate?: string;
  adultPrice?: number;
  childPrice?: number;
  capacity?: number;
  minTravellers?: number;
  coverImage?: string;
  gallery?: string[];
  highlights?: string[];
  spots?: Spot[];
  pickupPoints?: PickupPoint[];
};

const REGIONS = [
  "COASTAL",
  "HILL_TRACTS",
  "HISTORIC",
  "RIVERINE",
  "TEA_COUNTRY",
  "FOREST",
  "URBAN",
];

export default function TourBuilder({
  initial,
  mode,
}: {
  initial?: Initial;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const today = format(new Date(), "yyyy-MM-dd");

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    region: initial?.region ?? "COASTAL",
    destinationCity: initial?.destinationCity ?? "",
    durationDays: initial?.durationDays ?? 1,
    departureDate: initial?.departureDate ?? today,
    returnDate: initial?.returnDate ?? today,
    adultPrice: initial?.adultPrice ?? 1500,
    childPrice: initial?.childPrice ?? 900,
    capacity: initial?.capacity ?? 30,
    minTravellers: initial?.minTravellers ?? 10,
    coverImage: initial?.coverImage ?? "",
  });

  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [galleryInput, setGalleryInput] = useState("");

  const [highlights, setHighlights] = useState<string[]>(
    initial?.highlights ?? [],
  );
  const [highlightInput, setHighlightInput] = useState("");

  const [spots, setSpots] = useState<Spot[]>(
    initial?.spots ?? [
      {
        name: "",
        description: "",
        image: "",
        dayNumber: 1,
        orderIndex: 0,
        startTime: "",
        stayMinutes: 90,
        entryFeeIncluded: true,
      },
    ],
  );

  const [pickups, setPickups] = useState<PickupPoint[]>(
    initial?.pickupPoints ?? [
      {
        name: "",
        city: "Dhaka",
        address: "",
        landmark: "",
        pickupDate: today,
        pickupTime: "06:00",
        returnDate: today,
        returnTime: "22:00",
        orderIndex: 0,
      },
    ],
  );

  const update = (k: keyof typeof form, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addSpot = () => {
    setSpots((s) => [
      ...s,
      {
        name: "",
        description: "",
        image: "",
        dayNumber: 1,
        orderIndex: s.length,
        startTime: "",
        stayMinutes: 90,
        entryFeeIncluded: true,
      },
    ]);
  };
  const updateSpot = (i: number, k: keyof Spot, v: any) =>
    setSpots((s) => s.map((sp, j) => (j === i ? { ...sp, [k]: v } : sp)));
  const removeSpot = (i: number) =>
    setSpots((s) => s.filter((_, j) => j !== i));
  const moveSpot = (i: number, dir: -1 | 1) => {
    setSpots((s) => {
      const next = [...s];
      const j = i + dir;
      if (j < 0 || j >= next.length) return s;
      [next[i], next[j]] = [next[j], next[i]];
      return next.map((sp, idx) => ({ ...sp, orderIndex: idx }));
    });
  };

  const addPickup = () => {
    setPickups((p) => [
      ...p,
      {
        name: "",
        city: "Dhaka",
        address: "",
        landmark: "",
        pickupDate: form.departureDate,
        pickupTime: "06:00",
        returnDate: form.returnDate,
        returnTime: "22:00",
        orderIndex: p.length,
      },
    ]);
  };
  const updatePickup = (i: number, k: keyof PickupPoint, v: any) =>
    setPickups((p) =>
      p.map((pp, j) => (j === i ? { ...pp, [k]: v } : pp)),
    );
  const removePickup = (i: number) =>
    setPickups((p) => p.filter((_, j) => j !== i));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.coverImage) {
      toast.error("Add a cover image URL");
      return;
    }
    if (spots.some((s) => !s.name)) {
      toast.error("Every spot needs a name");
      return;
    }
    if (pickups.some((p) => !p.name || !p.city)) {
      toast.error("Every pickup point needs a name and city");
      return;
    }

    const payload = {
      ...form,
      coverImage: form.coverImage,
      gallery,
      highlights,
      spots: spots.map((s, i) => ({
        ...s,
        orderIndex: s.orderIndex ?? i,
        image: s.image || undefined,
        description: s.description || undefined,
        startTime: s.startTime || undefined,
      })),
      pickupPoints: pickups.map((p) => ({
        name: p.name,
        city: p.city,
        address: p.address || undefined,
        landmark: p.landmark || undefined,
        pickupTime: new Date(`${p.pickupDate}T${p.pickupTime}`).toISOString(),
        returnTime: new Date(`${p.returnDate}T${p.returnTime}`).toISOString(),
        orderIndex: p.orderIndex,
      })),
      departureDate: new Date(form.departureDate).toISOString(),
      returnDate: new Date(form.returnDate).toISOString(),
    };

    startTransition(async () => {
      const url =
        mode === "create"
          ? "/api/admin/tours"
          : `/api/admin/tours/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success(mode === "create" ? "Tour created" : "Saved");
      router.push("/admin/tours");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Basic info">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Cox's Bazar Express"
              className="input-field"
            />
          </Field>
          <Field label="Destination city">
            <input
              type="text"
              required
              value={form.destinationCity}
              onChange={(e) => update("destinationCity", e.target.value)}
              placeholder="Cox's Bazar"
              className="input-field"
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            placeholder="What makes this tour special?"
            className="input-field resize-none"
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Region">
            <select
              value={form.region}
              onChange={(e) => update("region", e.target.value)}
              className="input-field cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r.replace("_", " ")}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Duration (days)">
            <input
              type="number"
              required
              min={1}
              max={30}
              value={form.durationDays}
              onChange={(e) =>
                update("durationDays", parseInt(e.target.value) || 1)
              }
              className="input-field"
            />
          </Field>
          <Field label="Capacity">
            <input
              type="number"
              required
              min={1}
              max={500}
              value={form.capacity}
              onChange={(e) =>
                update("capacity", parseInt(e.target.value) || 1)
              }
              className="input-field"
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Departure date">
            <input
              type="date"
              required
              value={form.departureDate}
              onChange={(e) => update("departureDate", e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Return date">
            <input
              type="date"
              required
              value={form.returnDate}
              onChange={(e) => update("returnDate", e.target.value)}
              className="input-field"
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Adult price (BDT)">
            <input
              type="number"
              required
              min={0}
              value={form.adultPrice}
              onChange={(e) =>
                update("adultPrice", parseInt(e.target.value) || 0)
              }
              className="input-field"
            />
          </Field>
          <Field label="Child price (BDT)">
            <input
              type="number"
              required
              min={0}
              value={form.childPrice}
              onChange={(e) =>
                update("childPrice", parseInt(e.target.value) || 0)
              }
              className="input-field"
            />
          </Field>
          <Field label="Min travellers to run">
            <input
              type="number"
              required
              min={1}
              value={form.minTravellers}
              onChange={(e) =>
                update("minTravellers", parseInt(e.target.value) || 1)
              }
              className="input-field"
            />
          </Field>
        </div>
      </Section>

      <Section title="Images">
        <Field label="Cover image URL">
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="url"
              required
              value={form.coverImage}
              onChange={(e) => update("coverImage", e.target.value)}
              placeholder="https://images.unsplash.com/…"
              className="input-field !pl-10"
            />
          </div>
        </Field>
        <Field label="Gallery URLs (up to 8)">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="Paste an image URL and press Add"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  if (galleryInput && gallery.length < 8) {
                    setGallery([...gallery, galleryInput]);
                    setGalleryInput("");
                  }
                }}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            {gallery.length > 0 && (
              <ul className="space-y-1">
                {gallery.map((g, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 text-sm rounded-lg bg-ink-50 px-3 py-2"
                  >
                    <span className="truncate text-ink-700">{g}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setGallery(gallery.filter((_, j) => j !== i))
                      }
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>
        <Field label="Highlights (what's included)">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="e.g. AC bus from your nearest pickup"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  if (highlightInput && highlights.length < 10) {
                    setHighlights([...highlights, highlightInput]);
                    setHighlightInput("");
                  }
                }}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            {highlights.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {highlights.map((h, i) => (
                  <li
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-800 px-3 py-1 text-xs font-medium"
                  >
                    {h}
                    <button
                      type="button"
                      onClick={() =>
                        setHighlights(highlights.filter((_, j) => j !== i))
                      }
                      className="text-brand-700 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>
      </Section>

      <Section
        title="Sightseeing spots"
        subtitle="Add each place the bus will stop. Travellers see this as the day-by-day itinerary."
        action={
          <button type="button" onClick={addSpot} className="btn-secondary">
            <Plus className="h-4 w-4" /> Add spot
          </button>
        }
      >
        <div className="space-y-3">
          {spots.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-ink-100 bg-ink-50/30 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-ink-500">
                  Spot {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveSpot(i, -1)}
                    className="grid h-7 w-7 place-items-center rounded-md text-ink-500 hover:bg-white"
                    disabled={i === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSpot(i, 1)}
                    className="grid h-7 w-7 place-items-center rounded-md text-ink-500 hover:bg-white"
                    disabled={i === spots.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSpot(i)}
                    className="grid h-7 w-7 place-items-center rounded-md text-rose-500 hover:bg-rose-50"
                    disabled={spots.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  required
                  value={s.name}
                  onChange={(e) => updateSpot(i, "name", e.target.value)}
                  placeholder="Spot name (e.g. Inani Beach)"
                  className="input-field"
                />
                <input
                  type="url"
                  value={s.image}
                  onChange={(e) => updateSpot(i, "image", e.target.value)}
                  placeholder="Image URL (optional)"
                  className="input-field"
                />
              </div>
              <textarea
                value={s.description}
                onChange={(e) =>
                  updateSpot(i, "description", e.target.value)
                }
                rows={2}
                placeholder="What will travellers see/do here?"
                className="input-field resize-none"
              />
              <div className="grid gap-3 md:grid-cols-4">
                <Field label="Day" small>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={s.dayNumber}
                    onChange={(e) =>
                      updateSpot(
                        i,
                        "dayNumber",
                        parseInt(e.target.value) || 1,
                      )
                    }
                    className="input-field"
                  />
                </Field>
                <Field label="Start time" small>
                  <input
                    type="time"
                    value={s.startTime}
                    onChange={(e) =>
                      updateSpot(i, "startTime", e.target.value)
                    }
                    className="input-field"
                  />
                </Field>
                <Field label="Stay (mins)" small>
                  <input
                    type="number"
                    min={15}
                    max={720}
                    value={s.stayMinutes}
                    onChange={(e) =>
                      updateSpot(
                        i,
                        "stayMinutes",
                        parseInt(e.target.value) || 30,
                      )
                    }
                    className="input-field"
                  />
                </Field>
                <Field label="Entry included" small>
                  <select
                    value={s.entryFeeIncluded ? "yes" : "no"}
                    onChange={(e) =>
                      updateSpot(
                        i,
                        "entryFeeIncluded",
                        e.target.value === "yes",
                      )
                    }
                    className="input-field cursor-pointer"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Pickup points"
        subtitle="Where the bus will collect travellers on departure day."
        action={
          <button
            type="button"
            onClick={addPickup}
            className="btn-secondary"
          >
            <Plus className="h-4 w-4" /> Add pickup
          </button>
        }
      >
        <div className="space-y-3">
          {pickups.map((p, i) => (
            <div
              key={i}
              className="rounded-xl border border-ink-100 bg-ink-50/30 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                  <MapPin className="h-3.5 w-3.5" />
                  Pickup {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removePickup(i)}
                  className="grid h-7 w-7 place-items-center rounded-md text-rose-500 hover:bg-rose-50"
                  disabled={pickups.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  required
                  value={p.name}
                  onChange={(e) => updatePickup(i, "name", e.target.value)}
                  placeholder="Name (e.g. Gabtoli Bus Stand)"
                  className="input-field"
                />
                <input
                  type="text"
                  required
                  value={p.city}
                  onChange={(e) => updatePickup(i, "city", e.target.value)}
                  placeholder="City"
                  className="input-field"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  value={p.address}
                  onChange={(e) =>
                    updatePickup(i, "address", e.target.value)
                  }
                  placeholder="Address (optional)"
                  className="input-field"
                />
                <input
                  type="text"
                  value={p.landmark}
                  onChange={(e) =>
                    updatePickup(i, "landmark", e.target.value)
                  }
                  placeholder="Landmark (optional)"
                  className="input-field"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <Field label="Pickup date" small>
                  <input
                    type="date"
                    required
                    value={p.pickupDate}
                    onChange={(e) =>
                      updatePickup(i, "pickupDate", e.target.value)
                    }
                    className="input-field"
                  />
                </Field>
                <Field label="Pickup time" small>
                  <input
                    type="time"
                    required
                    value={p.pickupTime}
                    onChange={(e) =>
                      updatePickup(i, "pickupTime", e.target.value)
                    }
                    className="input-field"
                  />
                </Field>
                <Field label="Return date" small>
                  <input
                    type="date"
                    required
                    value={p.returnDate}
                    onChange={(e) =>
                      updatePickup(i, "returnDate", e.target.value)
                    }
                    className="input-field"
                  />
                </Field>
                <Field label="Return time" small>
                  <input
                    type="time"
                    required
                    value={p.returnTime}
                    onChange={(e) =>
                      updatePickup(i, "returnTime", e.target.value)
                    }
                    className="input-field"
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 flex justify-end gap-3 rounded-xl border border-ink-100 bg-white/95 p-3 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {mode === "create" ? "Create tour" : "Save changes"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-ink-600 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  small,
}: {
  label: string;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <label className="block">
      <span
        className={cn(
          "block text-sm font-medium text-ink-700 mb-1",
          small && "text-xs",
        )}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
