import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { AdminTokenPayload } from "@/lib/jwt";

// Falhas na auditoria impedem confirmar uma alteração como concluída.
export async function recordAudit(
  actor: AdminTokenPayload,
  action: string,
  resource: string,
  resourceId?: string,
  changes?: Prisma.InputJsonValue,
) {
  const admin = await prisma.admin.findUnique({
    where: { id: actor.adminId },
    select: { name: true, email: true },
  });
  await prisma.auditEvent.create({
    data: {
      actorId: actor.adminId,
      actorEmail: admin?.email ?? actor.email,
      actorName: admin?.name ?? actor.email,
      action,
      resource,
      resourceId,
      ...(changes ? { changes } : {}),
    },
  });
}

// Allowlist: never persist password hashes, secrets, tokens or personal contact data.
const SAFE_PRODUCT_FIELDS = [
  "name",
  "slug",
  "description",
  "category",
  "isPublished",
  "displayOrder",
  "price",
] as const;
export function productChanges(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
) {
  const output: Record<
    string,
    { before: string | number | boolean | null; after: string | number | boolean | null }
  > = {};
  for (const key of SAFE_PRODUCT_FIELDS) {
    const safe = (value: unknown): string | number | boolean | null =>
      typeof value === "string"
        ? value.slice(0, 500)
        : typeof value === "number" || typeof value === "boolean"
          ? value
          : null;
    const oldValue = safe(before?.[key]);
    const newValue = safe(after?.[key]);
    if (oldValue !== newValue) output[key] = { before: oldValue, after: newValue };
  }
  return output;
}
