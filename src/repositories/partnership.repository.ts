import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function findAllPartnerships() {
  return prisma.partnership.findMany({ orderBy: { order: "asc" } });
}

export function findPartnershipById(id: string) {
  return prisma.partnership.findUnique({ where: { id } });
}

export function createPartnership(data: Prisma.PartnershipCreateInput) {
  return prisma.partnership.create({ data });
}

export function updatePartnership(id: string, data: Prisma.PartnershipUpdateInput) {
  return prisma.partnership.update({ where: { id }, data });
}

export function deletePartnership(id: string) {
  return prisma.partnership.delete({ where: { id } });
}