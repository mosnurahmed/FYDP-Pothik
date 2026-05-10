import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TourCard from "@/components/tours/TourCard";
import TourFilters from "@/components/tours/TourFilters";
import { listPublishedTours } from "@/lib/tours";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  region?: string;
  duration?: string;
};

export default async function ToursPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const tours = await listPublishedTours({
    search: searchParams.search,
    region: searchParams.region as any,
    durationType: searchParams.duration as any,
  });

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 py-20">
          <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
          <div className="container-padded relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <Compass className="h-3.5 w-3.5" />
              Curated tours
            </span>
            <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold text-white leading-tight">
              Find a tour that fits your week
            </h1>
            <p className="mt-3 text-brand-200 max-w-2xl">
              From a single-day Sonargaon escape to a 3-day Sajek adventure —
              every trip listed here has a confirmed bus and a planned route.
            </p>
          </div>
        </section>

        <section className="container-padded py-10">
          <TourFilters />

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-ink-600">
              <span className="font-semibold text-ink-900">{tours.length}</span>{" "}
              {tours.length === 1 ? "tour" : "tours"} available
            </p>
          </div>

          {tours.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 p-12 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-600">
                <Compass className="h-7 w-7" />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
                No tours match your filters
              </h2>
              <p className="mt-2 text-sm text-ink-600 max-w-md mx-auto">
                Try removing a filter, or check back soon — new tours are added
                every week.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
