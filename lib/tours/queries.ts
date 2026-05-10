import { Prisma, TourStatus } from "@prisma/client";
import { prisma } from "../prisma";
import { NotFoundError } from "../shared/errors";
import type { TourFilters } from "./schemas";

/**
 * Read-only queries for the tours domain.
 * Pages and route handlers should ONLY hit Prisma through this module.
 */

export async function listPublishedTours(filters: TourFilters = {}) {
  const where: Prisma.TourPackageWhereInput = {
    status: TourStatus.PUBLISHED,
    departureDate: { gte: filters.fromDate ?? new Date() },
  };

  if (filters.region) where.region = filters.region;
  if (filters.destinationCity) where.destinationCity = filters.destinationCity;
  if (filters.durationType === "DAY_TRIP") where.durationDays = 1;
  if (filters.durationType === "MULTI_DAY") where.durationDays = { gt: 1 };
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { destinationCity: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.tourPackage.findMany({
    where,
    orderBy: { departureDate: "asc" },
    include: {
      _count: { select: { bookings: true, spots: true, pickupPoints: true } },
    },
  });
}

export async function getFeaturedTours(limit = 6) {
  return prisma.tourPackage.findMany({
    where: {
      status: TourStatus.PUBLISHED,
      departureDate: { gte: new Date() },
    },
    orderBy: [{ departureDate: "asc" }],
    take: limit,
    include: {
      _count: { select: { bookings: true, spots: true, pickupPoints: true } },
    },
  });
}

export async function getTourBySlug(slug: string) {
  const tour = await prisma.tourPackage.findUnique({
    where: { slug },
    include: {
      spots: { orderBy: [{ dayNumber: "asc" }, { orderIndex: "asc" }] },
      pickupPoints: { orderBy: { orderIndex: "asc" } },
      _count: { select: { bookings: true } },
    },
  });
  if (!tour) throw new NotFoundError("Tour");
  return tour;
}

export async function getTourById(id: string) {
  const tour = await prisma.tourPackage.findUnique({
    where: { id },
    include: {
      spots: { orderBy: [{ dayNumber: "asc" }, { orderIndex: "asc" }] },
      pickupPoints: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!tour) throw new NotFoundError("Tour");
  return tour;
}

/**
 * Count of paid travellers (adults + children + infants) for a tour.
 * Used by capacity checks and admin dashboard.
 */
export async function countTravellers(tourPackageId: string) {
  const result = await prisma.tourBooking.aggregate({
    where: {
      tourPackageId,
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    _sum: { adultsCount: true, childrenCount: true, infantsCount: true },
  });

  const adults = result._sum.adultsCount ?? 0;
  const children = result._sum.childrenCount ?? 0;
  const infants = result._sum.infantsCount ?? 0;
  return { adults, children, infants, total: adults + children + infants };
}

export async function listAllToursForAdmin() {
  return prisma.tourPackage.findMany({
    orderBy: [{ status: "asc" }, { departureDate: "asc" }],
    include: {
      _count: { select: { bookings: true } },
    },
  });
}
