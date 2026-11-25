import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/admin-authorization";
import { getSiteContent } from "@/services/site-content.service";

export async function GET() {
  const admin = await requireAdminRole();
  if (!admin)
    return NextResponse.json({ message: "Acesso restrito a administradores" }, { status: 403 });
  const record = await getSiteContent();
  if (!record)
    return NextResponse.json({ message: "Nenhum registro legado encontrado" }, { status: 404 });
  const payload = {
    format: "saboaria-legacy-site-content-v1",
    exportedAt: new Date().toISOString(),
    content: record,
  };
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="saboaria-conteudo-legado.json"',
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
