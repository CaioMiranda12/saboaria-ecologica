"use client";

import { useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Início"],
  ["/sobre", "Sobre"],
  ["/produtos", "Produtos"],
  ["/processo", "Processo"],
  ["/equipe", "Equipe"],
  ["/mapa", "Mapa"],
  ["/parcerias", "Parcerias"],
  ["/contato", "Contato"],
];

const Header = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  return (
    <nav
      aria-label="Navegação principal"
      onKeyDown={(e) => {
        if (e.key === "Escape" && menuAberto) {
          setMenuAberto(false);
          toggleRef.current?.focus();
        }
      }}
      className="fixed top-0 right-0 left-0 z-50 border-b border-verde-medio/10 bg-creme/90 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 xl:px-10">
        <Link
          href="/"
          className="min-w-0 font-serif text-lg font-bold tracking-wide text-verde-principal"
        >
          SABOARIA <em className="font-normal text-verde-medio not-italic">ecológica</em>
        </Link>

        {/* Desktop */}
        <div className="hidden gap-4 xl:flex 2xl:gap-8">
          {links.map(([path, label]) => (
            <Link
              key={path}
              href={path}
              aria-current={pathname === path ? "page" : undefined}
              className="text-xs font-medium tracking-widest text-verde-muted uppercase transition-colors hover:text-verde-medio"
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/contato"
          className="hidden rounded-full bg-verde-principal px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-verde-escuro xl:block"
        >
          Fale conosco
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuAberto((prev) => !prev)}
          className="shrink-0 p-2.5 text-verde-principal xl:hidden"
          ref={toggleRef}
          type="button"
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          {menuAberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {
        <div
          id="menu-mobile"
          hidden={!menuAberto}
          className={`${menuAberto ? "flex" : "hidden"} max-h-[calc(100dvh-72px)] flex-col gap-3 overflow-y-auto overscroll-contain border-t border-verde-medio/10 bg-creme px-4 pb-6 sm:px-6 xl:hidden`}
        >
          {links.map(([path, label]) => (
            <Link
              key={path}
              href={path}
              aria-current={pathname === path ? "page" : undefined}
              onClick={() => setMenuAberto(false)}
              className="py-1 text-sm font-medium tracking-widest text-verde-muted uppercase transition-colors hover:text-verde-medio"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contato"
            onClick={() => setMenuAberto(false)}
            className="mt-2 rounded-full bg-verde-principal px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
          >
            Fale conosco
          </Link>
        </div>
      }
    </nav>
  );
};

export default Header;
