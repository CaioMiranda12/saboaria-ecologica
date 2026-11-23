ALTER TABLE "audit_events" ADD COLUMN "changes" JSONB;
CREATE INDEX "audit_events_actorId_createdAt_idx" ON "audit_events"("actorId", "createdAt");
CREATE INDEX "audit_events_action_createdAt_idx" ON "audit_events"("action", "createdAt");
