import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/search/SearchBar";
import BusCard from "@/components/bus/BusCard";
import { startOfDay, endOfDay } from "date-fns";
import { MapPin, AlertCircle } from "lucide-react";

type SearchParams = {
  from?: string;
  to?: string;
  date?: string;
  passengers?: string;
};

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { from, to, date } = searchParams;

  let schedules: any[] = [];
  if (from && to && date) {
    const day = new Date(date);
    schedules = await prisma.schedule.findMany({
      where: {
        route: { fromCity: from, toCity: to },
        departureTime: {
          gte: startOfDay(day),
          lte: endOfDay(day),
        },
      },
      include: { bus: true, route: true },
      orderBy: { departureTime: "asc" },
    });
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <section className="bg-gradient-to-br from-brand-700 to-brand-900 pb-12 pt-12">
          <div className="container-padded">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              {from && to
                ? `${from} → ${to}`
                : "Find your next journey"}
            </h1>
            {date && (
              <p className="text-brand-200 mt-1 text-sm">
                Travelling on {new Date(date).toDateString()}
              </p>
            )}
            <div className="mt-6">
              <SearchBar variant="compact" />
            </div>
          </div>
        </section>

        <section className="container-padded py-10">
          {!from || !to || !date ? (
            <EmptyState
              title="Pick origin, destination & date"
              body="Use the search above to see all buses on your route."
            />
          ) : schedules.length === 0 ? (
            <EmptyState
              title="No buses on this route today"
              body="Try a different date, or check nearby routes. New schedules are added daily."
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-600">
                  <span className="font-semibold text-ink-900">
                    {schedules.length}
                  </span>{" "}
                  buses found
                </p>
              </div>
              {schedules.map((s) => (
                <BusCard key={s.id} schedule={s} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 p-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-600">
        <MapPin className="h-7 w-7" />
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-ink-600 max-w-md mx-auto">{body}</p>
    </div>
  );
}
