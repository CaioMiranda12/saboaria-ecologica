import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/admin-authorization";
import { userCreateSchema } from "@/schemas/admin-user.schema";
import { getAdminSession } from "@/lib/session";
import { recordAudit } from "@/lib/audit";
export async function GET() {
  if (!(await requireAdminRole()))
    return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
  const users = await prisma.admin.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ users });
}
export async function POST(request: Request) {
  if (!(await requireAdminRole()))
    return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
  const parsed = userCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { message: "Confira os campos. A senha precisa ter pelo menos 12 caracteres." },
      { status: 400 },
    );
  const { password, ...fields } = parsed.data;
  if (await prisma.admin.findUnique({ where: { email: fields.email } }))
    return NextResponse.json({ message: "Este e-mail já está cadastrado." }, { status: 409 });
  const user = await prisma.admin.create({
    data: { ...fields, passwordHash: await bcrypt.hash(password, 12) },
  });
  const session = await getAdminSession();
  if (session) await recordAudit(session, "CREATE", "admins", user.id);
  return NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
    { status: 201 },
  );
}
