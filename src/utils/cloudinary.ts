/**
 * Adiciona transformações do Cloudinary (formato e qualidade automáticos, largura máxima)
 * a URLs do Cloudinary. Qualquer outra URL (caminho local, data URL antiga) é devolvida igual,
 * então produtos já cadastrados continuam funcionando.
 */
export function optimizeImageUrl(url: string | null | undefined, width?: number): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  const transformations = ["f_auto", "q_auto", width ? `c_limit,w_${width}` : null]
    .filter(Boolean)
    .join(",");

  return url.replace("/upload/", `/upload/${transformations}/`);
}