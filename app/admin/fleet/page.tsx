import { listBuses } from "@/lib/admin";
import BusFleetManager from "@/components/admin/BusFleetManager";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const buses = await listBuses();
  return <BusFleetManager initial={buses} />;
}
