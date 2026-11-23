"use client";
import { useEffect, useState } from "react";
import { CMS_EDITOR_FIELDS, type InstitutionalSlug } from "@/constants/cms-editor-fields";
import { Save, ExternalLink, RotateCcw } from "lucide-react";
type Section = { key: string; title: string; enabled: boolean; position: number; content: Record<string, unknown> };
export default function InstitutionalEditor({ slug }: { slug: InstitutionalSlug }) {
  const config = CMS_EDITOR_FIELDS[slug];
  const [sections, setSections] = useState<Section[]>([]);
  const [snapshot, setSnapshot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dirty = !!snapshot && JSON.stringify(sections) !== snapshot;
  useEffect(() => {
    let active = true;
    fetch(`/api/admin/cms/pages/${slug}`, { cache: "no-store" }).then(async r => {
      const result = await r.json();
      if (!r.ok) throw new Error(result.message || "Erro ao carregar página");
      if (!result.page) throw new Error("Página não inicializada. Execute npm run db:seed-cms.");
      const loaded: Section[] = result.page.sections.map((s: Section) => ({ ...s, content: s.content || {} }));
      if (active) { setSections(loaded); setSnapshot(JSON.stringify(loaded)); }
    }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);
  useEffect(() => { const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
  function update(key: string, field: string, value: string) {
    setMessage("");
    setSections(old => old.map(s => s.key === key ? { ...s, content: { ...s.content, [field]: field === "steps" ? value.split("\n").filter(Boolean) : value } } : s));
  }
  async function save() {
    setSaving(true); setError(""); setMessage("");
    try {
      const r = await fetch(`/api/admin/cms/pages/${slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections: sections.map(({ key, title, position, enabled, content }) => ({ key, title, position, enabled, content })) }) });
      const result = await r.json();
      if (!r.ok) throw new Error(result.message || "Não foi possível salvar");
      setSnapshot(JSON.stringify(sections)); setMessage("Alterações salvas! Confira a página pública.");
    } catch (e) { setError(e instanceof Error ? e.message : "Erro inesperado"); } finally { setSaving(false); }
  }
  if (loading) return <p role="status" className="rounded-xl bg-white p-6">Carregando conteúdo...</p>;
  if (!snapshot) return <p role="alert" className="rounded-xl bg-red-50 p-6 text-red-800">{error || "Nenhuma seção encontrada. Execute o seed do CMS."}</p>;
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 border border-verde-medio/15">
      <span className="text-sm text-verde-muted">{dirty ? "● Alterações não salvas" : "✓ Tudo salvo"} · Salvar atualiza o site público.</span>
      <div className="flex flex-wrap gap-2">
        <a href={config.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"><ExternalLink size={16}/> Ver página</a>
        <button disabled={!dirty || saving} onClick={() => { setSections(JSON.parse(snapshot)); setMessage(""); }} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm disabled:opacity-40"><RotateCcw size={16}/> Descartar</button>
        <button disabled={!dirty || saving} onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-verde-principal px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"><Save size={16}/> {saving ? "Salvando..." : "Salvar alterações"}</button>
      </div>
    </div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error}</p>}
    {message && <p role="status" className="rounded-lg bg-green-50 p-4 text-green-800">{message}</p>}
    {sections.map(section => {
      const definition = (config.sections as Record<string, { title: string; fields: readonly {key:string;label:string}[] }>)[section.key];
      if (!definition) return null;
      return <section key={section.key} className="rounded-2xl border border-verde-medio/15 bg-white p-5 md:p-7 space-y-5">
        <div className="flex flex-wrap justify-between gap-3"><h2 className="font-serif text-2xl text-verde-principal">{definition.title}</h2><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={section.enabled} onChange={e => setSections(old => old.map(s => s.key === section.key ? {...s,enabled:e.target.checked} : s))}/> Exibir no site</label></div>
        {definition.fields.map(field => { const raw = section.content[field.key]; const value = Array.isArray(raw) ? raw.join("\n") : String(raw ?? ""); const multiline = ["description","intro","mission","vision","values","address","hours","steps"].includes(field.key); return <label key={field.key} className="block"><span className="mb-1 block text-sm font-semibold text-verde-principal">{field.label}</span>{multiline ? <textarea rows={field.key === "steps" ? 5 : 3} maxLength={3000} value={value} onChange={e => update(section.key,field.key,e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:ring-2 focus:ring-verde-medio"/> : <input maxLength={2048} value={value} onChange={e => update(section.key,field.key,e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:ring-2 focus:ring-verde-medio"/>}</label>; })}
        <div className="rounded-xl bg-[#f5f3e9] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-verde-muted mb-2">Prévia dos textos</p><h3 className="font-serif text-2xl text-verde-principal">{String(section.content.title || definition.title)}</h3><p className="mt-2 whitespace-pre-wrap text-sm text-verde-muted">{String(section.content.description || section.content.intro || "")}</p></div>
      </section>;
    })}
  </div>;
}
