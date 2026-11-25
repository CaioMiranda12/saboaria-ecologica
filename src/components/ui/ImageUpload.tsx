"use client";
import PublicImage from "@/components/PublicImage";

import { useRef, useState, type DragEvent } from "react";
import { isAxiosError } from "axios";
import { Loader2, UploadCloud, X, Images } from "lucide-react";
import { httpClient } from "@/lib/http";
import { MediaPicker } from "@/components/admin/MediaPicker";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

type FileMeta = { name: string; size: number | null };

type ImageUploadProps = {
  /** URL atual da imagem. String vazia = nenhuma imagem. */
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`
    : `${(bytes / 1024).toFixed(1).replace(".", ",")} KB`;
}

/** Descobre o nome quando já existe um valor salvo (ex.: edição de produto). */
function metaFromValue(value: string): FileMeta {
  if (value.startsWith("data:")) {
    const base64 = value.split(",")[1] ?? "";
    return { name: "Imagem do produto", size: Math.round((base64.length * 3) / 4) };
  }
  const lastSegment = value.split("?")[0].split("/").pop();
  return { name: lastSegment || "Imagem do produto", size: null };
}

export function ImageUpload({ value, onChange, error, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [meta, setMeta] = useState<FileMeta | null>(null);
  const [localError, setLocalError] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const hasImage = Boolean(value);
  const currentMeta = hasImage ? (meta ?? metaFromValue(value)) : null;
  const message = localError ?? error;
  const isBlocked = disabled || isUploading;

  async function handleFile(file?: File) {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError("Formato inválido. Envie PNG, JPEG ou WebP.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setLocalError(`A imagem tem ${formatSize(file.size)}. O limite é 8 MB.`);
      return;
    }

    setLocalError(undefined);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await httpClient.post<{ url: string }>("/admin/upload", formData);

      setMeta({ name: file.name, size: file.size });
      onChange(data.url);
    } catch (err) {
      const apiMessage = isAxiosError(err) ? err.response?.data?.message : undefined;
      setLocalError(apiMessage ?? "Não foi possível enviar a imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove() {
    setMeta(null);
    setLocalError(undefined);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (isBlocked) return;
    handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-lime-50/70 to-white p-4 shadow-sm">
      {/* stopPropagation evita que um <label> pai reative o clique */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        disabled={isBlocked}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {currentMeta && !isUploading ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 text-verde-principal">
              <PublicImage
                src={value}
                alt="Prévia da imagem selecionada"
                className="h-full w-full object-cover"
              />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-verde-escuro">{currentMeta.name}</p>
              {currentMeta.size !== null && (
                <p className="text-xs text-verde-escuro/60">{formatSize(currentMeta.size)}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            aria-label="Remover imagem"
            title="Remover imagem"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-verde-escuro/60 transition-colors hover:bg-verde-principal/10 hover:text-verde-escuro focus-visible:ring-2 focus-visible:ring-verde-principal/40 focus-visible:outline-none disabled:opacity-60"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isBlocked}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            if (!isBlocked) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed bg-white/65 px-4 py-10 text-center shadow-inner transition-colors focus-visible:ring-2 focus-visible:ring-verde-principal/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
            isDragging
              ? "border-verde-principal bg-verde-principal/10"
              : message
                ? "border-red-400 bg-red-50/50"
                : "border-verde-principal/30 hover:border-verde-principal hover:bg-verde-principal/5"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 size={28} className="animate-spin text-verde-principal" />
              <span className="text-sm font-medium text-verde-escuro">Enviando imagem...</span>
            </>
          ) : (
            <>
              <UploadCloud size={28} className="text-verde-principal" />
              <span className="text-sm font-medium text-verde-escuro">Clique para enviar</span>
              <span className="text-xs text-verde-escuro/60">PNG, JPEG ou WebP até 8 MB</span>
            </>
          )}
        </button>
      )}

      <button
        type="button"
        disabled={isBlocked}
        onClick={() => setPickerOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-100/70 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200/70 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-50"
      >
        <Images size={18} /> Escolher da biblioteca
      </button>
      {pickerOpen && (
        <MediaPicker
          onClose={() => setPickerOpen(false)}
          onSelect={(asset) => {
            onChange(asset.url);
            setMeta({ name: asset.filename, size: asset.bytes });
            setPickerOpen(false);
          }}
        />
      )}
      {message && <p className="text-xs text-red-600">{message}</p>}
    </div>
  );
}
