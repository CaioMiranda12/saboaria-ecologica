import Link from "next/link";
import { LocationsPublic } from "@/components/LocationsPublic";
import { publicLocations } from "@/lib/locations";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export async function generateMetadata() {
  return pageMetadata("/mapa");
}
export default async function MapaPage() {
  const locations = await publicLocations();
  return (
    <div className="flex flex-1 flex-col bg-creme text-verde-escuro">
      <section className="bg-verde-principal px-6 pt-28 pb-16 text-center text-white">
        <p className="mb-4 text-xs tracking-widest uppercase">Onde estamos</p>
        <h1 className="font-serif text-4xl md:text-5xl">Nossas sedes pelo Brasil</h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/90">
          Conheça as sedes da Saboaria Ecológica.
        </p>
      </section>
      <section className="mx-auto w-full max-w-7xl space-y-6 px-6 py-14 lg:px-12">
        <LocationsPublic locations={locations} />
        <Link
          href="/contato"
          className="inline-flex rounded-full bg-verde-principal px-6 py-3 text-sm font-medium text-white"
        >
          Fale conosco
        </Link>
      </section>
    </div>
  );
}
