"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, Handshake, FileText } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

const navItems = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/equipe", label: "Equipe", icon: Users },
  { href: "/admin/parcerias", label: "Parcerias", icon: Handshake },
  { href: "/admin/conteudo", label: "Conteúdo do site", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-verde-principal text-white px-4 py-6">
      <div className="px-2 mb-8">
        <p className="font-serif text-lg font-bold tracking-wide">
          SABOARIA <em className="font-normal not-italic text-white/60">ecológica</em>
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-white/10">
        <SignOutButton className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-2" />
      </div>
    </aside>
  );
}