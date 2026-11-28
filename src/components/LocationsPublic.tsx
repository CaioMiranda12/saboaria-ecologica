"use client";

import { useRef, useState, useId } from "react";
import { MapaBrasil } from "@/components/MapaBrasil";
import { googleMapsUrl, type LocationView } from "@/lib/location-map";

export function LocationsPublic({
  locations,
  compact = false,
}: {
  locations: LocationView[];
  compact?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [selected, setSelected] = useState<LocationView[]>([]);
  function open(items: LocationView[]) {
    setSelected(items);
    if (!dialog.current?.open) dialog.current?.showModal();
  }
  if (!locations.length)
    return (
      <p className="rounded-xl border border-verde-principal/15 bg-white p-5 text-sm text-verde-muted">
        Nenhuma sede publicada no momento.
      </p>
    );
  return (
    <div className="w-full space-y-5">
      <div
        className={
          compact
            ? "space-y-5"
            : "grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
        }
      >
        <div className="min-w-0 space-y-5">
          <MapaBrasil localizacoes={locations} onSelect={open} expanded={!compact} />
          <p className="text-sm text-verde-muted">
            {compact
              ? "Passe o mouse sobre um marcador para ver a prévia ou selecione-o para abrir os detalhes."
              : "Passe o mouse sobre um marcador para ver a prévia. Selecione um marcador ou uma sede na lista para abrir os detalhes."}{" "}
            Marcadores com números representam várias sedes próximas.
          </p>
        </div>
        {!compact && (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {locations.map((l) => (
              <button
                type="button"
                key={l.id}
                onClick={() => open([l])}
                className="rounded-xl border border-verde-principal/15 bg-white p-4 text-left hover:border-verde-principal focus-visible:outline-2"
              >
                <strong className="block text-verde-principal">{l.name}</strong>
                <span className="block text-sm text-verde-muted">
                  {l.city} – {l.state}
                </span>
                <span className="mt-2 block text-sm">{l.address}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-6 text-verde-escuro shadow-xl backdrop:bg-black/50"
      >
        <h2 id={titleId} className="mb-4 font-serif text-2xl">
          {selected.length === 1 ? selected[0].name : "Sedes nesta região"}
        </h2>
        {selected.map((l) => (
          <article
            key={l.id}
            className="mb-4 space-y-2 rounded-xl border border-verde-principal/15 p-4"
          >
            <h3 className="font-semibold">{l.name}</h3>
            <p>
              {l.city} – {l.state}
            </p>
            <p className="text-sm">{l.address}</p>
            {l.description && <p className="text-sm whitespace-pre-wrap">{l.description}</p>}
            <a
              href={googleMapsUrl(l)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-verde-principal px-4 py-2 text-sm text-white"
            >
              Abrir no Google Maps
            </a>
          </article>
        ))}
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="rounded-full border border-verde-principal px-5 py-2 text-sm"
        >
          Fechar
        </button>
      </dialog>
    </div>
  );
}
