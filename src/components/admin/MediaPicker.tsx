"use client";
import { useEffect, useState } from "react";
import { Images, X, Check, Loader2 } from "lucide-react";
export type MediaAsset = { id: string; url: string; filename: string; altText: string; bytes: number; width: number | null; height: number | null; createdAt: string };
export function MediaPicker({ onSelect, onClose }: { onSelect: (asset: MediaAsset) => void; onClose: () => void }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => { let active = true; fetch("/api/admin/media").then(async r => { if (!r.ok) throw Error("Falha ao carregar imagens"); return r.json(); }).then(data => { if (active) setAssets(data.assets); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  return <div role="dialog" aria-modal="true" aria-label="Selecionar imagem" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b p-4"><h2 className="flex items-center gap-2 text-lg font-semibold text-verde-escuro"><Images size={20}/> Selecionar imagem</h2><button type="button" onClick={onClose} aria-label="Fechar biblioteca" className="rounded-lg p-2 hover:bg-gray-100"><X size={20}/></button></div>
      <div className="p-4"><label htmlFor="media-search" className="sr-only">Buscar imagem</label><input id="media-search" autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar pelo nome ou descrição..." className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"/></div>
      <div className="min-h-40 flex-1 overflow-y-auto px-4 pb-4">{loading ? <p className="flex items-center gap-2 py-8 text-sm"><Loader2 className="animate-spin"/> Carregando...</p> : error ? <p role="alert" className="text-red-600">{error}</p> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{assets.filter(a => `${a.filename} ${a.altText}`.toLowerCase().includes(search.toLowerCase())).map(a => <button key={a.id} type="button" onClick={() => onSelect(a)} className="group overflow-hidden rounded-xl border border-gray-200 text-left hover:border-verde-principal focus-visible:outline-2 focus-visible:outline-verde-principal"><img src={a.url} alt={a.altText || a.filename} loading="lazy" className="h-28 w-full bg-gray-50 object-cover"/><span className="flex items-center gap-1 truncate p-2 text-xs text-verde-escuro"><Check size={13} className="shrink-0 opacity-0 group-hover:opacity-100"/>{a.filename}</span></button>)}</div>}{!loading && !error && assets.length === 0 && <p className="py-8 text-center text-sm text-gray-600">Ainda não há imagens. Envie a primeira na Biblioteca de mídia.</p>}</div>
    </div>
  </div>;
}
