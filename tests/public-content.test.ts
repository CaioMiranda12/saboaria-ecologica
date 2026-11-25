import { expect, it, vi } from "vitest";
import { publicImageUrl } from "@/lib/public-image";
import { siteOrigin, publicIndexOrigin } from "@/lib/site-url";
import { validMediaSignature } from "@/lib/media-validation";
import { navigationFor } from "@/components/admin/admin-navigation";

it("usa a versão WebP local", () => expect(publicImageUrl("/hero.jpg", 800)).toBe("/hero.webp"));
it("otimiza Cloudinary versionado", () =>
  expect(publicImageUrl("https://res.cloudinary.com/demo/image/upload/v123/foo.jpg", 800)).toBe(
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_800/v123/foo.jpg",
  ));
it("preserva URLs externas", () =>
  expect(publicImageUrl("https://example.com/a.jpg", 800)).toBe("https://example.com/a.jpg"));
it("não indexa localhost", () => {
  vi.stubEnv("APP_URL", "http://localhost:3000");
  expect(siteOrigin()).toBe("http://localhost:3000");
  expect(publicIndexOrigin()).toBeNull();
});
it("aceita origem HTTPS e rejeita caminhos", () => {
  vi.stubEnv("APP_URL", "https://example.com");
  expect(publicIndexOrigin()).toBe("https://example.com");
  vi.stubEnv("APP_URL", "https://example.com/admin");
  expect(siteOrigin()).toBeNull();
});
it("verifica assinaturas de imagens", () => {
  expect(validMediaSignature(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), "image/png")).toBe(
    true,
  );
  expect(validMediaSignature(Buffer.from([255, 216, 255]), "image/jpeg")).toBe(true);
  expect(validMediaSignature(Buffer.from("RIFF0000WEBP"), "image/webp")).toBe(true);
  expect(validMediaSignature(Buffer.from("not an image"), "image/png")).toBe(false);
});
it("oculta rotas administrativas exclusivas do editor", () => {
  const restricted = ["/admin/seo", "/admin/usuarios", "/admin/auditoria"];
  const editor = navigationFor("EDITOR").map((item) => item.href);
  const admin = navigationFor("ADMIN").map((item) => item.href);
  for (const path of restricted) {
    expect(editor).not.toContain(path);
    expect(admin).toContain(path);
  }
  expect(editor).toContain("/admin/produtos");
});
