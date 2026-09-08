import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { teamMemberFormSchema } from "@/schemas/team-member.schema";
import { createTeamMemberFromForm, listTeamMembers } from "@/services/team-member.service";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const teamMembers = await listTeamMembers();
  return NextResponse.json({ teamMembers });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = teamMemberFormSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  try {
    const teamMember = await createTeamMemberFromForm(parseResult.data);
    return NextResponse.json({ teamMember }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao criar membro" }, { status: 500 });
  }
}