import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { listCmsPages } from "@/services/cms.service";

export async function GET() {
  if (!(await getAdminSession()))
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  try {
    return NextResponse.json({ pages: await listCmsPages() });
  } catch (error) {
    console.error("CMS list:", error);
    return NextResponse.json({ message: "Erro ao carregar páginas" }, { status: 500 });
  }
}
