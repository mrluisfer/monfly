-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "debtor" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'lent',

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Loan_userEmail_idx" ON "Loan"("userEmail");
CREATE INDEX "Loan_userEmail_status_idx" ON "Loan"("userEmail", "status");
CREATE INDEX "Loan_userEmail_direction_idx" ON "Loan"("userEmail", "direction");
CREATE INDEX "Loan_userEmail_dueAt_idx" ON "Loan"("userEmail", "dueAt");
CREATE INDEX "Loan_transactionId_idx" ON "Loan"("transactionId");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
