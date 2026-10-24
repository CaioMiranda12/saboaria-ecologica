"use client";

import { useRef, useState, type DragEvent } from "react";
import { FileImage, UploadCloud, X } from "lucide-react";

const ACCEPTED_TYPES = ["image/png", "image/jpeg"];
const MAX_SIZE_BYTES = 200 * 1024;

type FileMeta = { name: string; size: number | null };

type ImageUploadProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1).replace(".", ",")} KB`;
}

function metaFromValue(value: string): FileMeta {
  if (value.startsWith("data:")) {
    const base64 = value.split(",")[1] ?? "";
    return { name: "Imagem do produto", size: Math.round((base64.length * 3) / 4) };
  }
  return { name: value.split("/").pop() || value, size: null };
}

function readAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({ value, onChange, error, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [meta, setMeta] = useState<FileMeta | null>(null);
  const [localError, setLocalError] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);

  const hasImage = Boolean(value);
  const currentMeta = hasImage ? (meta ?? metaFromValue(value)) : null;
  const message = localError ?? error;

  async function handleFile(file?: File) {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError("Formato inválido. Envie uma imagem PNG ou JPEG.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setLocalError(`A imagem tem ${formatSize(file.size)}. O limite é 200 KB.`);
      return;
    }

    try {
      const dataUrl = await readAsDataURL(file);
      setLocalError(undefined);
      setMeta({ name: file.name, size: file.size });
      onChange(dataUrl);
    } catch {
      setLocalError("Não foi possível ler a imagem. Tente novamente.");
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
    if (disabled) return;
    handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        disabled={disabled}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {currentMeta ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-verde-principal/30 bg-verde-principal/5 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-verde-principal/10 text-verde-principal">
              <FileImage size={20} />
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-verde-escuro/60 transition-colors hover:bg-verde-principal/10 hover:text-verde-escuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-principal/40 disabled:opacity-60"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-principal/40 disabled:opacity-60 ${isDragging
            ? "border-verde-principal bg-verde-principal/10"
            : message
              ? "border-red-400 bg-red-50/50"
              : "border-verde-principal/30 hover:border-verde-principal hover:bg-verde-principal/5"
            }`}
        >
          <UploadCloud size={28} className="text-verde-principal" />
          <span className="text-sm font-medium text-verde-escuro">Clique para enviar</span>
          <span className="text-xs text-verde-escuro/60">PNG ou JPEG até 200kb</span>
        </button>
      )}

      {message && <p className="text-xs text-red-600">{message}</p>}
    </div>
  );
}