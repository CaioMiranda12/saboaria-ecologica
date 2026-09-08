import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function findAllTeamMembers() {
  return prisma.teamMember.findMany({ orderBy: { order: "asc" } });
}

export function findTeamMemberById(id: string) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export function createTeamMember(data: Prisma.TeamMemberCreateInput) {
  return prisma.teamMember.create({ data });
}

export function updateTeamMember(id: string, data: Prisma.TeamMemberUpdateInput) {
  return prisma.teamMember.update({ where: { id }, data });
}

export function deleteTeamMember(id: string) {
  return prisma.teamMember.delete({ where: { id } });
}