import type { MetadataRoute } from 'next';
import { publicIndexOrigin } from '@/lib/site-url';
export default function robots(): MetadataRoute.Robots {
  const origin = publicIndexOrigin();
  if (!origin) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/login', '/esqueci-senha', '/redefinir-senha'] }, sitemap: new URL('/sitemap.xml', origin).href };
}
