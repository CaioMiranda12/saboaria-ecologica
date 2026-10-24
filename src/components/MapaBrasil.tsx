"use client";

import { useEffect, useRef, useState } from "react";
import { BRAZIL_MAP, lonLatToXY } from "@/data/brazil-map";
import type { Localizacao } from "@/data/localizacoes";

type MapaBrasilProps = {
  localizacoes: Localizacao[];
};

export function MapaBrasil({ localizacoes }: MapaBrasilProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Em telas touch, toque fora do mapa fecha o tooltip aberto
  useEffect(() => {
    if (!activeId) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setActiveId(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [activeId]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-md"
        style={{ aspectRatio: `${BRAZIL_MAP.width} / ${BRAZIL_MAP.height}` }}
      >
        <svg
          viewBox={`0 0 ${BRAZIL_MAP.width} ${BRAZIL_MAP.height}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Mapa do Brasil com as localizações da Saboaria Ecológica"
        >
          <path
            d={BRAZIL_MAP.path}
            className="fill-verde-claro stroke-verde-principal/40"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        </svg>

        {localizacoes.map((local) => {
          const { x, y } = lonLatToXY(local.longitude, local.latitude);
          const left = (x / BRAZIL_MAP.width) * 100;
          const top = (y / BRAZIL_MAP.height) * 100;
          const isActive = activeId === local.id;

          // O tooltip abre para o lado/direção com mais espaço livre
          const openBelow = top < 35;
          const horizontal =
            left < 25 ? "left-0" : left > 75 ? "right-0" : "left-1/2 -translate-x-1/2";

          return (
            <div
              key={local.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${isActive ? "z-20" : "z-10"}`}
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <button
                type="button"
                aria-label={`${local.cidade}, ${local.estado}`}
                aria-describedby={isActive ? `mapa-tooltip-${local.id}` : undefined}
                onPointerEnter={(event) => event.pointerType === "mouse" && setActiveId(local.id)}
                onPointerLeave={(event) => event.pointerType === "mouse" && setActiveId(null)}
                onFocus={() => setActiveId(local.id)}
                onBlur={() => setActiveId(null)}
                onClick={(event) => {
                  // Mouse e teclado já são tratados por hover/foco; o clique é só para touch
                  const type = (event.nativeEvent as PointerEvent).pointerType;
                  if (type === "touch" || type === "pen") {
                    setActiveId((current) => (current === local.id ? null : local.id));
                  }
                }}
                className="relative flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-principal/50"
              >
                {local.sede && (
                  <span className="absolute h-6 w-6 animate-ping rounded-full bg-verde-principal/30" />
                )}
                <span
                  className={`relative block rounded-full border-2 border-white bg-verde-principal shadow-md transition-transform duration-200 ${local.sede ? "h-4 w-4" : "h-3 w-3"
                    } ${isActive ? "scale-125" : ""}`}
                />
              </button>

              {isActive && (
                <div
                  id={`mapa-tooltip-${local.id}`}
                  role="tooltip"
                  className={`pointer-events-none absolute w-60 rounded-2xl border border-verde-medio/15 bg-white p-4 text-left shadow-xl ${horizontal} ${openBelow ? "top-full mt-2" : "bottom-full mb-2"
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif text-base font-bold text-verde-escuro">
                      {local.cidade}
                      <span className="ml-1.5 text-xs font-normal text-verde-muted">{local.estado}</span>
                    </p>
                    {local.sede && (
                      <span className="rounded-full bg-verde-claro px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-verde-principal">
                        Sede
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs font-light leading-relaxed text-verde-escuro/70">
                    {local.descricao}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-5 text-xs text-verde-muted">
        <span className="flex items-center gap-2">
          <span className="block h-3 w-3 rounded-full border-2 border-white bg-verde-principal shadow" />
          Parceiros e pontos de apoio
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-4 w-4 rounded-full border-2 border-white bg-verde-principal shadow" />
          Sede
        </span>
      </div>
    </div>
  );
}