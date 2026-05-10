import { notFound, redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingFlow from "@/components/booking/BookingFlow";
import { getTourBySlug } from "@/lib/tours";
import { getSessionUser } from "@/lib/auth";
import { NotFoundError } from "@/lib/shared/errors";

export const dynamic = "force-dynamic";

export default async function BookTourPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getSessionUser();
  if (!session) {
    redirect(`/login?callbackUrl=/tours/${params.slug}/book`);
  }

  let tour: Awaited<ReturnType<typeof getTourBySlug>>;
  try {
    tour = await getTourBySlug(params.slug);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  if (tour.status !== "PUBLISHED") {
    notFound();
  }

  const tourForUI = {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    destinationCity: tour.destinationCity,
    adultPrice: tour.adultPrice,
    childPrice: tour.childPrice,
    capacity: tour.capacity,
    durationDays: tour.durationDays,
    departureDate: tour.departureDate.toISOString(),
    pickupPoints: tour.pickupPoints.map((p) => ({
      id: p.id,
      name: p.name,
      city: p.city,
      address: p.address,
      pickupTime: p.pickupTime.toISOString(),
    })),
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <section className="container-padded py-10">
          <div className="mb-6">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-ink-900">
              Book your spot
            </h1>
            <p className="text-sm text-ink-600 mt-1">
              {tour.title} · departing{" "}
              {tour.departureDate.toLocaleDateString("en-BD", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <BookingFlow tour={tourForUI} />
        </section>
      </main>
      <Footer />
    </>
  );
}
