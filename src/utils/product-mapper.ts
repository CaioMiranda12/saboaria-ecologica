import type { Product } from "@prisma/client";
import type { Produto } from "@/data/produtos";
import { optimizeImageUrl } from "@/utils/cloudinary";

const TIPO_POR_TYPE: Record<Product["type"], Produto["tipo"]> = {
  BAR: "barra",
  PASTE: "pasta",
  LIQUID: "liquido",
  POWDER: "po",
  SOAP: "sabonete",
};

/** Largura máxima (px) da imagem do card; o Cloudinary entrega no tamanho e formato certos. */
const CARD_IMAGE_WIDTH = 800;

function withoutEmpty(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

/** Converte o produto do banco (Prisma) para o formato que o catálogo público já usa. */
export function toProduto(product: Product): Produto {
  return {
    id: product.id,
    nomePrincipal: product.mainName,
    nomeComplemento: product.complementName ?? "",
    descricao: product.shortDescription,
    descricaoCompleta: product.fullDescription,
    peso: product.weight,
    tipo: TIPO_POR_TYPE[product.type],
    ingredientes: withoutEmpty(product.ingredients),
    tipos: withoutEmpty(product.variants),
    modoDeUso: product.usageInstructions ?? "",
    badge: product.badge ?? "",
    destaque: product.isFeatured,
    consultarFragrancias: product.hasFragranceOptions,
    consultarTamanhos: product.hasSizeOptions,
    imagem: product.imageUrl ? optimizeImageUrl(product.imageUrl, CARD_IMAGE_WIDTH) : null,
  };
}