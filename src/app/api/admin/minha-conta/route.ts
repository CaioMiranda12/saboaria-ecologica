import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { recordAudit } from "@/lib/audit";

const profileSchema = z
  .object({ type: z.literal("profile"), name: z.string().trim().min(2).max(100) })
  .strict();
const passwordSchema = z
  .object({
    type: z.literal("password"),
    currentPassword: z.string().min(1),
    newPassword: z.string().min(12).max(128),
  })
  .strict();

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session)
    return NextResponse.json({ message: "Sessão expirada. Entre novamente." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (body?.type === "profile") {
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { message: "Informe um nome entre 2 e 100 caracteres." },
        { status: 400 },
      );
    const existing = await prisma.admin.findUnique({
      where: { id: session.adminId },
      select: { name: true },
    });
    if (!existing) return NextResponse.json({ message: "Conta não encontrada." }, { status: 404 });
    if (existing.name !== parsed.data.name) {
      await prisma.admin.update({
        where: { id: session.adminId },
        data: { name: parsed.data.name },
      });
      await recordAudit(session, "UPDATE_PROFILE", "admins", session.adminId);
    }
    return NextResponse.json({ ok: true, name: parsed.data.name });
  }
  if (body?.type === "password") {
    const parsed = passwordSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { message: "A nova senha deve ter entre 12 e 128 caracteres." },
        { status: 400 },
      );
    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
      select: { passwordHash: true },
    });
    if (!admin) return NextResponse.json({ message: "Conta não encontrada." }, { status: 404 });
    if (!(await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash)))
      return NextResponse.json({ message: "Senha atual incorreta." }, { status: 400 });
    if (await bcrypt.compare(parsed.data.newPassword, admin.passwordHash))
      return NextResponse.json(
        { message: "A nova senha deve ser diferente da atual." },
        { status: 400 },
      );
    const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
    // Compare-and-swap: evita alterações concorrentes com a mesma senha anterior.
    const updated = await prisma.admin.updateMany({
      where: { id: session.adminId, passwordHash: admin.passwordHash },
      data: { passwordHash: newHash, sessionVersion: { increment: 1 } },
    });
    if (!updated.count)
      return NextResponse.json(
        { message: "A senha foi alterada em outra sessão. Tente entrar novamente." },
        { status: 409 },
      );
    await recordAudit(session, "CHANGE_PASSWORD", "admins", session.adminId);
    return NextResponse.json({ ok: true, mustSignIn: true });
  }
  return NextResponse.json({ message: "Operação inválida." }, { status: 400 });
}
