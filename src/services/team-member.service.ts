import {
  createTeamMember,
  deleteTeamMember,
  findAllTeamMembers,
  findTeamMemberById,
  updateTeamMember,
} from "@/repositories/team-member.repository";
import type { TeamMemberFormValues } from "@/schemas/team-member.schema";

export class TeamMemberNotFoundError extends Error {}

export function listTeamMembers() {
  return findAllTeamMembers();
}

export async function getTeamMemberOrThrow(id: string) {
  const member = await findTeamMemberById(id);

  if (!member) {
    throw new TeamMemberNotFoundError();
  }

  return member;
}

export function createTeamMemberFromForm(values: TeamMemberFormValues) {
  return createTeamMember(values);
}

export async function updateTeamMemberFromForm(id: string, values: TeamMemberFormValues) {
  await getTeamMemberOrThrow(id);
  return updateTeamMember(id, values);
}

export async function removeTeamMember(id: string) {
  await getTeamMemberOrThrow(id);
  return deleteTeamMember(id);
}