import { expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  page: vi.fn(),
  admin: vi.fn(),
  publication: vi.fn(),
  version: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    cmsPage: { findUnique: mocks.page },
    admin: { findUnique: mocks.admin },
    $transaction: async (callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        cmsPublication: { upsert: mocks.publication },
        cmsVersion: { create: mocks.version },
      }),
  },
}));
import { getPublishedSections, publishCmsPage } from "@/services/cms-publication.service";
const section = {
  key: "hero",
  title: "Início",
  position: 0,
  enabled: true,
  content: { title: "Publicado" },
};
it("retorna apenas seções publicadas habilitadas", async () => {
  mocks.page.mockResolvedValue({
    publication: { sections: [section, { ...section, key: "hidden", enabled: false }] },
  });
  expect(await getPublishedSections("inicio")).toEqual([section]);
});
it("retorna vazio sem publicação", async () => {
  mocks.page.mockResolvedValue({ publication: null });
  expect(await getPublishedSections("inicio")).toEqual([]);
});
it("publica snapshot, registra autoria e revalida página", async () => {
  mocks.page.mockResolvedValue({ id: "page", sections: [section] });
  mocks.admin.mockResolvedValue({ id: "admin", name: "Admin", email: "admin@example.com" });
  expect(await publishCmsPage("inicio", { adminId: "admin", email: "admin@example.com" })).toEqual({
    published: true,
  });
  expect(mocks.publication).toHaveBeenCalledWith(
    expect.objectContaining({ create: { pageId: "page", sections: [section] } }),
  );
  expect(mocks.version).toHaveBeenCalledWith({
    data: expect.objectContaining({ action: "PUBLISH", actorId: "admin", sections: [section] }),
  });
  expect(mocks.revalidate).toHaveBeenCalledWith("/");
});
