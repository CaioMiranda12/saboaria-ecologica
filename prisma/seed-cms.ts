import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { CMS_PAGES, type CmsPageSlug } from "../src/constants/cms-pages";
import { historiaDaMarca, contatosDaMarca } from "../src/data/marca";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada");
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) });

const sections: Partial<Record<CmsPageSlug, Array<{ key: string; title: string; position: number; content: Prisma.InputJsonObject }>>> = {
  inicio: [
    { key: "hero", title: "Banner principal", position: 0, content: { title: "Limpeza que cuida do planeta", description: "Transformamos óleo de fritura em produtos de limpeza biodegradáveis, gerando renda em comunidades e preservando o meio ambiente.", primaryButton: "Ver produtos", secondaryButton: "Nossa história", imageUrl: "/logo.png" } },
    { key: "sobre", title: "Quem somos", position: 1, content: { title: "Um movimento de consciência ambiental", description: "Mais do que uma saboaria, representamos o empoderamento de mulheres em comunidades vulneráveis através da economia circular e da produção artesanal responsável.", mission: historiaDaMarca.missao, vision: historiaDaMarca.visao, values: historiaDaMarca.valores, imageUrl: "/economia-circular.jpg" } },
  ],
  sobre: [{ key: "institucional", title: "Apresentação institucional", position: 0, content: { description: historiaDaMarca.descricao, mission: historiaDaMarca.missao, vision: historiaDaMarca.visao, values: historiaDaMarca.valores, foundedYear: historiaDaMarca.fundacao } }],
  processo: [{ key: "etapas", title: "Etapas do processo", position: 0, content: { steps: ["Coleta do óleo", "Processamento", "Produção artesanal", "Impacto social"] } }],
  equipe: [{ key: "introducao", title: "Apresentação da equipe", position: 0, content: { title: "Nossa equipe" } }],
  contato: [{ key: "contatos", title: "Informações de contato", position: 0, content: { whatsapp: contatosDaMarca.whatsapp, instagram: contatosDaMarca.instagram, email: contatosDaMarca.email, linkedin: contatosDaMarca.linkedin, address: contatosDaMarca.endereco } }],
};

async function main() {
  for (const slug of Object.keys(CMS_PAGES) as CmsPageSlug[]) {
    const page = await prisma.cmsPage.upsert({
      where: { slug }, create: { slug, title: CMS_PAGES[slug] }, update: {},
    });
    for (const section of sections[slug] ?? []) {
      await prisma.cmsSection.upsert({
        where: { pageId_key: { pageId: page.id, key: section.key } },
        create: { ...section, pageId: page.id, enabled: true },
        update: {}, // Nunca sobrescrever conteúdo já editado.
      });
    }
    console.log(`Página preparada: ${slug}`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
