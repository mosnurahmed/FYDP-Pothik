import { apiHandler } from "@/lib/shared/api";
import { requireAdmin } from "@/lib/auth";
import { assignBus } from "@/lib/admin";

export const POST = (req: Request) =>
  apiHandler(async () => {
    await requireAdmin();
    const body = await req.json();
    const a = await assignBus(body);
    return { id: a.id };
  });
