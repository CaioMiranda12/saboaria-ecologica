"use client";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { Images, UploadCloud, Loader2, Check, Copy, ExternalLink } from "lucide-react";
import type { MediaAsset } from "@/components/admin/MediaPicker";
export default function MediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  async function load() { try { const response = await fetch("/api/admin/media"); if (!response.ok) throw Error("Não foi possível carregar as imagens."); const data = await response.json(); setAssets(data.assets); } catch (e) { setError(e instanceof Error ? e.message : "Erro inesperado"); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  async function upload(file?: File) {
    if (!file) return;
    if (!["image/png","image/jpeg","image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024 || file.size === 0) { setError("Escolha uma imagem PNG, JPEG ou WebP de até 8 MB."); return; }
    setBusy(true); setError(""); setNotice("");
    try { const form = new FormData(); form.append("file", file); const response = await fetch("/api/admin/upload", { method: "POST", body: form }); const data = await response.json(); if (!response.ok) throw Error(data.message || "Erro ao enviar imagem"); setAssets(prev => [data.asset, ...prev]); setNotice("Imagem enviada com sucesso!"); } catch(e) { setError(e instanceof Error ? e.message : "Erro inesperado"); } finally { setBusy(false); if (fileInput.current) fileInput.current.value = ""; }
  }
  async function saveAlt(id: string) {
    setBusy(true); setError("");
    try { const response = await fetch(`/api/admin/media/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ altText: alt }) }); const data = await response.json(); if (!response.ok) throw Error(data.message || "Erro ao salvar"); setAssets(prev => prev.map(a => a.id === id ? data.asset : a)); setEditing(null); setNotice("Descrição atualizada."); } catch(e) { setError(e instanceof Error ? e.message : "Erro inesperado"); } finally { setBusy(false); }
  }
  function drop(e: DragEvent<HTMLDivElement>) { e.preventDefault(); if (!busy) void upload(e.dataTransfer.files[0]); }
  return <div className="mx-auto max-w-6xl space-y-6">
    <div><h1 className="flex items-center gap-3 font-serif text-3xl text-verde-escuro"><Images/> Biblioteca de mídia</h1><p className="mt-2 text-sm text-verde-muted">Envie fotos e logotipos uma vez e reutilize-os nos formulários do site.</p></div>
    <div onDragOver={e => e.preventDefault()} onDrop={drop} className="rounded-3xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-100/80 via-lime-50 to-white p-7 text-center shadow-sm">
      <UploadCloud className="mx-auto mb-2 text-verde-principal" size={32}/><p className="font-medium text-verde-escuro">Arraste uma imagem até aqui ou selecione um arquivo</p><p className="mt-1 text-xs text-verde-muted">PNG, JPEG ou WebP, até 8 MB. Otimização automática pelo Cloudinary.</p>
      <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={e => void upload(e.target.files?.[0])} aria-label="Selecionar imagem"/>
      <button disabled={busy} onClick={() => fileInput.current?.click()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-verde-principal px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? <Loader2 className="animate-spin" size={18}/> : <UploadCloud size={18}/>} {busy ? "Enviando..." : "Enviar imagem"}</button>
    </div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{notice && <p role="status" className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-800"><Check size={16}/>{notice}</p>}
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold text-verde-escuro">Imagens enviadas ({assets.length})</h2><input aria-label="Buscar imagens" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar imagens..." className="admin-control px-4 py-2 text-sm"/></div>
    {loading ? <p className="flex items-center gap-2 text-sm"><Loader2 className="animate-spin"/> Carregando imagens...</p> : assets.length === 0 ? <p className="rounded-xl bg-white p-8 text-center text-sm text-verde-muted">Sua biblioteca está vazia. Envie uma imagem para começar.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{assets.filter(a => `${a.filename} ${a.altText}`.toLowerCase().includes(search.toLowerCase())).map(a => <article key={a.id} className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white shadow-sm transition hover:border-emerald-400 hover:shadow-md"><img src={a.url} alt={a.altText || a.filename} loading="lazy" className="h-48 w-full bg-emerald-100/40 object-contain p-3"/><div className="space-y-3 p-4"><p title={a.filename} className="truncate text-sm font-semibold text-verde-escuro">{a.filename}</p><p className="text-xs text-verde-muted">{a.width && a.height ? `${a.width} × ${a.height} px` : "Dimensões não informadas"} · {(a.bytes/1024).toFixed(0)} KB · {new Date(a.createdAt).toLocaleDateString("pt-BR", { timeZone: "America/Fortaleza" })}</p>{editing === a.id ? <div className="space-y-2"><label className="block text-xs font-medium">Descrição acessível da imagem</label><textarea maxLength={300} value={alt} onChange={e => setAlt(e.target.value)} rows={2} className="admin-control w-full p-2 text-sm"/><div className="flex gap-2"><button disabled={busy} onClick={() => void saveAlt(a.id)} className="rounded-lg bg-verde-principal px-3 py-2 text-xs text-white">Salvar</button><button onClick={() => setEditing(null)} className="rounded-lg border px-3 py-2 text-xs">Cancelar</button></div></div> : <p className="min-h-5 truncate text-xs text-verde-muted">{a.altText || "Sem descrição acessível"}</p>}<div className="flex flex-wrap gap-2"><button onClick={() => { setEditing(a.id); setAlt(a.altText); }} className="rounded-lg border px-3 py-2 text-xs">Editar descrição</button><button onClick={async () => { await navigator.clipboard.writeText(a.url); setNotice("Link copiado!"); }} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs"><Copy size={13}/> Copiar URL</button><a href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs"><ExternalLink size={13}/> Abrir</a></div></div></article>)}</div>}
    <p className="text-xs text-verde-muted">Para evitar imagens quebradas no site, a exclusão permanente de arquivos não está disponível nesta versão.</p>
  </div>;
}
