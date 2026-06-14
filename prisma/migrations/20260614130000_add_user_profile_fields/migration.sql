-- Additive only: profile preferences + legal acknowledgement timestamps on
-- User. All columns are nullable or have defaults, so existing rows are
-- unaffected.

-- AlterTable
ALTER TABLE "User" ADD COLUMN "preferredCurrency" TEXT;
ALTER TABLE "User" ADD COLUMN "marketingOptIn" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "productUpdatesOptIn" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "acceptedTermsAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "acceptedPrivacyAt" TIMESTAMP(3);
