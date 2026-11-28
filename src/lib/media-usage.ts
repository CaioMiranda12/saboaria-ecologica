import type { Prisma } from "@prisma/client";
import { isCmsPageSlug } from "@/constants/cms-pages";
import { containsMedia, type MediaIdentity, type MediaReference } from "@/lib/media-references";

export async function findMediaUsage(db: Prisma.TransactionClient, asset: MediaIdentity) {
  const [products, team, partners, seo, pages, legacy] = await Promise.all([
    db.product.findMany({
      select: {
        id: true,
        mainName: true,
        imageUrl: true,
        fullDescription: true,
        shortDescription: true,
        usageInstructions: true,
        ingredients: true,
        variants: true,
        purchaseUrl: true,
      },
    }),
    db.teamMember.findMany({ select: { id: true, name: true, imageUrl: true, bio: true } }),
    db.partnership.findMany({ select: { name: true, logoUrl: true } }),
    db.pageSeo.findMany(),
    db.cmsPage.findMany({
      select: {
        slug: true,
        title: true,
        sections: { select: { content: true } },
        publication: { select: { sections: true } },
        versions: { select: { sections: true, createdAt: true } },
      },
    }),
    db.siteContent.findMany(),
  ]);
  const usages: MediaReference[] = [];
  const add = (label: string, href: string) => usages.push({ label, href });
  for (const p of products)
    if (containsMedia(p, asset))
      add(`Produto: ${p.mainName}`, `/admin/produtos/${encodeURIComponent(p.id)}`);
  for (const p of team)
    if (containsMedia(p, asset))
      add(`Equipe: ${p.name}`, `/admin/equipe/${encodeURIComponent(p.id)}`);
  for (const p of partners)
    if (containsMedia(p, asset)) add(`Parceria: ${p.name}`, "/admin/parcerias");
  for (const p of seo) if (containsMedia(p, asset)) add(`SEO: ${p.path}`, "/admin/seo");
  for (const p of pages) {
    const href = isCmsPageSlug(p.slug) ? `/admin/paginas/${p.slug}` : "/admin/paginas";
    if (containsMedia(p.sections, asset)) add(`${p.title} — rascunho`, href);
    if (containsMedia(p.publication, asset)) add(`${p.title} — versão publicada`, href);
    const count = p.versions.filter((v) => containsMedia(v.sections, asset)).length;
    if (count) add(`${p.title} — histórico (${count} versão/versões)`, href);
  }
  if (containsMedia(legacy, asset)) add("Conteúdo legado (somente leitura)", "/admin/conteudo");
  return usages;
}
