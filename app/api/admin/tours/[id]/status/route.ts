import { apiHandler } from "@/lib/shared/api";
import { requireAdmin } from "@/lib/auth";
import { setTourStatus } from "@/lib/tours";

export const PATCH = (
  req: Request,
  { params }: { params: { id: string } },
) =>
  apiHandler(async () => {
    await requireAdmin();
    const { status } = await req.json();
    const tour = await setTourStatus(params.id, status);
    return { id: tour.id, status: tour.status };
  });
