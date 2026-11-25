import { cache } from "react";
import { getPublicCmsSections } from "@/services/cms.service";
import type { CmsPageSlug } from "@/constants/cms-pages";
const getSections = cache(getPublicCmsSections);
export async function publicSection(slug: CmsPageSlug, key: string): Promise<{enabled: boolean; content: Record<string, unknown>} | null> {
  try { const sections = await getSections(slug); const found = sections.find(s => s.key === key); return found ? { enabled: true, content: found.content as Record<string, unknown> } : null; }
  catch (error) { console.error("CMS fallback:", error); return null; }
}
export function cmsText(value: unknown, fallback: string): string { return typeof value === "string" ? value : fallback; }
