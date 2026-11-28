"use client";

import { useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { LocationMap } from "@/components/LocationMap";
import { LocationsPublic } from "@/components/LocationsPublic";
import { useCanDeleteRecords } from "@/components/admin/AdminPermissions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  parseCoordinates,
  STATES,
  googleMapsUrl,
  type Coordinates,
  type LocationView,
} from "@/lib/location-map";

type LocationRecord = LocationView & { isPublished: boolean };
type Fields = {
  name: string;
  city: string;
  state: string;
  address: string;
  description: string;
  isPublished: boolean;
};
const emptyFields: Fields = {
  name: "",
  city: "",
  state: "",
  address: "",
  description: "",
  isPublished: false,
};
const noLocations: LocationView[] = [];
const inputClass =
  "w-full rounded-lg border border-verde-principal/25 bg-white px-3 py-2.5 text-sm text-verde-escuro focus-visible:outline-2 focus-visible:outline-verde-principal";
const primaryClass =
  "rounded-full bg-verde-principal px-5 py-2.5 text-sm font-medium text-white hover:bg-verde-escuro disabled:opacity-50";
const secondaryClass =
  "rounded-full border border-verde-principal/30 px-4 py-2 text-sm text-verde-principal hover:bg-verde-claro disabled:opacity-50";

