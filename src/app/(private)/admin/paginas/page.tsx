import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileText, LockKeyhole, Archive } from "lucide-react";

const pages = [
  { title: "Página inicial", path: "/", note: "Edite o banner principal e a seção Quem somos.", edit: "/admin/paginas/inicio" },
  { title: "Sobre nós", path: "/sobre", note: "Edite a história, missão, visão e valores.", edit: "/admin/paginas/sobre" },
  { title: "Nosso processo", path: "/processo", note: "Edite a apresentação e as etapas do processo.", edit: "/admin/paginas/processo" },
  { title: "Produtos", path: "/produtos", note: "Os produtos já podem ser gerenciados.", edit: "/admin/produtos" },
  { title: "Equipe", path: "/equipe", note: "Edite a apresentação da equipe. Integrantes no cadastro de equipe.", edit: "/admin/paginas/equipe" },
  { title: "Contato", path: "/contato", note: "Edite canais de contato, endereço e horários.", edit: "/admin/paginas/contato" },
];

export default function AdminPagesHub() {
  return <div className="mx-auto max-w-5xl space-y-6">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-verde-muted hover:text-verde-escuro"><ArrowLeft size={16}/> Voltar à visão geral</Link>
    <div><h1 className="font-serif text-3xl text-verde-escuro">Páginas do site</h1><p className="mt-2 text-sm text-verde-muted">Veja as páginas públicas e acesse os editores já disponíveis. Novos editores serão adicionados nas próximas sprints.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">{pages.map(page => <article key={page.path} className="rounded-2xl border border-verde-medio/15 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><span className="rounded-xl bg-verde-claro p-3 text-verde-principal"><FileText size={21}/></span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${page.edit ? "bg-verde-claro text-verde-escuro" : "bg-gray-100 text-gray-600"}`}>{page.edit ? "Edição disponível" : "Em breve"}</span></div>
      <h2 className="mt-4 font-semibold text-lg text-verde-escuro">{page.title}</h2><p className="mt-1 text-sm text-verde-muted min-h-10">{page.note}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">{page.edit ? <Link href={page.edit} className="inline-flex items-center gap-2 rounded-lg bg-verde-principal px-4 py-2.5 text-sm font-semibold text-white hover:bg-verde-escuro">Editar conteúdo</Link> : <span className="inline-flex items-center gap-2 text-sm text-verde-muted"><LockKeyhole size={15}/> Editor em desenvolvimento</span>}<Link href={page.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-verde-principal hover:underline">Ver página <ArrowUpRight size={16}/></Link></div>
    </article>)}</div><div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-r from-[#f1f8ee] to-white p-4"><div className="flex items-center gap-2 text-sm font-semibold text-verde-escuro"><Archive size={17}/> Arquivo de conteúdo anterior</div><p className="mt-1 text-sm text-verde-muted">Administradores podem consultar e exportar os dados institucionais antigos. Essa área é somente leitura e não altera as páginas públicas.</p><Link href="/admin/conteudo" className="mt-2 inline-block text-sm font-semibold text-verde-principal underline underline-offset-2">Consultar arquivo legado</Link></div>
  </div>;
}
