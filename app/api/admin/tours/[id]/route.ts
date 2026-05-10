import { apiHandler } from "@/lib/shared/api";
import { requireAdmin } from "@/lib/auth";
import { updateTour, deleteTour } from "@/lib/tours";

export const PATCH = (
  req: Request,
  { params }: { params: { id: string } },
) =>
  apiHandler(async () => {
    await requireAdmin();
    const body = await req.json();
    const tour = await updateTour({ ...body, id: params.id });
    return { id: tour.id };
  });

export const DELETE = (
  _req: Request,
  { params }: { params: { id: string } },
) =>
  apiHandler(async () => {
    await requireAdmin();
    await deleteTour(params.id);
    return { ok: true };
  });
