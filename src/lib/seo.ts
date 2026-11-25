import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { publicIndexOrigin } from "@/lib/site-url";
import { seoPages } from "@/lib/seo-pages";

export async function pageMetadata(path: string): Promise<Metadata> {
  const defaults = seoPages.find((p) => p.path === path) ?? seoPages[0];
  const saved = await prisma.pageSeo.findUnique({ where: { path } });
  const { title, description } = saved ?? defaults;
  const image = saved?.imageUrl;
  const origin = publicIndexOrigin();
  const canonical = origin ? new URL(path, origin).href : undefined;
  return {
    ...(canonical ? { alternates: { canonical } } : { robots: { index: false, follow: false } }),
    title,
    description,
    openGraph: {
      ...(canonical ? { url: canonical } : {}),
      title,
      description,
      type: "website",
      siteName: "Saboaria Ecológica",
      locale: "pt_BR",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
