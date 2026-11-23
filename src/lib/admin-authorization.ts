import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function requireAdminRole() {
  const session = await getAdminSession();
  if (!session) return null;
  const admin = await prisma.admin.findUnique({ where: { id: session.adminId }, select: { id: true, email: true, name: true, role: true } });
  return admin?.role === "ADMIN" ? admin : null;
}
