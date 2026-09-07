import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginSchema } from "@/schemas/auth.schema";
import { authenticateAdmin, InvalidCredentialsError } from "@/services/auth.service";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE_SECONDS } from "@/constants/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = loginSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  try {
    const { token, admin } = await authenticateAdmin(parseResult.data);

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
    });

    return NextResponse.json({ admin });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json({ message: "E-mail ou senha incorretos" }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ message: "Erro ao processar o login" }, { status: 500 });
  }
}