import { MapPin, Clock } from "lucide-react";
import { formatTime, formatDate } from "@/lib/utils";

type PickupPoint = {
  id: string;
  name: string;
  city: string;
  address: string | null;
  landmark: string | null;
  pickupTime: Date;
  returnTime: Date;
};

export default function PickupPointsList({ points }: { points: PickupPoint[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {points.map((p) => (
        <div
          key={p.id}
          className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft hover:shadow-md transition-shadow"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-ink-900">{p.name}</div>
            <div className="text-xs text-ink-500 mt-0.5">
              {p.city}
              {p.address ? ` · ${p.address}` : ""}
            </div>
            {p.landmark && (
              <div className="text-xs text-ink-400 mt-0.5">
                Landmark: {p.landmark}
              </div>
            )}
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
              <Clock className="h-3.5 w-3.5" />
              Pickup {formatTime(p.pickupTime)} · {formatDate(p.pickupTime)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
