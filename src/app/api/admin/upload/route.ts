import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { uploadMediaImage } from "@/lib/cloudinary";
import { validMediaSignature } from "@/lib/media-validation";
import { isAllowedMediaFile, MAX_MEDIA_BYTES } from "@/constants/media";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!(await getAdminSession()))
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > MAX_MEDIA_BYTES + 64 * 1024)
    return NextResponse.json({ message: "Envie uma imagem de até 4 MB." }, { status: 413 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ message: "Selecione uma imagem." }, { status: 400 });
  if (!isAllowedMediaFile(file))
    return NextResponse.json({ message: "Envie PNG, JPEG ou WebP de até 4 MB." }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!validMediaSignature(buffer, file.type))
    return NextResponse.json({ message: "Arquivo de imagem inválido." }, { status: 400 });
  try {
    const uploaded = await uploadMediaImage(buffer);
    const asset = await prisma.mediaAsset.create({
      data: {
        publicId: uploaded.publicId,
        url: uploaded.url,
        filename: file.name.slice(0, 255),
        mimeType: file.type,
        bytes: uploaded.bytes,
        width: uploaded.width,
        height: uploaded.height,
      },
    });
    return NextResponse.json({ url: asset.url, asset }, { status: 201 });
  } catch (error) {
    console.error("[media upload]", error);
    return NextResponse.json(
      {
        message:
          "Não foi possível enviar a imagem. Confira a configuração do Cloudinary e do banco.",
      },
      { status: 502 },
    );
  }
}
