import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function findCmsPage(slug: string) {
  return prisma.cmsPage.findUnique({
    where: { slug },
    include: { sections: { orderBy: [{ position: "asc" }, { key: "asc" }] } },
  });
}

export function listCmsPages() {
  return prisma.cmsPage.findMany({
    select: { slug: true, title: true, updatedAt: true, _count: { select: { sections: true } } },
    orderBy: { title: "asc" },
  });
}

export async function replaceCmsSections(
  slug: string,
  title: string,
  sections: Array<{
    key: string;
    title: string;
    position: number;
    enabled: boolean;
    content: Record<string, unknown>;
  }>,
) {
  return prisma.$transaction(async (tx) => {
    const page = await tx.cmsPage.upsert({
      where: { slug },
      update: { title },
      create: { slug, title },
    });
    await tx.cmsSection.deleteMany({ where: { pageId: page.id } });
    for (const section of sections) {
      await tx.cmsSection.create({
        data: {
          pageId: page.id,
          key: section.key,
          title: section.title,
          position: section.position,
          enabled: section.enabled,
          content: section.content as Prisma.InputJsonObject,
        },
      });
    }
    return tx.cmsPage.findUniqueOrThrow({
      where: { id: page.id },
      include: { sections: { orderBy: [{ position: "asc" }, { key: "asc" }] } },
    });
  });
}
