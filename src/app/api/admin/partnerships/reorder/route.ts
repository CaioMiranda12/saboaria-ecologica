import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { recordAudit } from "@/lib/audit";

const schema = z.object({ ids: z.array(z.string().cuid()).min(1).max(500).refine(ids => new Set(ids).size === ids.length, "IDs repetidos") });

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Ordem inválida" }, { status: 400 });
  const existing = await prisma.partnership.findMany({ select: { id: true } });
  const actual = new Set(existing.map(p => p.id));
  if (actual.size !== parsed.data.ids.length || parsed.data.ids.some(id => !actual.has(id))) {
    return NextResponse.json({ message: "A lista mudou. Atualize a página e tente novamente." }, { status: 409 });
  }
  await prisma.$transaction(parsed.data.ids.map((id, order) => prisma.partnership.update({ where: { id }, data: { order } })));
  await recordAudit(session, "UPDATE", "partnerships", "reorder");
  return NextResponse.json({ message: "Ordem salva" });
}
