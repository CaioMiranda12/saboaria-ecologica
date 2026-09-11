import { findSiteContent, upsertSiteContent } from "@/repositories/site-content.repository";
import type { SiteContentFormValues } from "@/schemas/site-content.schema";

export async function getSiteContent() {
  return findSiteContent();
}

export function saveSiteContent(values: SiteContentFormValues) {
  return upsertSiteContent(values);
}