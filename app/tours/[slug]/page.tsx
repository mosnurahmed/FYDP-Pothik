import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TourGallery from "@/components/tours/TourGallery";
import TourItinerary from "@/components/tours/TourItinerary";
import PickupPointsList from "@/components/tours/PickupPointsList";
import BookingSidebar from "@/components/tours/BookingSidebar";
import { getTourBySlug } from "@/lib/tours";
import { NotFoundError } from "@/lib/shared/errors";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { formatDateLong } from "@/lib/utils";

export const dynamic = "force-dynamic";

const regionLabel: Record<string, string> = {
  COASTAL: "Coastal",
  HILL_TRACTS: "Hill Tracts",
  HISTORIC: "Historic",
  RIVERINE: "Riverine",
  URBAN: "Urban",
  FOREST: "Forest",
  TEA_COUNTRY: "Tea Country",
};

export default async function TourDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let tour: Awaited<ReturnType<typeof getTourBySlug>>;
  try {
    tour = await getTourBySlug(params.slug);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <section className="container-padded py-8">
          <nav className="text-xs text-ink-500 mb-4">
            <a href="/" className="hover:text-brand-700">Home</a>
            <span className="mx-1.5">/</span>
            <a href="/tours" className="hover:text-brand-700">Tours</a>
            <span className="mx-1.5">/</span>
            <span className="text-ink-700">{tour.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* main column */}
            <div className="space-y-10 min-w-0">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-brand">
                    {regionLabel[tour.region] ?? tour.region}
                  </span>
                  <span className="badge-accent">
                    <Clock className="h-3 w-3" />
                    {tour.durationDays === 1
                      ? "Day trip"
                      : `${tour.durationDays} days`}
                  </span>
                </div>
                <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-ink-900 leading-tight">
                  {tour.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-brand-500" />
                    {tour.destinationCity}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-brand-500" />
                    Departs {formatDateLong(tour.departureDate)}
                  </span>
                </div>
              </div>

              <TourGallery
                cover={tour.coverImage}
                gallery={tour.gallery}
                alt={tour.title}
              />

              <div>
                <h2 className="section-title text-2xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-600" />
                  About this tour
                </h2>
                <p className="mt-4 leading-relaxed text-ink-700 whitespace-pre-line">
                  {tour.description}
                </p>
              </div>

              <div>
                <h2 className="section-title text-2xl flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brand-600" />
                  Itinerary
                </h2>
                <div className="mt-6">
                  <TourItinerary spots={tour.spots} />
                </div>
              </div>

              <div>
                <h2 className="section-title text-2xl">Pickup points</h2>
                <p className="mt-2 text-sm text-ink-600">
                  Pick the boarding point closest to home when you book. Be
                  there at least 10 minutes before pickup time.
                </p>
                <div className="mt-5">
                  <PickupPointsList points={tour.pickupPoints} />
                </div>
              </div>
            </div>

            {/* sidebar */}
            <BookingSidebar
              slug={tour.slug}
              adultPrice={tour.adultPrice}
              childPrice={tour.childPrice}
              capacity={tour.capacity}
              booked={tour._count.bookings}
              departureDate={tour.departureDate}
              durationDays={tour.durationDays}
              highlights={tour.highlights}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
