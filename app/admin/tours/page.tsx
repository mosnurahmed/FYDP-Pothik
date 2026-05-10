import Link from "next/link";
import { listAllToursForAdmin } from "@/lib/tours";
import { Compass, Plus, ArrowRight } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusBadge: Record<string, string> = {
  DRAFT: "bg-ink-100 text-ink-700 ring-ink-200",
  PUBLISHED: "bg-brand-50 text-brand-700 ring-brand-200",
  CLOSED: "bg-accent-50 text-accent-700 ring-accent-200",
  COMPLETED: "bg-violet-50 text-violet-700 ring-violet-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default async function AdminToursPage() {
  const tours = await listAllToursForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">
            Tour packages
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {tours.length} tour{tours.length === 1 ? "" : "s"} in the system.
          </p>
        </div>
        <Link href="/admin/tours/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New tour
        </Link>
      </div>

      {tours.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-600">
            <Compass className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
            No tours yet
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Create your first tour package to start accepting bookings.
          </p>
          <Link href="/admin/tours/new" className="btn-primary mt-5">
            Create tour
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-100 bg-white shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50/60 text-[11px] uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Tour</th>
                  <th className="text-left px-5 py-3 font-semibold">Departure</th>
                  <th className="text-left px-5 py-3 font-semibold">Capacity</th>
                  <th className="text-left px-5 py-3 font-semibold">Price</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {tours.map((t) => (
                  <tr key={t.id} className="hover:bg-ink-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink-900 truncate max-w-[260px]">
                        {t.title}
                      </div>
                      <div className="text-xs text-ink-500 mt-0.5">
                        {t.destinationCity} ·{" "}
                        {t.durationDays === 1
                          ? "Day trip"
                          : `${t.durationDays} days`}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-700">
                      {formatDate(t.departureDate)}
                    </td>
                    <td className="px-5 py-4 text-ink-700">
                      {t._count.bookings}/{t.capacity}
                    </td>
                    <td className="px-5 py-4 font-semibold text-brand-700">
                      {formatPrice(t.adultPrice)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`badge text-[10px] ring-1 ring-inset ${statusBadge[t.status] ?? ""}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/tours/${t.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
                      >
                        Manage <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
