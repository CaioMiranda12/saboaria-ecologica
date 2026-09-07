'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

const links = [
  ['/', 'Início'],
  ['/sobre', 'Sobre'],
  ['/produtos', 'Produtos'],
  ['/processo', 'Processo'],
  ['/equipe', 'Equipe'],
  ['/contato', 'Contato'],
]

const Header = () => {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-creme/90 backdrop-blur-sm border-b border-verde-medio/10">
      <div className="flex items-center justify-between px-6 md:px-10 py-4">
        <Link href="/" className="font-serif text-lg font-bold text-verde-principal tracking-wide">
          SABOARIA <em className="font-normal not-italic text-verde-medio">ecológica</em>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-8">
          {links.map(([path, label]) => (
            <Link key={path} href={path} className="text-xs font-medium text-verde-muted uppercase tracking-widest hover:text-verde-medio transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <Link href="/contato" className="hidden md:block bg-verde-principal text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-verde-escuro transition-colors">
          Fale conosco
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuAberto((prev) => !prev)}
          className="md:hidden text-verde-principal p-1"
          aria-label="Abrir menu"
        >
          {menuAberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuAberto && (
        <div className="md:hidden flex flex-col px-6 pb-6 gap-4 border-t border-verde-medio/10 bg-creme">
          {links.map(([path, label]) => (
            <Link
              key={path}
              href={path}
              onClick={() => setMenuAberto(false)}
              className="text-sm font-medium text-verde-muted uppercase tracking-widest hover:text-verde-medio transition-colors py-1"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contato"
            onClick={() => setMenuAberto(false)}
            className="bg-verde-principal text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-verde-escuro transition-colors text-center mt-2"
          >
            Fale conosco
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Header