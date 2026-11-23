import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-authorization";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function AuditoriaPage() {
  if (!await requireAdminRole()) redirect("/admin");
  const events = await prisma.auditEvent.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return <main className="space-y-6 p-4 sm:p-8">
    <div><h1 className="text-2xl font-semibold text-verde-escuro">Auditoria administrativa</h1><p className="text-sm text-verde-muted">Últimas 100 alterações de produtos, equipe e parcerias. Acesso exclusivo de administradores.</p></div>
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-gray-50"><tr>{["Data", "Responsável", "Ação", "Área", "Registro"].map(h=><th className="p-3" key={h}>{h}</th>)}</tr></thead><tbody>{events.map(event=><tr className="border-t" key={event.id}><td className="p-3 whitespace-nowrap">{event.createdAt.toISOString().slice(0,16).replace("T", " ") + " UTC"}</td><td className="p-3"><strong>{event.actorName}</strong><span className="block text-xs text-gray-500">{event.actorEmail}</span></td><td className="p-3">{({CREATE:"Criação",UPDATE:"Edição",DELETE:"Exclusão"} as Record<string,string>)[event.action] ?? event.action}</td><td className="p-3">{event.resource}</td><td className="p-3 text-xs">{event.resourceId ?? "—"}</td></tr>)}</tbody></table>{events.length===0&&<p className="p-6 text-center text-gray-500">Nenhuma alteração registrada ainda.</p>}</div>
  </main>;
}
