"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Clock,
  MapPin,
  Calendar,
  Armchair,
  ArrowRight,
  Loader2,
} from "lucide-react";
import SeatLayout, { SeatInfo } from "../bus/SeatLayout";
import {
  formatPrice,
  formatTime,
  formatDateLong,
  formatDuration,
} from "@/lib/utils";

type Schedule = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  bus: {
    operator: string;
    busNumber: string;
    type: string;
    totalSeats: number;
    rating: number;
  };
  route: {
    fromCity: string;
    toCity: string;
    durationMinutes: number;
  };
  seats: SeatInfo[];
};

export default function BookingPanel({ schedule }: { schedule: Schedule }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [passenger, setPassenger] = useState({
    name: session?.user?.name ?? "",
    phone: "",
    email: session?.user?.email ?? "",
  });

  const total = selected.length * schedule.price;

  const toggle = (s: string) =>
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to continue");
      router.push(`/login?callbackUrl=/booking/${schedule.id}`);
      return;
    }
    if (selected.length === 0) {
      toast.error("Pick at least one seat");
      return;
    }
    if (!passenger.name || !passenger.phone || !passenger.email) {
      toast.error("Fill all passenger details");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId: schedule.id,
          seatNumbers: selected,
          passengerName: passenger.name,
          passengerPhone: passenger.phone,
          passengerEmail: passenger.email,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Booking failed. Please try again.");
        return;
      }

      const data = await res.json();
      toast.success("Booking confirmed!");
      router.push(`/booking/success/${data.bookingCode}`);
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        {/* Trip header */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold text-ink-900">
                  {schedule.bus.operator}
                </h1>
                <span className="badge-brand">
                  {schedule.bus.type.replace("_", " ")}
                </span>
              </div>
              <div className="text-xs text-ink-500 mt-0.5">
                Bus #{schedule.bus.busNumber}
              </div>
            </div>
            <span className="badge-accent">
              ★ {schedule.bus.rating.toFixed(1)}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Info
              icon={<MapPin className="h-4 w-4" />}
              label="Route"
              value={`${schedule.route.fromCity} → ${schedule.route.toCity}`}
            />
            <Info
              icon={<Calendar className="h-4 w-4" />}
              label="Date"
              value={formatDateLong(schedule.departureTime)}
            />
            <Info
              icon={<Clock className="h-4 w-4" />}
              label="Time"
              value={`${formatTime(schedule.departureTime)} → ${formatTime(
                schedule.arrivalTime
              )} · ${formatDuration(schedule.route.durationMinutes)}`}
            />
          </div>
        </div>

        {/* Seat layout */}
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-3 flex items-center gap-2">
            <Armchair className="h-5 w-5 text-brand-600" />
            Pick your seats
          </h2>
          <SeatLayout
            totalSeats={schedule.bus.totalSeats}
            seats={schedule.seats}
            selected={selected}
            onToggle={toggle}
          />
        </div>
      </div>

      {/* Sticky summary */}
      <aside className="lg:sticky lg:top-24 self-start space-y-4">
        <form
          onSubmit={submit}
          className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft"
        >
          <h3 className="font-display text-lg font-semibold text-ink-900">
            Booking summary
          </h3>

          <div className="mt-4 space-y-3 text-sm">
            <Row label="Selected seats">
              {selected.length === 0 ? (
                <span className="text-ink-400">None</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {selected.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Row>
            <Row label="Price per seat">
              <span className="font-medium">
                {formatPrice(schedule.price)}
              </span>
            </Row>
            <Row label="Number of seats">
              <span className="font-medium">{selected.length}</span>
            </Row>
            <div className="border-t border-ink-100 pt-3 flex items-center justify-between">
              <span className="text-sm text-ink-600">Total</span>
              <span className="font-display text-2xl font-bold text-brand-700">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-semibold text-ink-700">
              Passenger details
            </h4>
            <input
              required
              type="text"
              placeholder="Full name"
              value={passenger.name}
              onChange={(e) =>
                setPassenger({ ...passenger, name: e.target.value })
              }
              className="input-field"
            />
            <input
              required
              type="tel"
              placeholder="Phone (e.g. 01700000000)"
              value={passenger.phone}
              onChange={(e) =>
                setPassenger({ ...passenger, phone: e.target.value })
              }
              className="input-field"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={passenger.email}
              onChange={(e) =>
                setPassenger({ ...passenger, email: e.target.value })
              }
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={isPending || selected.length === 0}
            className="btn-primary w-full mt-6"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming…
              </>
            ) : (
              <>
                Confirm booking
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="mt-3 text-[11px] text-ink-500 text-center">
            Free cancellation up to 6 hours before departure.
          </p>
        </form>
      </aside>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-ink-400">
          {label}
        </div>
        <div className="font-medium text-ink-900 truncate">{value}</div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-ink-500">{label}</span>
      {children}
    </div>
  );
}
