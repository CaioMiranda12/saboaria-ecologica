"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X, ChevronRight } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { adminNavigation } from "./admin-navigation";

export function AdminTopbar({ adminEmail }: { adminEmail: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1);
  const crumbLabels: Record<string,string> = { paginas:"Páginas", inicio:"Início", sobre:"Sobre", processo:"Processo", contato:"Contato", produtos:"Produtos", equipe:"Equipe", parcerias:"Parcerias", usuarios:"Usuários", auditoria:"Auditoria", midia:"Mídia", conteudo:"Conteúdo", novo:"Novo cadastro" };
  return <header className="relative z-20 shrink-0 bg-white border-b border-verde-medio/15">
    <div className="min-h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
      <div className="min-w-0"><nav aria-label="Caminho de navegação" className="flex items-center gap-1 text-xs text-verde-muted mb-1"><Link href="/admin" className="hover:text-verde-principal">Painel</Link>{segments.map((segment,index)=><span key={`${segment}-${index}`} className="inline-flex items-center gap-1"><ChevronRight size={12}/><span aria-current={index===segments.length-1?"page":undefined} className={index===segments.length-1?"font-semibold text-verde-escuro":""}>{crumbLabels[segment] ?? (segment.length>12?"Editar registro":segment)}</span></span>)}</nav><p className="truncate text-sm font-semibold text-verde-escuro" title={adminEmail}>{adminEmail}</p></div>
      <div className="flex items-center gap-2">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-verde-medio/25 px-3 py-2 text-sm font-medium text-verde-escuro hover:bg-verde-claro focus-visible:outline-2 focus-visible:outline-verde-principal"><ExternalLink size={16}/> Visualizar site</Link>
        <button type="button" className="md:hidden rounded-lg p-2 text-verde-escuro hover:bg-verde-claro focus-visible:outline-2 focus-visible:outline-verde-principal" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="admin-mobile-menu" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X size={24}/> : <Menu size={24}/>}</button>
      </div>
    </div>
    {open && <nav id="admin-mobile-menu" aria-label="Menu administrativo móvel" className="md:hidden border-t border-verde-medio/15 p-3 bg-white shadow-lg space-y-1">
      {adminNavigation.map(({href,label,icon:Icon}) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={(href === "/admin" ? pathname === href : pathname.startsWith(href)) ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${pathname === href ? "bg-verde-claro text-verde-escuro" : "text-verde-muted hover:bg-verde-claro"}`}><Icon size={18}/>{label}</Link>)}
      <Link href="/" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="sm:hidden flex items-center gap-3 px-3 py-3 text-sm text-verde-escuro"><ExternalLink size={18}/>Visualizar site</Link>
      <div className="border-t border-verde-medio/15 pt-2 px-3"><SignOutButton className="py-3 text-sm font-semibold text-verde-escuro"/></div>
    </nav>}
  </header>;
}
