CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');
ALTER TABLE "admins" ADD COLUMN "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';
CREATE TABLE "audit_events" (
 "id" TEXT NOT NULL,
 "actorId" TEXT NOT NULL,
 "actorEmail" TEXT NOT NULL,
 "actorName" TEXT NOT NULL,
 "action" TEXT NOT NULL,
 "resource" TEXT NOT NULL,
 "resourceId" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "audit_events_createdAt_idx" ON "audit_events"("createdAt");
CREATE INDEX "audit_events_resource_resourceId_idx" ON "audit_events"("resource", "resourceId");
