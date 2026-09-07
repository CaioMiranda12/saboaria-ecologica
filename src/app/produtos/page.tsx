'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import CardProduto from '@/components/CardProduto'
import { listaDeProdutos, type Produto } from '@/data/produtos'
import { contatosDaMarca } from '@/data/marca'

type FiltroTipo = 'todos' | 'barra' | 'pasta' | 'liquido' | 'po'

const filtros: { valor: FiltroTipo; label: string }[] = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'barra', label: 'Barra' },
  { valor: 'pasta', label: 'Pasta' },
  { valor: 'liquido', label: 'Líquido' },
  { valor: 'po', label: 'Pó' },
]

const Produtos = () => {
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroTipo>('todos')
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)

  const produtosFiltrados =
    filtroAtivo === 'todos'
      ? listaDeProdutos
      : listaDeProdutos.filter((p) => p.tipo === filtroAtivo)

  const mensagemWhatsApp = (produto: Produto) =>
    encodeURIComponent(`Olá! Tenho interesse no produto *${produto.nomePrincipal}*. Pode me ajudar?`)

  return (
    <div className="bg-creme text-[#1a2e1f]">

      {/* Hero */}
      <section className="bg-azul-principal pt-28 pb-16 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/4" />
        <div className="flex justify-between">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-azul-medio" />
              Produtos artesanais
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-5">
              Limpeza <em className="text-white/45">natural</em><br />para cada uso
            </h1>
            <p className="text-white/60 font-light leading-relaxed text-base">
              Todos os nossos produtos são feitos à mão com óleo reutilizado, ingredientes naturais e embalagens biodegradáveis.
            </p>
          </div>
          <div className="flex flex-col items-center lg:flex-row">
            <img
              src="/logo.png"
              alt="Saboaria Ecológica"
              className="max-w-100 w-full md:w-1/2 h-full object-contain"
            />
            <img
              src="/logo-ellas.png"
              alt="Saboaria Ecológica"
              className="max-w-125 w-full md:w-1/2 h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Filtros */}
      <div className="sticky top-16 z-40 bg-white border-b border-azul-principal/10 px-6 md:px-20 py-4 flex gap-2 flex-wrap">
        {filtros.map(({ valor, label }) => (
          <button
            key={valor}
            onClick={() => setFiltroAtivo(valor)}
            className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${filtroAtivo === valor
              ? 'bg-azul-principal text-white'
              : 'border border-azul-principal/20 text-azul-muted hover:border-azul-principal hover:text-azul-principal'
              }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-azul-muted font-light">
          {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <section className="px-6 md:px-20 py-12 md:py-16">
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-24 text-azul-muted text-sm font-light">
            Nenhum produto encontrado para esse filtro.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosFiltrados.map((produto) => (
              <CardProduto
                key={produto.id}
                produto={produto}
                onVerDetalhes={() => setProdutoSelecionado(produto)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {produtoSelecionado && (
        <div
          className="fixed inset-0 z-50 bg-azul-principal/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => setProdutoSelecionado(null)}
        >
          <div
            className="bg-creme w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do modal */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {produtoSelecionado.tipos?.map((tipo) => (
                    <span
                      key={tipo}
                      className="bg-azul-claro text-azul-principal text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider"
                    >
                      {tipo}
                    </span>
                  ))}
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-azul-principal">
                  {produtoSelecionado.nomePrincipal}
                </h2>
                {produtoSelecionado.nomeComplemento && (
                  <p className="text-sm text-azul-muted font-light italic mt-1">
                    {produtoSelecionado.nomeComplemento}
                  </p>
                )}
              </div>
              <button
                onClick={() => setProdutoSelecionado(null)}
                className="w-9 h-9 rounded-full bg-white border border-azul-principal/15 flex items-center justify-center text-azul-muted hover:border-azul-principal transition-colors shrink-0 ml-4"
              >
                <X size={16} />
              </button>
            </div>

            {/* Blocos de info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {produtoSelecionado.ingredientes && (
                <div className="bg-white rounded-2xl p-4 border border-azul-principal/10">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-azul-principal mb-2">Ingredientes</p>
                  <p className="text-xs text-azul-muted font-light leading-relaxed">{produtoSelecionado.ingredientes}</p>
                </div>
              )}
              {produtoSelecionado.modoDeUso && (
                <div className="bg-white rounded-2xl p-4 border border-azul-principal/10">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-azul-principal mb-2">Modo de uso</p>
                  <p className="text-xs text-azul-muted font-light leading-relaxed">{produtoSelecionado.modoDeUso}</p>
                </div>
              )}
              {produtoSelecionado.descricaoCompleta && (
                <div className="bg-white rounded-2xl p-4 border border-azul-principal/10 sm:col-span-2">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-azul-principal mb-2">Descrição completa</p>
                  <p className="text-xs text-azul-muted font-light leading-relaxed">{produtoSelecionado.descricaoCompleta}</p>
                </div>
              )}
            </div>

            {/* Peso */}
            <div className="flex justify-between items-center mb-5">
              {produtoSelecionado.peso && (
                <span className="text-xs text-azul-muted font-light">{produtoSelecionado.peso}</span>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${contatosDaMarca.whatsapp}?text=${mensagemWhatsApp(produtoSelecionado)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-azul-principal text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-azul-escuro transition-colors text-center"
              >
                Pedir pelo WhatsApp
              </a>
              <button
                onClick={() => setProdutoSelecionado(null)}
                className="flex-1 border border-azul-principal/25 text-azul-muted px-6 py-3 rounded-full text-sm font-light hover:border-azul-principal transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Produtos