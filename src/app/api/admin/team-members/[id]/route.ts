import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { teamMemberFormSchema } from "@/schemas/team-member.schema";
import {
  getTeamMemberOrThrow,
  updateTeamMemberFromForm,
  removeTeamMember,
  TeamMemberNotFoundError,
} from "@/services/team-member.service";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const teamMember = await getTeamMemberOrThrow(id);
    return NextResponse.json({ teamMember });
  } catch (error) {
    if (error instanceof TeamMemberNotFoundError) {
      return NextResponse.json({ message: "Membro não encontrado" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro ao buscar membro" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parseResult = teamMemberFormSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  try {
    const teamMember = await updateTeamMemberFromForm(id, parseResult.data);
    return NextResponse.json({ teamMember });
  } catch (error) {
    if (error instanceof TeamMemberNotFoundError) {
      return NextResponse.json({ message: "Membro não encontrado" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro ao atualizar membro" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await removeTeamMember(id);
    return NextResponse.json({ message: "Membro removido" });
  } catch (error) {
    if (error instanceof TeamMemberNotFoundError) {
      return NextResponse.json({ message: "Membro não encontrado" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro ao remover membro" }, { status: 500 });
  }
}