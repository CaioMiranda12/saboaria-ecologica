import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { partnershipFormSchema } from "@/schemas/partnership.schema";
import { createPartnershipFromForm, listPartnerships } from "@/services/partnership.service";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const partnerships = await listPartnerships();
  return NextResponse.json({ partnerships });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = partnershipFormSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  try {
    const last = await prisma.partnership.aggregate({ _max: { order: true } });
    const partnership = await createPartnershipFromForm({
      ...parseResult.data,
      order: (last._max.order ?? -1) + 1,
    });
    await recordAudit(session, "CREATE", "partnerships", partnership.id);
    return NextResponse.json({ partnership }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao criar parceria" }, { status: 500 });
  }
}
