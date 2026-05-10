import { prisma } from "../prisma";
import { NotFoundError, ValidationError } from "../shared/errors";
import {
  busInputSchema,
  busAssignmentInputSchema,
  type BusInput,
  type BusAssignmentInput,
} from "./schemas";

export async function createBus(input: BusInput) {
  const data = busInputSchema.parse(input);
  return prisma.bus.create({ data });
}

export async function updateBus(id: string, input: Partial<BusInput>) {
  const data = busInputSchema.partial().parse(input);
  const bus = await prisma.bus.findUnique({ where: { id } });
  if (!bus) throw new NotFoundError("Bus");
  return prisma.bus.update({ where: { id }, data });
}

export async function deleteBus(id: string) {
  const bus = await prisma.bus.findUnique({
    where: { id },
    include: { _count: { select: { assignments: true } } },
  });
  if (!bus) throw new NotFoundError("Bus");
  if (bus._count.assignments > 0) {
    throw new ValidationError(
      "Bus is assigned to one or more tours. Remove assignments first.",
    );
  }
  return prisma.bus.delete({ where: { id } });
}

export async function assignBus(input: BusAssignmentInput) {
  const data = busAssignmentInputSchema.parse(input);

  // Verify bus and tour exist
  const [bus, tour] = await Promise.all([
    prisma.bus.findUnique({ where: { id: data.busId } }),
    prisma.tourPackage.findUnique({
      where: { id: data.tourPackageId },
      include: { pickupPoints: { select: { id: true } } },
    }),
  ]);
  if (!bus) throw new NotFoundError("Bus");
  if (!tour) throw new NotFoundError("Tour");

  // Verify all pickup points belong to this tour
  const validIds = new Set(tour.pickupPoints.map((p) => p.id));
  for (const id of data.pickupPointIds) {
    if (!validIds.has(id)) {
      throw new ValidationError("Pickup point doesn't belong to this tour");
    }
  }

  return prisma.busAssignment.upsert({
    where: {
      tourPackageId_busId: {
        tourPackageId: data.tourPackageId,
        busId: data.busId,
      },
    },
    create: {
      tourPackageId: data.tourPackageId,
      busId: data.busId,
      pickupPointIds: data.pickupPointIds,
      notes: data.notes,
    },
    update: {
      pickupPointIds: data.pickupPointIds,
      notes: data.notes,
    },
  });
}

export async function removeBusAssignment(assignmentId: string) {
  return prisma.busAssignment.delete({ where: { id: assignmentId } });
}
