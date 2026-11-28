"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import {
  groupPoints,
  validCoordinates,
  type Coordinates,
  type LocationView,
} from "@/lib/location-map";
import "leaflet/dist/leaflet.css";

type Props = {
  locations: LocationView[];
  onSelect?: (locations: LocationView[]) => void;
  position?: Coordinates | null;
  onPosition?: (position: Coordinates) => void;
  picker?: boolean;
};

export function LocationMap({ locations, onSelect, position, onPosition, picker = false }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  // Keep selection callbacks and coordinates fresh without recreating the map on every click.
  const callbacks = useRef({ onSelect, onPosition, position });
  useEffect(() => {
    callbacks.current = { onSelect, onPosition, position };
  }, [onSelect, onPosition, position]);
  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;
    let observer: ResizeObserver | undefined;
    async function init() {
      try {
        const L = await import("leaflet");
        if (cancelled || !container.current) return;
        const initial = callbacks.current.position;
        map = L.map(container.current, {
          scrollWheelZoom: false,
          minZoom: 3,
          maxZoom: 19,
          maxBounds: [
            [-38, -80],
            [10, -23],
          ],
          maxBoundsViscosity: 1,
        });
        const activeMap = map;
        activeMap.setView(
          initial ? [initial.latitude, initial.longitude] : [-14, -52],
          initial ? 15 : 4,
        );
        const attribution = document.createElement("span");
        attribution.textContent = process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION || "";
        const tiles = L.tileLayer(
          process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors' +
              (attribution.textContent ? ` · ${attribution.innerHTML}` : ""),
          },
        );
        tiles.addTo(activeMap);
        tiles.on("tileerror", () => {
          if (!cancelled)
            setError(
              "O mapa de ruas pode estar indisponível. Você ainda pode utilizar a lista ou informar coordenadas.",
            );
        });
        const layer = L.layerGroup().addTo(activeMap);
        const pin = L.divIcon({
          className: "",
          html: '<span style="display:block;width:20px;height:20px;border-radius:50%;background:#396824;border:3px solid white;box-shadow:0 1px 5px #0006"></span>',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        if (picker) {
          const marker = L.marker(initial ? [initial.latitude, initial.longitude] : [-14, -52], {
            icon: pin,
            draggable: true,
            title: "Posição da sede",
          });
          if (initial) marker.addTo(layer);
          const choose = (latitude: number, longitude: number) => {
            if (!validCoordinates(latitude, longitude)) {
              setError("Selecione uma posição na área do Brasil.");
              return;
            }
            setError("");
            marker.setLatLng([latitude, longitude]).addTo(layer);
            callbacks.current.onPosition?.({ latitude, longitude });
          };
          activeMap.on("click", (event: import("leaflet").LeafletMouseEvent) =>
            choose(event.latlng.lat, event.latlng.lng),
          );
          marker.on("dragend", () => {
            const p = marker.getLatLng();
            if (!validCoordinates(p.lat, p.lng)) {
              const old = callbacks.current.position;
              if (old) marker.setLatLng([old.latitude, old.longitude]);
              return;
            }
            choose(p.lat, p.lng);
          });
        } else {
          if (locations.length)
            activeMap.fitBounds(
              L.latLngBounds(locations.map((l) => L.latLng(l.latitude, l.longitude))),
              { padding: [32, 32], maxZoom: 12 },
            );
          function renderMarkers() {
            layer.clearLayers();
            const groups = groupPoints(
              locations.map((item) => {
                const p = activeMap.project([item.latitude, item.longitude], activeMap.getZoom());
                return { x: p.x, y: p.y, item };
              }),
              34,
            );
            for (const group of groups) {
              const first = group.items[0];
              const count = group.items.length;
              const icon =
                count === 1
                  ? pin
                  : L.divIcon({
                      className: "",
                      html: `<span style="display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#396824;color:white;font-weight:bold;border:2px solid white">${count}</span>`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                    });
              const marker = L.marker([first.latitude, first.longitude], {
                icon,
                title: count === 1 ? first.name : `${count} sedes`,
                alt: count === 1 ? first.name : `${count} sedes`,
                keyboard: true,
              }).addTo(layer);
              const label = document.createElement("span");
              label.textContent = count === 1 ? first.name : `${count} sedes — clique para ver`;
              marker.getElement()?.setAttribute("aria-label", label.textContent ?? "Sede");
              marker.bindTooltip(label, { direction: "top", offset: [0, -12] });
              marker.on("click", () => callbacks.current.onSelect?.(group.items));
            }
          }
          renderMarkers();
          activeMap.on("zoomend", renderMarkers);
        }
        observer = new ResizeObserver(() => activeMap.invalidateSize());
        observer.observe(container.current);
      } catch {
        if (!cancelled)
          setError("Não foi possível carregar o mapa. Use a lista ou as coordenadas.");
      }
    }
    void init();
    return () => {
      cancelled = true;
      observer?.disconnect();
      map?.remove();
    };
  }, [locations, picker]);
  return (
    <div className="space-y-2">
      <div
        ref={container}
        role="region"
        aria-label={picker ? "Mapa para selecionar sede" : "Mapa interativo das sedes"}
        className="relative z-0 h-[360px] w-full overflow-hidden rounded-xl border border-verde-principal/20 bg-verde-claro sm:h-[480px]"
      />
      {error && (
        <p role="status" className="text-sm text-verde-muted">
          {error}
        </p>
      )}
    </div>
  );
}
