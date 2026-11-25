"use client";
import { useRef, useState } from 'react';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { UploadCloud, Images, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import type { SeoFields } from '@/lib/seo-pages';
type Page = SeoFields & { path: string; label: string };
export function SeoEditor({ pages }: { pages: Page[] }) {
  const [saved, setSaved] = useState(pages);
  const [drafts, setDrafts] = useState(pages);
  const [path, setPath] = useState(pages[0].path);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  async function upload(file?: File) {
    if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || !file.size || file.size > 8 * 1024 * 1024) {
      toast.error('Selecione PNG, JPEG ou WebP de até 8 MB.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setUploading(true);
    try {
      const body = new FormData(); body.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await response.json();
      if (!response.ok || !data.asset?.url) throw new Error(data.message || 'Falha no envio.');
      change('imageUrl', data.asset.url);
      toast.success('Imagem enviada à biblioteca. Salve o SEO para aplicar.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Falha no envio.'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  }
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
    <form className="space-y-5 rounded-xl border border-green-200 bg-white p-3 sm:p-5" onSubmit={e => { e.preventDefault(); void save(); }}>
      <fieldset disabled={busy || uploading || pickerOpen} className="min-w-0 space-y-4">
        <label className="block">Página<select className="mt-1 block w-full rounded-lg border p-3" value={path} onChange={e => setPath(e.target.value)}>{drafts.map(p => <option key={p.path} value={p.path}>{p.label} ({p.path}){JSON.stringify(p) !== JSON.stringify(saved.find(s => s.path === p.path)) ? ' — não salvo' : ''}</option>)}</select></label>
        <label className="block">Título SEO<input required maxLength={120} className="mt-1 block w-full rounded-lg border p-3" value={current.title} onChange={e => change('title', e.target.value)} /><span className="text-xs text-gray-600">{current.title.length} caracteres · sugestão: até 60</span></label>
        <label className="block">Descrição SEO<textarea required maxLength={320} rows={4} className="mt-1 block w-full rounded-lg border p-3" value={current.description} onChange={e => change('description', e.target.value)} /><span className="text-xs text-gray-600">{current.description.length} caracteres · sugestão: até 160</span></label>
        <section className="space-y-3" aria-label="Imagem de compartilhamento">
          <h2 className="font-semibold text-emerald-950">Imagem de compartilhamento (opcional)</h2>
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex aspect-[1200/630] w-full max-w-xs items-center justify-center overflow-hidden rounded-xl border bg-white">{current.imageUrl ? <img src={current.imageUrl} alt="Prévia da imagem de compartilhamento" className="h-full w-full object-contain" /> : <ImageIcon className="text-emerald-400" />}</div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" tabIndex={-1} aria-label="Selecionar imagem no computador" onChange={e => void upload(e.target.files?.[0])} />
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-3 py-2 text-sm text-white"><UploadCloud size={16}/>{uploading ? 'Enviando...' : 'Enviar do computador'}</button>
              <button type="button" onClick={() => setPickerOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 px-3 py-2 text-sm text-emerald-900"><Images size={16}/> Escolher da biblioteca</button>
              {current.imageUrl && <button type="button" onClick={() => change('imageUrl', '')} className="rounded-xl px-3 py-2 text-sm text-rose-700">Remover associação</button>}
            </div>
          </div>
          <p className="text-xs text-gray-600">PNG, JPEG ou WebP até 8 MB. Recomendado: 1200 × 630 px. Remover a associação não exclui o arquivo da biblioteca.</p>
        </section>
      </fieldset>
      <section className="rounded-lg border bg-green-50 p-4 [overflow-wrap:anywhere]"><h2 className="font-semibold">Prévia ilustrativa de busca</h2><p className="text-xs text-gray-600">Saboaria Ecológica › {current.path}</p><p className="text-lg text-blue-800">{current.title}</p><p className="text-sm text-gray-700">{current.description}</p><p className="mt-2 text-xs text-gray-600">O buscador pode escolher outro título ou descrição.</p></section>
      <p className="text-sm text-gray-600">Ao salvar, os metadados públicos são atualizados independentemente dos rascunhos de conteúdo.</p>
      <button disabled={busy || uploading || pickerOpen || !dirty} className="w-full sm:w-auto rounded-lg bg-green-800 px-5 py-3 text-white disabled:opacity-50" type="submit">{busy ? 'Salvando...' : 'Salvar SEO'}</button>
    </form>
    {pickerOpen && <MediaPicker onClose={() => setPickerOpen(false)} onSelect={asset => { change('imageUrl', asset.url); setPickerOpen(false); }} />}
  </div>;
}
