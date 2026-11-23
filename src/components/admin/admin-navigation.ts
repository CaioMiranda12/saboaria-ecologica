import { LayoutDashboard, Files, Package, Users, Handshake, Images, ClipboardList, UserCog, CircleUserRound } from "lucide-react";

export const adminNavigation = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/paginas", label: "Páginas do site", icon: Files },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/equipe", label: "Equipe", icon: Users },
  { href: "/admin/parcerias", label: "Parcerias", icon: Handshake },
  { href: "/admin/midia", label: "Biblioteca de mídia", icon: Images },
  { href: "/admin/minha-conta", label: "Minha conta", icon: CircleUserRound },
  { href: "/admin/usuarios", label: "Usuários", icon: UserCog },
  { href: "/admin/auditoria", label: "Auditoria", icon: ClipboardList },
];
