import Link from "next/link";
import { ArrowRight, BookOpenText, FileText, Handshake, Package, Users, ExternalLink, Sparkles } from "lucide-react";

const shortcuts = [
  { href: "/admin/paginas", title: "Páginas do site", description: "Veja as páginas públicas e saiba o que já pode editar.", icon: BookOpenText },
  { href: "/admin/produtos", title: "Produtos", description: "Cadastre e atualize os produtos do catálogo.", icon: Package },
  { href: "/admin/equipe", title: "Equipe", description: "Gerencie os integrantes e suas informações.", icon: Users },
  { href: "/admin/parcerias", title: "Parcerias", description: "Organize as parcerias da Saboaria.", icon: Handshake },
  { href: "/admin/conteudo", title: "Conteúdo institucional", description: "Edite missão, visão, valores e dados de contato.", icon: FileText },
];

export default function AdminDashboardPage() {
  return <div className="mx-auto max-w-6xl space-y-8">
    <section className="rounded-3xl bg-verde-principal px-6 py-8 sm:px-10 sm:py-10 text-white shadow-sm">
      <div className="flex items-center gap-2 text-white/85 text-sm mb-3"><Sparkles size={17}/> Sua central de gerenciamento</div>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Bem-vindo ao painel!</h1>
      <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed">Escolha abaixo o que deseja atualizar. Você não precisa mexer em código para utilizar as funcionalidades disponíveis.</p>
      <Link href="/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-verde-escuro hover:bg-creme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ExternalLink size={17}/> Visualizar site público</Link>
    </section>
    <section aria-labelledby="atalhos-titulo">
      <div className="mb-4"><h2 id="atalhos-titulo" className="font-serif text-2xl text-verde-escuro">O que você deseja fazer?</h2><p className="text-sm text-verde-muted mt-1">Acesse uma área para começar.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shortcuts.map(({href,title,description,icon:Icon}) => <Link href={href} key={href} className="group flex min-h-44 flex-col rounded-2xl border border-verde-medio/15 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-verde-medio/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-verde-principal"><span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-verde-claro text-verde-principal"><Icon size={23}/></span><span className="text-base font-semibold text-verde-escuro">{title}</span><span className="mt-1 text-sm leading-relaxed text-verde-muted flex-1">{description}</span><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-verde-principal">Acessar <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></span></Link>)}
      </div>
    </section>
    <section className="rounded-2xl border border-verde-medio/15 bg-white p-5 sm:p-6"><h2 className="font-semibold text-verde-escuro">Dica para começar</h2><p className="mt-2 text-sm leading-relaxed text-verde-muted">Quer alterar informações sobre a Saboaria? Acesse <Link className="font-semibold text-verde-principal underline underline-offset-2" href="/admin/conteudo">Conteúdo institucional</Link>. A edição individual das páginas públicas será adicionada nas próximas sprints.</p></section>
  </div>;
}
