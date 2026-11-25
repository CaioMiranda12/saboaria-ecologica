import PublicImage from "@/components/PublicImage";
import { pageMetadata } from "@/lib/seo";
import { publicSection, cmsText } from "@/lib/cms-public";
import Link from "next/link";
import EtapaTimeline from "@/components/EtapaTimeline";
import {
  etapasDoProcessoNatural,
  ingredientesDosProdutos,
  principiosDeProducao,
} from "@/data/processo";
import { contatosDaMarca } from "@/data/marca";

const numerosDoProcesso = [
  { valor: "100%", label: "Produção artesanal" },
  { valor: "0%", label: "Resíduos descartados incorretamente" },
  { valor: "2 anos", label: "Validade dos produtos" },
];

const Processo = async () => {
  const section = await publicSection("processo", "etapas");
  const content = section?.content ?? {};
  return (
    <div className="bg-creme text-[#1a2e1f]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-verde-principal px-5 pt-24 pb-16 md:pt-28 md:pb-20 lg:px-20">
        <div className="absolute -top-15 -right-15 h-72 w-72 rounded-full bg-white/4 md:h-96 md:w-96" />
        <div className="flex items-center justify-between">
          <div className="relative z-10 max-w-2xl">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium tracking-widest text-white/80 uppercase">
              Como produzimos
            </span>
            <h1 className="mb-4 font-serif text-4xl leading-tight text-white md:text-5xl">
              {cmsText(content.title, "Do resíduo ao produto sustentável")}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed font-light text-white/65 md:text-base">
              {cmsText(
                content.description,
                "Cada produto nasce de um processo artesanal responsável, que transforma óleo saturado de fritura em limpeza eficaz e biodegradável, sem agredir o meio ambiente.",
              )}
            </p>
          </div>
          <PublicImage
            priority
            maxWidth={800}
            src="/logo.png"
            alt="Saboaria Ecológica"
            className="h-full w-1/2 max-w-100 object-contain"
          />
          <div />
        </div>
      </section>

      {/* Números */}
      <div className="grid grid-cols-1 border-b border-verde-principal/12 bg-white md:grid-cols-3">
        {numerosDoProcesso.map((item, i) => (
          <div
            key={item.valor}
            className={`py-8 text-center md:py-10 ${
              i < numerosDoProcesso.length - 1
                ? "border-b border-verde-principal/12 md:border-r md:border-b-0"
                : ""
            }`}
          >
            <p className="mb-1 font-serif text-3xl font-bold text-verde-principal md:text-4xl">
              {item.valor}
            </p>
            <p className="text-xs font-light text-verde-muted">{item.label}</p>
          </div>
        ))}
      </div>

      {Array.isArray(content.steps) && content.steps.length > 0 && (
        <div className="bg-white px-5 py-8 lg:px-20">
          <h2 className="mb-4 font-serif text-2xl text-verde-principal">Resumo das etapas</h2>
          <ol className="grid gap-3 md:grid-cols-4">
            {content.steps
              .filter((step): step is string => typeof step === "string")
              .map((step, i) => (
                <li key={i} className="rounded-xl bg-verde-claro p-4 text-sm text-verde-principal">
                  <strong>{i + 1}.</strong> {step}
                </li>
              ))}
          </ol>
        </div>
      )}
      {/* Timeline de etapas */}
      <section className="bg-creme px-5 py-16 md:py-20 lg:px-20">
        <p className="mb-2 text-xs font-medium tracking-widest text-verde-principal uppercase">
          Passo a passo
        </p>
        <h2 className="mb-10 font-serif text-3xl leading-tight text-verde-principal md:mb-12 md:text-4xl">
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
      <section className="border-t border-verde-principal/10 bg-white px-5 py-16 md:py-20 lg:px-20">
        <p className="mb-2 text-xs font-medium tracking-widest text-verde-principal uppercase">
          Nossos princípios
        </p>
        <h2 className="mb-10 font-serif text-3xl leading-tight text-verde-principal md:text-4xl">
          O que guia cada <em className="text-verde-medio">decisão de produção</em>
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {principiosDeProducao.map((principio) => (
            <div
              key={principio.titulo}
              className="rounded-2xl border border-verde-principal/10 p-5 transition-all hover:border-verde-principal hover:bg-verde-claro md:p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-verde-claro">
                <span className="h-2 w-2 rounded-full bg-verde-principal" />
              </div>
              <h3 className="mb-2 text-sm font-medium text-verde-principal">{principio.titulo}</h3>
              <p className="text-xs leading-relaxed font-light text-verde-muted">
                {principio.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ingredientes */}
      <section className="border-t border-verde-principal/10 bg-creme px-5 py-16 md:py-20 lg:px-20">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="mb-2 text-xs font-medium tracking-widest text-verde-principal uppercase">
              Ingredientes
            </p>
            <h2 className="mb-3 font-serif text-3xl leading-tight text-verde-principal md:text-4xl">
              O que entra em cada <em className="text-verde-medio">produto</em>
            </h2>
            <p className="mb-6 text-sm leading-relaxed font-light text-verde-muted">
              Ingredientes simples, naturais e biodegradáveis. Nada supérfluo, tudo com propósito.
            </p>
            <div className="flex flex-col gap-3">
              {ingredientesDosProdutos.map((ing) => (
                <div
                  key={ing.nome}
                  className="flex items-center gap-4 rounded-xl border border-verde-principal/10 bg-white px-4 py-3"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-verde-principal" />
                  <div>
                    <p className="text-sm font-medium text-verde-principal">{ing.nome}</p>
                    <p className="text-xs font-light text-verde-muted">{ing.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-verde-principal p-8 md:p-12">
            {[
              { valor: "25mil L", label: "de água preservados por litro de óleo reutilizado" },
              { valor: "100%", label: "dos ingredientes são biodegradáveis" },
              { valor: "2 anos", label: "de validade com qualidade preservada" },
            ].map((stat) => (
              <div key={stat.valor} className="rounded-2xl border border-white/15 bg-white/10 p-5">
                <p className="mb-1 font-serif text-3xl font-bold text-white">{stat.valor}</p>
                <p className="text-sm font-light text-white/65">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center bg-verde-principal px-5 py-16 text-center md:py-20 lg:px-20">
        <h2 className="mb-3 font-serif text-3xl text-white md:text-4xl">
          Conheça os <em className="text-white/85">produtos</em>
        </h2>
        <p className="mb-8 max-w-md text-sm leading-relaxed font-light text-white/85">
          Cada item é resultado desse processo cuidadoso. Veja o que produzimos para a sua casa e o
          planeta.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/produtos"
            className="rounded-full bg-white px-8 py-3 text-center text-sm font-medium text-verde-principal transition-colors hover:bg-verde-claro"
          >
            Ver produtos
          </Link>
          <a
            href={`https://wa.me/${contatosDaMarca.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/30 px-8 py-3 text-center text-sm font-light text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Falar pelo WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default Processo;

export async function generateMetadata() {
  return pageMetadata("/processo");
}
