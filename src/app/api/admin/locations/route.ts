import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { locationSchema } from "@/schemas/location.schema";
import { revalidatePath } from "next/cache";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const locations = await prisma.location.findMany({ orderBy: [{ name: "asc" }, { id: "asc" }] });
  return NextResponse.json({ locations });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const parsed = locationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { message: "Confira os campos e a posição no mapa." },
      { status: 400 },
    );
  try {
    const location = await prisma.$transaction(async (tx) => {
      const actor = await tx.admin.findUniqueOrThrow({ where: { id: session.adminId } });
      const created = await tx.location.create({ data: parsed.data });
      await tx.auditEvent.create({
        data: {
          actorId: actor.id,
          actorEmail: actor.email,
          actorName: actor.name,
          action: "CREATE",
          resource: "locations",
          resourceId: created.id,
        },
      });
      return created;
    });
    revalidatePath("/mapa");
    revalidatePath("/contato");
    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar sede", error);
    return NextResponse.json({ message: "Não foi possível cadastrar a sede." }, { status: 500 });
  }
}
