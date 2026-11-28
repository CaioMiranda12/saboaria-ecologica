export type MediaReference = { label: string; href: string };
export type MediaIdentity = { url: string; publicId: string };

// Conservatively recognize original URLs, transformed Cloudinary URLs and nested CMS values.
export function containsMedia(value: unknown, asset: MediaIdentity): boolean {
  if (typeof value === "string") {
    if (asset.url && value.includes(asset.url)) return true;
    if (!asset.publicId) return false;
    let decoded = value;
    try {
      decoded = decodeURIComponent(value);
    } catch {
      /* Keep the original string. */
    }
    return decoded.includes(asset.publicId);
  }
  if (Array.isArray(value)) return value.some((item) => containsMedia(item, asset));
  if (value && typeof value === "object")
    return Object.values(value).some((item) => containsMedia(item, asset));
  return false;
}
