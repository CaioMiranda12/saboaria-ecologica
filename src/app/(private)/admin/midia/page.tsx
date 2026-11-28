"use client";
import { isAllowedMediaFile } from "@/constants/media";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { MediaReference } from "@/lib/media-references";
import PublicImage from "@/components/PublicImage";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { Images, UploadCloud, Loader2, Check, Copy, ExternalLink } from "lucide-react";
import type { MediaAsset } from "@/components/admin/MediaPicker";
export default function MediaPage() {
  const [canRemove, setCanRemove] = useState(false);
  const [usages, setUsages] = useState<{ name: string; items: MediaReference[] } | null>(null);
  const [pending, setPending] = useState<{ asset: MediaAsset; replace: boolean } | null>(null);
  const replacementInput = useRef<HTMLInputElement>(null);
  const replacementTarget = useRef<MediaAsset | null>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/media", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw Error("Não foi possível carregar as imagens.");
        return response.json();
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setAssets(data.assets);
          setCanRemove(data.canRemove === true);
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "Erro inesperado");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  async function upload(file?: File, replace?: MediaAsset) {
    if (!file) return;
    if (!isAllowedMediaFile(file)) {
      setError("Escolha uma imagem PNG, JPEG ou WebP de até 4 MB.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (response.status === 413)
        throw new Error("A imagem excede o limite de envio. Reduza para até 4 MB.");
      const data = await response.json();
      if (!response.ok) throw Error(data.message || "Erro ao enviar imagem");
      setAssets((prev) => [data.asset, ...prev]);
      if (replace) {
        const removed = await removeAsset(replace);
        if (removed) setNotice("Imagem substituída na biblioteca.");
        else setNotice("Nova imagem enviada; a anterior foi preservada.");
      } else setNotice("Imagem enviada com sucesso!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }
  async function inspect(asset: MediaAsset, operation: "view" | "remove" | "replace") {
    setBusy(true);
    setError("");
    setNotice("");
    setUsages(null);
    try {
      const response = await fetch(`/api/admin/media/${asset.id}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || "Não foi possível verificar o uso.");
      if (data.usages.length || operation === "view")
        setUsages({ name: asset.filename, items: data.usages });
      else setPending({ asset, replace: operation === "replace" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }
  async function removeAsset(asset: MediaAsset) {
    const response = await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 409) setUsages({ name: asset.filename, items: data.usages });
      else setError(data.message || "Não foi possível remover a imagem.");
      return false;
    }
    setAssets((prev) => prev.filter((item) => item.id !== asset.id));
    return true;
  }
  async function confirmOperation() {
    if (!pending) return;
    const { asset, replace } = pending;
    setPending(null);
    if (replace) {
      replacementTarget.current = asset;
      replacementInput.current?.click();
      return;
    }
    setBusy(true);
    try {
      if (await removeAsset(asset)) setNotice("Imagem removida da biblioteca.");
    } catch {
      setError("Não foi possível remover a imagem.");
    } finally {
      setBusy(false);
    }
  }
  async function saveAlt(id: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText: alt }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || "Erro ao salvar");
      setAssets((prev) => prev.map((a) => (a.id === id ? data.asset : a)));
      setEditing(null);
      setNotice("Descrição atualizada.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }
  function drop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!busy) void upload(e.dataTransfer.files[0]);
  }
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <input
        ref={replacementInput}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        aria-label="Selecionar imagem substituta"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const target = replacementTarget.current;
          replacementTarget.current = null;
          e.target.value = "";
          if (target && file) void upload(file, target);
        }}
      />
      <ConfirmDialog
        isOpen={pending !== null}
        title={pending?.replace ? "Trocar imagem" : "Remover imagem"}
        description={
          pending?.replace
            ? "Selecione um novo arquivo. A imagem anterior será removida da biblioteca somente se continuar sem uso; o arquivo original permanecerá no Cloudinary."
            : "Esta imagem não possui referências cadastradas. Remover da biblioteca? O arquivo original permanecerá no Cloudinary."
        }
        confirmLabel={pending?.replace ? "Selecionar arquivo" : "Remover"}
        onCancel={() => setPending(null)}
        onConfirm={() => void confirmOperation()}
      />
      {usages && (
        <section
          role="status"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-verde-escuro"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Uso da imagem: {usages.name}</h2>
            <button onClick={() => setUsages(null)} className="rounded-lg border px-3 py-2">
              Fechar
            </button>
          </div>
          {usages.items.length ? (
            <>
              <p className="my-2">
                Imagem em uso. Abra o local correspondente para trocar ou remover a referência.
                Versões históricas são preservadas.
              </p>
              <ul className="space-y-2">
                {usages.items.map((item, i) => (
                  <li key={`${item.href}-${i}`}>
                    <Link href={item.href} className="underline">
                      {item.label} → Abrir no painel
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2">Nenhuma referência cadastrada encontrada.</p>
          )}
        </section>
      )}
      <div>
        <h1 className="flex items-center gap-3 font-serif text-3xl text-verde-escuro">
          <Images /> Biblioteca de mídia
        </h1>
        <p className="mt-2 text-sm text-verde-muted">
          Envie fotos e logotipos uma vez e reutilize-os nos formulários do site.
        </p>
      </div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={drop}
        className="rounded-3xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-100/80 via-lime-50 to-white p-7 text-center shadow-sm"
      >
        <UploadCloud className="mx-auto mb-2 text-verde-principal" size={32} />
        <p className="font-medium text-verde-escuro">
          Arraste uma imagem até aqui ou selecione um arquivo
        </p>
        <p className="mt-1 text-xs text-verde-muted">
          PNG, JPEG ou WebP, até 4 MB. Otimização automática pelo Cloudinary.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => void upload(e.target.files?.[0])}
          aria-label="Selecionar imagem"
        />
        <button
          disabled={busy}
          onClick={() => fileInput.current?.click()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-verde-principal px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}{" "}
          {busy ? "Enviando..." : "Enviar imagem"}
        </button>
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-800"
        >
          <Check size={16} />
          {notice}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-verde-escuro">Imagens enviadas ({assets.length})</h2>
        <input
          aria-label="Buscar imagens"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar imagens..."
          className="admin-control px-4 py-2 text-sm"
        />
      </div>
      {loading ? (
        <p className="flex items-center gap-2 text-sm">
          <Loader2 className="animate-spin" /> Carregando imagens...
        </p>
      ) : assets.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-sm text-verde-muted">
          Sua biblioteca está vazia. Envie uma imagem para começar.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets
            .filter((a) =>
              `${a.filename} ${a.altText}`.toLowerCase().includes(search.toLowerCase()),
            )
            .map((a) => (
              <article
                key={a.id}
                className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white shadow-sm transition hover:border-emerald-400 hover:shadow-md"
              >
                <PublicImage
                  src={a.url}
                  maxWidth={640}
                  alt={a.altText || a.filename}
                  loading="lazy"
                  className="h-48 w-full bg-emerald-100/40 object-contain p-3"
                />
                <div className="space-y-3 p-4">
                  <p
                    title={a.filename}
                    className="truncate text-sm font-semibold text-verde-escuro"
                  >
                    {a.filename}
                  </p>
                  <p className="text-xs text-verde-muted">
                    {a.width && a.height
                      ? `${a.width} × ${a.height} px`
                      : "Dimensões não informadas"}{" "}
                    · {(a.bytes / 1024).toFixed(0)} KB ·{" "}
                    {new Date(a.createdAt).toLocaleDateString("pt-BR", {
                      timeZone: "America/Fortaleza",
                    })}
                  </p>
                  {editing === a.id ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium">
                        Descrição acessível da imagem
                      </label>
                      <textarea
                        maxLength={300}
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        rows={2}
                        className="admin-control w-full p-2 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          disabled={busy}
                          onClick={() => void saveAlt(a.id)}
                          className="rounded-lg bg-verde-principal px-3 py-2 text-xs text-white"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="rounded-lg border px-3 py-2 text-xs"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="min-h-5 truncate text-xs text-verde-muted">
                      {a.altText || "Sem descrição acessível"}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled={busy}
                      onClick={() => {
                        void inspect(a, "view");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded-lg border px-3 py-2 text-xs"
                    >
                      Onde é usada?
                    </button>
                    {canRemove && (
                      <>
                        <button
                          disabled={busy}
                          onClick={() => {
                            void inspect(a, "replace");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-lg border px-3 py-2 text-xs"
                        >
                          Trocar imagem
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => {
                            void inspect(a, "remove");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-700"
                        >
                          Remover
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setEditing(a.id);
                        setAlt(a.altText);
                      }}
                      className="rounded-lg border px-3 py-2 text-xs"
                    >
                      Editar descrição
                    </button>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(a.url);
                        setNotice("Link copiado!");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs"
                    >
                      <Copy size={13} /> Copiar URL
                    </button>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs"
                    >
                      <ExternalLink size={13} /> Abrir
                    </a>
                  </div>
                </div>
              </article>
            ))}
        </div>
      )}
      <p className="text-xs text-verde-muted">
        A remoção retira a imagem da biblioteca, mas preserva o arquivo original no Cloudinary.
        Imagens em uso ou no histórico não podem ser removidas.
      </p>
    </div>
  );
}
