import { NextResponse } from "next/server";
import { z } from "zod";
import { GENERIC_MESSAGE, requestPasswordReset } from "@/lib/password-reset";
import { prisma } from "@/lib/prisma";
import { createHash } from "node:crypto";

const schema = z.object({ email: z.string().trim().toLowerCase().max(254).pipe(z.email()) });
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ message: "Informe um e-mail válido." }, { status: 400 });
  // Separate request throttling: hashed email and trusted platform IP (if available).
  const ip = request.headers.get("x-real-ip") ?? "unknown";
  const keys = [`reset-email:${parsed.data.email}`, `reset-ip:${ip}`].map((x) =>
    createHash("sha256").update(x).digest("hex"),
  );
  const now = new Date();
  const records = await prisma.loginAttempt.findMany({ where: { key: { in: keys } } });
  if (records.some((r) => r.blockedUntil && r.blockedUntil > now))
    return NextResponse.json({ message: GENERIC_MESSAGE });
  for (const key of keys) {
    const previous = records.find((r) => r.key === key);
    const stale = !previous || now.getTime() - previous.updatedAt.getTime() > 60 * 60 * 1000;
    const failures = stale ? 1 : previous.failures + 1;
    await prisma.loginAttempt.upsert({
      where: { key },
      create: { key, failures, blockedUntil: null },
      update: {
        failures,
        blockedUntil: failures >= 5 ? new Date(now.getTime() + 60 * 60 * 1000) : null,
      },
    });
  }
  try {
    await requestPasswordReset(parsed.data.email);
  } catch (error) {
    console.error("Password reset request failed", error);
  }
  return NextResponse.json({ message: GENERIC_MESSAGE });
}
