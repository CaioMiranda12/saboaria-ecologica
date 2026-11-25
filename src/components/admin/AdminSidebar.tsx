"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, ExternalLink, LogOut } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { navigationFor } from "./admin-navigation";

const STORAGE_KEY = "admin-sidebar-collapsed";

export function AdminSidebar({ role }: { role: "ADMIN" | "EDITOR" }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try { setCollapsed(localStorage.getItem(STORAGE_KEY) === "1"); } catch { /* indisponível */ }
  }, []);
  function toggle() {
    setCollapsed((previous) => {
      const next = !previous;
      try { localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch { /* indisponível */ }
      return next;
    });
  }
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  return (
    <aside className={`hidden md:flex sticky top-0 h-screen self-start shrink-0 flex-col admin-sidebar text-white py-6 overflow-hidden transition-[width,padding] duration-300 ${collapsed ? "w-[76px] px-3" : "w-64 px-4"}`}>
      <div className={`mb-8 flex items-center ${collapsed ? "justify-center" : "justify-between gap-2 px-2"}`}>
        {!collapsed && <Link href="/admin" className="font-serif text-lg font-bold tracking-wide whitespace-nowrap">SABOARIA <em className="font-normal not-italic text-white/70">ecológica</em></Link>}
        <button type="button" onClick={toggle} aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"} aria-expanded={!collapsed} title={collapsed ? "Expandir menu" : "Recolher menu"} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"><ToggleIcon size={19}/></button>
      </div>
      <nav aria-label="Menu administrativo" className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navigationFor(role).map(({href,label,icon:Icon}) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} title={collapsed ? label : undefined} aria-label={label} aria-current={active ? "page" : undefined} className={`flex items-center rounded-xl text-sm font-medium transition-colors ${collapsed ? "justify-center h-11" : "gap-3 px-3 py-3"} ${active ? "bg-white/20 text-white shadow-[inset_3px_0_0_#cdeab4]" : "text-white/80 hover:bg-white/10 hover:text-white"}`}><Icon size={19} className="shrink-0"/><span className={collapsed ? "sr-only" : "whitespace-nowrap"}>{label}</span></Link>;
        })}
      </nav>
      <div className="border-t border-white/20 pt-4 space-y-2">
        <Link href="/" target="_blank" rel="noopener noreferrer" className={`flex items-center rounded-xl text-sm text-white/80 hover:bg-white/10 p-3 ${collapsed ? "justify-center" : "gap-3"}`} title="Visualizar site"><ExternalLink size={19}/>{!collapsed && "Visualizar site"}</Link>
        <SignOutButton icon={<LogOut size={19} className="shrink-0" />} collapsed={collapsed} className={`flex w-full items-center rounded-xl border border-white/15 bg-white/10 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white ${collapsed ? "justify-center p-3" : "gap-3 px-3 py-3"}`}/>
      </div>
    </aside>
  );
}
