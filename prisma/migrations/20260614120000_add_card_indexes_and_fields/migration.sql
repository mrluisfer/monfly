-- Additive only: new indexes for card-scoped filtering and optional Card
-- presentation columns. No data is altered; existing rows keep cardId = NULL
-- and Card.status defaults to 'active'.

-- AlterTable
ALTER TABLE "Card" ADD COLUMN "color" TEXT;
ALTER TABLE "Card" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "Transaction_userEmail_cardId_idx" ON "Transaction"("userEmail", "cardId");
CREATE INDEX "Transaction_cardId_date_idx" ON "Transaction"("cardId", "date");

-- CreateIndex
CREATE INDEX "Card_userEmail_idx" ON "Card"("userEmail");
