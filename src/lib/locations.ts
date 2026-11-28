import { prisma } from "@/lib/prisma";

export async function publicLocations() {
  return prisma.location.findMany({
    where: { isPublished: true },
    orderBy: [{ state: "asc" }, { city: "asc" }, { name: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      address: true,
      description: true,
      latitude: true,
      longitude: true,
    },
  });
}
