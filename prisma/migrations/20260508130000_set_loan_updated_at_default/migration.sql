-- AlterTable: align Loan.updatedAt default with other models (already present in DB)
ALTER TABLE "Loan" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
