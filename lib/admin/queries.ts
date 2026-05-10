import { prisma } from "../prisma";
import { NotFoundError } from "../shared/errors";
import { countTravellers } from "../tours/queries";
import { getPickupDistribution } from "../bookings/queries";

export async function listBuses() {
  return prisma.bus.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getDashboardStats() {
  const [activeTours, totalBookings, revenueAgg, fleetSize] = await Promise.all(
    [
      prisma.tourPackage.count({ where: { status: "PUBLISHED" } }),
      prisma.tourBooking.count(),
      prisma.tourBooking.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { totalAmount: true },
      }),
      prisma.bus.count(),
    ],
  );

  return {
    activeTours,
    totalBookings,
    totalRevenue: revenueAgg._sum.totalAmount ?? 0,
    fleetSize,
  };
}

export async function getToursNeedingAttention() {
  // Tours that are full or below minimum and departing soon.
  const tours = await prisma.tourPackage.findMany({
    where: {
      status: "PUBLISHED",
      departureDate: {
        gte: new Date(),
        lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { departureDate: "asc" },
    include: {
      _count: { select: { bookings: true } },
    },
  });

  const enriched = await Promise.all(
    tours.map(async (t) => {
      const counts = await countTravellers(t.id);
      const utilization = counts.total / t.capacity;
      const belowMinimum = counts.total < t.minTravellers;
      const nearlyFull = utilization >= 0.9;
      return {
        id: t.id,
        slug: t.slug,
        title: t.title,
        departureDate: t.departureDate,
        capacity: t.capacity,
        booked: counts.total,
        belowMinimum,
        nearlyFull,
        flagged: belowMinimum || nearlyFull,
      };
    }),
  );

  return enriched.filter((t) => t.flagged);
}

export async function getTourBookingsForAdmin(tourPackageId: string) {
  const tour = await prisma.tourPackage.findUnique({
    where: { id: tourPackageId },
    include: {
      pickupPoints: { orderBy: { orderIndex: "asc" } },
      busAssignments: { include: { bus: true } },
    },
  });
  if (!tour) throw new NotFoundError("Tour");

  const bookings = await prisma.tourBooking.findMany({
    where: { tourPackageId, status: { in: ["CONFIRMED", "PENDING"] } },
    orderBy: { createdAt: "desc" },
    include: {
      pickupPoint: { select: { name: true, city: true } },
      user: { select: { name: true, email: true } },
    },
  });

  const distribution = await getPickupDistribution(tourPackageId);
  const counts = await countTravellers(tourPackageId);

  return { tour, bookings, distribution, counts };
}

/**
 * Suggest bus configuration based on current bookings.
 * - Smallest bus that fits everyone is preferred (1-bus solution).
 * - If no single bus fits, multiple buses balanced by pickup proximity.
 * Returns options the admin can choose from.
 */
export async function suggestBusConfiguration(tourPackageId: string) {
  const buses = await prisma.bus.findMany({ orderBy: { totalSeats: "desc" } });
  const counts = await countTravellers(tourPackageId);
  const distribution = await getPickupDistribution(tourPackageId);
  const total = counts.total;

  if (total === 0) return { options: [], total, distribution };

  type Option = {
    label: string;
    buses: { busId: string; busNumber: string; capacity: number; pickups: typeof distribution }[];
    totalCapacity: number;
    notes: string;
  };

  const options: Option[] = [];

  // Option A: single bus that fits everyone
  const singleFit = buses
    .filter((b) => b.totalSeats >= total)
    .sort((a, b) => a.totalSeats - b.totalSeats)[0];
  if (singleFit) {
    options.push({
      label: `1 × ${singleFit.busNumber} (${singleFit.totalSeats}-seat ${singleFit.type})`,
      buses: [
        {
          busId: singleFit.id,
          busNumber: singleFit.busNumber,
          capacity: singleFit.totalSeats,
          pickups: distribution,
        },
      ],
      totalCapacity: singleFit.totalSeats,
      notes: "One bus covers every pickup point.",
    });
  }

  // Option B: greedy split across multiple buses by pickup volume
  const sortedPickups = [...distribution].sort((a, b) => b.travellers - a.travellers);
  const sortedBuses = [...buses].sort((a, b) => b.totalSeats - a.totalSeats);
  const split: Option["buses"] = [];
  let busIdx = 0;
  let currentBus = sortedBuses[busIdx];
  let currentLoad = 0;
  let currentPickups: typeof distribution = [];
  for (const p of sortedPickups) {
    if (!currentBus) break;
    if (currentLoad + p.travellers > currentBus.totalSeats) {
      split.push({
        busId: currentBus.id,
        busNumber: currentBus.busNumber,
        capacity: currentBus.totalSeats,
        pickups: currentPickups,
      });
      busIdx++;
      currentBus = sortedBuses[busIdx];
      currentLoad = 0;
      currentPickups = [];
      if (!currentBus) break;
    }
    currentLoad += p.travellers;
    currentPickups.push(p);
  }
  if (currentBus && currentPickups.length > 0) {
    split.push({
      busId: currentBus.id,
      busNumber: currentBus.busNumber,
      capacity: currentBus.totalSeats,
      pickups: currentPickups,
    });
  }
  if (
    split.length > 1 &&
    split.reduce((s, b) => s + b.capacity, 0) >= total
  ) {
    options.push({
      label: `${split.length} buses (split by pickup volume)`,
      buses: split,
      totalCapacity: split.reduce((s, b) => s + b.capacity, 0),
      notes: "Split lets buses leave faster with fewer pickup stops each.",
    });
  }

  return { options, total, distribution };
}
