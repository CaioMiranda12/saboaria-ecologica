const localImages: Record<string, string> = {
  "/secao-produtos.jpg": "/secao-produtos.webp",
  "/trajetoria2.png": "/trajetoria2.webp",
  "/pasta-de-brilho.jpg": "/pasta-de-brilho.webp",
  "/oficina.jpg": "/oficina.webp",
  "/detergente.jpg": "/detergente.webp",
  "/hero.jpg": "/hero.webp",
  "/agua-sanitaria.jpg": "/agua-sanitaria.webp",
  "/desinfetante.jpg": "/desinfetante.webp",
  "/economia-circular.jpg": "/economia-circular.webp",
  "/sabao-liquido.jpg": "/sabao-liquido.webp",
  "/trajetoria.png": "/trajetoria.webp",
  "/sabonete-em-barra.jpg": "/sabonete-em-barra.webp",
  "/amaciante.jpg": "/amaciante.webp",
  "/logo-ellas.png": "/logo-ellas.webp",
  "/logo-2.png": "/logo-2.webp",
  "/logo.png": "/logo.webp",
  "/sabonete-em-cachos.png": "/sabonete-em-cachos.webp",
  "/sabao-em-po.png": "/sabao-em-po.webp"
};

export function publicImageUrl(src: string, width: number): string {
  if (localImages[src]) return localImages[src];
  try {
    const url = new URL(src);
    if (url.protocol === "https:" && url.hostname === "res.cloudinary.com" && /^\/[^/]+\/image\/upload\/v\d+\//.test(url.pathname)) {
      url.pathname = url.pathname.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
      return url.href;
    }
  } catch { /* local or unsupported URL: preserve original */ }
  return src;
}
