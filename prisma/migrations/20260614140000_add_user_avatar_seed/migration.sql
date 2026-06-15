-- Additive only: stores the chosen avatar seed so a reshuffled profile picture
-- persists across reloads. Nullable, so existing rows keep their name-derived
-- avatar.

-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatarSeed" TEXT;
