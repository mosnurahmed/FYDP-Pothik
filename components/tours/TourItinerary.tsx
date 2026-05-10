import { MapPin, Clock, Ticket } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";

type Spot = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  dayNumber: number;
  orderIndex: number;
  startTime: string | null;
  stayMinutes: number;
  entryFeeIncluded: boolean;
};

export default function TourItinerary({ spots }: { spots: Spot[] }) {
  // group by day
  const byDay = new Map<number, Spot[]>();
  for (const s of spots) {
    if (!byDay.has(s.dayNumber)) byDay.set(s.dayNumber, []);
    byDay.get(s.dayNumber)!.push(s);
  }

  const days = Array.from(byDay.keys()).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {days.map((day) => (
        <div key={day} className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold shadow-md">
              {day}
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900">
                Day {day}
              </h3>
              <p className="text-xs text-ink-500">
                {byDay.get(day)!.length} stops
              </p>
            </div>
          </div>

          <ol className="relative space-y-5 pl-5 border-l-2 border-dashed border-brand-200">
            {byDay.get(day)!.map((s) => (
              <li key={s.id} className="relative">
                <span className="absolute -left-[27px] top-1.5 grid h-4 w-4 place-items-center rounded-full bg-white ring-2 ring-brand-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                </span>

                <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-semibold text-ink-900">
                          <MapPin className="inline h-4 w-4 text-brand-600 mr-1" />
                          {s.name}
                        </h4>
                        {s.entryFeeIncluded && (
                          <span className="badge-brand">
                            <Ticket className="h-3 w-3" />
                            Entry included
                          </span>
                        )}
                      </div>
                      {s.description && (
                        <p className="mt-2 text-sm leading-relaxed text-ink-600">
                          {s.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-4 text-xs text-ink-500">
                        {s.startTime && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Starts {s.startTime}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Stay {formatDuration(s.stayMinutes)}
                        </span>
                      </div>
                    </div>
                    {s.image && (
                      <div className="relative h-20 w-28 sm:h-24 sm:w-36 overflow-hidden rounded-lg shrink-0">
                        <Image
                          src={s.image}
                          alt={s.name}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
