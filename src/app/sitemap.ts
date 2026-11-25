import type { MetadataRoute } from "next";
import { seoPages } from "@/lib/seo-pages";
import { publicIndexOrigin } from "@/lib/site-url";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = publicIndexOrigin();
  return origin ? seoPages.map((page) => ({ url: new URL(page.path, origin).href })) : [];
}
