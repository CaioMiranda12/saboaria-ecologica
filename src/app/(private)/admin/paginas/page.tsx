import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileText, LockKeyhole } from "lucide-react";

const pages = [
  { title: "Página inicial", path: "/", note: "Edite o banner principal e a seção Quem somos.", edit: "/admin/paginas/inicio" },
  { title: "Sobre nós", path: "/sobre", note: "Editor de página previsto para a Sprint 4." },
  { title: "Nosso processo", path: "/processo", note: "Editor de página previsto para a Sprint 4." },
  { title: "Produtos", path: "/produtos", note: "Os produtos já podem ser gerenciados.", edit: "/admin/produtos" },
  { title: "Equipe", path: "/equipe", note: "Os integrantes já podem ser gerenciados.", edit: "/admin/equipe" },
  { title: "Contato", path: "/contato", note: "Dados institucionais editáveis; editor completo na Sprint 4.", edit: "/admin/conteudo" },
];

export default function AdminPagesHub() {
  return <div className="mx-auto max-w-5xl space-y-6">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-verde-muted hover:text-verde-escuro"><ArrowLeft size={16}/> Voltar à visão geral</Link>
    <div><h1 className="font-serif text-3xl text-verde-escuro">Páginas do site</h1><p className="mt-2 text-sm text-verde-muted">Veja as páginas públicas e acesse os editores já disponíveis. Novos editores serão adicionados nas próximas sprints.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">{pages.map(page => <article key={page.path} className="rounded-2xl border border-verde-medio/15 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><span className="rounded-xl bg-verde-claro p-3 text-verde-principal"><FileText size={21}/></span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${page.edit ? "bg-verde-claro text-verde-escuro" : "bg-gray-100 text-gray-600"}`}>{page.edit ? "Edição disponível" : "Em breve"}</span></div>
      <h2 className="mt-4 font-semibold text-lg text-verde-escuro">{page.title}</h2><p className="mt-1 text-sm text-verde-muted min-h-10">{page.note}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">{page.edit ? <Link href={page.edit} className="inline-flex items-center gap-2 rounded-lg bg-verde-principal px-4 py-2.5 text-sm font-semibold text-white hover:bg-verde-escuro">Editar conteúdo</Link> : <span className="inline-flex items-center gap-2 text-sm text-verde-muted"><LockKeyhole size={15}/> Editor em desenvolvimento</span>}<Link href={page.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-verde-principal hover:underline">Ver página <ArrowUpRight size={16}/></Link></div>
    </article>)}</div>
  </div>;
}
