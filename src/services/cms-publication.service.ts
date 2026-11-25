import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { CMS_PAGES, type CmsPageSlug } from '@/constants/cms-pages';
import { cmsPageUpdateSchema } from '@/schemas/cms.schema';
import type { z } from 'zod';

export type SectionSnapshot = z.infer<typeof cmsPageUpdateSchema>['sections'];
const paths: Record<CmsPageSlug, string> = { inicio: '/', sobre: '/sobre', processo: '/processo', equipe: '/equipe', contato: '/contato' };

export async function getPublishedSections(slug: CmsPageSlug) {
  const page = await prisma.cmsPage.findUnique({ where: { slug }, select: { publication: { select: { sections: true } } } });
  if (!page?.publication) return [];
  const parsed = cmsPageUpdateSchema.safeParse({ sections: page.publication.sections });
  return parsed.success ? parsed.data.sections.filter(s => s.enabled) : [];
}

export type CmsActor = { adminId: string; email: string };
async function actorSnapshot(actor: CmsActor) {
  const admin = await prisma.admin.findUnique({ where: { id: actor.adminId }, select: { id: true, name: true, email: true } });
  if (!admin) throw new Error("Administrador não encontrado");
  return { actorId: admin.id, actorName: admin.name, actorEmail: admin.email };
}

export async function publishCmsPage(slug: CmsPageSlug, actor: CmsActor) {
  const page = await prisma.cmsPage.findUnique({ where: { slug }, include: { sections: { orderBy: [{ position: 'asc' }, { key: 'asc' }] } } });
  if (!page) throw new Error('Página não encontrada');
  const sections: SectionSnapshot = page.sections.map(s => ({ key: s.key, title: s.title, position: s.position, enabled: s.enabled, content: s.content as Record<string, unknown> }));
  const parsed = cmsPageUpdateSchema.parse({ sections });
  const attribution = await actorSnapshot(actor);
  await prisma.$transaction(async tx => {
    await tx.cmsPublication.upsert({ where: { pageId: page.id }, create: { pageId: page.id, sections: parsed.sections as Prisma.InputJsonArray }, update: { sections: parsed.sections as Prisma.InputJsonArray, publishedAt: new Date() } });
    await tx.cmsVersion.create({ data: { pageId: page.id, sections: parsed.sections as Prisma.InputJsonArray, ...attribution, action: "PUBLISH" } });
  });
  revalidatePath(paths[slug]);
  return { published: true };
}

export async function listCmsVersions(slug: CmsPageSlug) {
  const page = await prisma.cmsPage.findUnique({ where: { slug } });
  if (!page) return [];
  return prisma.cmsVersion.findMany({ where: { pageId: page.id }, orderBy: { createdAt: 'desc' }, take: 20, select: { id: true, createdAt: true, actorName: true, actorEmail: true, action: true, sourceVersionId: true } });
}

export async function restoreCmsVersion(slug: CmsPageSlug, versionId: string, actor: CmsActor) {
  const version = await prisma.cmsVersion.findFirst({ where: { id: versionId, page: { slug } } });
  if (!version) throw new Error('Versão não encontrada');
  const parsed = cmsPageUpdateSchema.parse({ sections: version.sections });
  const { saveCmsPage } = await import('@/services/cms.service');
  const attribution = await actorSnapshot(actor);
  await saveCmsPage(slug, parsed);
  await prisma.cmsVersion.create({ data: { pageId: version.pageId, sections: parsed.sections as Prisma.InputJsonArray, ...attribution, action: "RESTORE_DRAFT", sourceVersionId: version.id } });
  return { restored: true }; // Restoration updates the draft only; publish separately.
}
