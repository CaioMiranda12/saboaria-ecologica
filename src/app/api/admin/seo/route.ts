import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/admin-authorization";
import { seoPages } from "@/lib/seo-pages";

const schema = z.object({
  path: z.string().refine((path) => seoPages.some((p) => p.path === path)),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(320),
  imageUrl: z
    .string()
    .trim()
    .max(2048)
    .refine((value) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        return url.protocol === "https:" && !url.username && !url.password;
      } catch {
        return false;
      }
    }),
});
export async function PUT(request: Request) {
  const actor = await requireAdminRole();
  if (!actor) return NextResponse.json({ message: "Acesso restrito." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { message: "Confira o título, descrição e URL HTTPS da imagem." },
      { status: 400 },
    );
  const { path, ...fields } = parsed.data;
  await prisma.$transaction([
    prisma.pageSeo.upsert({ where: { path }, create: { path, ...fields }, update: fields }),
    prisma.auditEvent.create({
      data: {
        actorId: actor.id,
        actorEmail: actor.email,
        actorName: actor.name,
        action: "UPDATE",
        resource: "page_seo",
        resourceId: path,
      },
    }),
  ]);
  revalidatePath(path);
  return NextResponse.json({ message: "SEO atualizado." });
}
