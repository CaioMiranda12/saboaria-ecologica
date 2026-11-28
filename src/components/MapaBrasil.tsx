"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BRAZIL_MAP, lonLatToXY } from "@/data/brazil-map";
import { groupPoints, type LocationView } from "@/lib/location-map";

type Props = {
  localizacoes: LocationView[];
  onSelect: (locations: LocationView[]) => void;
  expanded?: boolean;
};

export function MapaBrasil({ localizacoes, onSelect, expanded = false }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const id = useId();
  const [width, setWidth] = useState(280);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const node = container.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(1, entry.contentRect.width)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const points = localizacoes.map((item) => ({
    ...lonLatToXY(item.longitude, item.latitude),
    item,
  }));
  const left = Math.min(-18, ...points.map((p) => p.x - 18));
  const top = Math.min(-20, ...points.map((p) => p.y - 20));
  const viewWidth = Math.max(488, ...points.map((p) => p.x + 18)) - left;
  const viewHeight = Math.max(499, ...points.map((p) => p.y + 20)) - top;
  const groups = groupPoints(points, (34 * viewWidth) / width);
  const cardWidth = Math.max(1, Math.min(288, width - 16));

  return (
    <div
      ref={container}
      className={`relative mx-auto w-full ${expanded ? "max-w-2xl" : "max-w-md"}`}
    >
      <svg
        viewBox={`${left} ${top} ${viewWidth} ${viewHeight}`}
        className="h-auto w-full"
        role="img"
        aria-label="Mapa do Brasil com as sedes cadastradas"
      >
        <path
          d={BRAZIL_MAP.path}
          className="fill-verde-claro stroke-verde-principal/40"
          strokeWidth={1}
          strokeLinejoin="round"
        />
      </svg>
      {groups.map((group) => {
        const first = group.items[0];
        const key = first.id;
        const multiple = group.items.length > 1;
        const label = multiple ? `${group.items.length} sedes` : first.name;
        const tooltipId = `${id}-${key}`;
        const visible = active === key;
        const x = (group.x - left) / viewWidth;
        const y = (group.y - top) / viewHeight;
        // Keep the card inside the horizontal bounds of the map, including coastal points.
        const cardLeft = Math.max(8, Math.min(x * width - cardWidth / 2, width - cardWidth - 8));
        return (
          <div
            key={key}
            className={`absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 ${visible ? "z-20" : "z-0"}`}
            style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
            onMouseEnter={() => setActive(key)}
            onMouseLeave={() => setActive((current) => (current === key ? null : current))}
          >
            <button
              type="button"
              aria-label={label}
              aria-describedby={visible ? tooltipId : undefined}
              aria-haspopup="dialog"
              onFocus={() => setActive(key)}
              onBlur={() => setActive((current) => (current === key ? null : current))}
              onKeyDown={(event) => {
                if (event.key === "Escape") setActive(null);
              }}
              onClick={() => {
                setActive(null);
                onSelect(group.items);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-verde-principal text-xs font-bold text-white shadow transition-colors hover:bg-verde-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-escuro"
            >
              {multiple ? group.items.length : "•"}
            </button>
            {visible && (
              <div
                className={`absolute ${y < 0.4 ? "top-full pt-2" : "bottom-full pb-2"}`}
                style={{ left: cardLeft - x * width + 14, width: cardWidth }}
              >
                <div
                  id={tooltipId}
                  role="tooltip"
                  className="rounded-xl border border-verde-principal/20 bg-white p-3 text-left text-verde-escuro shadow-lg"
                >
                  {multiple ? (
                    <>
                      <p className="font-semibold text-verde-principal">{label} nesta região</p>
                      {group.items.slice(0, 3).map((location) => (
                        <div
                          key={location.id}
                          className="mt-2 border-t border-verde-principal/10 pt-2 text-xs"
                        >
                          <p className="line-clamp-1 font-medium">{location.name}</p>
                          <p className="text-verde-muted">
                            {location.city} – {location.state}
                          </p>
                        </div>
                      ))}
                      {group.items.length > 3 && (
                        <p className="mt-2 text-xs">+ {group.items.length - 3} sedes</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="line-clamp-2 font-semibold text-verde-principal">
                        {first.name}
                      </p>
                      <p className="mt-1 text-xs font-medium">
                        {first.city} – {first.state}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-verde-muted">{first.address}</p>
                      {first.description && (
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed">
                          {first.description}
                        </p>
                      )}
                    </>
                  )}
                  <p className="mt-2 text-xs font-medium text-verde-principal">
                    Clique para ver os detalhes
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
