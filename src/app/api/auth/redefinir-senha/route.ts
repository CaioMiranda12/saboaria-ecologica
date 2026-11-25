import { NextResponse } from "next/server";
import { z } from "zod";
import { resetPassword } from "@/lib/password-reset";
const schema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/),
  password: z
    .string()
    .min(12)
    .max(128)
    .regex(/[A-Z]/, "Inclua uma letra maiúscula")
    .regex(/[a-z]/, "Inclua uma letra minúscula")
    .regex(/[0-9]/, "Inclua um número"),
});
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { message: "Verifique o link e os requisitos da senha." },
      { status: 400 },
    );
  try {
    const success = await resetPassword(parsed.data.token, parsed.data.password);
    if (!success)
      return NextResponse.json(
        { message: "Este link expirou ou já foi utilizado. Solicite um novo." },
        { status: 400 },
      );
    return NextResponse.json({ message: "Senha alterada. Faça login novamente." });
  } catch (error) {
    console.error("Password reset failed", error);
    return NextResponse.json(
      { message: "Não foi possível redefinir a senha agora." },
      { status: 500 },
    );
  }
}
