import { apiHandler } from "@/lib/shared/api";
import { requireAdmin } from "@/lib/auth";
import { removeBusAssignment } from "@/lib/admin";

export const DELETE = (
  _req: Request,
  { params }: { params: { id: string } },
) =>
  apiHandler(async () => {
    await requireAdmin();
    await removeBusAssignment(params.id);
    return { ok: true };
  });
