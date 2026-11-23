'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Eye, Save, RotateCcw } from 'lucide-react';
import CmsPublishingControls from './CmsPublishingControls';

type SectionKey = 'hero' | 'sobre';
type Section = { key: SectionKey; title: string; position: number; enabled: boolean; content: Record<string, string> };
const defaults: Section[] = [
  { key: 'hero', title: 'Banner principal', position: 0, enabled: true, content: { title: 'Limpeza que cuida do planeta', description: 'Transformamos óleo de fritura em produtos de limpeza biodegradáveis, gerando renda em comunidades e preservando o meio ambiente.', primaryButton: 'Ver produtos', secondaryButton: 'Nossa história', imageUrl: '/logo.png' } },
  { key: 'sobre', title: 'Quem somos', position: 1, enabled: true, content: { title: 'Um movimento de consciência ambiental', description: 'Mais do que uma saboaria, representamos o empoderamento de mulheres em comunidades vulneráveis através da economia circular e da produção artesanal responsável.', mission: '', vision: '', values: '', imageUrl: '/economia-circular.jpg' } },
];
const fields: Record<SectionKey, { key: string; label: string; multiline?: boolean; hint?: string }[]> = {
  hero: [
    { key: 'title', label: 'Título principal' }, { key: 'description', label: 'Texto de apresentação', multiline: true },
    { key: 'primaryButton', label: 'Botão principal' }, { key: 'secondaryButton', label: 'Botão secundário' },
    { key: 'imageUrl', label: 'Endereço da imagem', hint: 'Use uma imagem da pasta public (ex.: /logo.png) ou uma URL HTTPS do Cloudinary.' },
  ],
  sobre: [
    { key: 'title', label: 'Título da seção' }, { key: 'description', label: 'Texto da seção', multiline: true },
    { key: 'mission', label: 'Missão', multiline: true }, { key: 'vision', label: 'Visão', multiline: true },
    { key: 'values', label: 'Valores', multiline: true }, { key: 'imageUrl', label: 'Endereço da imagem' },
  ],
};

