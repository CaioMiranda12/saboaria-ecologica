import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/session';
import { isCmsPageSlug } from '@/constants/cms-pages';
import { publishCmsPage } from '@/services/cms-publication.service';
export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  const { slug } = await params;
  if (!isCmsPageSlug(slug)) return NextResponse.json({ message: 'Página inválida' }, { status: 404 });
  try { return NextResponse.json(await publishCmsPage(slug, session)); }
  catch (error) { console.error(error); return NextResponse.json({ message: 'Falha ao publicar' }, { status: 500 }); }
}
