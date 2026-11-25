import { expect, it } from "vitest";
import { isAllowedApiRequest } from "@/lib/request-security";

const request = (method: string, headers: Record<string, string> = {}) =>
  new Request("http://localhost:3000/api/admin/products", { method, headers });

it("permite leitura e mutações da mesma origem", () => {
  expect(isAllowedApiRequest(request("GET", { "sec-fetch-site": "cross-site" }))).toBe(true);
  expect(isAllowedApiRequest(request("POST", { "sec-fetch-site": "same-origin" }))).toBe(true);
});

it("bloqueia mutações vindas de outro site ou subdomínio", () => {
  for (const site of ["cross-site", "same-site", "none"]) {
    expect(isAllowedApiRequest(request("PATCH", { "sec-fetch-site": site }))).toBe(false);
  }
});

it("verifica Origin na ausência de Fetch Metadata", () => {
  expect(isAllowedApiRequest(request("POST", { origin: "http://localhost:3000" }))).toBe(true);
  expect(isAllowedApiRequest(request("DELETE", { origin: "https://externo.example" }))).toBe(false);
  expect(isAllowedApiRequest(request("POST", { origin: "null" }))).toBe(false);
});

it("aceita a origem pública configurada atrás de proxy", () => {
  expect(
    isAllowedApiRequest(
      request("POST", { origin: "https://site.example" }),
      "https://site.example",
    ),
  ).toBe(true);
});

it("mantém clientes sem cabeçalhos de navegador sujeitos à autenticação normal", () => {
  expect(isAllowedApiRequest(request("POST"))).toBe(true);
});
