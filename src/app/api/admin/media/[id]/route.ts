import { findMediaUsage } from "@/lib/media-usage";
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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession()))
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const asset = await prisma.mediaAsset.findUnique({ where: { id: (await params).id } });
  if (!asset) return NextResponse.json({ message: "Imagem não encontrada." }, { status: 404 });
  return NextResponse.json(
    { usages: await findMediaUsage(prisma, asset) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  try {
    return await prisma.$transaction(async (tx) => {
      const actor = await tx.admin.findUnique({ where: { id: session.adminId } });
      if (actor?.role !== "ADMIN")
        return NextResponse.json(
          { message: "Apenas administradores podem remover imagens." },
          { status: 403 },
        );
      const asset = await tx.mediaAsset.findUnique({ where: { id } });
      if (!asset) return NextResponse.json({ message: "Imagem não encontrada." }, { status: 404 });
      const usages = await findMediaUsage(tx, asset);
      if (usages.length)
        return NextResponse.json(
          { message: "Esta imagem está em uso. Remova as referências antes de continuar.", usages },
          { status: 409 },
        );
      // Remove only the catalog entry. Keeping the binary prevents broken external URLs
      // and protects references submitted concurrently or outside this application.
      await tx.mediaAsset.delete({ where: { id } });
      await tx.auditEvent.create({
        data: {
          actorId: actor.id,
          actorEmail: actor.email,
          actorName: actor.name,
          action: "DELETE",
          resource: "media",
          resourceId: id,
        },
      });
      return NextResponse.json({ message: "Imagem removida da biblioteca." });
    });
  } catch (error) {
    console.error("[media removal]", error);
    return NextResponse.json({ message: "Não foi possível remover a imagem." }, { status: 500 });
  }
}
