import { expect, it, vi } from "vitest";
import { SignJWT } from "jose";

vi.mock("@/config/env", () => ({
  env: { JWT_SECRET: "test-only-jwt-secret-not-for-production-123456" },
}));

import { signAdminToken, verifyAdminToken } from "@/lib/jwt";

const secret = new TextEncoder().encode("test-only-jwt-secret-not-for-production-123456");
const claims = { adminId: "admin-test", email: "admin@example.test", sessionVersion: 1 };

it("aceita um token emitido pela aplicação", async () => {
  const token = await signAdminToken(claims);
  expect(await verifyAdminToken(token)).toMatchObject(claims);
});

it("rejeita token assinado com outro algoritmo", async () => {
  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS384" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
  await expect(verifyAdminToken(token)).rejects.toThrow();
});

it("rejeita token sem expiração", async () => {
  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secret);
  await expect(verifyAdminToken(token)).rejects.toThrow();
});

it("rejeita token expirado", async () => {
  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(1)
    .sign(secret);
  await expect(verifyAdminToken(token)).rejects.toThrow();
});

it("rejeita versão de sessão com tipo inválido", async () => {
  const token = await new SignJWT({ ...claims, sessionVersion: "1" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
  await expect(verifyAdminToken(token)).rejects.toThrow();
});
