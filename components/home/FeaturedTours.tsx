import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import { getFeaturedTours } from "@/lib/tours";

export default async function FeaturedTours() {
  const tours = await getFeaturedTours(6);

  return (
    <section className="container-padded py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <span className="section-subtitle">Departing soon</span>
          <h2 className="section-title mt-3">
            Tours you can join this month
          </h2>
        </div>
        <Link href="/tours" className="btn-ghost group">
          View all tours
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {tours.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 p-12 text-center">
          <p className="text-ink-600">
            New tours are being scheduled. Check back soon.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <TourCard key={t.id} tour={t} />
          ))}
        </div>
      )}
    </section>
  );
}
