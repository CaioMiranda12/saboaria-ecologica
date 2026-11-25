import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  findUnique: vi.fn(),
  remove: vi.fn(),
  get: vi.fn(),
  audit: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ getAdminSession: mocks.session }));
vi.mock("@/lib/prisma", () => ({ prisma: { admin: { findUnique: mocks.findUnique } } }));
vi.mock("@/lib/audit", () => ({ recordAudit: mocks.audit, productChanges: vi.fn() }));
vi.mock("@/services/product.service", () => ({
  removeProduct: mocks.remove,
  getProductOrThrow: mocks.get,
  updateProductFromForm: vi.fn(),
  ProductNotFoundError: class extends Error {},
  DuplicateProductSlugError: class extends Error {},
}));
import { DELETE } from "@/app/api/admin/products/[id]/route";
const request = () => new Request("http://localhost/api/admin/products/test", { method: "DELETE" });
const params = () => ({ params: Promise.resolve({ id: "test" }) });
beforeEach(() => {
  mocks.session.mockReset();
  mocks.findUnique.mockReset();
  mocks.remove.mockReset();
  mocks.get.mockReset();
  mocks.audit.mockReset();
});
it("recusa exclusão sem sessão", async () => {
  mocks.session.mockResolvedValue(null);
  expect((await DELETE(request(), params())).status).toBe(401);
  expect(mocks.remove).not.toHaveBeenCalled();
});
it("recusa exclusão direta pelo editor", async () => {
  mocks.session.mockResolvedValue({
    adminId: "editor",
    email: "editor@example.com",
    sessionVersion: 1,
  });
  mocks.findUnique.mockResolvedValue({ role: "EDITOR" });
  expect((await DELETE(request(), params())).status).toBe(403);
  expect(mocks.remove).not.toHaveBeenCalled();
});
it("permite exclusão pelo administrador e registra auditoria", async () => {
  mocks.session.mockResolvedValue({
    adminId: "admin",
    email: "admin@example.com",
    sessionVersion: 1,
  });
  mocks.findUnique.mockResolvedValue({ role: "ADMIN" });
  mocks.get.mockResolvedValue({ id: "test" });
  expect((await DELETE(request(), params())).status).toBe(200);
  expect(mocks.remove).toHaveBeenCalledWith("test");
  expect(mocks.audit).toHaveBeenCalledTimes(1);
});
