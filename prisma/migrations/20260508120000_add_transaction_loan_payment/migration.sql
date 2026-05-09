-- AlterTable: add nullable foreign key linking a transaction to the loan it pays.
-- A NULL value means the transaction is a regular transaction (not a loan payment).
ALTER TABLE "Transaction" ADD COLUMN "appliedToLoanId" TEXT;

-- CreateIndex: speeds up "list payments for loan X" and the integrity check we
-- run when editing/deleting a transaction.
CREATE INDEX "Transaction_appliedToLoanId_idx" ON "Transaction"("appliedToLoanId");

-- AddForeignKey: ON DELETE SET NULL — if the loan disappears, keep the transaction
-- (the user still wants their money movement recorded) but drop the broken link.
ALTER TABLE "Transaction"
  ADD CONSTRAINT "Transaction_appliedToLoanId_fkey"
  FOREIGN KEY ("appliedToLoanId") REFERENCES "Loan"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
