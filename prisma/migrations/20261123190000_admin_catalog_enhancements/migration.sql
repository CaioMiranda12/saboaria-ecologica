ALTER TABLE "products" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true, ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "team_members" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "partnerships" ADD COLUMN "logoUrl" TEXT;
