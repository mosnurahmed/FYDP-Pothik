import { apiHandler } from "@/lib/shared/api";
import { requireAdmin } from "@/lib/auth";
import { updateBus, deleteBus } from "@/lib/admin";

export const PATCH = (
  req: Request,
  { params }: { params: { id: string } },
) =>
  apiHandler(async () => {
    await requireAdmin();
    const body = await req.json();
    const bus = await updateBus(params.id, body);
    return { id: bus.id };
  });

export const DELETE = (
  _req: Request,
  { params }: { params: { id: string } },
) =>
  apiHandler(async () => {
    await requireAdmin();
    await deleteBus(params.id);
    return { ok: true };
  });
