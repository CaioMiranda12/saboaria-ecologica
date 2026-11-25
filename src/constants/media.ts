export const MAX_MEDIA_BYTES = 4 * 1024 * 1024;
export const MEDIA_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function isAllowedMediaFile(file: { size: number; type: string }): boolean {
  return file.size > 0 && file.size <= MAX_MEDIA_BYTES && MEDIA_TYPES.includes(file.type);
}
