import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { partnershipFormSchema } from "@/schemas/partnership.schema";
import {
  getPartnershipOrThrow,
  updatePartnershipFromForm,
  removePartnership,
  PartnershipNotFoundError,
} from "@/services/partnership.service";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parseResult = partnershipFormSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  try {
    const partnership = await updatePartnershipFromForm(id, parseResult.data);
    return NextResponse.json({ partnership });
  } catch (error) {
    if (error instanceof PartnershipNotFoundError) {
      return NextResponse.json({ message: "Parceria não encontrada" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro ao atualizar parceria" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await removePartnership(id);
    return NextResponse.json({ message: "Parceria removida" });
  } catch (error) {
    if (error instanceof PartnershipNotFoundError) {
      return NextResponse.json({ message: "Parceria não encontrada" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro ao remover parceria" }, { status: 500 });
  }
}