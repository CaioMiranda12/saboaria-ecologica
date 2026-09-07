import CardProduto from '@/components/CardProduto'
import { listaDeProdutos } from '@/data/produtos'
import { historiaDaMarca, contatosDaMarca } from '@/data/marca'
import Link from 'next/link'

const pilaresInstitucionais = [
  { titulo: 'Missão', texto: historiaDaMarca.missao },
  { titulo: 'Visão', texto: historiaDaMarca.visao },
  { titulo: 'Valores', texto: historiaDaMarca.valores },
]

const etapasDoProcesso = [
  { numero: '1', titulo: 'Coleta do óleo', texto: 'Óleo saturado de frituras é coletado de residências e estabelecimentos locais.' },
  { numero: '2', titulo: 'Processamento', texto: 'O óleo passa por filtragem e tratamento artesanal com ingredientes naturais.' },
  { numero: '3', titulo: 'Produção artesanal', texto: 'Fabricação manual com cuidado, em embalagens sustentáveis e biodegradáveis.' },
  { numero: '4', titulo: 'Impacto social', texto: 'Geração de renda local e educação ambiental nas comunidades parceiras.' },
]

const Home = () => {
  return (
    <div className="bg-creme text-[#1a2e1f]">

      {/* Hero */}
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-20">
        <div className="flex flex-col justify-center px-6 md:px-20 py-16 md:py-20">
          <span className="inline-flex items-center gap-2 bg-verde-claro text-verde-principal px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest mb-8 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-verde-medio" />
            Negócio social sustentável
          </span>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight text-verde-principal mb-6">
            Limpeza que<br />
            <em className="text-verde-medio">cuida do planeta</em>
          </h1>
          <p className="text-verde-muted text-base md:text-lg leading-relaxed font-light max-w-md mb-10">
            Transformamos óleo de fritura em produtos de limpeza biodegradáveis, gerando renda em comunidades e preservando o meio ambiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link
              href="/produtos"
              className="bg-verde-principal text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-verde-escuro transition-all hover:-translate-y-0.5 text-center"
            >
              Ver produtos
            </Link>
            <Link
              href="/sobre"
              className="text-verde-principal text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              Nossa história →
            </Link>
          </div>
        </div>
        <div className="relative bg-verde-principal flex items-center justify-center overflow-hidden min-h-64 md:min-h-0">
          <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#fff,#fff_1px,transparent_1px,transparent_30px)]" />
          <img src='/logo.png' alt="Saboaria Ecológica" />
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 border-y border-verde-medio/15">
        {[
          { num: '2023', label: 'Fundada com propósito social' },
          { num: '4+', label: 'Produtos biodegradáveis' },
          { num: '0%', label: 'Óleo de fritura no esgoto' },
        ].map((stat, i) => (
          <div key={i} className={`py-8 md:py-10 text-center ${i < 2 ? 'border-r border-verde-medio/15' : ''}`}>
            <p className="font-serif text-2xl md:text-4xl font-bold text-verde-medio mb-1">{stat.num}</p>
            <p className="text-[10px] md:text-xs text-verde-muted font-light px-1 leading-relaxed">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sobre */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 px-6 md:px-20 py-16 md:py-24 bg-white border-t border-verde-medio/10">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-verde-medio mb-3">Quem somos</p>
          <h2 className="font-serif text-3xl md:text-4xl text-verde-principal leading-tight mb-5">
            Um movimento de <em className="text-verde-medio">consciência ambiental</em>
          </h2>
          <p className="text-verde-muted leading-relaxed font-light mb-8">
            Mais do que uma saboaria, representamos o empoderamento de mulheres em comunidades vulneráveis através da economia circular e da produção artesanal responsável.
          </p>
          <div className="flex flex-col gap-4">
            {pilaresInstitucionais.map((pilar) => (
              <div
                key={pilar.titulo}
                className="flex gap-4 items-start p-4 rounded-xl border border-verde-medio/10 hover:border-verde-medio hover:bg-verde-claro transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-verde-claro flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-verde-medio" />
                </div>
                <div>
                  <p className="text-sm font-medium text-verde-principal mb-1">{pilar.titulo}</p>
                  <p className="text-xs text-verde-muted leading-relaxed font-light">{pilar.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="drop-shadow-xl">
          <img
            src='/economia-circular.jpg'
            alt="Economia Circular"
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      {/* Produtos */}
      <section className="px-6 md:px-20 py-16 md:py-24 bg-creme">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-verde-medio mb-3">Nossos produtos</p>
            <h2 className="font-serif text-3xl md:text-4xl text-verde-principal">
              Limpeza <em className="text-verde-medio">natural</em> para cada necessidade
            </h2>
          </div>
          <Link
            href="/produtos"
            className="text-verde-principal text-sm font-medium hover:gap-2 flex items-center gap-1 transition-all shrink-0 hover:text-verde-escuro"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listaDeProdutos.slice(0, 4).map((produto) => (
            <CardProduto key={produto.id} produto={produto} />
          ))}
        </div>
      </section>

      {/* Processo */}
      <section className="px-6 md:px-20 py-16 md:py-24 bg-white border-t border-verde-medio/10">
        <p className="text-xs font-medium tracking-widest uppercase text-verde-medio mb-3">Como fazemos</p>
        <h2 className="font-serif text-3xl md:text-4xl text-verde-principal mb-10 md:mb-12">
          Do resíduo ao produto <em className="text-verde-medio">sustentável</em>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {etapasDoProcesso.map((etapa, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full bg-verde-claro border-2 border-verde-medio/20 flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-xl font-bold text-verde-principal">{etapa.numero}</span>
              </div>
              <h3 className="text-sm font-medium text-verde-principal mb-2">{etapa.titulo}</h3>
              <p className="text-xs text-verde-muted leading-relaxed font-light">{etapa.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-20 py-16 md:py-24 bg-verde-principal text-center flex flex-col items-center">
        <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
          Faça parte <em className="text-white/50">desse movimento</em>
        </h2>
        <p className="text-white/60 font-light mb-10 max-w-md leading-relaxed">
          Entre em contato e saiba como adquirir nossos produtos ou como contribuir com a nossa causa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href={`https://wa.me/${contatosDaMarca.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-verde-principal px-8 py-3.5 rounded-full text-sm font-medium hover:bg-verde-claro transition-colors text-center"
          >
            Pedir pelo WhatsApp
          </a>
          <a
            href={`https://instagram.com/${contatosDaMarca.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="border border-white/30 text-white px-8 py-3.5 rounded-full text-sm font-light hover:border-white hover:bg-white/10 transition-colors text-center"
          >
            @saboariaecologica
          </a>
        </div>
      </section>

    </div>
  )
}

export default Home