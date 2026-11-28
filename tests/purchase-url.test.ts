import { expect, it } from "vitest";
import { productFormSchema } from "@/schemas/product.schema";
import { safePurchaseUrl } from "@/lib/purchase-url";

const product = {
  mainName: "Sabão",
  shortDescription: "Descrição curta válida",
  fullDescription: "Descrição completa válida",
  type: "BAR",
};

it("aceita produto sem link de compra e permite limpar o campo", () => {
  expect(productFormSchema.safeParse(product).success).toBe(true);
  expect(productFormSchema.parse({ ...product, purchaseUrl: "  " }).purchaseUrl).toBe("");
  expect(safePurchaseUrl(null)).toBeNull();
  expect(safePurchaseUrl("")).toBeNull();
});

it("aceita endereço HTTPS de loja ou produto e preserva a consulta", () => {
  const url = "https://loja.example.com/produto?id=123";
  expect(productFormSchema.parse({ ...product, purchaseUrl: ` ${url} ` }).purchaseUrl).toBe(url);
  expect(safePurchaseUrl(url)).toBe(url);
});

it("rejeita protocolos inseguros, endereços relativos e credenciais", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,x",
    "http://example.com",
    "//example.com",
    "/produto",
    "https://user:pass@example.com",
    "https://",
    "https://example.com/ a",
  ]) {
    expect(safePurchaseUrl(url)).toBeNull();
    expect(productFormSchema.safeParse({ ...product, purchaseUrl: url }).success).toBe(false);
  }
});
