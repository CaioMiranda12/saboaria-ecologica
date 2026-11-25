import { expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import type { Admin } from "@prisma/client";
const mocks = vi.hoisted(() => ({ updateMany: vi.fn(), transaction: vi.fn(), hash: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { admin: { updateMany: mocks.updateMany }, $transaction: mocks.transaction },
}));
vi.mock("bcrypt", () => ({ default: { hash: mocks.hash } }));
import { consumeEmailCode } from "@/lib/email-factor";
import { hashResetToken, resetPassword } from "@/lib/password-reset";
function account(overrides: Partial<Admin> = {}): Admin {
  const secret = "test-secret-not-for-production-123456";
  vi.stubEnv("JWT_SECRET", secret);
  const now = new Date();
  return {
    id: "test",
    email: "test@example.com",
    name: "Test",
    role: "EDITOR",
    passwordHash: "unused",
    createdAt: now,
    updatedAt: now,
    sessionVersion: 1,
    emailFactor: true,
    emailOtpHash: createHmac("sha256", secret)
      .update(JSON.stringify(["test", "login", 1, "123456"]))
      .digest("hex"),
    emailOtpUntil: new Date(Date.now() + 60000),
    emailOtpSent: now,
    emailOtpAttempts: 0,
    emailOtpVersion: 1,
    emailOtpPurpose: "login",
    ...overrides,
  };
}
it("rejeita código expirado ou com limite de tentativas", async () => {
  expect(await consumeEmailCode(account({ emailOtpUntil: new Date(0) }), "login", "123456")).toBe(
    false,
  );
  expect(await consumeEmailCode(account({ emailOtpAttempts: 5 }), "login", "123456")).toBe(false);
  expect(mocks.updateMany).not.toHaveBeenCalled();
});
it("consome código válido uma única vez na atualização condicional", async () => {
  mocks.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });
  const admin = account();
  expect(await consumeEmailCode(admin, "login", "123456")).toBe(true);
  expect(await consumeEmailCode(admin, "login", "123456")).toBe(false);
});
it("gera hash de token e rejeita token malformado", async () => {
  expect(hashResetToken("abc")).toBe(
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
  expect(await resetPassword("invalid", "password-test-123")).toBe(false);
  expect(mocks.transaction).not.toHaveBeenCalled();
});
it("rejeita token usado ou expirado", async () => {
  mocks.hash.mockResolvedValue("hash");
  const findUnique = vi
    .fn()
    .mockResolvedValueOnce({ usedAt: new Date(), expiresAt: new Date(Date.now() + 60000) })
    .mockResolvedValueOnce({ usedAt: null, expiresAt: new Date(0) });
  const updateMany = vi.fn();
  mocks.transaction.mockImplementation(async (callback) =>
    callback({ passwordResetToken: { findUnique, updateMany } }),
  );
  expect(await resetPassword("a".repeat(64), "password-test-123")).toBe(false);
  expect(await resetPassword("b".repeat(64), "password-test-123")).toBe(false);
  expect(updateMany).not.toHaveBeenCalled();
});
