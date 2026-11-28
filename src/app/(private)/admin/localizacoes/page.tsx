import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { LocationsManager } from "@/components/admin/LocationsManager";

export const dynamic = "force-dynamic";
export default async function LocationsPage() {
  if (!(await getAdminSession())) redirect("/login");
  const locations = await prisma.location.findMany({
    orderBy: [{ name: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      address: true,
      description: true,
      latitude: true,
      longitude: true,
      isPublished: true,
    },
  });
  return <LocationsManager initialLocations={locations} />;
}
