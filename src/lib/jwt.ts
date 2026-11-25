import { SignJWT, jwtVerify } from "jose";
import { env } from "@/config/env";
import { AUTH_TOKEN_EXPIRATION } from "@/constants/auth";

const JWT_ALGORITHM = "HS256";
const secretKey = new TextEncoder().encode(env.JWT_SECRET);

export type AdminTokenPayload = {
  adminId: string;
  email: string;
  sessionVersion: number;
};

export function signAdminToken(payload: AdminTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(AUTH_TOKEN_EXPIRATION)
    .sign(secretKey);
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify<AdminTokenPayload>(token, secretKey, {
    algorithms: [JWT_ALGORITHM],
    requiredClaims: ["exp", "iat", "adminId", "email", "sessionVersion"],
  });
  if (
    typeof payload.adminId !== "string" ||
    !payload.adminId ||
    typeof payload.email !== "string" ||
    !payload.email ||
    !Number.isInteger(payload.sessionVersion) ||
    payload.sessionVersion < 0
  ) {
    throw new Error("Invalid admin token payload");
  }
  return payload;
}
