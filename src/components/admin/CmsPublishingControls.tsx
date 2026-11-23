'use client';
import { useCallback, useEffect, useState } from 'react';
import type { CmsPageSlug } from '@/constants/cms-pages';

type Version = { id: string; createdAt: string };
export default function CmsPublishingControls({ slug, dirty, onRestored }: { slug: CmsPageSlug; dirty: boolean; onRestored: () => Promise<void> | void }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    const response = await fetch(`/api/admin/cms/pages/${slug}/versions`, { cache: 'no-store' });
    if (response.ok) setVersions((await response.json()).versions);
  }, [slug]);
  useEffect(() => { void reload(); }, [reload]);
  async function publish() {
    if (dirty) { setError('Salve seu rascunho antes de publicar.'); return; }
    if (!window.confirm('Publicar a versão salva desta página no site público?')) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch(`/api/admin/cms/pages/${slug}/publish`, { method: 'POST' });
      if (!response.ok) throw new Error('Não foi possível publicar.');
      setMessage('Página publicada com sucesso!'); await reload();
    } catch (e) { setError(e instanceof Error ? e.message : 'Erro ao publicar'); }
    finally { setBusy(false); }
  }
  async function restore(id: string) {
    if (dirty) { setError('Salve ou descarte as alterações antes de restaurar uma versão.'); return; }
    if (!window.confirm('Restaurar esta versão como rascunho? O site público não será alterado até publicar.')) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch(`/api/admin/cms/pages/${slug}/restore`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ versionId: id }) });
      if (!response.ok) throw new Error('Não foi possível restaurar.');
      await onRestored(); setMessage('Versão restaurada como rascunho. Publique quando estiver pronto.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Erro ao restaurar'); }
    finally { setBusy(false); }
  }
  return <section className="rounded-xl border border-verde-medio/20 bg-white p-4 space-y-3" aria-label="Publicação e histórico">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-verde-principal">Publicação</h2><p className="text-sm text-verde-muted">Salvar mantém um rascunho. Publicar atualiza o site.</p></div><button type="button" onClick={publish} disabled={busy || dirty} className="rounded-lg bg-verde-principal px-5 py-2 text-sm font-semibold text-white disabled:opacity-40">{busy ? 'Aguarde...' : 'Publicar página'}</button></div>
    {dirty && <p className="text-sm text-amber-700">Existem alterações não salvas. Salve o rascunho para habilitar a publicação.</p>}
    {message && <p role="status" className="text-sm text-green-800">{message}</p>}{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <details><summary className="cursor-pointer text-sm font-semibold text-verde-principal">Histórico de publicações ({versions.length})</summary><ul className="mt-3 space-y-2">{versions.map(v => <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 p-3 text-sm"><time dateTime={v.createdAt}>{new Date(v.createdAt).toLocaleString('pt-BR')}</time><button type="button" disabled={busy || dirty} onClick={() => restore(v.id)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Restaurar rascunho</button></li>)}{versions.length === 0 && <li className="text-sm text-verde-muted">Nenhuma publicação registrada.</li>}</ul></details>
  </section>;
}
