import PublicImage from "@/components/PublicImage";
import { pageMetadata } from "@/lib/seo";
import CardProduto from "@/components/CardProduto";
import { listaDeProdutos } from "@/data/produtos";
import { historiaDaMarca, contatosDaMarca } from "@/data/marca";
import Link from "next/link";
import { getPublicCmsSections } from "@/services/cms.service";

const etapasDoProcesso = [
  {
    numero: "1",
    titulo: "Coleta do óleo",
    texto: "Óleo saturado de frituras é coletado de residências e estabelecimentos locais.",
  },
  {
    numero: "2",
    titulo: "Processamento",
    texto: "O óleo passa por filtragem e tratamento artesanal com ingredientes naturais.",
  },
  {
    numero: "3",
    titulo: "Produção artesanal",
    texto: "Fabricação manual com cuidado, em embalagens sustentáveis e biodegradáveis.",
  },
  {
    numero: "4",
    titulo: "Impacto social",
    texto: "Geração de renda local e educação ambiental nas comunidades parceiras.",
  },
];

export const dynamic = "force-dynamic";
const Home = async () => {
  // A página mantém o conteúdo original caso o CMS ainda não tenha sido inicializado.
  let cms: Awaited<ReturnType<typeof getPublicCmsSections>> = [];
  try {
    cms = await getPublicCmsSections("inicio");
  } catch (error) {
    console.error("CMS da home indisponível:", error);
  }
  const hero = cms.find((s) => s.key === "hero");
  const about = cms.find((s) => s.key === "sobre");
  const field = (section: typeof hero, key: string, fallback: string) => {
    const value =
      section?.content && typeof section.content === "object" && !Array.isArray(section.content)
        ? (section.content as Record<string, unknown>)[key]
        : undefined;
    return typeof value === "string" ? value : fallback;
  };
  const heroTitle = field(hero, "title", "Limpeza que cuida do planeta");
  const aboutTitle = field(about, "title", "Um movimento de consciência ambiental");
  const heroImage = field(hero, "imageUrl", "/logo.png");
  const aboutImage = field(about, "imageUrl", "/economia-circular.jpg");
  const pilares = [
    { titulo: "Missão", texto: field(about, "mission", historiaDaMarca.missao) },
    { titulo: "Visão", texto: field(about, "vision", historiaDaMarca.visao) },
    { titulo: "Valores", texto: field(about, "values", historiaDaMarca.valores) },
  ];
  return (
    <div className="bg-creme text-[#1a2e1f]">
      {/* Hero */}
      {(!hero || hero.enabled) && (
        <section className="grid min-h-screen grid-cols-1 pt-20 md:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 md:py-20 lg:px-20">
            <span className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-verde-claro px-4 py-2 text-xs font-medium tracking-widest text-verde-principal uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-verde-medio" />
              Negócio social sustentável
            </span>
            <h1 className="mb-6 font-serif text-4xl leading-tight text-verde-principal md:text-6xl">
              {heroTitle}
            </h1>
            <p className="mb-10 max-w-md text-base leading-relaxed font-light text-verde-muted md:text-lg">
              {field(
                hero,
                "description",
                "Transformamos óleo de fritura em produtos de limpeza biodegradáveis, gerando renda em comunidades e preservando o meio ambiente.",
              )}
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/produtos"
                className="rounded-full bg-verde-principal px-8 py-3.5 text-center text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-verde-escuro"
              >
                {field(hero, "primaryButton", "Ver produtos")}
              </Link>
              <Link
                href="/sobre"
                className="flex items-center gap-1 text-sm font-medium text-verde-principal transition-all hover:gap-2"
              >
                {field(hero, "secondaryButton", "Nossa história")} →
              </Link>
            </div>
          </div>
          <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-verde-principal md:min-h-0">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#fff,#fff_1px,transparent_1px,transparent_30px)] opacity-5" />
            <PublicImage
              priority
              src={heroImage}
              alt="Saboaria Ecológica"
              className="max-h-[420px] w-full object-contain"
            />
          </div>
        </section>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 border-y border-verde-medio/15 sm:grid-cols-3">
        {[
          { num: "2023", label: "Fundada com propósito social" },
          { num: "4+", label: "Produtos biodegradáveis" },
          { num: "0%", label: "Óleo de fritura no esgoto" },
        ].map((stat, i) => (
          <div
            key={i}
            className={`py-8 text-center md:py-10 ${i < 2 ? "border-r border-verde-medio/15" : ""}`}
          >
            <p className="mb-1 font-serif text-2xl font-bold text-verde-medio md:text-4xl">
              {stat.num}
            </p>
            <p className="px-1 text-[10px] leading-relaxed font-light text-verde-muted md:text-xs">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Sobre */}
      {(!about || about.enabled) && (
        <section className="grid grid-cols-1 gap-10 border-t border-verde-medio/10 bg-white px-6 py-16 md:grid-cols-2 md:py-24 lg:gap-24 lg:px-20">
          <div>
            <p className="mb-3 text-xs font-medium tracking-widest text-verde-medio uppercase">
              Quem somos
            </p>
            <h2 className="mb-5 font-serif text-3xl leading-tight text-verde-principal md:text-4xl">
              {aboutTitle}
            </h2>
            <p className="mb-8 leading-relaxed font-light text-verde-muted">
              {field(
                about,
                "description",
                "Mais do que uma saboaria, representamos o empoderamento de mulheres em comunidades vulneráveis através da economia circular e da produção artesanal responsável.",
              )}
            </p>
            <div className="flex flex-col gap-4">
              {pilares.map((pilar) => (
                <div
                  key={pilar.titulo}
                  className="flex items-start gap-4 rounded-xl border border-verde-medio/10 p-4 transition-all hover:border-verde-medio hover:bg-verde-claro"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-verde-claro">
                    <span className="h-2 w-2 rounded-full bg-verde-medio" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-verde-principal">{pilar.titulo}</p>
                    <p className="text-xs leading-relaxed font-light text-verde-muted">
                      {pilar.texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="drop-shadow-xl">
            <PublicImage
              src={aboutImage}
              alt="Economia Circular"
              className="h-full w-full object-contain"
            />
          </div>
        </section>
      )}

      {/* Produtos */}
      <section className="bg-creme px-6 py-16 md:py-24 lg:px-20">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end md:mb-12">
          <div>
            <p className="mb-3 text-xs font-medium tracking-widest text-verde-medio uppercase">
              Nossos produtos
            </p>
            <h2 className="font-serif text-3xl text-verde-principal md:text-4xl">
              Limpeza <em className="text-verde-medio">natural</em> para cada necessidade
            </h2>
          </div>
          <Link
            href="/produtos"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-verde-principal transition-all hover:gap-2 hover:text-verde-escuro"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {listaDeProdutos.slice(0, 4).map((produto) => (
            <CardProduto key={produto.id} produto={produto} />
          ))}
        </div>
      </section>

      {/* Processo */}
      <section className="border-t border-verde-medio/10 bg-white px-6 py-16 md:py-24 lg:px-20">
        <p className="mb-3 text-xs font-medium tracking-widest text-verde-medio uppercase">
          Como fazemos
        </p>
        <h2 className="mb-10 font-serif text-3xl text-verde-principal md:mb-12 md:text-4xl">
          Do resíduo ao produto <em className="text-verde-medio">sustentável</em>
        </h2>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {etapasDoProcesso.map((etapa, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-verde-medio/20 bg-verde-claro">
                <span className="font-serif text-xl font-bold text-verde-principal">
                  {etapa.numero}
                </span>
              </div>
              <h3 className="mb-2 text-sm font-medium text-verde-principal">{etapa.titulo}</h3>
              <p className="text-xs leading-relaxed font-light text-verde-muted">{etapa.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center bg-verde-principal px-6 py-16 text-center md:py-24 lg:px-20">
        <h2 className="mb-4 font-serif text-4xl text-white md:text-5xl">
          Faça parte <em className="text-white/85">desse movimento</em>
        </h2>
        <p className="mb-10 max-w-md leading-relaxed font-light text-white/85">
          Entre em contato e saiba como adquirir nossos produtos ou como contribuir com a nossa
          causa.
        </p>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <a
            href={`https://wa.me/${contatosDaMarca.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-8 py-3.5 text-center text-sm font-medium text-verde-principal transition-colors hover:bg-verde-claro"
          >
            Pedir pelo WhatsApp
          </a>
          <a
            href={`https://instagram.com/${contatosDaMarca.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/30 px-8 py-3.5 text-center text-sm font-light text-white transition-colors hover:border-white hover:bg-white/10"
          >
            @saboariaecologica
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;

export async function generateMetadata() {
  return pageMetadata("/");
}
