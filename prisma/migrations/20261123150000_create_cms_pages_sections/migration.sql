CREATE TABLE "cms_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cms_pages_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "cms_pages_slug_key" ON "cms_pages"("slug");
CREATE TABLE "cms_sections" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cms_sections_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "cms_sections_pageId_key_key" ON "cms_sections"("pageId", "key");
CREATE INDEX "cms_sections_pageId_position_idx" ON "cms_sections"("pageId", "position");
ALTER TABLE "cms_sections" ADD CONSTRAINT "cms_sections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "cms_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
