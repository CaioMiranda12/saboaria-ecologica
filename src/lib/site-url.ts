/** Use the operator-configured origin, never the request Host header. */
export function siteOrigin(): string | null {
  try {
    const url = new URL(process.env.APP_URL ?? '');
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    if (url.protocol === 'https:' || (url.protocol === 'http:' && url.hostname === 'localhost')) return url.origin;
  } catch { /* No valid configured origin. */ }
  return null;
}
export function publicIndexOrigin(): string | null {
  const origin = siteOrigin();
  if (!origin || !origin.startsWith('https:') || new URL(origin).hostname === 'localhost') return null;
  return origin;
}
