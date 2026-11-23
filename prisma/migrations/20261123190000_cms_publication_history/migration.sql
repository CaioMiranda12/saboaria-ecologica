CREATE TABLE "cms_publications" (
 "id" TEXT NOT NULL, "pageId" TEXT NOT NULL, "sections" JSONB NOT NULL,
 "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "cms_publications_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "cms_publications_pageId_key" ON "cms_publications"("pageId");
ALTER TABLE "cms_publications" ADD CONSTRAINT "cms_publications_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "cms_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "cms_versions" (
 "id" TEXT NOT NULL, "pageId" TEXT NOT NULL, "sections" JSONB NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "cms_versions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "cms_versions_pageId_createdAt_idx" ON "cms_versions"("pageId", "createdAt");
ALTER TABLE "cms_versions" ADD CONSTRAINT "cms_versions_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "cms_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- Preserve current live content as the first published version.
INSERT INTO "cms_publications" ("id", "pageId", "sections", "publishedAt")
SELECT md5(random()::text || p."id"), p."id",
 COALESCE((SELECT jsonb_agg(jsonb_build_object('key', s."key", 'title', s."title", 'position', s."position", 'enabled', s."enabled", 'content', s."content") ORDER BY s."position", s."key") FROM "cms_sections" s WHERE s."pageId" = p."id"), '[]'::jsonb), CURRENT_TIMESTAMP
FROM "cms_pages" p;
INSERT INTO "cms_versions" ("id", "pageId", "sections", "createdAt")
SELECT md5(random()::text || "pageId"), "pageId", "sections", CURRENT_TIMESTAMP FROM "cms_publications";
