-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('BAR', 'PASTE', 'LIQUID', 'POWDER', 'SOAP');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "mainName" TEXT NOT NULL,
    "complementName" TEXT,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "weight" TEXT,
    "type" "ProductType" NOT NULL,
    "ingredients" TEXT[],
    "variants" TEXT[],
    "usageInstructions" TEXT,
    "badge" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "hasFragranceOptions" BOOLEAN NOT NULL DEFAULT false,
    "hasSizeOptions" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
