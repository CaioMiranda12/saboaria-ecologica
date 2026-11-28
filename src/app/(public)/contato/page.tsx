import PublicImage from "@/components/PublicImage";
import { pageMetadata } from "@/lib/seo";
import { publicSection, cmsText } from "@/lib/cms-public";
import { contatosDaMarca } from "@/data/marca";
import { publicLocations } from "@/lib/locations";
import Link from "next/link";
import { LocationsPublic } from "@/components/LocationsPublic";

export const dynamic = "force-dynamic";

const canaisDeContato = [
  {
    nome: "WhatsApp",
    valor: "(85) 98705-2241",
    href: `https://wa.me/${contatosDaMarca.whatsapp}`,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#4a7c59">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.872L.057 23.571a.75.75 0 0 0 .921.921l5.699-1.487A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.523-5.204-1.431l-.374-.22-3.384.883.897-3.274-.242-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    nome: "Instagram",
    valor: "@saboariaecologica",
    href: `https://instagram.com/${contatosDaMarca.instagram}`,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="#4a7c59" />
      </svg>
    ),
  },
  {
    nome: "E-mail",
    valor: contatosDaMarca.email,
    href: `mailto:${contatosDaMarca.email}`,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    nome: "Linkedin",
    valor: "Saboaria Ecológica",
    href: `https://linkedin.com/in/${contatosDaMarca.linkedin}`,
    icone: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4a7c59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const horarioDeAtendimento = [
  { dia: "Segunda a Quinta", hora: "09h às 17h" },
  { dia: "Sexta", hora: "09h às 18h" },
  { dia: "Sábado e Domingo", hora: "Fechado" },
];

const Contato = async () => {
  const [section, locations] = await Promise.all([
    publicSection("contato", "contatos"),
    publicLocations(),
  ]);
  const content = section?.content ?? {};
  const whatsapp = cmsText(content.whatsapp, contatosDaMarca.whatsapp).replace(/\D/g, "");
  const instagram = cmsText(content.instagram, contatosDaMarca.instagram).replace(/^@/, "");
  const email = cmsText(content.email, contatosDaMarca.email);
  const linkedin = cmsText(content.linkedin, contatosDaMarca.linkedin);
  const canais = canaisDeContato.map((c) =>
    c.nome === "WhatsApp"
      ? { ...c, valor: whatsapp, href: `https://wa.me/${whatsapp}` }
      : c.nome === "Instagram"
        ? { ...c, valor: `@${instagram}`, href: `https://instagram.com/${instagram}` }
        : c.nome === "E-mail"
          ? { ...c, valor: email, href: `mailto:${email}` }
          : { ...c, href: `https://linkedin.com/in/${linkedin}` },
  );
  const hours = cmsText(content.hours, "").split("\n").filter(Boolean);
  return (
    <div className="bg-creme text-[#1a2e1f]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-verde-principal px-5 pt-24 pb-16 md:pt-28 md:pb-20 lg:px-20">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/4 md:h-96 md:w-96" />
        <div className="flex items-center justify-between">
          <div className="relative z-10 max-w-xl">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium tracking-widest text-white/80 uppercase">
              Fale com a gente
            </span>
            <h1 className="mb-4 font-serif text-4xl leading-tight text-white md:text-5xl">
              {cmsText(content.title, "Entre em contato")}
            </h1>
            <p className="text-sm leading-relaxed font-light text-white/65 md:text-base">
              {cmsText(
                content.description,
                "Tire suas dúvidas, faça seu pedido ou saiba como contribuir com a nossa causa. Estamos prontos para te atender pelos canais abaixo.",
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

      {/* Canais rápidos */}
      <div className="grid grid-cols-2 border-b border-verde-medio/10 bg-white md:grid-cols-4">
        {canais.map((canal, i) => (
          <a
            key={canal.nome}
            href={canal.href}
            target="_blank"
            rel="noreferrer"
            className={`flex flex-col items-center px-4 py-6 text-center no-underline transition-colors hover:bg-verde-claro md:py-8 ${i % 2 === 0 ? "border-r border-verde-medio/10" : ""} ${i < 2 ? "border-b border-verde-medio/10 md:border-b-0" : ""} md:border-r md:border-b-0 md:last:border-r-0`}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-verde-claro">
              {canal.icone}
            </div>
            <p className="mb-1 text-xs font-medium text-verde-principal">{canal.nome}</p>
            <p className="text-xs font-light text-verde-muted">{canal.valor}</p>
          </a>
        ))}
      </div>

      {/* Mapa + Info lateral */}
      <div className="grid grid-cols-1 border-t border-verde-medio/10 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-8 px-5 py-14 md:px-14 md:py-20">
          <div className="max-w-sm text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-verde-claro px-4 py-2 text-xs font-medium tracking-widest text-verde-principal uppercase">
              Onde estamos
            </span>
            <h2 className="mb-2 font-serif text-2xl text-verde-escuro md:text-3xl">
              Presença por todo o <em className="text-verde-principal">Brasil</em>
            </h2>
            <p className="text-sm leading-relaxed font-light text-verde-muted">
              Conheça as sedes cadastradas e veja os detalhes na página exclusiva.
            </p>
          </div>

          <LocationsPublic locations={locations} compact />
          <Link
            href="/mapa"
            className="rounded-full border border-verde-principal px-5 py-2.5 text-sm font-medium text-verde-principal hover:bg-verde-claro"
          >
            Ver mapa completo
          </Link>
        </div>

        {/* Info lateral */}
        <div className="flex flex-col gap-6 bg-verde-principal px-5 py-14 md:px-14 md:py-20">
          <div>
            <h3 className="mb-2 font-serif text-2xl text-white">Canais de atendimento</h3>
            <p className="mb-5 text-sm leading-relaxed font-light text-white/85">
              Prefere um contato direto? Escolha o canal mais conveniente para você.
            </p>
            <div className="flex flex-col gap-3">
              {canais.map((canal) => (
                <a
                  key={canal.nome}
                  href={canal.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/8 px-4 py-3 no-underline transition-colors hover:bg-white/[0.14]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <div className="[&_svg]:stroke-white/80">{canal.icone}</div>
                  </div>
                  <div>
                    <p className="mb-0.5 text-xs font-light text-white/85">{canal.nome}</p>
                    <p className="text-sm font-medium text-white">{canal.valor}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <Link
            href="/mapa"
            className="rounded-2xl border border-white/10 bg-white/6 p-5 text-center text-sm text-white hover:bg-white/10"
          >
            Consultar endereços das sedes
          </Link>

          {/* Horário */}
          <div className="rounded-2xl bg-white/6 px-5 py-4">
            <p className="mb-3 text-xs font-light tracking-widest text-white/85 uppercase">
              Horário de atendimento
            </p>
            <div className="flex flex-col divide-y divide-white/6">
              {(hours.length
                ? hours.map((line) => {
                    const [dia, ...rest] = line.split(":");
                    return { dia, hora: rest.join(":").trim() };
                  })
                : horarioDeAtendimento
              ).map((item) => (
                <div key={item.dia} className="flex items-center justify-between py-2.5">
                  <span className="text-sm font-light text-white/70">{item.dia}</span>
                  <span className="text-sm font-medium text-white">{item.hora}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;

export async function generateMetadata() {
  return pageMetadata("/contato");
}
