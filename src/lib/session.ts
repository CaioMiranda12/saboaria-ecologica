import { cookies } from "next/headers";
import { verifyAdminToken, type AdminTokenPayload } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/constants/auth";

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}