import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingPanel from "@/components/booking/BookingPanel";

export const dynamic = "force-dynamic";

export default async function BookingPage({
  params,
}: {
  params: { id: string };
}) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: params.id },
    include: { bus: true, route: true, seats: true },
  });

  if (!schedule) notFound();

  const seatsForUI = schedule.seats.map((s) => ({
    seatNumber: s.seatNumber,
    status: s.status,
  }));

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <section className="container-padded py-10">
          <BookingPanel
            schedule={{
              id: schedule.id,
              departureTime: schedule.departureTime.toISOString(),
              arrivalTime: schedule.arrivalTime.toISOString(),
              price: schedule.price,
              bus: {
                operator: schedule.bus.operator,
                busNumber: schedule.bus.busNumber,
                type: schedule.bus.type,
                totalSeats: schedule.bus.totalSeats,
                rating: schedule.bus.rating,
              },
              route: {
                fromCity: schedule.route.fromCity,
                toCity: schedule.route.toCity,
                durationMinutes: schedule.route.durationMinutes,
              },
              seats: seatsForUI,
            }}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
