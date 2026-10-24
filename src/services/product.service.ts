import { revalidatePath } from "next/cache";
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProductById,
  findProductBySlug,
  findPublicProducts,
  updateProduct,
} from "@/repositories/product.repository";
import { createSlug } from "@/utils/slug";
import type { ProductFormValues } from "@/schemas/product.schema";

export class ProductNotFoundError extends Error {}
export class DuplicateProductSlugError extends Error {}

export function listProducts() {
  return findAllProducts();
}

export function listPublicProducts() {
  return findPublicProducts();
}

/** Faz o catálogo público refletir na hora o que foi salvo no admin. */
function revalidatePublicCatalog() {
  revalidatePath("/produtos");
}

export async function getProductOrThrow(id: string) {
  const product = await findProductById(id);

  if (!product) {
    throw new ProductNotFoundError();
  }

  return product;
}

async function ensureUniqueSlug(baseName: string, ignoreProductId?: string) {
  const slug = createSlug(baseName);
  const existing = await findProductBySlug(slug);

  if (existing && existing.id !== ignoreProductId) {
    throw new DuplicateProductSlugError();
  }

  return slug;
}

function mapFormValuesToProductData(values: ProductFormValues) {
  return {
    mainName: values.mainName,
    complementName: values.complementName || null,
    shortDescription: values.shortDescription,
    fullDescription: values.fullDescription,
    weight: values.weight || null,
    type: values.type,
    ingredients: values.ingredients,
    variants: values.variants,
    usageInstructions: values.usageInstructions || null,
    badge: values.badge || null,
    isFeatured: values.isFeatured,
    hasFragranceOptions: values.hasFragranceOptions,
    hasSizeOptions: values.hasSizeOptions,
    imageUrl: values.imageUrl || null,
  };
}

export async function createProductFromForm(values: ProductFormValues) {
  const slug = await ensureUniqueSlug(values.mainName);
  const product = await createProduct({ slug, ...mapFormValuesToProductData(values) });
  revalidatePublicCatalog();
  return product;
}

export async function updateProductFromForm(id: string, values: ProductFormValues) {
  await getProductOrThrow(id);
  const slug = await ensureUniqueSlug(values.mainName, id);
  const product = await updateProduct(id, { slug, ...mapFormValuesToProductData(values) });
  revalidatePublicCatalog();
  return product;
}

export async function removeProduct(id: string) {
  await getProductOrThrow(id);
  const product = await deleteProduct(id);
  revalidatePublicCatalog();
  return product;
}