import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export function findAllProducts() {
  return prisma.product.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] });
}

export function findPublicProducts() {
  return prisma.product.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  });
}

export function findProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export function findProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data });
}

export function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}
