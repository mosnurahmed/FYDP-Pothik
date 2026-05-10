import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getTourBookingsForAdmin,
  suggestBusConfiguration,
  listBuses,
} from "@/lib/admin";
import { getTourById } from "@/lib/tours";
import { NotFoundError } from "@/lib/shared/errors";
import { prisma } from "@/lib/prisma";
import BusAssignmentPanel from "@/components/admin/BusAssignmentPanel";
import TourStatusActions from "@/components/admin/TourStatusActions";
import {
  formatPrice,
  formatDate,
  formatTime,
} from "@/lib/utils";
import {
  Calendar,
  Users,
  Wallet,
  ArrowLeft,
  Pencil,
  Ticket,
} from "lucide-react";

export const dynamic = "force-dynamic";

const statusBadge: Record<string, string> = {
  DRAFT: "bg-ink-100 text-ink-700 ring-ink-200",
  PUBLISHED: "bg-brand-50 text-brand-700 ring-brand-200",
  CLOSED: "bg-accent-50 text-accent-700 ring-accent-200",
  COMPLETED: "bg-violet-50 text-violet-700 ring-violet-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default async function AdminTourDetail({
  params,
}: {
  params: { id: string };
}) {
  let tour: Awaited<ReturnType<typeof getTourById>>;
  try {
    tour = await getTourById(params.id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  const [adminView, suggestion, allBuses, fullAssignments] = await Promise.all([
    getTourBookingsForAdmin(params.id),
    suggestBusConfiguration(params.id),
    listBuses(),
    prisma.busAssignment.findMany({
      where: { tourPackageId: params.id },
      include: { bus: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/tours"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All tours
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink-900">
              {tour.title}
            </h1>
            <span
              className={`badge text-[10px] ring-1 ring-inset ${statusBadge[tour.status]}`}
            >
              {tour.status}
            </span>
          </div>
          <p className="text-sm text-ink-600 mt-1">
            {tour.destinationCity} ·{" "}
            {tour.durationDays === 1 ? "Day trip" : `${tour.durationDays} days`}{" "}
            · Departing {formatDate(tour.departureDate)}
          </p>
        </div>
        <TourStatusActions id={tour.id} status={tour.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat
          icon={<Users className="h-4 w-4" />}
          label="Booked"
          value={`${adminView.counts.total}/${tour.capacity}`}
        />
        <Stat
          icon={<Calendar className="h-4 w-4" />}
          label="Departure"
          value={formatDate(tour.departureDate)}
        />
        <Stat
          icon={<Wallet className="h-4 w-4" />}
          label="Adult / Child"
          value={`${formatPrice(tour.adultPrice)} / ${formatPrice(tour.childPrice)}`}
        />
        <Stat
          icon={<Ticket className="h-4 w-4" />}
          label="Min to run"
          value={String(tour.minTravellers)}
        />
      </div>

      <BusAssignmentPanel
        tourPackageId={tour.id}
        totalTravellers={adminView.counts.total}
        distribution={adminView.distribution}
        buses={allBuses.map((b) => ({
          id: b.id,
          busNumber: b.busNumber,
          type: b.type,
          totalSeats: b.totalSeats,
        }))}
        assignments={fullAssignments.map((a) => ({
          id: a.id,
          busId: a.busId,
          pickupPointIds: a.pickupPointIds,
          bus: {
            id: a.bus.id,
            busNumber: a.bus.busNumber,
            type: a.bus.type,
            totalSeats: a.bus.totalSeats,
          },
        }))}
        suggestions={suggestion.options}
      />

      {/* Bookings list */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
        <h2 className="font-display font-semibold text-ink-900 mb-4">
          Bookings ({adminView.bookings.length})
        </h2>
        {adminView.bookings.length === 0 ? (
          <p className="text-sm text-ink-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="text-left py-2 font-semibold">Code</th>
                  <th className="text-left py-2 font-semibold">User</th>
                  <th className="text-left py-2 font-semibold">Pickup</th>
                  <th className="text-left py-2 font-semibold">Travellers</th>
                  <th className="text-left py-2 font-semibold">Total</th>
                  <th className="text-left py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {adminView.bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 font-mono text-xs">{b.bookingCode}</td>
                    <td className="py-3">
                      <div className="font-medium text-ink-900">
                        {b.user.name}
                      </div>
                      <div className="text-xs text-ink-500">
                        {b.user.email}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-ink-700">{b.pickupPoint.name}</div>
                      <div className="text-xs text-ink-500">
                        {b.pickupPoint.city}
                      </div>
                    </td>
                    <td className="py-3 text-ink-700">
                      {b.adultsCount}A / {b.childrenCount}C / {b.infantsCount}I
                    </td>
                    <td className="py-3 font-semibold text-brand-700">
                      {formatPrice(b.totalAmount)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`badge text-[10px] ring-1 ring-inset ${
                          b.status === "CONFIRMED"
                            ? "bg-brand-50 text-brand-700 ring-brand-200"
                            : "bg-accent-50 text-accent-700 ring-accent-200"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-bold text-ink-900">
        {value}
      </div>
    </div>
  );
}
