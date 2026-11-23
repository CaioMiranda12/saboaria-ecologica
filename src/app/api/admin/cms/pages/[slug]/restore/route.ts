import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/session';
import { isCmsPageSlug } from '@/constants/cms-pages';
import { restoreCmsVersion } from '@/services/cms-publication.service';
import { z } from 'zod';
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  const { slug } = await params;
  if (!isCmsPageSlug(slug)) return NextResponse.json({ message: 'Página inválida' }, { status: 404 });
  const parsed = z.object({ versionId: z.string().min(1) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: 'Versão inválida' }, { status: 400 });
  try { return NextResponse.json(await restoreCmsVersion(slug, parsed.data.versionId, session)); }
  catch { return NextResponse.json({ message: 'Não foi possível restaurar' }, { status: 400 }); }
}
