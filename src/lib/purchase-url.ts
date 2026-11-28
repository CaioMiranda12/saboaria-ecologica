/** Links externos de compra: apenas HTTPS absoluto, sem credenciais. */
export function safePurchaseUrl(value: string | null | undefined): string | null {
  const text = value?.trim();
  if (!text || text.length > 2048 || !/^https:\/\//i.test(text) || /[\s\\]/.test(text)) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}
