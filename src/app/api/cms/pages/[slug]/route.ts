import { NextResponse } from "next/server";
import { isCmsPageSlug } from "@/constants/cms-pages";
import { getPublicCmsSections } from "@/services/cms.service";

type Context = { params: Promise<{ slug: string }> };
export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  if (!isCmsPageSlug(slug))
    return NextResponse.json({ message: "Página não encontrada" }, { status: 404 });
  try {
    return NextResponse.json({ slug, sections: await getPublicCmsSections(slug) });
  } catch (error) {
    console.error("CMS public:", error);
    return NextResponse.json({ message: "Erro ao carregar conteúdo" }, { status: 500 });
  }
}
