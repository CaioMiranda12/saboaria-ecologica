import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const actor = await prisma.admin.findUnique({
    where: { id: session.adminId },
    select: { role: true },
  });
  return NextResponse.json({ assets, canRemove: actor?.role === "ADMIN" });
}
