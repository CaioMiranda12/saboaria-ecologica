'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CmsPageSlug } from '@/constants/cms-pages';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type Version = { id: string; createdAt: string; actorName: string | null; actorEmail: string | null; action: string; sourceVersionId: string | null };
type Pending = { kind: 'publish' } | { kind: 'restore'; id: string };
export default function CmsPublishingControls({ slug, dirty, onRestored }: { slug: CmsPageSlug; dirty: boolean; onRestored: () => Promise<void> | void }) {
  const [status,setStatus]=useState<{hasPublication:boolean;hasPendingChanges:boolean;publishedAt:string|null}|null>(null);
  const previouslyDirty=useRef(false);
  const loadStatus=useCallback(async()=>{const r=await fetch(`/api/admin/cms/pages/${slug}/status`,{cache:"no-store"});if(r.ok)setStatus(await r.json());},[slug]);
  useEffect(()=>{void loadStatus()},[loadStatus]);
  useEffect(()=>{if(previouslyDirty.current&&!dirty)void loadStatus();previouslyDirty.current=dirty},[dirty,loadStatus]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    const response = await fetch(`/api/admin/cms/pages/${slug}/versions`, { cache: 'no-store' });
    if (response.ok) setVersions((await response.json()).versions);
  }, [slug]);
  useEffect(() => { void reload(); }, [reload]);
  function askPublish() {
    if (dirty) { setError('Salve seu rascunho antes de publicar.'); return; }
    setPending({ kind: 'publish' });
  }
  function askRestore(id: string) {
    if (dirty) { setError('Salve ou descarte as alterações antes de restaurar uma versão.'); return; }
    setPending({ kind: 'restore', id });
  }
  async function execute() {
    if (!pending || busy) return;
    const operation = pending;
    setBusy(true); setError(''); setMessage('');
    try {
      const response = operation.kind === 'publish'
        ? await fetch(`/api/admin/cms/pages/${slug}/publish`, { method: 'POST' })
        : await fetch(`/api/admin/cms/pages/${slug}/restore`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ versionId: operation.id }) });
      if (!response.ok) throw new Error(operation.kind === 'publish' ? 'Não foi possível publicar.' : 'Não foi possível restaurar.');
      if (operation.kind === 'restore') await onRestored();
      setMessage(operation.kind === 'publish' ? 'Página publicada com sucesso!' : 'Versão restaurada como rascunho. Publique quando estiver pronto.');
      await reload(); await loadStatus();
      setPending(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível concluir a ação'); setPending(null); }
    finally { setBusy(false); }
  }
  return <section className="rounded-xl border border-verde-medio/20 bg-white p-4 space-y-3" aria-label="Publicação e histórico">
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-3" role="status" aria-live="polite"><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${(dirty||status?.hasPendingChanges)?"bg-amber-100 text-amber-900":status?.hasPublication?"bg-emerald-700 text-white":"bg-slate-100 text-slate-700"}`}>{dirty?"● Alterações não salvas":!status?"Verificando publicação...":!status.hasPublication?"○ Ainda não publicada":status.hasPendingChanges?"● Rascunho diferente do publicado":"✓ Publicada e atualizada"}</span><span className="text-xs text-emerald-900">{status?.hasPublication?`Última publicação: ${new Date(status.publishedAt!).toLocaleString("pt-BR",{timeZone:"America/Fortaleza"})}`:"Nenhuma versão pública registrada"}</span></div>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-verde-principal">Publicação</h2><p className="text-sm text-verde-muted">Salvar mantém um rascunho. Publicar atualiza o site.</p></div><button type="button" onClick={askPublish} disabled={busy || dirty} className="rounded-lg bg-verde-principal px-5 py-2 text-sm font-semibold text-white disabled:opacity-40">{busy ? 'Aguarde...' : 'Publicar página'}</button></div>
    {dirty && <p className="text-sm text-amber-700">Existem alterações não salvas. Salve o rascunho para habilitar a publicação.</p>}
    {message && <p role="status" className="text-sm text-green-800">{message}</p>}{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <details><summary className="cursor-pointer text-sm font-semibold text-verde-principal">Histórico de ações ({versions.length})</summary><ul className="mt-3 space-y-2">{versions.map(v => <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 p-3 text-sm"><div><time dateTime={v.createdAt}>{new Date(v.createdAt).toLocaleString('pt-BR',{timeZone:'America/Fortaleza'})}</time><p className="font-medium">{v.action === 'RESTORE_DRAFT' ? 'Restaurou como rascunho' : 'Publicou página'}</p><p className="text-verde-muted">{v.actorName ? `${v.actorName} (${v.actorEmail || 'sem e-mail'})` : 'Responsável não registrado (registro anterior)'}</p></div><button type="button" disabled={busy || dirty} onClick={() => askRestore(v.id)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Restaurar rascunho</button></li>)}{versions.length === 0 && <li className="text-sm text-verde-muted">Nenhuma ação registrada.</li>}</ul></details>
    <ConfirmDialog isOpen={pending !== null} title={pending?.kind === 'publish' ? 'Publicar página?' : 'Restaurar versão?'} description={pending?.kind === 'publish' ? 'O conteúdo salvo ficará visível imediatamente no site público.' : 'O conteúdo desta versão substituirá seu rascunho atual. O site público não será alterado até uma nova publicação.'} confirmLabel={pending?.kind === 'publish' ? 'Sim, publicar' : 'Restaurar rascunho'} isConfirming={busy} onCancel={() => { if (!busy) setPending(null); }} onConfirm={() => { void execute(); }}/>
  </section>;
}
