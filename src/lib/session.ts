import { cookies } from "next/headers";
import { verifyAdminToken, type AdminTokenPayload } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/constants/auth";
import { prisma } from "@/lib/prisma";

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAdminToken(token);
    const admin = await prisma.admin.findUnique({ where: { id: payload.adminId }, select: { email: true } });
    return admin && admin.email === payload.email ? payload : null;
  } catch {
    return null;
  }
}