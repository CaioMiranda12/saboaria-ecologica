import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/admin-authorization";
import { prisma } from "@/lib/prisma";
export async function GET() {
  if (!await requireAdminRole()) return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
  const events = await prisma.auditEvent.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ events });
}
