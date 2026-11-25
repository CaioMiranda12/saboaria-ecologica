import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { seoPages } from '@/lib/seo-pages';

export async function pageMetadata(path: string): Promise<Metadata> {
  const defaults = seoPages.find(p => p.path === path) ?? seoPages[0];
  const saved = await prisma.pageSeo.findUnique({ where: { path } });
  const { title, description } = saved ?? defaults;
  const image = saved?.imageUrl;
  return {
    title, description,
    openGraph: { title, description, type: 'website', siteName: 'Saboaria Ecológica', locale: 'pt_BR', ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description, ...(image ? { images: [image] } : {}) },
  };
}
