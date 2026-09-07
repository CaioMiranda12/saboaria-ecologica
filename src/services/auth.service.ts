import bcrypt from "bcrypt";
import { findAdminByEmail } from "@/repositories/admin.repository";
import { signAdminToken } from "@/lib/jwt";
import type { LoginFormValues } from "@/schemas/auth.schema";

export class InvalidCredentialsError extends Error {}

export async function authenticateAdmin({ email, password }: LoginFormValues) {
  const admin = await findAdminByEmail(email);

  if (!admin) {
    throw new InvalidCredentialsError();
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  const token = await signAdminToken({ adminId: admin.id, email: admin.email });

  return { token, admin: { email: admin.email, name: admin.name } };
}