import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { isCmsPageSlug } from "@/constants/cms-pages";
import { cmsPageUpdateSchema } from "@/schemas/cms.schema";
import { getCmsPage, saveCmsPage } from "@/services/cms.service";

type Context = { params: Promise<{ slug: string }> };
async function authorize(context: Context) {
  const { slug } = await context.params;
  return { slug, authorized: Boolean(await getAdminSession()) };
}
export async function GET(_request: Request, context: Context) {
  const { slug, authorized } = await authorize(context);
  if (!authorized) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  if (!isCmsPageSlug(slug)) return NextResponse.json({ message: "Página não encontrada" }, { status: 404 });
  try { return NextResponse.json({ page: await getCmsPage(slug) }); }
  catch (error) { console.error("CMS get:", error); return NextResponse.json({ message: "Erro ao carregar página" }, { status: 500 }); }
}
export async function PUT(request: Request, context: Context) {
  const { slug, authorized } = await authorize(context);
  if (!authorized) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  if (!isCmsPageSlug(slug)) return NextResponse.json({ message: "Página não encontrada" }, { status: 404 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ message: "JSON inválido" }, { status: 400 }); }
  const parsed = cmsPageUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Dados inválidos", errors: parsed.error.flatten() }, { status: 400 });
  try { return NextResponse.json({ page: await saveCmsPage(slug, parsed.data) }); }
  catch (error) { console.error("CMS save:", error); return NextResponse.json({ message: "Erro ao salvar página" }, { status: 500 }); }
}
