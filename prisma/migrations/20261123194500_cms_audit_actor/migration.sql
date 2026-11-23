ALTER TABLE "cms_versions" ADD COLUMN "actorId" TEXT, ADD COLUMN "actorName" TEXT, ADD COLUMN "actorEmail" TEXT, ADD COLUMN "action" TEXT NOT NULL DEFAULT 'PUBLISH', ADD COLUMN "sourceVersionId" TEXT;
-- Existing records remain unattributed; do not infer an actor.
