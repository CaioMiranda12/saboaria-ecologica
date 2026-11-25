import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { isCmsPageSlug } from "@/constants/cms-pages";
import { prisma } from "@/lib/prisma";
import { cmsPageUpdateSchema } from "@/schemas/cms.schema";
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await getAdminSession()))
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const { slug } = await params;
  if (!isCmsPageSlug(slug))
    return NextResponse.json({ message: "Página inválida" }, { status: 404 });
  const page = await prisma.cmsPage.findUnique({
    where: { slug },
    include: { sections: true, publication: true },
  });
  if (!page) return NextResponse.json({ message: "Página não encontrada" }, { status: 404 });
  const draft = cmsPageUpdateSchema.safeParse({
    sections: page.sections.map((s) => ({
      key: s.key,
      title: s.title,
      position: s.position,
      enabled: s.enabled,
      content: s.content,
    })),
  });
  const published = cmsPageUpdateSchema.safeParse({ sections: page.publication?.sections ?? [] });
  const normalized = (
    sections: {
      key: string;
      title: string;
      position: number;
      enabled: boolean;
      content: Record<string, unknown>;
    }[],
  ) =>
    JSON.stringify(
      sections
        .map((s) => ({
          key: s.key,
          title: s.title,
          position: s.position,
          enabled: s.enabled,
          content: s.content,
        }))
        .sort((a, b) => a.key.localeCompare(b.key)),
    );
  const hasPublication = Boolean(page.publication);
  const hasPendingChanges =
    !hasPublication ||
    !draft.success ||
    !published.success ||
    normalized(draft.data.sections) !== normalized(published.data.sections);
  return NextResponse.json({
    hasPublication,
    hasPendingChanges,
    publishedAt: page.publication?.publishedAt ?? null,
  });
}
