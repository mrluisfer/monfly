-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "role" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Card_userEmail_role_key" ON "Card"("userEmail", "role");
