-- AlterTable
ALTER TABLE "User" ADD COLUMN     "shortcuts" TEXT[] DEFAULT ARRAY['transactions']::TEXT[];

