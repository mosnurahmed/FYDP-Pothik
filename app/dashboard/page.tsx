import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Ticket, MapPin, Wallet, ArrowRight } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string;

  const [bookings, totalSpent] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      include: { schedule: { include: { route: true, bus: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.booking.aggregate({
      where: { userId, paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
  ]);

  const upcomingCount = await prisma.booking.count({
    where: {
      userId,
      status: "CONFIRMED",
      schedule: { departureTime: { gte: new Date() } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">
          Hello, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-ink-600 mt-1 text-sm">
          Here's what's happening with your trips.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<Ticket className="h-5 w-5" />}
          label="Total bookings"
          value={String(bookings.length)}
          tone="brand"
        />
        <Stat
          icon={<MapPin className="h-5 w-5" />}
          label="Upcoming trips"
          value={String(upcomingCount)}
          tone="accent"
        />
        <Stat
          icon={<Wallet className="h-5 w-5" />}
          label="Total spent"
          value={formatPrice(totalSpent._sum.totalAmount ?? 0)}
          tone="violet"
        />
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-ink-100 p-5">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            Recent bookings
          </h2>
          <Link
            href="/dashboard/bookings"
            className="text-sm font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-ink-500">
            <p>No bookings yet.</p>
            <Link href="/search" className="btn-primary mt-4">
              Find a bus
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="p-5 flex flex-wrap items-center justify-between gap-3 hover:bg-ink-50/50"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-ink-900 truncate">
                    {b.schedule.route.fromCity} → {b.schedule.route.toCity}
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5">
                    {b.schedule.bus.operator} ·{" "}
                    {formatDate(b.schedule.departureTime)} ·{" "}
                    {b.seatNumbers.join(", ")}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-brand-700">
                    {formatPrice(b.totalAmount)}
                  </span>
                  <span className="badge-brand">{b.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "brand" | "accent" | "violet";
}) {
  const palette = {
    brand: "from-brand-500 to-brand-700",
    accent: "from-accent-400 to-accent-600",
    violet: "from-violet-500 to-purple-700",
  }[tone];

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${palette} text-white`}
      >
        {icon}
      </div>
      <div className="mt-4 font-display text-2xl font-bold text-ink-900">
        {value}
      </div>
      <div className="text-xs text-ink-500">{label}</div>
    </div>
  );
}
