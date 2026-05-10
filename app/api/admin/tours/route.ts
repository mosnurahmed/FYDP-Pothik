import { apiHandler } from "@/lib/shared/api";
import { requireAdmin } from "@/lib/auth";
import { createTour } from "@/lib/tours";

export const POST = (req: Request) =>
  apiHandler(async () => {
    const admin = await requireAdmin();
    const body = await req.json();
    const tour = await createTour(body, admin.id);
    return { id: tour.id, slug: tour.slug };
  });
