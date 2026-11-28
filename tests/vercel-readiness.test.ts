import { expect, it, vi } from "vitest";
import { isAllowedMediaFile, MAX_MEDIA_BYTES } from "@/constants/media";
import { publicIndexOrigin, siteOrigin } from "@/lib/site-url";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

it("mantém a demonstração HTTPS fora da indexação por padrão", () => {
  vi.stubEnv("APP_URL", "https://demo.vercel.app");
  vi.stubEnv("ALLOW_INDEXING", "false");
  vi.stubEnv("VERCEL_ENV", "production");
  expect(siteOrigin()).toBe("https://demo.vercel.app");
  expect(publicIndexOrigin()).toBeNull();
  expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  expect(sitemap()).toEqual([]);
});

it("não indexa um domínio vercel.app mesmo com autorização explícita", () => {
  vi.stubEnv("APP_URL", "https://demo.vercel.app");
  vi.stubEnv("ALLOW_INDEXING", "true");
  vi.stubEnv("VERCEL_ENV", "production");
  expect(publicIndexOrigin()).toBeNull();
});

it("não indexa ambientes de preview", () => {
  vi.stubEnv("APP_URL", "https://example.com");
  vi.stubEnv("ALLOW_INDEXING", "true");
  vi.stubEnv("VERCEL_ENV", "preview");
  expect(publicIndexOrigin()).toBeNull();
});

it("habilita o sitemap apenas para o domínio definitivo autorizado", () => {
  vi.stubEnv("APP_URL", "https://example.com");
  vi.stubEnv("ALLOW_INDEXING", "true");
  vi.stubEnv("VERCEL_ENV", "production");
  expect(sitemap()).toHaveLength(8);
  expect(sitemap().map((entry) => entry.url)).toContain("https://example.com/mapa");
  expect(sitemap().map((entry) => entry.url)).toContain("https://example.com/parcerias");
  expect(robots().sitemap).toBe("https://example.com/sitemap.xml");
});

it("aceita imagens até 4 MiB e rejeita arquivos maiores, vazios ou inválidos", () => {
  expect(MAX_MEDIA_BYTES).toBe(4194304);
  expect(isAllowedMediaFile({ size: MAX_MEDIA_BYTES, type: "image/jpeg" })).toBe(true);
  expect(isAllowedMediaFile({ size: MAX_MEDIA_BYTES + 1, type: "image/jpeg" })).toBe(false);
  expect(isAllowedMediaFile({ size: 0, type: "image/png" })).toBe(false);
  expect(isAllowedMediaFile({ size: 10, type: "image/svg+xml" })).toBe(false);
});
