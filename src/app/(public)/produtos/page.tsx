import ProdutosCatalogo from "@/components/ProdutosCatalogo";
import { listPublicProducts } from "@/services/product.service";
import { toProduto } from "@/utils/product-mapper";

// A página é gerada no servidor e regenerada no máximo a cada hora.
// Ao criar, editar ou remover um produto no admin, o service chama revalidatePath("/produtos"),
// então a mudança aparece na hora.
export const revalidate = 3600;

export default async function ProdutosPage() {
  const products = await listPublicProducts();

  return <ProdutosCatalogo produtos={products.map(toProduto)} />;
}