import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  transaction: vi.fn(),
  actor: vi.fn(),
  remove: vi.fn(),
  audit: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ getAdminSession: mocks.session }));
vi.mock("@/lib/prisma", () => ({ prisma: { $transaction: mocks.transaction } }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
import { DELETE, PATCH } from "@/app/api/admin/locations/[id]/route";
const params = { params: Promise.resolve({ id: "test" }) };
const request = (method: string, body?: string) =>
  new Request("http://localhost/api/admin/locations/test", { method, body });
beforeEach(() => {
  vi.resetAllMocks();
  mocks.session.mockResolvedValue({ adminId: "a" });
  mocks.transaction.mockImplementation(async (fn) =>
    fn({
      admin: { findUniqueOrThrow: mocks.actor },
      location: { delete: mocks.remove },
      auditEvent: { create: mocks.audit },
    }),
  );
});
it("rejeita exclusão sem sessão", async () => {
  mocks.session.mockResolvedValue(null);
  expect((await DELETE(request("DELETE"), params)).status).toBe(401);
  expect(mocks.transaction).not.toHaveBeenCalled();
});
it("impede exclusão por editor no servidor", async () => {
  mocks.actor.mockResolvedValue({ role: "EDITOR" });
  expect((await DELETE(request("DELETE"), params)).status).toBe(403);
  expect(mocks.remove).not.toHaveBeenCalled();
});
it("admin exclui e registra auditoria na transação", async () => {
  mocks.actor.mockResolvedValue({ role: "ADMIN", id: "a", email: "a@example.com", name: "Teste" });
  expect((await DELETE(request("DELETE"), params)).status).toBe(200);
  expect(mocks.remove).toHaveBeenCalledWith({ where: { id: "test" } });
  expect(mocks.audit).toHaveBeenCalledTimes(1);
  expect(mocks.revalidate).toHaveBeenCalledWith("/mapa");
});
it("rejeita JSON malformado antes de acessar o banco", async () => {
  expect((await PATCH(request("PATCH", "{"), params)).status).toBe(400);
  expect(mocks.transaction).not.toHaveBeenCalled();
});
