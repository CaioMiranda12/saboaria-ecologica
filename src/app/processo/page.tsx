import Link from 'next/link'
import EtapaTimeline from '@/components/EtapaTimeline'
import {
  etapasDoProcessoNatural,
  ingredientesDosProdutos,
  principiosDeProducao,
} from '@/data/processo'
import { contatosDaMarca } from '@/data/marca'

const numerosDoProcesso = [
  { valor: '100%', label: 'Produção artesanal' },
  { valor: '0%', label: 'Resíduos descartados incorretamente' },
  { valor: '2 anos', label: 'Validade dos produtos' },
]

const Processo = () => {
  return (
    <div className="bg-creme text-[#1a2e1f]">

      {/* Hero */}
      <section className="bg-verde-principal pt-24 md:pt-28 pb-16 md:pb-20 px-5 md:px-20 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-72 md:w-96 h-72 md:h-96 rounded-full bg-white/[0.04]" />
        <div className="flex justify-between items-center">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest mb-5 w-fit">
              Como produzimos
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-4">
              Do resíduo ao produto<br />
              <em className="text-white/50">sustentável</em>
            </h1>
            <p className="text-white/65 font-light leading-relaxed text-sm md:text-base max-w-xl">
              Cada produto nasce de um processo artesanal responsável, que transforma óleo saturado de fritura em limpeza eficaz e biodegradável, sem agredir o meio ambiente.
            </p>
          </div>
          <img
            src="/logo.png"
            alt="Saboaria Ecológica"
            className="max-w-100 w-1/2 h-full object-contain"
          />
          <div />
        </div>
      </section>

      {/* Números */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-white border-b border-verde-principal/12">
        {numerosDoProcesso.map((item, i) => (
          <div
            key={item.valor}
            className={`py-8 md:py-10 text-center ${i < numerosDoProcesso.length - 1
              ? 'border-b md:border-b-0 md:border-r border-verde-principal/12'
              : ''
              }`}
          >
            <p className="font-serif text-3xl md:text-4xl font-bold text-verde-principal mb-1">{item.valor}</p>
            <p className="text-xs text-verde-muted font-light">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline de etapas */}
      <section className="px-5 md:px-20 py-16 md:py-20 bg-creme">
        <p className="text-xs font-medium tracking-widest uppercase text-verde-principal mb-2">Passo a passo</p>
        <h2 className="font-serif text-3xl md:text-4xl text-verde-principal mb-10 md:mb-12 leading-tight">
          As etapas do nosso <em className="text-verde-medio">processo natural</em>
        </h2>
        <div>
          {etapasDoProcessoNatural.map((etapa, i) => (
            <EtapaTimeline
              key={etapa.numero}
              etapa={etapa}
              ultima={i === etapasDoProcessoNatural.length - 1}
            />
          ))}
        </div>
      </section>

      {/* Princípios */}
      <section className="px-5 md:px-20 py-16 md:py-20 bg-white border-t border-verde-principal/10">
        <p className="text-xs font-medium tracking-widest uppercase text-verde-principal mb-2">Nossos princípios</p>
        <h2 className="font-serif text-3xl md:text-4xl text-verde-principal mb-10 leading-tight">
          O que guia cada <em className="text-verde-medio">decisão de produção</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {principiosDeProducao.map((principio) => (
            <div
              key={principio.titulo}
              className="p-5 md:p-7 rounded-2xl border border-verde-principal/10 hover:border-verde-principal hover:bg-verde-claro transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-verde-claro flex items-center justify-center mb-4">
                <span className="w-2 h-2 rounded-full bg-verde-principal" />
              </div>
              <h3 className="text-sm font-medium text-verde-principal mb-2">{principio.titulo}</h3>
              <p className="text-xs text-verde-muted leading-relaxed font-light">{principio.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ingredientes */}
      <section className="px-5 md:px-20 py-16 md:py-20 bg-creme border-t border-verde-principal/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-verde-principal mb-2">Ingredientes</p>
            <h2 className="font-serif text-3xl md:text-4xl text-verde-principal mb-3 leading-tight">
              O que entra em cada <em className="text-verde-medio">produto</em>
            </h2>
            <p className="text-sm text-verde-muted font-light leading-relaxed mb-6">
              Ingredientes simples, naturais e biodegradáveis. Nada supérfluo, tudo com propósito.
            </p>
            <div className="flex flex-col gap-3">
              {ingredientesDosProdutos.map((ing) => (
                <div
                  key={ing.nome}
                  className="flex items-center gap-4 bg-white px-4 py-3 rounded-xl border border-verde-principal/10"
                >
                  <span className="w-2 h-2 rounded-full bg-verde-principal flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-verde-principal">{ing.nome}</p>
                    <p className="text-xs text-verde-muted font-light">{ing.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-verde-principal rounded-3xl p-8 md:p-12 flex flex-col gap-4">
            {[
              { valor: '25mil L', label: 'de água preservados por litro de óleo reutilizado' },
              { valor: '100%', label: 'dos ingredientes são biodegradáveis' },
              { valor: '2 anos', label: 'de validade com qualidade preservada' },
            ].map((stat) => (
              <div
                key={stat.valor}
                className="bg-white/10 border border-white/15 rounded-2xl p-5"
              >
                <p className="font-serif text-3xl font-bold text-white mb-1">{stat.valor}</p>
                <p className="text-white/65 text-sm font-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-20 py-16 md:py-20 bg-verde-principal flex flex-col items-center text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
          Conheça os <em className="text-white/45">produtos</em>
        </h2>
        <p className="text-white/60 font-light text-sm leading-relaxed mb-8 max-w-md">
          Cada item é resultado desse processo cuidadoso. Veja o que produzimos para a sua casa e o planeta.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/produtos"
            className="bg-white text-verde-principal px-8 py-3 rounded-full text-sm font-medium hover:bg-verde-claro transition-colors text-center"
          >
            Ver produtos
          </Link>
          <a
            href={`https://wa.me/${contatosDaMarca.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="border border-white/30 text-white px-8 py-3 rounded-full text-sm font-light hover:border-white hover:bg-white/10 transition-colors text-center"
          >
            Falar pelo WhatsApp
          </a>
        </div>
      </section>

    </div>
  )
}

export default Processo