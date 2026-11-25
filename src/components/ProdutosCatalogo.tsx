"use client";
import PublicImage from "@/components/PublicImage";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import CardProduto from "@/components/CardProduto";
import type { Produto } from "@/data/produtos";
import { contatosDaMarca } from "@/data/marca";

type FiltroTipo = "todos" | "barra" | "pasta" | "liquido" | "po";

const filtros: { valor: FiltroTipo; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "barra", label: "Barra" },
  { valor: "pasta", label: "Pasta" },
  { valor: "liquido", label: "Líquido" },
  { valor: "po", label: "Pó" },
];

type Props = {
  produtos: Produto[];
};

const ProdutosCatalogo = ({ produtos }: Props) => {
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroTipo>("todos");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!produtoSelecionado || !dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [produtoSelecionado]);

  const produtosFiltrados =
    filtroAtivo === "todos" ? produtos : produtos.filter((p) => p.tipo === filtroAtivo);

  const mensagemWhatsApp = (produto: Produto) =>
    encodeURIComponent(
      `Olá! Tenho interesse no produto *${produto.nomePrincipal}*. Pode me ajudar?`,
    );

  return (
    <div className="bg-creme text-[#1a2e1f]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-azul-principal px-6 pt-28 pb-16 md:px-20">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/4" />
        <div className="flex justify-between">
          <div className="relative z-10 max-w-xl">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium tracking-widest text-white/80 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-azul-medio" />
              Produtos artesanais
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-white md:text-5xl">
              Limpeza <em className="text-white/85">natural</em>
              <br />
              para cada uso
            </h1>
            <p className="text-base leading-relaxed font-light text-white/85">
              Todos os nossos produtos são feitos à mão com óleo reutilizado, ingredientes naturais
              e embalagens biodegradáveis.
            </p>
          </div>
          <div className="flex flex-col items-center lg:flex-row">
            <PublicImage
              src="/logo.png"
              alt="Saboaria Ecológica"
              className="h-full w-full max-w-100 object-contain md:w-1/2"
            />
            <PublicImage
              src="/logo-ellas.png"
              alt="Saboaria Ecológica"
              className="h-full w-full max-w-125 object-contain md:w-1/2"
            />
          </div>
        </div>
      </section>

      {/* Filtros */}
      <div className="sticky top-16 z-40 flex flex-wrap gap-2 border-b border-azul-principal/10 bg-white px-6 py-4 md:px-20">
        {filtros.map(({ valor, label }) => (
          <button
            key={valor}
            onClick={() => setFiltroAtivo(valor)}
            aria-pressed={filtroAtivo === valor}
            className={`rounded-full px-5 py-2 text-xs font-medium tracking-wider uppercase transition-all ${
              filtroAtivo === valor
                ? "bg-azul-principal text-white"
                : "border border-azul-principal/20 text-azul-muted hover:border-azul-principal hover:text-azul-principal"
            }`}
          >
            {label}
          </button>
        ))}
        <span role="status" className="ml-auto self-center text-xs font-light text-azul-muted">
          {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      <section className="px-6 py-12 md:px-20 md:py-16">
        {produtosFiltrados.length === 0 ? (
          <div className="py-24 text-center text-sm font-light text-azul-muted">
            Nenhum produto encontrado para esse filtro.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <dialog
          ref={dialogRef}
          aria-labelledby="produto-dialog-title"
          className="fixed inset-0 m-auto h-full max-h-none w-full max-w-none items-end justify-center bg-transparent p-0 backdrop:bg-azul-principal/60 open:flex sm:items-center sm:p-6"
          onCancel={(e) => {
            e.preventDefault();
            setProdutoSelecionado(null);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setProdutoSelecionado(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-creme p-6 sm:max-w-xl sm:rounded-3xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do modal */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  {produtoSelecionado.tipos?.map((tipo) => (
                    <span
                      key={tipo}
                      className="rounded-full bg-azul-claro px-3 py-1 text-[10px] font-medium tracking-wider text-azul-principal uppercase"
                    >
                      {tipo}
                    </span>
                  ))}
                </div>
                <h2
                  id="produto-dialog-title"
                  className="font-serif text-2xl text-azul-principal md:text-3xl"
                >
                  {produtoSelecionado.nomePrincipal}
                </h2>
                {produtoSelecionado.nomeComplemento && (
                  <p className="mt-1 text-sm font-light text-azul-muted italic">
                    {produtoSelecionado.nomeComplemento}
                  </p>
                )}
              </div>
              <button
                onClick={() => setProdutoSelecionado(null)}
                aria-label="Fechar detalhes do produto"
                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-azul-principal/15 bg-white text-azul-muted transition-colors hover:border-azul-principal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Blocos de info */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {produtoSelecionado.ingredientes && produtoSelecionado.ingredientes.length > 0 && (
                <div className="rounded-2xl border border-azul-principal/10 bg-white p-4">
                  <p className="mb-2 text-[10px] font-medium tracking-widest text-azul-principal uppercase">
                    Ingredientes
                  </p>
                  <p className="text-xs leading-relaxed font-light text-azul-muted">
                    {produtoSelecionado.ingredientes.join(", ")}
                  </p>
                </div>
              )}
              {produtoSelecionado.modoDeUso && (
                <div className="rounded-2xl border border-azul-principal/10 bg-white p-4">
                  <p className="mb-2 text-[10px] font-medium tracking-widest text-azul-principal uppercase">
                    Modo de uso
                  </p>
                  <p className="text-xs leading-relaxed font-light text-azul-muted">
                    {produtoSelecionado.modoDeUso}
                  </p>
                </div>
              )}
              {produtoSelecionado.descricaoCompleta && (
                <div className="rounded-2xl border border-azul-principal/10 bg-white p-4 sm:col-span-2">
                  <p className="mb-2 text-[10px] font-medium tracking-widest text-azul-principal uppercase">
                    Descrição completa
                  </p>
                  <p className="text-xs leading-relaxed font-light text-azul-muted">
                    {produtoSelecionado.descricaoCompleta}
                  </p>
                </div>
              )}
            </div>

            {/* Peso */}
            <div className="mb-5 flex items-center justify-between">
              {produtoSelecionado.peso && (
                <span className="text-xs font-light text-azul-muted">
                  {produtoSelecionado.peso}
                </span>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${contatosDaMarca.whatsapp}?text=${mensagemWhatsApp(produtoSelecionado)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-full bg-azul-principal px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-azul-escuro"
              >
                Pedir pelo WhatsApp
              </a>
              <button
                onClick={() => setProdutoSelecionado(null)}
                className="flex-1 rounded-full border border-azul-principal/25 px-6 py-3 text-sm font-light text-azul-muted transition-colors hover:border-azul-principal"
              >
                Fechar
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ProdutosCatalogo;
