import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 6;
function keyFor(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
export async function loginLimit(email: string, ip: string) {
  const keys = [keyFor(`email:${email.toLowerCase()}`), keyFor(`ip:${ip}`)];
  const records = await prisma.loginAttempt.findMany({ where: { key: { in: keys } } });
  return records.some((entry) => entry.blockedUntil && entry.blockedUntil.getTime() > Date.now());
}
export async function loginFailure(email: string, ip: string) {
  const keys = [keyFor(`email:${email.toLowerCase()}`), keyFor(`ip:${ip}`)];
  for (const key of keys) {
    const previous = await prisma.loginAttempt.findUnique({ where: { key } });
    if (previous && Date.now() - previous.updatedAt.getTime() > WINDOW_MS) {
      await prisma.loginAttempt.update({
        where: { key },
        data: { failures: 1, blockedUntil: null },
      });
      continue;
    }
    const entry = await prisma.loginAttempt.upsert({
      where: { key },
      create: { key, failures: 1 },
      update: { failures: { increment: 1 } },
    });
    if (entry.failures >= LIMIT) {
      await prisma.loginAttempt.update({
        where: { key },
        data: { blockedUntil: new Date(Date.now() + WINDOW_MS) },
      });
    }
  }
}
export async function loginSuccess(email: string) {
  await prisma.loginAttempt.deleteMany({ where: { key: keyFor(`email:${email.toLowerCase()}`) } });
}