export default function HomeEditor() {
  const [sections, setSections] = useState<Section[]>(defaults);
  const [original, setOriginal] = useState('');
  const [active, setActive] = useState<SectionKey>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const dirty = !!original && JSON.stringify(sections) !== original;

  const reloadDraft = async () => {
    const response = await fetch('/api/admin/cms/pages/inicio', { cache: 'no-store' });
    if (!response.ok) throw new Error('Falha ao recarregar rascunho');
    const result = await response.json();
    const loaded: Section[] = defaults.map(base => {
      const stored = result.page?.sections?.find((s: {key:string}) => s.key === base.key);
      return stored ? { ...base, enabled: stored.enabled, position: stored.position, content: {...base.content, ...stored.content} } : base;
    });
    setSections(loaded); setOriginal(JSON.stringify(loaded));
  };
  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/cms/pages/inicio', { cache: 'no-store' }).then(async response => {
      if (!response.ok) throw new Error('Não foi possível carregar o conteúdo.');
      const result = await response.json();
      if (!result.page) throw new Error('Página não inicializada. Execute npm run db:seed-cms.');
      const saved: Section[] = defaults.map(base => {
        const stored = result.page.sections?.find((s: { key: string }) => s.key === base.key);
        return stored ? { ...base, enabled: stored.enabled, position: stored.position, content: { ...base.content, ...stored.content } } : base;
      });
      if (mounted) { setSections(saved); setOriginal(JSON.stringify(saved)); }
    }).catch(e => { if (mounted) setError(e.message); }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const update = (key: SectionKey, field: string, value: string) => {
    setNotice(''); setSections(current => current.map(section => section.key === key ? { ...section, content: { ...section.content, [field]: value } } : section));
  };
  const toggle = (key: SectionKey, enabled: boolean) => { setNotice(''); setSections(current => current.map(s => s.key === key ? { ...s, enabled } : s)); };
  const save = async () => {
    setSaving(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/admin/cms/pages/inicio', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sections }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Erro ao salvar conteúdo.');
      setOriginal(JSON.stringify(sections));
      setNotice('Rascunho salvo. Clique em Publicar página para atualizar o site.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Erro inesperado.'); }
    finally { setSaving(false); }
  };
  const section = sections.find(s => s.key === active)!;
  if (loading) return <div role="status" className="rounded-2xl bg-white p-8 text-verde-muted">Carregando conteúdo...</div>;
  if (error && !original) return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">{error}</div>;
  return <div className="space-y-5">
    <CmsPublishingControls slug="inicio" dirty={dirty} onRestored={reloadDraft} />
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-verde-medio/15 bg-white p-4">
      <span className="text-sm text-verde-muted">{dirty ? '● Alterações não salvas' : '✓ Tudo salvo'} · Salvar não publica no site.</span>
      <div className="flex flex-wrap gap-2">
        <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-verde-medio/30 px-4 py-2 text-sm font-medium text-verde-principal"><ExternalLink size={16}/> Ver site</a>
        <button type="button" disabled={!dirty || saving} onClick={() => { setSections(JSON.parse(original)); setNotice(''); }} className="inline-flex items-center gap-2 rounded-lg border border-verde-medio/30 px-4 py-2 text-sm disabled:opacity-40"><RotateCcw size={16}/> Descartar</button>
        <button type="button" disabled={!dirty || saving} onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-verde-principal px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"><Save size={16}/>{saving ? 'Salvando...' : 'Salvar alterações'}</button>
      </div>
    </div>
    {notice && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Seções da página" className="flex gap-2 lg:flex-col">
        {sections.map(s => <button type="button" key={s.key} onClick={() => setActive(s.key)} aria-current={active === s.key ? 'page' : undefined} className={`rounded-xl p-4 text-left text-sm font-semibold ${active === s.key ? 'bg-verde-principal text-white' : 'bg-white text-verde-principal border border-verde-medio/15'}`}>{s.title}<span className="mt-1 block text-xs font-normal opacity-75">{s.enabled ? 'Visível' : 'Oculta'}</span></button>)}
      </nav>
      <div className="min-w-0 space-y-5">
        <section className="rounded-2xl border border-verde-medio/15 bg-white p-5 md:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl text-verde-principal">{section.title}</h2><p className="text-sm text-verde-muted">Edite os campos abaixo e confira a prévia.</p></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={section.enabled} onChange={e => toggle(active, e.target.checked)} className="accent-green-800"/> Exibir no site</label></div>
          <div className="space-y-5">{fields[active].map(f => <label key={f.key} className="block"><span className="mb-1.5 block text-sm font-semibold text-verde-principal">{f.label}</span>{f.multiline ? <textarea rows={3} maxLength={3000} value={section.content[f.key] ?? ''} onChange={e => update(active, f.key, e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-verde-medio"/> : <input maxLength={f.key === 'imageUrl' ? 2048 : 3000} value={section.content[f.key] ?? ''} onChange={e => update(active, f.key, e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-verde-medio"/>}{f.hint && <span className="mt-1 block text-xs text-verde-muted">{f.hint}</span>}</label>)}</div>
        </section>
        <section className="overflow-hidden rounded-2xl border border-verde-medio/15 bg-white"><div className="flex items-center gap-2 border-b border-gray-100 p-4 text-sm font-semibold text-verde-principal"><Eye size={17}/> Pré-visualização desta seção</div><div className="grid gap-5 bg-[#f5f3e9] p-6 md:grid-cols-2 md:p-8"><div className="flex flex-col justify-center gap-4"><h3 className="font-serif text-3xl text-verde-principal break-words">{section.content.title}</h3><p className="whitespace-pre-wrap text-sm leading-relaxed text-verde-muted">{section.content.description}</p>{active === 'hero' ? <div className="flex flex-wrap gap-2"><span className="rounded-full bg-verde-principal px-4 py-2 text-xs text-white">{section.content.primaryButton}</span><span className="rounded-full border border-verde-principal px-4 py-2 text-xs text-verde-principal">{section.content.secondaryButton}</span></div> : <div className="space-y-2 text-xs text-verde-muted">{(['mission','vision','values'] as const).map((k,i) => <p key={k}><strong>{['Missão','Visão','Valores'][i]}:</strong> {section.content[k]}</p>)}</div>}</div><div className="flex min-h-48 items-center justify-center rounded-xl bg-verde-principal/10">{section.content.imageUrl && (/^https:\/\//.test(section.content.imageUrl) || section.content.imageUrl.startsWith('/')) ? <img src={section.content.imageUrl} alt="Prévia da imagem selecionada" className="max-h-64 w-full object-contain"/> : <span className="text-xs text-verde-muted">Imagem não configurada</span>}</div></div>{!section.enabled && <p className="bg-amber-50 p-3 text-sm text-amber-800">Esta seção ficará oculta no site depois de salvar.</p>}</section>
      </div>
    </div>
  </div>;
}
