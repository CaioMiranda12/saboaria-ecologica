import { issueEmailCode, consumeEmailCode } from "@/lib/email-factor";
import bcrypt from "bcrypt";
import { findAdminByEmail } from "@/repositories/admin.repository";
import { signAdminToken } from "@/lib/jwt";
import type { LoginFormValues } from "@/schemas/auth.schema";

export class SecondFactorRequired extends Error { constructor(public method: "email") { super(); } }
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

  if (admin.emailFactor) {
    if (!code) { await issueEmailCode(admin, "login"); throw new SecondFactorRequired("email"); }
    if (!await consumeEmailCode(admin, "login", code)) throw new InvalidCredentialsError();
  }
  const token = await signAdminToken({ adminId: admin.id, email: admin.email, sessionVersion: admin.sessionVersion });

  return { token, admin: { email: admin.email, name: admin.name } };
}