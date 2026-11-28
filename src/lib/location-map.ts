export const STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;
export type Coordinates = { latitude: number; longitude: number };
export type LocationView = Coordinates & {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  description: string;
};
export function validCoordinates(latitude: number, longitude: number) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -34 &&
    latitude <= 6 &&
    longitude >= -74 &&
    longitude <= -28
  );
}
export function parseCoordinates(value: string): Coordinates | null {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  return validCoordinates(latitude, longitude) ? { latitude, longitude } : null;
}
export function googleMapsUrl(location: Coordinates) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.latitude},${location.longitude}`)}`;
}
export type MapPoint<T> = { x: number; y: number; item: T };
// The first point anchors each group; coordinates of individual locations never change.
export function groupPoints<T>(points: MapPoint<T>[], radius: number) {
  const groups: { x: number; y: number; items: T[] }[] = [];
  for (const point of points) {
    const group = groups.find((g) => Math.hypot(point.x - g.x, point.y - g.y) <= radius);
    if (group) group.items.push(point.item);
    else groups.push({ x: point.x, y: point.y, items: [point.item] });
  }
  return groups;
}
