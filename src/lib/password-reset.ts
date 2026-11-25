import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

const EXPIRY_MS = 30 * 60 * 1000;
const REQUEST_COOLDOWN_MS = 60 * 1000;
const GENERIC_MESSAGE =
  "Se o e-mail estiver cadastrado, você receberá as instruções para recuperar o acesso.";
export { GENERIC_MESSAGE };
export const hashResetToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function requestPasswordReset(email: string) {
  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, email: true },
  });
  if (!admin) return;
  const recent = await prisma.passwordResetToken.findFirst({
    where: { adminId: admin.id, createdAt: { gt: new Date(Date.now() - REQUEST_COOLDOWN_MS) } },
  });
  if (recent) return;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PASSWORD_RESET_FROM_EMAIL;
  const publicUrl = process.env.APP_URL;
  if (!apiKey || !from || !publicUrl) {
    console.error(
      "Password reset email is not configured: RESEND_API_KEY, PASSWORD_RESET_FROM_EMAIL and APP_URL required",
    );
    return;
  }
  // APP_URL must be configured by the operator, never derived from Host or forwarding headers.
  const base = new URL(publicUrl);
  if (
    base.protocol !== "https:" &&
    !(process.env.NODE_ENV !== "production" && base.hostname === "localhost")
  )
    throw new Error("APP_URL must use HTTPS");
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);
  const record = await prisma.passwordResetToken.create({
    data: { adminId: admin.id, tokenHash, expiresAt: new Date(Date.now() + EXPIRY_MS) },
  });
  const link = new URL("/redefinir-senha", base);
  link.searchParams.set("token", token);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [admin.email],
        subject: "Recuperação de acesso — Saboaria Ecológica",
        text: `Recebemos um pedido para redefinir sua senha administrativa. Abra este link (válido por 30 minutos): ${link.toString()}\n\nSe não solicitou, ignore esta mensagem.`,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  } catch (error) {
    await prisma.passwordResetToken.delete({ where: { id: record.id } }).catch(() => undefined);
    console.error("Failed to send password reset email", error);
  }
}

export async function resetPassword(token: string, password: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return false;
  const tokenHash = hashResetToken(token);
  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const record = await tx.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!record || record.usedAt || record.expiresAt <= now) return false;
    const consumed = await tx.passwordResetToken.updateMany({
      where: { id: record.id, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });
    if (consumed.count !== 1) return false;
    await tx.admin.update({
      where: { id: record.adminId },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    });
    await tx.passwordResetToken.updateMany({
      where: { adminId: record.adminId, usedAt: null },
      data: { usedAt: now },
    });
    await tx.auditEvent.create({
      data: {
        actorId: record.adminId,
        actorEmail: "[recuperacao]",
        actorName: "Recuperação de acesso",
        action: "PASSWORD_RESET",
        resource: "admin",
        resourceId: record.adminId,
      },
    });
    return true;
  });
}
