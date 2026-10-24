import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_SIZE_BYTES = 200 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg"];

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Confere os primeiros bytes para não confiar só no mime type informado pelo navegador. */
function hasValidSignature(buffer: Buffer, type: string) {
  if (type === "image/png") return buffer.subarray(0, 8).equals(PNG_SIGNATURE);
  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

// A rota fica sob /api/admin/*, já protegida pelo middleware de autenticação.
export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Envie uma imagem no campo 'file'." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ message: "Formato inválido. Envie uma imagem PNG ou JPEG." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ message: "A imagem excede o limite de 200 KB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!hasValidSignature(buffer, file.type)) {
    return NextResponse.json({ message: "O arquivo não parece ser uma imagem válida." }, { status: 400 });
  }

  try {
    const url = await uploadProductImage(buffer);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("[upload] falha ao enviar imagem para o Cloudinary", error);
    return NextResponse.json({ message: "Não foi possível enviar a imagem. Tente novamente." }, { status: 502 });
  }
}