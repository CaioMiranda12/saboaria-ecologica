import { prisma } from "@/lib/prisma";
import type { AdminTokenPayload } from "@/lib/jwt";

// Falhas na auditoria impedem confirmar uma alteração como concluída.
export async function recordAudit(actor: AdminTokenPayload, action: string, resource: string, resourceId?: string) {
  const admin = await prisma.admin.findUnique({ where: { id: actor.adminId }, select: { name: true, email: true } });
  await prisma.auditEvent.create({ data: {
    actorId: actor.adminId, actorEmail: admin?.email ?? actor.email,
    actorName: admin?.name ?? actor.email, action, resource, resourceId,
  } });
}
