import { TourStatus } from "@prisma/client";
import { prisma } from "../prisma";
import { NotFoundError, ValidationError } from "../shared/errors";
import {
  createTourSchema,
  updateTourSchema,
  type CreateTourInput,
  type UpdateTourInput,
} from "./schemas";

/**
 * Slugify a tour title. Replaces non-alphanumerics with hyphens, lowercases.
 * Append a short random suffix to keep slugs unique without checking the DB twice.
 */
function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export async function createTour(input: CreateTourInput, createdById: string) {
  const data = createTourSchema.parse(input);

  return prisma.tourPackage.create({
    data: {
      slug: slugify(data.title),
      title: data.title,
      description: data.description,
      highlights: data.highlights,
      coverImage: data.coverImage,
      gallery: data.gallery,
      region: data.region,
      destinationCity: data.destinationCity,
      durationDays: data.durationDays,
      departureDate: data.departureDate,
      returnDate: data.returnDate,
      adultPrice: data.adultPrice,
      childPrice: data.childPrice,
      capacity: data.capacity,
      minTravellers: data.minTravellers,
      createdById,
      status: TourStatus.DRAFT,
      spots: {
        create: data.spots.map((s) => ({
          name: s.name,
          description: s.description,
          image: s.image || null,
          dayNumber: s.dayNumber,
          orderIndex: s.orderIndex,
          startTime: s.startTime || null,
          stayMinutes: s.stayMinutes,
          entryFeeIncluded: s.entryFeeIncluded,
        })),
      },
      pickupPoints: {
        create: data.pickupPoints.map((p) => ({
          name: p.name,
          city: p.city,
          address: p.address,
          landmark: p.landmark,
          pickupTime: p.pickupTime,
          returnTime: p.returnTime,
          orderIndex: p.orderIndex,
        })),
      },
    },
    include: { spots: true, pickupPoints: true },
  });
}

export async function updateTour(input: UpdateTourInput) {
  const data = updateTourSchema.parse(input);
  const { id, spots, pickupPoints, ...rest } = data;

  // For spots and pickup points, replace the whole set if provided —
  // simpler than diffing and adequate for an admin builder.
  return prisma.$transaction(async (tx) => {
    const existing = await tx.tourPackage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Tour");

    if (spots) {
      await tx.tourSpot.deleteMany({ where: { tourPackageId: id } });
      await tx.tourSpot.createMany({
        data: spots.map((s) => ({
          tourPackageId: id,
          name: s.name,
          description: s.description,
          image: s.image || null,
          dayNumber: s.dayNumber,
          orderIndex: s.orderIndex,
          startTime: s.startTime || null,
          stayMinutes: s.stayMinutes,
          entryFeeIncluded: s.entryFeeIncluded,
        })),
      });
    }

    if (pickupPoints) {
      await tx.pickupPoint.deleteMany({ where: { tourPackageId: id } });
      await tx.pickupPoint.createMany({
        data: pickupPoints.map((p) => ({
          tourPackageId: id,
          name: p.name,
          city: p.city,
          address: p.address,
          landmark: p.landmark,
          pickupTime: p.pickupTime,
          returnTime: p.returnTime,
          orderIndex: p.orderIndex,
        })),
      });
    }

    return tx.tourPackage.update({
      where: { id },
      data: rest,
      include: { spots: true, pickupPoints: true },
    });
  });
}

export async function setTourStatus(id: string, status: TourStatus) {
  const tour = await prisma.tourPackage.findUnique({
    where: { id },
    include: { _count: { select: { spots: true, pickupPoints: true } } },
  });
  if (!tour) throw new NotFoundError("Tour");

  if (status === TourStatus.PUBLISHED) {
    if (tour._count.spots === 0) {
      throw new ValidationError("Add at least one sightseeing spot before publishing");
    }
    if (tour._count.pickupPoints === 0) {
      throw new ValidationError("Add at least one pickup point before publishing");
    }
  }

  return prisma.tourPackage.update({
    where: { id },
    data: { status },
  });
}

export async function deleteTour(id: string) {
  const tour = await prisma.tourPackage.findUnique({
    where: { id },
    include: { _count: { select: { bookings: true } } },
  });
  if (!tour) throw new NotFoundError("Tour");
  if (tour._count.bookings > 0) {
    throw new ValidationError(
      "Cannot delete a tour that already has bookings. Cancel it instead.",
    );
  }
  return prisma.tourPackage.delete({ where: { id } });
}
