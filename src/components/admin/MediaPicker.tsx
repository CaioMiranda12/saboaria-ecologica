"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Images, X, Check, Loader2, Search, ImageOff } from "lucide-react";

export type MediaAsset = { id: string; url: string; filename: string; altText: string; bytes: number; width: number | null; height: number | null; createdAt: string };

export function MediaPicker({ onSelect, onClose }: { onSelect: (asset: MediaAsset) => void; onClose: () => void }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    let active = true;
    fetch("/api/admin/media").then(async r => { if (!r.ok) throw Error("Falha ao carregar imagens"); return r.json(); })
      .then(data => { if (active) setAssets(data.assets ?? []); })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "Tab") {
        const dialog = document.getElementById("media-picker-dialog");
        const focusables = Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])') ?? []);
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);
  const filtered = assets.filter(a => `${a.filename} ${a.altText}`.toLowerCase().includes(search.trim().toLowerCase()));
  if (!mounted) return null;
  return createPortal(
    <div role="presentation" className="fixed inset-0 z-[150] flex items-center justify-center bg-emerald-950/65 p-3 backdrop-blur-[3px] sm:p-6" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <section id="media-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="media-picker-title" className="flex max-h-[min(88dvh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-lime-50/60 to-white shadow-[0_24px_90px_rgba(5,46,25,.30)]">
        <header className="flex items-center justify-between gap-3 border-b border-emerald-200/80 bg-emerald-100/60 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3"><span className="rounded-xl bg-emerald-800 p-2.5 text-white"><Images size={21}/></span><div><h2 id="media-picker-title" className="text-lg font-bold text-emerald-950">Biblioteca de imagens</h2><p className="text-xs text-emerald-800">Escolha uma imagem já enviada ao site.</p></div></div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar biblioteca" className="rounded-xl border border-emerald-200 bg-white/70 p-2 text-emerald-900 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"><X size={20}/></button>
        </header>
        <div className="px-5 py-4 sm:px-6"><label htmlFor="media-search" className="mb-1.5 block text-xs font-semibold text-emerald-900">Buscar imagem</label><div className="relative"><Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700"/><input id="media-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Nome do arquivo ou descrição" className="admin-control w-full bg-white/80 py-3 pl-10 pr-4 text-sm"/></div><p className="mt-2 text-xs text-emerald-700" aria-live="polite">{loading ? "Carregando imagens…" : `${filtered.length} ${filtered.length === 1 ? "imagem encontrada" : "imagens encontradas"}`}</p></div>
        <div className="min-h-36 flex-1 overflow-y-auto px-5 pb-5 sm:px-6">{loading ? <p role="status" className="flex items-center justify-center gap-2 py-12 text-sm text-emerald-800"><Loader2 className="animate-spin"/> Carregando biblioteca…</p> : error ? <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : filtered.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{filtered.map(a => <button key={a.id} type="button" onClick={() => onSelect(a)} title={a.filename} className="group overflow-hidden rounded-2xl border border-emerald-200 bg-white/85 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md focus-visible:outline-2 focus-visible:outline-emerald-700 motion-reduce:transform-none"><div className="relative aspect-[4/3] overflow-hidden bg-emerald-100/70"><img src={a.url} alt={a.altText || a.filename} loading="lazy" className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105 motion-reduce:transform-none"/><span className="absolute right-2 top-2 rounded-full bg-emerald-800 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><Check size={15}/></span></div><span className="block truncate px-3 py-2.5 text-xs font-semibold text-emerald-950">{a.filename}</span></button>)}</div> : <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-white/70 px-4 py-10 text-center"><ImageOff size={27} className="text-emerald-600"/><p className="text-sm font-semibold text-emerald-950">{assets.length ? "Nenhuma imagem corresponde à busca" : "A biblioteca ainda está vazia"}</p><p className="text-xs text-emerald-700">{assets.length ? "Tente outro nome ou limpe a busca." : "Envie uma imagem para começar a utilizar a biblioteca."}</p>{search && <button type="button" onClick={() => setSearch("")} className="mt-2 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-semibold text-white">Limpar busca</button>}</div>}</div>
        <footer className="flex justify-end border-t border-emerald-200/80 bg-white/65 px-5 py-3 sm:px-6"><button type="button" onClick={onClose} className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50">Cancelar</button></footer>
      </section>
    </div>, document.body
  );
}
