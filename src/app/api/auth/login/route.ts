import { loginLimit, loginFailure, loginSuccess } from "@/lib/login-protection";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginSchema } from "@/schemas/auth.schema";
import { authenticateAdmin, InvalidCredentialsError, SecondFactorRequired } from "@/services/auth.service";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE_SECONDS } from "@/constants/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = loginSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  // Only trust platform-provided forwarding headers behind a configured trusted proxy.
  // A spoofed IP cannot bypass the separate per-email limiter.
  const ip = request.headers.get("x-real-ip") ?? "unknown";
  const email = parseResult.data.email.trim().toLowerCase();
  if (await loginLimit(email, ip)) {
    return NextResponse.json({ message: "Muitas tentativas. Aguarde 15 minutos e tente novamente." }, { status: 429, headers: { "Retry-After": "900" } });
  }
  try {
    const { token, admin } = await authenticateAdmin({...parseResult.data,email});

    await loginSuccess(email);
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
    if (error instanceof SecondFactorRequired) return NextResponse.json({requires2FA:true, method:error.method});
    if (error instanceof InvalidCredentialsError) {
      await loginFailure(email, ip);
      return NextResponse.json({ message: "Credenciais ou código de segurança incorretos" }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ message: "Erro ao processar o login" }, { status: 500 });
  }
}