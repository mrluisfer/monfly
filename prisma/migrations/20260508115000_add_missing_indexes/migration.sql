-- CreateIndex
CREATE INDEX "Category_userEmail_idx" ON "Category"("userEmail");

-- CreateIndex
CREATE INDEX "Transaction_userEmail_idx" ON "Transaction"("userEmail");
CREATE INDEX "Transaction_userEmail_type_idx" ON "Transaction"("userEmail", "type");
CREATE INDEX "Transaction_userEmail_date_idx" ON "Transaction"("userEmail", "date");
CREATE INDEX "Transaction_userEmail_createdAt_idx" ON "Transaction"("userEmail", "createdAt");
