import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { CMS_EDITOR_FIELDS } from "@/constants/cms-editor-fields";
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
  if (!isCmsPageSlug(slug))
    return NextResponse.json({ message: "Página não encontrada" }, { status: 404 });
  try {
    return NextResponse.json({ page: await getCmsPage(slug) });
  } catch (error) {
    console.error("CMS get:", error);
    return NextResponse.json({ message: "Erro ao carregar página" }, { status: 500 });
  }
}
export async function PUT(request: Request, context: Context) {
  const { slug, authorized } = await authorize(context);
  if (!authorized) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  if (!isCmsPageSlug(slug))
    return NextResponse.json({ message: "Página não encontrada" }, { status: 404 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }
  const parsed = cmsPageUpdateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { message: "Dados inválidos", errors: parsed.error.flatten() },
      { status: 400 },
    );
  if (slug === "inicio") {
    const allowed = new Set(["hero", "sobre"]);
    if (parsed.data.sections.some((s) => !allowed.has(s.key)))
      return NextResponse.json({ message: "Seção desconhecida" }, { status: 400 });
    for (const section of parsed.data.sections) {
      const permitted =
        section.key === "hero"
          ? ["title", "description", "primaryButton", "secondaryButton", "imageUrl"]
          : ["title", "description", "mission", "vision", "values", "imageUrl"];
      if (
        Object.keys(section.content).some((k) => !permitted.includes(k)) ||
        Object.entries(section.content).some(
          ([k, v]) => typeof v !== "string" || v.length > (k === "imageUrl" ? 2048 : 3000),
        )
      ) {
        return NextResponse.json({ message: "Campos de conteúdo inválidos" }, { status: 400 });
      }
      const image = section.content.imageUrl;
      if (
        typeof image === "string" &&
        image &&
        !image.startsWith("/") &&
        !/^https:\/\//.test(image)
      ) {
        return NextResponse.json({ message: "URL de imagem inválida" }, { status: 400 });
      }
    }
  }
  if (slug in CMS_EDITOR_FIELDS) {
    const definition = CMS_EDITOR_FIELDS[slug as keyof typeof CMS_EDITOR_FIELDS];
    for (const section of parsed.data.sections) {
      const fields = (
        definition.sections as Record<string, { fields: readonly { key: string }[] }>
      )[section.key];
      if (!fields) return NextResponse.json({ message: "Seção desconhecida" }, { status: 400 });
      const allowed = new Set(fields.fields.map((f) => f.key));
      if (
        Object.entries(section.content).some(
          ([key, value]) =>
            !allowed.has(key) ||
            (key === "steps"
              ? !Array.isArray(value) ||
                value.length > 30 ||
                value.some((v) => typeof v !== "string" || v.length > 3000)
              : typeof value !== "string" || value.length > 3000),
        )
      ) {
        return NextResponse.json({ message: "Campos inválidos" }, { status: 400 });
      }
      const image = section.content.imageUrl;
      if (
        typeof image === "string" &&
        image &&
        !image.startsWith("/") &&
        !/^https:\/\//.test(image)
      )
        return NextResponse.json({ message: "URL de imagem inválida" }, { status: 400 });
    }
  }
  try {
    return NextResponse.json({ page: await saveCmsPage(slug, parsed.data) });
  } catch (error) {
    console.error("CMS save:", error);
    return NextResponse.json({ message: "Erro ao salvar página" }, { status: 500 });
  }
}
