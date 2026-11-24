import { prisma } from "@/lib/prisma";
import { decryptSecret, matchingStep, recoveryHash } from "@/lib/totp";
import bcrypt from "bcrypt";
import { findAdminByEmail } from "@/repositories/admin.repository";
import { signAdminToken } from "@/lib/jwt";
import type { LoginFormValues } from "@/schemas/auth.schema";

export class SecondFactorRequired extends Error {}
export class InvalidCredentialsError extends Error {}

export async function authenticateAdmin({ email, password, code }: LoginFormValues) {
  const admin = await findAdminByEmail(email);

  if (!admin) {
    throw new InvalidCredentialsError();
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  if (admin.totpSecret) {
    if (!code) throw new SecondFactorRequired();
    const step = matchingStep(decryptSecret(admin.totpSecret, admin.id), code, admin.totpLastStep);
    const hash = recoveryHash(code);
    if (step === null && !admin.totpRecovery.includes(hash)) throw new InvalidCredentialsError();
    const used = await prisma.admin.updateMany({where:{id:admin.id,sessionVersion:admin.sessionVersion,totpSecret:admin.totpSecret,totpLastStep:admin.totpLastStep,totpRecovery:{equals:admin.totpRecovery}},data:step!==null?{totpLastStep:step}:{totpRecovery:admin.totpRecovery.filter(h=>h!==hash)}});
    if (!used.count) throw new InvalidCredentialsError();
  }
  const token = await signAdminToken({ adminId: admin.id, email: admin.email, sessionVersion: admin.sessionVersion });

  return { token, admin: { email: admin.email, name: admin.name } };
}