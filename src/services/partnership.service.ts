import {
  createPartnership,
  deletePartnership,
  findAllPartnerships,
  findPartnershipById,
  updatePartnership,
} from "@/repositories/partnership.repository";
import type { PartnershipFormValues } from "@/schemas/partnership.schema";

export class PartnershipNotFoundError extends Error {}

export function listPartnerships() {
  return findAllPartnerships();
}

export async function getPartnershipOrThrow(id: string) {
  const partnership = await findPartnershipById(id);

  if (!partnership) {
    throw new PartnershipNotFoundError();
  }

  return partnership;
}

export function createPartnershipFromForm(values: PartnershipFormValues) {
  return createPartnership(values);
}

export async function updatePartnershipFromForm(id: string, values: PartnershipFormValues) {
  await getPartnershipOrThrow(id);
  return updatePartnership(id, values);
}

export async function removePartnership(id: string) {
  await getPartnershipOrThrow(id);
  return deletePartnership(id);
}