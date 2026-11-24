BEGIN;
UPDATE "admins" SET "emailFactor" = true, "sessionVersion" = "sessionVersion" + 1, "emailOtpHash" = NULL, "emailOtpUntil" = NULL, "emailOtpSent" = NULL, "emailOtpAttempts" = 0, "emailOtpPurpose" = NULL, "emailOtpVersion" = NULL WHERE "totpSecret" IS NOT NULL;
ALTER TABLE "admins" DROP COLUMN "totpSecret", DROP COLUMN "totpLastStep", DROP COLUMN "totpRecovery";
COMMIT;
