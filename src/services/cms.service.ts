import { CMS_PAGES, type CmsPageSlug } from "@/constants/cms-pages";
import { findCmsPage, listCmsPages, replaceCmsSections } from "@/repositories/cms.repository";
import type { z } from "zod";
import type { cmsPageUpdateSchema } from "@/schemas/cms.schema";

export { listCmsPages };
export function getCmsPage(slug: CmsPageSlug) {
  return findCmsPage(slug);
}
export function saveCmsPage(slug: CmsPageSlug, values: z.infer<typeof cmsPageUpdateSchema>) {
  return replaceCmsSections(slug, CMS_PAGES[slug], values.sections);
}

// Para páginas públicas: só seções habilitadas, com fallback estático
// até os editores de conteúdo das Sprints 3 e 4 estarem prontos.
export async function getPublicCmsSections(slug: CmsPageSlug) {
  const { getPublishedSections } = await import("@/services/cms-publication.service");
  return getPublishedSections(slug);
}
