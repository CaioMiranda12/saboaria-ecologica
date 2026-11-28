import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { locationSchema } from "@/schemas/location.schema";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };
function failure(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
    return NextResponse.json({ message: "Registro não encontrado." }, { status: 404 });
  console.error("Erro ao alterar sede", error);
  return NextResponse.json({ message: "Não foi possível concluir a operação." }, { status: 500 });
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const parsed = locationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { message: "Confira os campos e a posição no mapa." },
      { status: 400 },
    );
  const { id } = await params;
  try {
    const location = await prisma.$transaction(async (tx) => {
      const actor = await tx.admin.findUniqueOrThrow({ where: { id: session.adminId } });
      const updated = await tx.location.update({ where: { id }, data: parsed.data });
      await tx.auditEvent.create({
        data: {
          actorId: actor.id,
          actorEmail: actor.email,
          actorName: actor.name,
          action: "UPDATE",
          resource: "locations",
          resourceId: id,
        },
      });
      return updated;
    });
    revalidatePath("/mapa");
    revalidatePath("/contato");
    return NextResponse.json({ location });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  try {
    const deleted = await prisma.$transaction(async (tx) => {
      const actor = await tx.admin.findUniqueOrThrow({ where: { id: session.adminId } });
      if (actor.role !== "ADMIN") return false;
      await tx.location.delete({ where: { id } });
      await tx.auditEvent.create({
        data: {
          actorId: actor.id,
          actorEmail: actor.email,
          actorName: actor.name,
          action: "DELETE",
          resource: "locations",
          resourceId: id,
        },
      });
      return true;
    });
    if (!deleted) return NextResponse.json({ message: "Acesso restrito." }, { status: 403 });
    revalidatePath("/mapa");
    revalidatePath("/contato");
    return NextResponse.json({ message: "Sede removida." });
  } catch (error) {
    return failure(error);
  }
}
