import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/admin-authorization";
import { getSiteContent } from "@/services/site-content.service";

// API legada preservada para consulta; alterações devem ocorrer no CMS.
export async function GET() {
  const admin = await requireAdminRole();
  if (!admin) return NextResponse.json({ message: "Acesso restrito a administradores" }, { status: 403 });
  const siteContent = await getSiteContent();
  return NextResponse.json({ siteContent }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH() {
  return NextResponse.json({ message: "Edição legada desativada. Utilize /admin/paginas para editar o conteúdo do site." }, { status: 410 });
}
