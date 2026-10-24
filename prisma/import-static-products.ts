/**
 * Importa os produtos de src/data/produtos.ts para o banco, uma única vez.
 *
 * - Usa o slug (o `id` do produto estático) para não duplicar: produtos que já existem
 *   no banco são ignorados e NÃO são sobrescritos, então é seguro rodar mais de uma vez.
 * - As imagens continuam apontando para os arquivos de /public (ex.: /pasta-de-brilho.jpg).
 *
 * Uso (na raiz do projeto): npx tsx prisma/import-static-products.ts
 */
import { config } from "dotenv";
import type { Product } from "@prisma/client";
import { listaDeProdutos, type Produto } from "../src/data/produtos";

// O .env precisa ser carregado ANTES de importar o Prisma/env.ts, que validam as variáveis
// assim que o módulo é carregado. Por isso o Prisma é importado dinamicamente dentro de main().
config({ path: ".env.local" });
config();

const TYPE_POR_TIPO: Record<Produto["tipo"], Product["type"]> = {
  barra: "BAR",
  pasta: "PASTE",
  liquido: "LIQUID",
  po: "POWDER",
  sabonete: "SOAP",
};

function withoutEmpty(items: string[] = []) {
  return items.map((item) => item.trim()).filter(Boolean);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL não encontrada. Confirme que existe um arquivo .env ou .env.local na raiz do projeto " +
        "(a pasta de onde você roda o comando) com DATABASE_URL, JWT_SECRET, ADMIN_SEED_EMAIL e ADMIN_SEED_PASSWORD.",
    );
  }

  const { prisma } = await import("../src/lib/prisma");

  try {
    let created = 0;
    let skipped = 0;

    for (const produto of listaDeProdutos) {
      const existing = await prisma.product.findUnique({ where: { slug: produto.id } });

      if (existing) {
        skipped += 1;
        continue;
      }

      await prisma.product.create({
        data: {
          slug: produto.id,
          mainName: produto.nomePrincipal,
          complementName: produto.nomeComplemento || null,
          shortDescription: produto.descricao,
          fullDescription: produto.descricaoCompleta,
          weight: produto.peso,
          type: TYPE_POR_TIPO[produto.tipo],
          ingredients: withoutEmpty(produto.ingredientes),
          variants: withoutEmpty(produto.tipos),
          usageInstructions: produto.modoDeUso || null,
          badge: produto.badge || null,
          isFeatured: produto.destaque ?? false,
          hasFragranceOptions: produto.consultarFragrancias ?? false,
          hasSizeOptions: produto.consultarTamanhos ?? false,
          imageUrl: produto.imagem ?? null,
        },
      });

      created += 1;
    }

    console.log(`Importação concluída: ${created} criado(s), ${skipped} já existia(m).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});