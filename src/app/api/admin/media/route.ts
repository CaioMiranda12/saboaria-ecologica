import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
export async function GET() {
  if (!(await getAdminSession()))
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ assets });
}
