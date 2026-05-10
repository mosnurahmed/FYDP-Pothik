import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getBookingByCode } from "@/lib/bookings";
import { getSessionUser } from "@/lib/auth";
import { NotFoundError } from "@/lib/shared/errors";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  Ticket,
  ArrowRight,
} from "lucide-react";
import {
  formatPrice,
  formatDateLong,
  formatTime,
  formatDate,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BookingSuccessPage({
  params,
}: {
  params: { code: string; slug: string };
}) {
  const session = await getSessionUser();

  let booking: Awaited<ReturnType<typeof getBookingByCode>>;
  try {
    booking = await getBookingByCode(params.code, session?.id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  const travellers = booking.travellers as Array<{
    name: string;
    age: number;
    type: string;
  }>;

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 bg-ink-50/30 pb-16">
        <section className="container-padded py-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 animate-fade-in">
                <CheckCircle2
                  className="h-12 w-12 text-brand-600"
                  strokeWidth={2}
                />
              </div>
              <h1 className="mt-6 font-display text-3xl md:text-4xl font-bold text-ink-900">
                You're booked, see you on the road!
              </h1>
              <p className="mt-3 text-ink-600">
                We've sent a confirmation to{" "}
                <span className="font-semibold text-ink-900">
                  {booking.contactEmail}
                </span>
                . Your booking code is{" "}
                <span className="font-mono font-bold text-brand-700">
                  {booking.bookingCode}
                </span>
                .
              </p>
            </div>

            {/* Ticket card */}
            <div className="mt-10 rounded-3xl border border-ink-100 bg-white shadow-soft overflow-hidden">
              <div className="relative h-56">
                <Image
                  src={booking.tourPackage.coverImage}
                  alt={booking.tourPackage.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-900/40 to-transparent" />
                <div className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-sm">
                  <Ticket className="h-3.5 w-3.5 text-brand-600" />
                  {booking.bookingCode}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[11px] uppercase tracking-wider opacity-90">
                    {booking.tourPackage.destinationCity}
                  </div>
                  <h2 className="font-display text-2xl font-bold">
                    {booking.tourPackage.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Detail
                    icon={<Calendar className="h-4 w-4" />}
                    label="Departure"
                    value={formatDateLong(
                      booking.tourPackage.departureDate,
                    )}
                  />
                  <Detail
                    icon={<Clock className="h-4 w-4" />}
                    label="Duration"
                    value={
                      booking.tourPackage.durationDays === 1
                        ? "Day trip"
                        : `${booking.tourPackage.durationDays} days`
                    }
                  />
                  <Detail
                    icon={<MapPin className="h-4 w-4" />}
                    label="Pickup point"
                    value={`${booking.pickupPoint.name} · ${formatTime(
                      booking.pickupPoint.pickupTime,
                    )}`}
                  />
                  <Detail
                    icon={<Users className="h-4 w-4" />}
                    label="Travellers"
                    value={`${booking.adultsCount} adult${
                      booking.adultsCount === 1 ? "" : "s"
                    }${
                      booking.childrenCount
                        ? ` · ${booking.childrenCount} child`
                        : ""
                    }${
                      booking.infantsCount
                        ? ` · ${booking.infantsCount} infant`
                        : ""
                    }`}
                  />
                </div>

                {travellers.length > 0 && (
                  <div className="mt-6 rounded-xl bg-ink-50/60 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-ink-500 mb-2 font-semibold">
                      Passenger list
                    </div>
                    <ul className="space-y-1 text-sm">
                      {travellers.map((t, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <span className="text-ink-700">
                            {t.name} <span className="text-ink-400">· {t.age}y</span>
                          </span>
                          <span className="badge-brand text-[10px]">
                            {t.type}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
                  <span className="inline-flex items-center gap-2 text-ink-700">
                    <Phone className="h-4 w-4 text-brand-500" />
                    {booking.contactPhone}
                  </span>
                  <span className="inline-flex items-center gap-2 text-ink-700">
                    <Mail className="h-4 w-4 text-brand-500" />
                    {booking.contactEmail}
                  </span>
                </div>

                <div className="mt-6 border-t border-dashed border-ink-200 pt-5 flex items-center justify-between">
                  <span className="text-sm text-ink-600">Total paid</span>
                  <span className="font-display text-2xl font-bold text-brand-700">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/dashboard/bookings" className="btn-primary">
                View all my tours <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tours" className="btn-secondary">
                Browse more tours
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Detail({
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
