"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Users,
  MapPin,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Minus,
  Calendar,
  Clock,
} from "lucide-react";
import { cn, formatPrice, formatDate, formatTime } from "@/lib/utils";

type PickupPoint = {
  id: string;
  name: string;
  city: string;
  address: string | null;
  pickupTime: string;
};

type Tour = {
  id: string;
  slug: string;
  title: string;
  destinationCity: string;
  adultPrice: number;
  childPrice: number;
  capacity: number;
  durationDays: number;
  departureDate: string;
  pickupPoints: PickupPoint[];
};

type Traveller = {
  name: string;
  age: number;
  type: "ADULT" | "CHILD" | "INFANT";
};

const STEPS = [
  { id: 1, label: "Travellers", icon: Users },
  { id: 2, label: "Pickup", icon: MapPin },
  { id: 3, label: "Review", icon: ClipboardCheck },
];

export default function BookingFlow({ tour }: { tour: Tour }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const [travellers, setTravellers] = useState<Traveller[]>([
    { name: "", age: 25, type: "ADULT" },
  ]);

  const [pickupId, setPickupId] = useState(tour.pickupPoints[0]?.id ?? "");
  const [specialRequest, setSpecialRequest] = useState("");
  const [contact, setContact] = useState({
    name: session?.user?.name ?? "",
    phone: "",
    email: session?.user?.email ?? "",
  });

  // Keep traveller array in sync with adult/child/infant counts.
  // Build the expected slot list and merge with existing entries by index.
  const totalCount = adults + children + infants;
  const expectedTypes = useMemo(() => {
    const list: Traveller["type"][] = [];
    for (let i = 0; i < adults; i++) list.push("ADULT");
    for (let i = 0; i < children; i++) list.push("CHILD");
    for (let i = 0; i < infants; i++) list.push("INFANT");
    return list;
  }, [adults, children, infants]);

  // Resync travellers when counts change
  if (travellers.length !== expectedTypes.length) {
    const next: Traveller[] = expectedTypes.map((t, i) => {
      const prev = travellers[i];
      const defaultAge = t === "ADULT" ? 25 : t === "CHILD" ? 8 : 2;
      return {
        name: prev?.name ?? "",
        age: prev?.age ?? defaultAge,
        type: t,
      };
    });
    setTravellers(next);
  } else {
    // Type may have shifted (e.g. adult became child)
    const mismatch = travellers.some((t, i) => t.type !== expectedTypes[i]);
    if (mismatch) {
      setTravellers(
        travellers.map((t, i) => ({ ...t, type: expectedTypes[i] })),
      );
    }
  }

  const total = adults * tour.adultPrice + children * tour.childPrice;
  const selectedPickup = tour.pickupPoints.find((p) => p.id === pickupId);

  const canGoNext = () => {
    if (step === 1) {
      if (totalCount === 0) return false;
      return travellers.every((t) => t.name.trim().length >= 2 && t.age >= 0);
    }
    if (step === 2) return Boolean(pickupId);
    return true;
  };

  const next = () => {
    if (!canGoNext()) {
      toast.error("Please complete this step before continuing");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/tours/${tour.slug}/book`);
      return;
    }
    if (!contact.name || !contact.phone || !contact.email) {
      toast.error("Please add contact details");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/tour-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourPackageId: tour.id,
          pickupPointId: pickupId,
          adultsCount: adults,
          childrenCount: children,
          infantsCount: infants,
          travellers,
          contactName: contact.name,
          contactPhone: contact.phone,
          contactEmail: contact.email,
          specialRequest: specialRequest || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Booking failed");
        return;
      }

      const data = await res.json();
      toast.success("Booking confirmed!");
      router.push(`/tours/${tour.slug}/book/success/${data.bookingCode}`);
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="min-w-0">
        {/* Step indicator */}
        <ol className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <li
                key={s.id}
                className={cn(
                  "flex items-center gap-2 flex-1",
                  i < STEPS.length - 1 && "after:flex-1 after:h-px after:bg-ink-200 after:ml-2",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-xs font-bold transition-colors",
                    active
                      ? "bg-brand-600 text-white shadow-glow"
                      : done
                        ? "bg-brand-100 text-brand-700"
                        : "bg-ink-100 text-ink-400",
                  )}
                >
                  <s.icon className="h-4 w-4" />
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold whitespace-nowrap",
                    active
                      ? "text-ink-900"
                      : done
                        ? "text-brand-700"
                        : "text-ink-400",
                  )}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 md:p-8 shadow-soft min-h-[420px]">
          {step === 1 && (
            <StepTravellers
              adults={adults}
              setAdults={setAdults}
              children={children}
              setChildren={setChildren}
              infants={infants}
              setInfants={setInfants}
              travellers={travellers}
              setTravellers={setTravellers}
            />
          )}
          {step === 2 && (
            <StepPickup
              points={tour.pickupPoints}
              pickupId={pickupId}
              setPickupId={setPickupId}
              specialRequest={specialRequest}
              setSpecialRequest={setSpecialRequest}
            />
          )}
          {step === 3 && (
            <StepReview
              tour={tour}
              adults={adults}
              children={children}
              infants={infants}
              travellers={travellers}
              pickup={selectedPickup}
              specialRequest={specialRequest}
              total={total}
              contact={contact}
              setContact={setContact}
            />
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={back}
            disabled={step === 1}
            className="btn-secondary disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {step < 3 ? (
            <button onClick={next} className="btn-primary">
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={isPending}
              className="btn-primary"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Confirming…
                </>
              ) : (
                <>Confirm & pay {formatPrice(total)}</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sticky summary */}
      <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
        <h3 className="font-display font-semibold text-ink-900">{tour.title}</h3>
        <div className="mt-1 text-xs text-ink-500">{tour.destinationCity}</div>

        <div className="mt-4 space-y-2 text-sm border-t border-ink-100 pt-4">
          <Row icon={<Calendar className="h-4 w-4" />} label="Departs">
            {formatDate(tour.departureDate)}
          </Row>
          <Row icon={<Clock className="h-4 w-4" />} label="Duration">
            {tour.durationDays === 1 ? "Day trip" : `${tour.durationDays} days`}
          </Row>
        </div>

        <div className="mt-4 space-y-2 text-sm border-t border-ink-100 pt-4">
          <PriceRow
            label={`${adults} × Adult`}
            value={formatPrice(adults * tour.adultPrice)}
          />
          {children > 0 && (
            <PriceRow
              label={`${children} × Child`}
              value={formatPrice(children * tour.childPrice)}
            />
          )}
          {infants > 0 && (
            <PriceRow label={`${infants} × Infant`} value="Free" />
          )}
        </div>

        <div className="mt-4 border-t border-ink-100 pt-4 flex items-center justify-between">
          <span className="text-sm text-ink-600">Total</span>
          <span className="font-display text-2xl font-bold text-brand-700">
            {formatPrice(total)}
          </span>
        </div>
      </aside>
    </div>
  );
}

function StepTravellers(props: {
  adults: number;
  setAdults: (n: number) => void;
  children: number;
  setChildren: (n: number) => void;
  infants: number;
  setInfants: (n: number) => void;
  travellers: Traveller[];
  setTravellers: (t: Traveller[]) => void;
}) {
  const update = (i: number, key: keyof Traveller, val: string | number) => {
    const next = props.travellers.slice();
    (next[i] as any)[key] = val;
    props.setTravellers(next);
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-ink-900">
        Who's coming?
      </h2>
      <p className="mt-1 text-sm text-ink-600">
        Add the count and details for everyone in your group.
      </p>

      <div className="mt-6 space-y-3">
        <Counter
          label="Adults"
          hint="13+ years"
          value={props.adults}
          onChange={props.setAdults}
          min={0}
          max={20}
        />
        <Counter
          label="Children"
          hint="5–12 years · child price"
          value={props.children}
          onChange={props.setChildren}
          min={0}
          max={20}
        />
        <Counter
          label="Infants"
          hint="Under 5 · free"
          value={props.infants}
          onChange={props.setInfants}
          min={0}
          max={20}
        />
      </div>

      {props.travellers.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display font-semibold text-ink-900 mb-3">
            Traveller details
          </h3>
          <div className="space-y-3">
            {props.travellers.map((t, i) => (
              <div
                key={i}
                className="rounded-xl border border-ink-100 bg-ink-50/40 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-ink-700">
                    {t.type === "ADULT"
                      ? `Adult ${i + 1}`
                      : t.type === "CHILD"
                        ? `Child ${i + 1}`
                        : `Infant ${i + 1}`}
                  </span>
                  <span className="badge-brand text-[10px]">{t.type}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => update(i, "name", e.target.value)}
                    placeholder="Full name"
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={t.age}
                    onChange={(e) =>
                      update(i, "age", parseInt(e.target.value) || 0)
                    }
                    placeholder="Age"
                    min={0}
                    max={120}
                    className="input-field"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepPickup(props: {
  points: PickupPoint[];
  pickupId: string;
  setPickupId: (id: string) => void;
  specialRequest: string;
  setSpecialRequest: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-ink-900">
        Where should we pick you up?
      </h2>
      <p className="mt-1 text-sm text-ink-600">
        Be at the pickup point at least 10 minutes early.
      </p>

      <div className="mt-6 space-y-2">
        {props.points.map((p) => {
          const active = props.pickupId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => props.setPickupId(p.id)}
              className={cn(
                "w-full flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all",
                active
                  ? "border-brand-500 bg-brand-50 shadow-soft"
                  : "border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50/30",
              )}
            >
              <span
                className={cn(
                  "mt-1 grid h-5 w-5 place-items-center rounded-full border-2 shrink-0",
                  active ? "border-brand-600" : "border-ink-300",
                )}
              >
                {active && (
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink-900">{p.name}</div>
                <div className="text-xs text-ink-500 mt-0.5">
                  {p.city}
                  {p.address ? ` · ${p.address}` : ""}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                  <Clock className="h-3 w-3" />
                  Pickup at {formatTime(p.pickupTime)} ·{" "}
                  {formatDate(p.pickupTime)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium text-ink-700">
          Special request <span className="text-ink-400">(optional)</span>
        </label>
        <textarea
          value={props.specialRequest}
          onChange={(e) => props.setSpecialRequest(e.target.value)}
          rows={3}
          placeholder="Wheelchair, vegetarian, anything else we should know…"
          className="input-field mt-1 resize-none"
        />
      </div>
    </div>
  );
}

function StepReview(props: {
  tour: Tour;
  adults: number;
  children: number;
  infants: number;
  travellers: Traveller[];
  pickup?: PickupPoint;
  specialRequest: string;
  total: number;
  contact: { name: string; phone: string; email: string };
  setContact: (c: { name: string; phone: string; email: string }) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-ink-900">
        Review & confirm
      </h2>
      <p className="mt-1 text-sm text-ink-600">
        Looks good? Add contact details and confirm.
      </p>

      <div className="mt-6 space-y-5">
        <Block title="Travellers">
          <ul className="text-sm text-ink-700 space-y-1">
            {props.travellers.map((t, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>
                  {t.name || <span className="text-ink-400">No name</span>} · {t.age}y
                </span>
                <span className="badge-brand text-[10px]">{t.type}</span>
              </li>
            ))}
          </ul>
        </Block>

        {props.pickup && (
          <Block title="Pickup">
            <div className="text-sm text-ink-700">
              <div className="font-semibold">{props.pickup.name}</div>
              <div className="text-ink-500 mt-0.5 text-xs">
                {props.pickup.city}
                {props.pickup.address ? ` · ${props.pickup.address}` : ""}
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                <Clock className="h-3 w-3" />
                {formatTime(props.pickup.pickupTime)},{" "}
                {formatDate(props.pickup.pickupTime)}
              </div>
            </div>
          </Block>
        )}

        {props.specialRequest && (
          <Block title="Special request">
            <p className="text-sm text-ink-700">{props.specialRequest}</p>
          </Block>
        )}

        <Block title="Contact details">
          <div className="space-y-3">
            <input
              type="text"
              required
              value={props.contact.name}
              onChange={(e) =>
                props.setContact({ ...props.contact, name: e.target.value })
              }
              placeholder="Contact name"
              className="input-field"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="tel"
                required
                value={props.contact.phone}
                onChange={(e) =>
                  props.setContact({
                    ...props.contact,
                    phone: e.target.value,
                  })
                }
                placeholder="Phone"
                className="input-field"
              />
              <input
                type="email"
                required
                value={props.contact.email}
                onChange={(e) =>
                  props.setContact({
                    ...props.contact,
                    email: e.target.value,
                  })
                }
                placeholder="Email"
                className="input-field"
              />
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
}

function Counter({
  label,
  hint,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50/40 px-4 py-3">
      <div>
        <div className="font-semibold text-ink-900">{label}</div>
        {hint && <div className="text-xs text-ink-500">{hint}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-700 hover:border-brand-400 hover:text-brand-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center font-display text-lg font-bold tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-700 hover:border-brand-400 hover:text-brand-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-ink-50/40 p-4">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-500 mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-ink-500">
        <span className="text-brand-500">{icon}</span>
        {label}
      </span>
      <span className="font-medium text-ink-900">{children}</span>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-600">{label}</span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  );
}
