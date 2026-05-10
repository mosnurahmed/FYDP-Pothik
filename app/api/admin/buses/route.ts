import { apiHandler } from "@/lib/shared/api";
import { requireAdmin } from "@/lib/auth";
import { createBus } from "@/lib/admin";

export const POST = (req: Request) =>
  apiHandler(async () => {
    await requireAdmin();
    const body = await req.json();
    const bus = await createBus(body);
    return { id: bus.id };
  });
