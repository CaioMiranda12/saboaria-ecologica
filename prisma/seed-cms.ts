import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { CMS_PAGES, type CmsPageSlug } from "../src/constants/cms-pages";
import { historiaDaMarca, contatosDaMarca } from "../src/data/marca";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada");
const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

const sections: Partial<
  Record<
    CmsPageSlug,
    Array<{ key: string; title: string; position: number; content: Prisma.InputJsonObject }>
  >
> = {
  inicio: [
    {
      key: "hero",
      title: "Banner principal",
      position: 0,
      content: {
        title: "Limpeza que cuida do planeta",
        description:
          "Transformamos óleo de fritura em produtos de limpeza biodegradáveis, gerando renda em comunidades e preservando o meio ambiente.",
        primaryButton: "Ver produtos",
        secondaryButton: "Nossa história",
        imageUrl: "/logo.png",
      },
    },
    {
      key: "sobre",
      title: "Quem somos",
      position: 1,
      content: {
        title: "Um movimento de consciência ambiental",
        description:
          "Mais do que uma saboaria, representamos o empoderamento de mulheres em comunidades vulneráveis através da economia circular e da produção artesanal responsável.",
        mission: historiaDaMarca.missao,
        vision: historiaDaMarca.visao,
        values: historiaDaMarca.valores,
        imageUrl: "/economia-circular.jpg",
      },
    },
  ],
  sobre: [
    {
      key: "institucional",
      title: "Apresentação institucional",
      position: 0,
      content: {
        title: "Mais do que uma saboaria, um movimento",
        intro: "Fundada com o propósito de transformar resíduos em soluções sustentáveis.",
        imageUrl: "/logo.png",
        description: historiaDaMarca.descricao,
        mission: historiaDaMarca.missao,
        vision: historiaDaMarca.visao,
        values: historiaDaMarca.valores,
        foundedYear: historiaDaMarca.fundacao,
      },
    },
  ],
  processo: [
    {
      key: "etapas",
      title: "Etapas do processo",
      position: 0,
      content: {
        title: "Do resíduo ao produto sustentável",
        description:
          "Cada produto nasce de um processo artesanal responsável, que transforma óleo saturado de fritura em limpeza eficaz e biodegradável, sem agredir o meio ambiente.",
        steps: ["Coleta do óleo", "Processamento", "Produção artesanal", "Impacto social"],
      },
    },
  ],
  equipe: [
    {
      key: "introducao",
      title: "Apresentação da equipe",
      position: 0,
      content: {
        title: "Nossa equipe",
        description:
          "Pessoas comprometidas com o impacto social e ambiental que move a Saboaria Ecológica.",
      },
    },
  ],
  contato: [
    {
      key: "contatos",
      title: "Informações de contato",
      position: 0,
      content: {
        title: "Entre em contato",
        description:
          "Tire suas dúvidas, faça seu pedido ou saiba como contribuir com a nossa causa. Estamos prontos para te atender pelos canais abaixo.",
        hours: "Segunda a Quinta: 09h às 17h\nSexta: 09h às 18h\nSábado e Domingo: Fechado",
        whatsapp: contatosDaMarca.whatsapp,
        instagram: contatosDaMarca.instagram,
        email: contatosDaMarca.email,
        linkedin: contatosDaMarca.linkedin,
        address: contatosDaMarca.endereco,
      },
    },
  ],
};

async function main() {
  for (const slug of Object.keys(CMS_PAGES) as CmsPageSlug[]) {
    const page = await prisma.cmsPage.upsert({
      where: { slug },
      create: { slug, title: CMS_PAGES[slug] },
      update: {},
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
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
