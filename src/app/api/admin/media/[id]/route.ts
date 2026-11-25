import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const schema = z.object({ altText: z.string().trim().max(300) });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession()))
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ message: "Descrição inválida." }, { status: 400 });
  const { id } = await params;
  const existing = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ message: "Imagem não encontrada." }, { status: 404 });
  const asset = await prisma.mediaAsset.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ asset });
}
