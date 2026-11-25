import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { Admin } from "@prisma/client";
const digest = (id: string, purpose: string, version: number, code: string) =>
  createHmac("sha256", process.env.JWT_SECRET!)
    .update(JSON.stringify([id, purpose, version, code]))
    .digest("hex");
export async function issueEmailCode(admin: Admin, purpose: string) {
  const apiKey = process.env.RESEND_API_KEY,
    from = process.env.PASSWORD_RESET_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Envio de e-mail indisponível");
  const now = new Date();
  const code = randomInt(0, 1000000).toString().padStart(6, "0");
  const hash = digest(admin.id, purpose, admin.sessionVersion, code);
  const result = await prisma.admin.updateMany({
    where: {
      id: admin.id,
      sessionVersion: admin.sessionVersion,
      OR: [{ emailOtpSent: null }, { emailOtpSent: { lte: new Date(now.getTime() - 60000) } }],
    },
    data: {
      emailOtpHash: hash,
      emailOtpUntil: new Date(now.getTime() + 300000),
      emailOtpSent: now,
      emailOtpAttempts: 0,
      emailOtpVersion: admin.sessionVersion,
      emailOtpPurpose: purpose,
    },
  });
  if (!result.count) {
    if (
      admin.emailOtpAttempts < 5 &&
      admin.emailOtpPurpose === purpose &&
      admin.emailOtpVersion === admin.sessionVersion &&
      admin.emailOtpHash &&
      admin.emailOtpUntil &&
      admin.emailOtpUntil > now
    )
      return;
    throw new Error("Aguarde antes de solicitar outro código");
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [admin.email],
        subject: "Código de segurança — Saboaria Ecológica",
        text: `Seu código de segurança é ${code}. Válido por cinco minutos. Não compartilhe este código.`,
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Falha no envio");
  } catch {
    await prisma.admin.updateMany({
      where: { id: admin.id, emailOtpHash: hash },
      data: { emailOtpHash: null, emailOtpUntil: null },
    });
    throw new Error("Não foi possível enviar o código");
  }
}
export async function consumeEmailCode(admin: Admin, purpose: string, code: string) {
  if (
    !admin.emailOtpHash ||
    admin.emailOtpPurpose !== purpose ||
    admin.emailOtpVersion !== admin.sessionVersion ||
    !admin.emailOtpUntil ||
    admin.emailOtpUntil <= new Date() ||
    admin.emailOtpAttempts >= 5
  )
    return false;
  const valid =
    /^\d{6}$/.test(code) &&
    timingSafeEqual(
      Buffer.from(admin.emailOtpHash),
      Buffer.from(digest(admin.id, purpose, admin.sessionVersion, code)),
    );
  const result = await prisma.admin.updateMany({
    where: {
      id: admin.id,
      sessionVersion: admin.sessionVersion,
      emailOtpHash: admin.emailOtpHash,
      emailOtpAttempts: admin.emailOtpAttempts,
      emailOtpUntil: { gt: new Date() },
    },
    data: valid
      ? { emailOtpHash: null, emailOtpUntil: null }
      : { emailOtpAttempts: { increment: 1 } },
  });
  return valid && result.count === 1;
}
