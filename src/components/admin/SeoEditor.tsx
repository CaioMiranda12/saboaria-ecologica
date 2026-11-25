"use client";
import { useState } from 'react';
import { toast } from 'react-toastify';
import type { SeoFields } from '@/lib/seo-pages';
type Page = SeoFields & { path: string; label: string };
export function SeoEditor({ pages }: { pages: Page[] }) {
  const [saved, setSaved] = useState(pages);
  const [drafts, setDrafts] = useState(pages);
  const [path, setPath] = useState(pages[0].path);
  const [busy, setBusy] = useState(false);
  const current = drafts.find(p => p.path === path)!;
  const original = saved.find(p => p.path === path)!;
  const dirty = JSON.stringify(current) !== JSON.stringify(original);
  const change = (field: keyof SeoFields, value: string) => setDrafts(old => old.map(p => p.path === path ? { ...p, [field]: value } : p));
  async function save() {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/seo', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(current) });
      if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.message ?? 'Não foi possível salvar.'); }
      const normalized = { ...current, title: current.title.trim(), description: current.description.trim(), imageUrl: current.imageUrl.trim() };
      setSaved(old => old.map(p => p.path === path ? normalized : p));
      setDrafts(old => old.map(p => p.path === path ? normalized : p));
      toast.success('Metadados atualizados.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Erro ao salvar.'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-6">
    <header><h1 className="text-2xl font-bold text-green-900">SEO das páginas</h1><p className="text-sm text-gray-600">Gerencie como as páginas aparecem em buscadores e redes sociais.</p></header>
    <form className="space-y-5 rounded-xl border border-green-200 bg-white p-5" onSubmit={e => { e.preventDefault(); void save(); }}>
      <fieldset disabled={busy} className="space-y-4">
        <label className="block">Página<select className="mt-1 block w-full rounded-lg border p-3" value={path} onChange={e => setPath(e.target.value)}>{drafts.map(p => <option key={p.path} value={p.path}>{p.label} ({p.path}){JSON.stringify(p) !== JSON.stringify(saved.find(s => s.path === p.path)) ? ' — não salvo' : ''}</option>)}</select></label>
        <label className="block">Título SEO<input required maxLength={120} className="mt-1 block w-full rounded-lg border p-3" value={current.title} onChange={e => change('title', e.target.value)} /><span className="text-xs text-gray-600">{current.title.length} caracteres · sugestão: até 60</span></label>
        <label className="block">Descrição SEO<textarea required maxLength={320} rows={4} className="mt-1 block w-full rounded-lg border p-3" value={current.description} onChange={e => change('description', e.target.value)} /><span className="text-xs text-gray-600">{current.description.length} caracteres · sugestão: até 160</span></label>
        <label className="block">Imagem de compartilhamento (URL HTTPS opcional)<input type="url" maxLength={2048} className="mt-1 block w-full rounded-lg border p-3" value={current.imageUrl} onChange={e => change('imageUrl', e.target.value)} placeholder="https://..." /><span className="text-xs text-gray-600">Use uma imagem pública, preferencialmente 1200 × 630 px.</span></label>
      </fieldset>
      <section className="rounded-lg border bg-green-50 p-4 break-words"><h2 className="font-semibold">Prévia ilustrativa de busca</h2><p className="text-xs text-gray-600">Saboaria Ecológica › {current.path}</p><p className="text-lg text-blue-800">{current.title}</p><p className="text-sm text-gray-700">{current.description}</p><p className="mt-2 text-xs text-gray-600">O buscador pode escolher outro título ou descrição.</p></section>
      <p className="text-sm text-gray-600">Ao salvar, os metadados públicos são atualizados independentemente dos rascunhos de conteúdo.</p>
      <button disabled={busy || !dirty} className="rounded-lg bg-green-800 px-5 py-3 text-white disabled:opacity-50" type="submit">{busy ? 'Salvando...' : 'Salvar SEO'}</button>
    </form>
  </div>;
}
