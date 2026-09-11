import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_ID } from "@/constants/site-content";
import type { Prisma } from "@prisma/client";

export function findSiteContent() {
  return prisma.siteContent.findUnique({ where: { id: SITE_CONTENT_ID } });
}

export function upsertSiteContent(data: Omit<Prisma.SiteContentCreateInput, "id">) {
  return prisma.siteContent.upsert({
    where: { id: SITE_CONTENT_ID },
    update: data,
    create: { id: SITE_CONTENT_ID, ...data },
  });
}