"use client";
import { CalendarDateInput } from "@/components/ui/CalendarDateInput";
import { useCallback, useEffect, useState } from "react";
import { Download, Search, ShieldCheck, ChevronLeft, ChevronRight, X, Clock3 } from "lucide-react";

type Event = { id: string; actorName: string; actorEmail: string; action: string; resource: string; resourceId: string | null; createdAt: string; changes: Record<string, { before: unknown; after: unknown }> | null };
const actions: Record<string, string> = { CREATE: "Criação", UPDATE: "Edição", DELETE: "Exclusão" };
const resources: Record<string, string> = { products: "Produtos", "team-members": "Equipe", partnerships: "Parcerias", admins: "Usuários" };
const fields: Record<string, string> = { name: "Nome", slug: "Identificador", description: "Descrição", category: "Categoria", isPublished: "Publicado", displayOrder: "Ordem", price: "Preço" };
const formatDate = (date: string) => new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Fortaleza", dateStyle: "short", timeStyle: "short" }).format(new Date(date));
const display = (value: unknown) => value === null || value === undefined ? "—" : typeof value === "boolean" ? value ? "Sim" : "Não" : String(value);
const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
export default function AuditExplorer() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [resource, setResource] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Event | null>(null);
  const [exporting, setExporting] = useState(false);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement | null;
    const handler = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", handler);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = originalOverflow; previous?.focus(); };
  }, [selected]);
  const makeParams = useCallback((n: number, size = 20) => new URLSearchParams({ page: String(n), pageSize: String(size), search, action, resource, from, to }), [search, action, resource, from, to]);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError("");
      try {
        const response = await fetch(`/api/admin/auditoria?${makeParams(page)}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Não foi possível carregar o histórico.");
        const data = await response.json(); setEvents(data.events); setTotal(data.total); setPages(data.pages);
      } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Erro ao carregar"); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load(); return () => controller.abort();
  }, [makeParams, page]);
  const changeFilter = (setter: (v: string) => void) => (value: string) => { setter(value); setPage(1); };
  async function exportCsv() {
    setExporting(true); setError("");
    try {
      // Export filtered records in batches, with a safety cap of 5,000 events.
      const rows: Event[] = [];
      for (let n = 1; n <= 50; n++) {
        const res = await fetch(`/api/admin/auditoria?${makeParams(n, 100)}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Não foi possível exportar os eventos.");
        const data = await res.json(); rows.push(...data.events);
        if (n >= data.pages) break;
      }
      const csv = ["Data (Fortaleza);Responsável;E-mail;Ação;Área;Registro", ...rows.map(e => [formatDate(e.createdAt), e.actorName, e.actorEmail, actions[e.action] || e.action, resources[e.resource] || e.resource, e.resourceId || ""].map(v => csvCell(v)).join(";"))].join("\r\n");
      const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "auditoria-administrativa.csv"; anchor.click(); URL.revokeObjectURL(url);
      if (rows.length === 5000) setError("Exportação limitada aos 5.000 eventos mais recentes do filtro.");
    } catch (e) { setError(e instanceof Error ? e.message : "Erro ao exportar"); }
    finally { setExporting(false); }
  }
  return <main className="space-y-6 p-4 sm:p-8">
    <header className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-green-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-3"><div className="rounded-2xl bg-emerald-100 p-3 text-emerald-800"><ShieldCheck /></div><div><h1 className="text-2xl font-bold text-emerald-950">Auditoria administrativa</h1><p className="mt-1 text-sm text-emerald-800/80">Consulte quem realizou alterações, quando e em qual área. Acesso exclusivo de administradores.</p><p className="mt-2 flex items-center gap-1 text-xs text-emerald-700"><Clock3 size={14} /> Horários de Fortaleza/Brasília (UTC−3)</p></div></div>
    </header>
    <section className="rounded-3xl border border-emerald-200/70 bg-white/90 p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-emerald-950">Histórico de atividades</h2><p className="text-sm text-emerald-700">{total.toLocaleString("pt-BR")} registros encontrados</p></div><button onClick={exportCsv} disabled={exporting || loading || total === 0} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"><Download size={16} />{exporting ? "Exportando..." : "Exportar CSV"}</button></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="relative sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-emerald-900">Buscar responsável ou registro</span><Search className="absolute bottom-3 left-3 text-emerald-600" size={16} /><input value={search} onChange={e => changeFilter(setSearch)(e.target.value)} placeholder="Nome, e-mail ou ID" className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400" /></label>
        <label><span className="mb-1 block text-xs font-semibold text-emerald-900">Ação</span><select value={action} onChange={e => changeFilter(setAction)(e.target.value)} className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 p-2.5 text-sm"><option value="">Todas</option>{Object.entries(actions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label><span className="mb-1 block text-xs font-semibold text-emerald-900">Área</span><select value={resource} onChange={e => changeFilter(setResource)(e.target.value)} className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 p-2.5 text-sm"><option value="">Todas</option>{Object.entries(resources).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-2 lg:col-span-1"><CalendarDateInput label="De" value={from} onChange={changeFilter(setFrom)} /><CalendarDateInput label="Até" value={to} onChange={changeFilter(setTo)} /></div>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
      <div className="mt-5 overflow-x-auto rounded-2xl border border-emerald-100"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-emerald-100/70 text-emerald-950"><tr>{["Data", "Responsável", "Ação", "Área", "Registro", "Detalhes"].map(h => <th className="px-4 py-3 font-semibold" key={h}>{h}</th>)}</tr></thead><tbody>{events.map((event, i) => <tr key={event.id} className={`border-t border-emerald-100 ${i % 2 ? "bg-emerald-50/50" : "bg-white"} hover:bg-emerald-100/40`}><td className="whitespace-nowrap px-4 py-3">{formatDate(event.createdAt)}</td><td className="px-4 py-3"><strong>{event.actorName}</strong><span className="block text-xs text-emerald-700/80">{event.actorEmail}</span></td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${event.action === "DELETE" ? "bg-rose-50 text-rose-800" : event.action === "CREATE" ? "bg-emerald-100 text-emerald-900" : "bg-sky-50 text-sky-800"}`}>{actions[event.action] || event.action}</span></td><td className="px-4 py-3">{resources[event.resource] || event.resource}</td><td className="max-w-48 truncate px-4 py-3 text-xs" title={event.resourceId || ""}>{event.resourceId || "—"}</td><td className="px-4 py-3"><button onClick={() => setSelected(event)} className="rounded-lg border border-emerald-200 px-3 py-1.5 font-medium text-emerald-800 hover:bg-emerald-50">Ver detalhes</button></td></tr>)}</tbody></table>{loading && <p className="p-8 text-center text-emerald-700">Carregando histórico...</p>}{!loading && !events.length && <p className="p-8 text-center text-emerald-700">Nenhum evento encontrado para os filtros selecionados.</p>}</div>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-emerald-800"><span>Página {page} de {pages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)} className="rounded-xl border border-emerald-200 p-2 disabled:opacity-40" aria-label="Página anterior"><ChevronLeft size={18} /></button><button disabled={page >= pages || loading} onClick={() => setPage(p => p + 1)} className="rounded-xl border border-emerald-200 p-2 disabled:opacity-40" aria-label="Próxima página"><ChevronRight size={18} /></button></div></div>
    </section>
    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/55 p-4" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null) }}><section role="dialog" aria-modal="true" aria-labelledby="audit-modal-title" className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-emerald-200 bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><h2 id="audit-modal-title" className="text-xl font-bold text-emerald-950">Detalhes do evento</h2><p className="text-sm text-emerald-700">{formatDate(selected.createdAt)} • {selected.actorName}</p></div><button onClick={() => setSelected(null)} aria-label="Fechar detalhes" className="rounded-lg p-2 hover:bg-emerald-50"><X /></button></div><dl className="mt-5 grid gap-2 text-sm"><div><dt className="font-semibold text-emerald-900">Ação</dt><dd>{actions[selected.action] || selected.action}</dd></div><div><dt className="font-semibold text-emerald-900">Área e registro</dt><dd className="break-all">{resources[selected.resource] || selected.resource} • {selected.resourceId || "—"}</dd></div></dl><h3 className="mt-5 font-semibold text-emerald-950">Campos alterados</h3>{selected.changes && Object.keys(selected.changes).length ? <div className="mt-2 space-y-3">{Object.entries(selected.changes).map(([key, values]) => <div key={key} className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3"><p className="mb-2 text-sm font-semibold text-emerald-900">{fields[key] || key}</p><div className="grid grid-cols-2 gap-3 text-sm"><div className="break-words"><span className="block text-xs text-emerald-700">Antes</span>{display(values.before)}</div><div className="break-words"><span className="block text-xs text-emerald-700">Depois</span>{display(values.after)}</div></div></div>)}</div> : <p className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Este evento não possui diferenças por campo registradas.</p>}<button onClick={() => setSelected(null)} className="mt-5 w-full rounded-xl bg-emerald-800 px-4 py-2.5 font-semibold text-white">Fechar</button></section></div>}
  </main>;
}