function LocationForm({
  record,
  onCancel,
  onSaved,
}: {
  record?: LocationRecord;
  onCancel: () => void;
  onSaved: (location: LocationRecord) => void;
}) {
  const [fields, setFields] = useState<Fields>(record ?? emptyFields);
  const [position, setPosition] = useState<Coordinates | null>(
    record ? { latitude: record.latitude, longitude: record.longitude } : null,
  );
  const [paste, setPaste] = useState("");
  const [mapKey, setMapKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function change<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }
  function applyCoordinates() {
    const parsed = parseCoordinates(paste);
    if (!parsed) {
      setError(
        "Cole latitude e longitude separadas por vírgula, com ponto decimal. Ex.: -3.7319, -38.5267.",
      );
      return;
    }
    setError("");
    setPosition(parsed);
    setMapKey((prev) => prev + 1);
  }
  const search = [fields.address, fields.city, fields.state, "Brasil"].filter(Boolean).join(", ");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!position) {
      setError("Selecione a posição da sede no mapa antes de salvar.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        record ? `/api/admin/locations/${encodeURIComponent(record.id)}` : "/api/admin/locations",
        {
          method: record ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...fields, ...position }),
        },
      );
      const result = await response.json();
      if (!response.ok || !result.location)
        throw new Error(result.message || "Não foi possível salvar.");
      onSaved(result.location);
      toast.success("Sede salva com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar a sede.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={save}
      className="space-y-5 rounded-2xl border border-verde-principal/15 bg-white p-4 shadow-sm sm:p-6"
    >
      <h2 className="font-serif text-2xl text-verde-escuro">
        {record ? "Editar sede" : "Nova sede"}
      </h2>
      <fieldset disabled={busy} className="space-y-4">
        <label className="block space-y-1 text-sm font-medium">
          Nome da sede
          <input
            className={inputClass}
            required
            maxLength={120}
            value={fields.name}
            onChange={(e) => change("name", e.target.value)}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1 text-sm font-medium">
            Cidade
            <input
              className={inputClass}
              required
              maxLength={100}
              value={fields.city}
              onChange={(e) => change("city", e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            Estado
            <select
              className={inputClass}
              required
              value={fields.state}
              onChange={(e) => change("state", e.target.value)}
            >
              <option value="">Selecione</option>
              {STATES.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block space-y-1 text-sm font-medium">
          Endereço
          <input
            className={inputClass}
            required
            maxLength={300}
            value={fields.address}
            onChange={(e) => change("address", e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          Descrição (opcional)
          <textarea
            className={inputClass}
            rows={3}
            maxLength={2000}
            value={fields.description}
            onChange={(e) => change("description", e.target.value)}
          />
        </label>
        <div className="space-y-3 rounded-xl border border-verde-principal/15 p-3 sm:p-4">
          <h3 className="font-semibold">Posição da sede</h3>
          <p className="text-sm text-verde-muted">
            Amplie o mapa e clique no local exato. Arraste o marcador para ajustar. Para encontrar
            um endereço, você também pode pesquisar no Google Maps.
          </p>
          <a
            className="inline-flex text-sm font-medium text-verde-principal underline"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(search)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pesquisar endereço no Google Maps ↗
          </a>
          <LocationMap
            key={mapKey}
            locations={noLocations}
            picker
            position={position}
            onPosition={setPosition}
          />
          <p className="text-sm font-medium" aria-live="polite">
            {position
              ? `Posição selecionada: ${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`
              : "Nenhuma posição selecionada."}
          </p>
          <p className="text-xs text-verde-muted">
            No Google Maps pelo computador, clique com o botão direito sobre o local e copie as
            coordenadas. Cole abaixo e confirme a posição no mapa.
          </p>
          <div className="flex flex-wrap items-end gap-2">
            <label className="min-w-0 flex-1 space-y-1 text-sm">
              Coordenadas (opcional)
              <input
                className={inputClass}
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                placeholder="-3.7319, -38.5267"
              />
            </label>
            <button type="button" className={secondaryClass} onClick={applyCoordinates}>
              Usar coordenadas
            </button>
          </div>
          {position && (
            <a
              className="text-sm text-verde-principal underline"
              href={googleMapsUrl(position)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conferir posição no Google Maps ↗
            </a>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={fields.isPublished}
            onChange={(e) => change("isPublished", e.target.checked)}
          />{" "}
          Exibir no mapa público
        </label>
      </fieldset>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" className={secondaryClass} disabled={busy} onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className={primaryClass} disabled={busy || !position}>
          {busy ? "Salvando..." : "Salvar sede"}
        </button>
      </div>
    </form>
  );
}

export function LocationsManager({ initialLocations }: { initialLocations: LocationRecord[] }) {
  const canDelete = useCanDeleteRecords();
  const [locations, setLocations] = useState(initialLocations);
  const [editing, setEditing] = useState<LocationRecord | "new" | null>(null);
  const [deleting, setDeleting] = useState<LocationRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(false);
  const published = useMemo(() => locations.filter((l) => l.isPublished), [locations]);
  const visible = locations.filter((location) =>
    [location.name, location.city, location.state, location.address]
      .join(" ")
      .toLocaleLowerCase("pt-BR")
      .includes(search.trim().toLocaleLowerCase("pt-BR")),
  );
  async function remove() {
    if (!deleting || busy) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/locations/${encodeURIComponent(deleting.id)}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Não foi possível excluir.");
      setLocations((prev) => prev.filter((location) => location.id !== deleting.id));
      setDeleting(null);
      toast.success("Sede excluída.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao excluir.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-5 text-verde-escuro">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Sedes</h1>
          <p className="text-sm text-verde-muted">
            Gerencie as localizações da instituição no mapa público.
          </p>
        </div>
        <button
          type="button"
          disabled={!!editing || !!deleting}
          onClick={() => {
            setEditing("new");
            setPreview(false);
          }}
          className={primaryClass}
        >
          + Nova sede
        </button>
      </header>
      {editing ? (
        <LocationForm
          key={editing === "new" ? "new" : editing.id}
          record={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSaved={(location) => {
            setLocations((prev) =>
              [...prev.filter((item) => item.id !== location.id), location].sort((a, b) =>
                a.name.localeCompare(b.name, "pt-BR"),
              ),
            );
            setEditing(null);
          }}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <label className="min-w-0 flex-1 text-sm">
              Buscar sedes
              <input
                className={inputClass}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome, cidade ou endereço"
              />
            </label>
            <button
              type="button"
              className={secondaryClass}
              onClick={() => setPreview((prev) => !prev)}
            >
              {preview ? "Ocultar prévia" : "Pré-visualizar mapa público"}
            </button>
          </div>
          {preview && <LocationsPublic locations={published} />}
          <p className="text-sm text-verde-muted">
            {locations.length} cadastrada(s) · {published.length} publicada(s)
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((location) => (
              <article
                key={location.id}
                className="space-y-3 rounded-2xl border border-verde-principal/15 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="font-semibold">{location.name}</h2>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${location.isPublished ? "bg-verde-claro text-verde-escuro" : "bg-gray-100 text-gray-600"}`}
                  >
                    {location.isPublished ? "Visível" : "Oculta"}
                  </span>
                </div>
                <p className="text-sm">
                  {location.city} – {location.state}
                </p>
                <p className="text-sm text-verde-muted">{location.address}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={secondaryClass}
                    onClick={() => {
                      setEditing(location);
                      setPreview(false);
                    }}
                  >
                    Editar
                  </button>
                  {canDelete && (
                    <button
                      type="button"
                      className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-700"
                      onClick={() => setDeleting(location)}
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <p className="rounded-xl border border-verde-principal/15 bg-white p-5 text-sm text-verde-muted">
              Nenhuma sede encontrada.
            </p>
          )}
        </>
      )}
      <ConfirmDialog
        isOpen={!!deleting}
        title="Excluir sede"
        description={`Deseja excluir ${deleting?.name ?? "esta sede"}? Ela será retirada do mapa público.`}
        confirmLabel="Excluir sede"
        isConfirming={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void remove()}
      />
    </div>
  );
}
