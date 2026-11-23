CREATE TABLE "media_assets" (
 "id" TEXT NOT NULL,
 "publicId" TEXT NOT NULL,
 "url" TEXT NOT NULL,
 "filename" TEXT NOT NULL,
 "mimeType" TEXT NOT NULL,
 "bytes" INTEGER NOT NULL,
 "width" INTEGER,
 "height" INTEGER,
 "altText" TEXT NOT NULL DEFAULT '',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "media_assets_publicId_key" ON "media_assets"("publicId");
CREATE INDEX "media_assets_createdAt_idx" ON "media_assets"("createdAt");
