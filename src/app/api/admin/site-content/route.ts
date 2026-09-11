import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { siteContentFormSchema } from "@/schemas/site-content.schema";
import { getSiteContent, saveSiteContent } from "@/services/site-content.service";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const siteContent = await getSiteContent();
  return NextResponse.json({ siteContent });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = siteContentFormSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  try {
    const siteContent = await saveSiteContent(parseResult.data);
    return NextResponse.json({ siteContent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao salvar conteúdo" }, { status: 500 });
  }
}