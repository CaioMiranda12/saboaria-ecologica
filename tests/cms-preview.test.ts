import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ session: vi.fn(), version: vi.fn(), transaction: vi.fn() }));
vi.mock("@/lib/session", () => ({ getAdminSession: mocks.session }));
vi.mock("@/lib/prisma", () => ({
  prisma: { cmsVersion: { findFirst: mocks.version }, $transaction: mocks.transaction },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { GET } from "@/app/api/admin/cms/pages/[slug]/versions/route";

const section = {
  key: "hero",
  title: "Banner",
  position: 0,
  enabled: false,
  content: { title: "Versão antiga" },
};
const request = () =>
  new Request("http://localhost/api/admin/cms/pages/inicio/versions?versionId=old");
const params = () => ({ params: Promise.resolve({ slug: "inicio" }) });
beforeEach(() => {
  mocks.session.mockReset();
  mocks.version.mockReset();
  mocks.transaction.mockClear();
});

it("não expõe o histórico para visitantes sem sessão", async () => {
  mocks.session.mockResolvedValue(null);
  expect((await GET(request(), params())).status).toBe(401);
  expect(mocks.version).not.toHaveBeenCalled();
});

it("retorna o snapshot da página, inclusive seções desabilitadas, sem restaurar", async () => {
  mocks.session.mockResolvedValue({ adminId: "editor", email: "editor@example.com" });
  mocks.version.mockResolvedValue({ id: "old", sections: [section] });
  const response = await GET(request(), params());
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toContain("no-store");
  expect(await response.json()).toEqual({ version: { id: "old", sections: [section] } });
  expect(mocks.version).toHaveBeenCalledWith({
    where: { id: "old", page: { slug: "inicio" } },
    select: { id: true, sections: true },
  });
  expect(mocks.transaction).not.toHaveBeenCalled();
});

it("não retorna uma versão inexistente ou de outra página", async () => {
  mocks.session.mockResolvedValue({ adminId: "editor" });
  mocks.version.mockResolvedValue(null);
  expect((await GET(request(), params())).status).toBe(404);
  expect(mocks.transaction).not.toHaveBeenCalled();
});

it("rejeita snapshots incompatíveis com o schema", async () => {
  mocks.session.mockResolvedValue({ adminId: "editor" });
  mocks.version.mockResolvedValue({ id: "old", sections: [{ key: "hero" }] });
  expect((await GET(request(), params())).status).toBe(404);
});
