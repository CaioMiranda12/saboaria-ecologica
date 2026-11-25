const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Browser metadata is a defense in depth, not a replacement for authentication.
export function isAllowedApiRequest(request: Request, appUrl?: string): boolean {
  if (SAFE_METHODS.has(request.method.toUpperCase())) return true;

  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site" || site === "same-site" || site === "none") return false;
  if (site === "same-origin") return true;

  // Older browsers may omit Fetch Metadata. Validate Origin when available.
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser clients still require normal authentication.
  if (origin === new URL(request.url).origin) return true;
  if (!appUrl) return false;
  try {
    return origin === new URL(appUrl).origin;
  } catch {
    return false;
  }
}
