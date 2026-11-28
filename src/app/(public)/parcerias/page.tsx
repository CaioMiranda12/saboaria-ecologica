import Link from "next/link";
import PublicImage from "@/components/PublicImage";
import { listPartnerships } from "@/services/partnership.service";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return pageMetadata("/parcerias");
}

export default async function ParceriasPage() {
  const parcerias = await listPartnerships();
  return (
    <div className="flex flex-1 flex-col bg-creme text-verde-escuro">
      <section className="bg-verde-principal px-6 pt-28 pb-16 text-center text-white">
        <p className="mb-4 text-xs tracking-widest uppercase">Rede de apoio</p>
        <h1 className="font-serif text-4xl md:text-5xl">Nossas parcerias</h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/90">
          Conheça as instituições que caminham junto à Saboaria Ecológica.
        </p>
      </section>
      <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-12">
        {parcerias.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {parcerias.map((parceiro) => (
              <article
                key={parceiro.id}
                className="flex flex-col items-center gap-4 rounded-2xl border border-verde-principal/15 bg-white p-6 text-center shadow-sm"
              >
                {parceiro.logoUrl ? (
                  <PublicImage
                    src={parceiro.logoUrl}
                    alt=""
                    maxWidth={320}
                    width={240}
                    height={120}
                    className="h-28 w-full object-contain"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-28 w-full items-center justify-center rounded-xl bg-verde-claro font-serif text-3xl text-verde-principal"
                  >
                    {parceiro.name.trim().slice(0, 2).toUpperCase()}
                  </div>
                )}
                <h2 className="font-semibold text-verde-escuro">{parceiro.name}</h2>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-verde-muted">
            Nenhuma parceria cadastrada no momento.
          </p>
        )}
        <div className="mt-12 text-center">
          <h2 className="mb-3 font-serif text-2xl text-verde-principal">
            Quer fazer parte dessa rede?
          </h2>
          <Link
            href="/contato"
            className="inline-flex rounded-full bg-verde-principal px-6 py-3 text-sm font-medium text-white hover:bg-verde-escuro"
          >
            Entre em contato
          </Link>
        </div>
      </section>
    </div>
  );
}
