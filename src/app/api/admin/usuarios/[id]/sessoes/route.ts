import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/admin-authorization";
import { getAdminSession } from "@/lib/session";
import { recordAudit } from "@/lib/audit";

type Context = { params: Promise<{ id: string }> };
export async function POST(_request: Request, { params }: Context) {
  if (!(await requireAdminRole()))
    return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
  const { id } = await params;
  const admin = await prisma.admin.findUnique({ where: { id }, select: { id: true } });
  if (!admin) return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
  await prisma.admin.update({ where: { id }, data: { sessionVersion: { increment: 1 } } });
  const session = await getAdminSession();
  if (session) await recordAudit(session, "UPDATE", "admin_sessions", id);
  return NextResponse.json({ ok: true });
}
