import { expect, it } from "vitest";
import { groupPoints, parseCoordinates, googleMapsUrl, validCoordinates } from "@/lib/location-map";
import { locationSchema } from "@/schemas/location.schema";
const sede = {
  name: "Unidade de teste",
  city: "Fortaleza",
  state: "CE",
  address: "Rua de teste",
  description: "",
  latitude: -3.7319,
  longitude: -38.5267,
  isPublished: false,
};
it("aceita sede oculta ou publicada", () => {
  expect(locationSchema.safeParse(sede).success).toBe(true);
  expect(locationSchema.safeParse({ ...sede, isPublished: true }).success).toBe(true);
});
it("rejeita coordenadas ausentes, inválidas ou fora dos limites", () => {
  expect(locationSchema.safeParse({ ...sede, latitude: undefined }).success).toBe(false);
  expect(locationSchema.safeParse({ ...sede, longitude: 38 }).success).toBe(false);
  expect(validCoordinates(NaN, -38)).toBe(false);
});
it("valida estado e endereço", () => {
  expect(locationSchema.safeParse({ ...sede, state: "XX" }).success).toBe(false);
  expect(locationSchema.safeParse({ ...sede, address: " " }).success).toBe(false);
});
it("interpreta coordenadas copiadas e recusa texto malformado", () => {
  expect(parseCoordinates("-3.7319, -38.5267")).toEqual({ latitude: -3.7319, longitude: -38.5267 });
  expect(parseCoordinates("https://example.org")).toBeNull();
  expect(parseCoordinates("45, 12")).toBeNull();
});
it("mantém sedes coincidentes e separa as distantes", () => {
  const groups = groupPoints(
    [
      { x: 5, y: 5, item: "a" },
      { x: 5, y: 5, item: "b" },
      { x: 150, y: 150, item: "c" },
    ],
    30,
  );
  expect(groups.map((g) => g.items)).toEqual([["a", "b"], ["c"]]);
});
it("separa sedes quando a distância projetada aumenta com zoom", () => {
  const points = [
    { x: 10, y: 10, item: 1 },
    { x: 20, y: 20, item: 2 },
  ];
  expect(groupPoints(points, 34)).toHaveLength(1);
  expect(
    groupPoints(
      points.map((p) => ({ ...p, x: p.x * 4, y: p.y * 4 })),
      34,
    ),
  ).toHaveLength(2);
});
it("gera URL do Google Maps a partir das coordenadas", () => {
  const url = new URL(googleMapsUrl(sede));
  expect(url.hostname).toBe("www.google.com");
  expect(url.searchParams.get("query")).toBe("-3.7319,-38.5267");
});
