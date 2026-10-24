"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Handshake,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

const STORAGE_KEY = "admin-sidebar-collapsed";

const navItems = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/equipe", label: "Equipe", icon: Users },
  { href: "/admin/parcerias", label: "Parcerias", icon: Handshake },
  { href: "/admin/conteudo", label: "Conteúdo do site", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Restaura a preferência do usuário (após a hidratação, evitando mismatch com o SSR)
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* localStorage indisponível */
    }
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignora */
      }
      return next;
    });
  }

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={`hidden md:flex shrink-0 flex-col bg-verde-principal text-white py-6 overflow-hidden transition-[width,padding] duration-300 ease-in-out ${collapsed ? "w-[76px] px-3" : "w-64 px-4"
        }`}
    >
      <div
        className={`mb-8 flex items-center ${collapsed ? "justify-center" : "justify-between gap-2 px-2"
          }`}
      >
        {!collapsed && (
          <p className="font-serif text-lg font-bold tracking-wide whitespace-nowrap">
            SABOARIA <em className="font-normal not-italic text-white/60">ecológica</em>
          </p>
        )}

        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <ToggleIcon size={18} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center rounded-xl text-sm font-medium transition-colors ${collapsed ? "justify-center h-11 w-full" : "gap-3 px-3 py-2.5"
                } ${isActive
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className={collapsed ? "sr-only" : "whitespace-nowrap"}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="pt-4 border-t border-white/10">
        <SignOutButton
          className={`flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors py-2 ${collapsed ? "justify-center px-0 w-full" : "px-3"
            }`}
        />
      </div>
    </aside>
  );
}