import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { isCmsPageSlug } from "@/constants/cms-pages";
import { getCmsVersionPreview, listCmsVersions } from "@/services/cms-publication.service";
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await getAdminSession()))
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const { slug } = await params;
  if (!isCmsPageSlug(slug))
    return NextResponse.json({ message: "Página inválida" }, { status: 404 });
  const versionId = new URL(request.url).searchParams.get("versionId");
  if (versionId !== null) {
    const version = await getCmsVersionPreview(slug, versionId);
    if (!version)
      return NextResponse.json(
        { message: "Versão indisponível para pré-visualização." },
        { status: 404 },
      );
    return NextResponse.json({ version }, { headers: { "Cache-Control": "private, no-store" } });
  }
  return NextResponse.json({ versions: await listCmsVersions(slug) });
}
