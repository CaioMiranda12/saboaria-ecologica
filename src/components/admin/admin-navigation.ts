import {
  LayoutDashboard,
  Files,
  Package,
  Users,
  Handshake,
  MapPin,
  Images,
  ClipboardList,
  UserCog,
  CircleUserRound,
} from "lucide-react";

const adminNavigation = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/paginas", label: "Páginas do site", icon: Files },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/equipe", label: "Equipe", icon: Users },
  { href: "/admin/localizacoes", label: "Sedes", icon: MapPin },
  { href: "/admin/parcerias", label: "Parcerias", icon: Handshake },
  { href: "/admin/midia", label: "Biblioteca de mídia", icon: Images },
  { href: "/admin/minha-conta", label: "Minha conta", icon: CircleUserRound },
  { href: "/admin/seo", label: "SEO", icon: Files, adminOnly: true },
  { href: "/admin/usuarios", label: "Usuários", icon: UserCog, adminOnly: true },
  { href: "/admin/auditoria", label: "Auditoria", icon: ClipboardList, adminOnly: true },
];

export function navigationFor(role: "ADMIN" | "EDITOR") {
  return adminNavigation.filter((item) => !item.adminOnly || role === "ADMIN");
}
