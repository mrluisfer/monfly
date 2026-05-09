import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";
import {
  applyLoanPaymentDelta,
  LoanPaymentError,
} from "~/server/db/loans/apply-loan-payment";

type PutTransactionInput = {
  id: string;
  data: {
    amount: number;
    type: string;
    category: string;
    description: string;
    date: Date;
    /**
     * undefined = caller didn't touch loan linkage; preserve existing.
     * null      = caller explicitly unlinked (transaction is no longer a loan payment).
     * string    = caller wants this transaction applied as payment of that loan.
     */
    appliedToLoanId?: string | null;
  };
};

export const putTransactionById = async (input: PutTransactionInput) => {
  try {
    const { id, data: transactionData } = input;

    const updatedTransaction = await prismaClient.$transaction(async (tx) => {
      const oldTransaction = await tx.transaction.findUniqueOrThrow({
        where: { id },
        select: {
          amount: true,
          type: true,
          userEmail: true,
          appliedToLoanId: true,
        },
      });

      // ── Loan side: figure out what changed and emit signed deltas ─────────
      // If the caller didn't pass appliedToLoanId, preserve the existing link.
      const nextLoanId =
        transactionData.appliedToLoanId === undefined
          ? oldTransaction.appliedToLoanId
          : transactionData.appliedToLoanId;
      const oldLoanId = oldTransaction.appliedToLoanId;

      // Same loan pre/post: apply just the difference (could be 0).
      // Different loans: revert old fully, then apply new fully.
      // This also covers "linked → unlinked" (revert old) and
      // "unlinked → linked" (apply new).
      if (oldLoanId && oldLoanId === nextLoanId) {
        const delta = transactionData.amount - oldTransaction.amount;
        if (delta !== 0) {
          await applyLoanPaymentDelta(tx, {
            loanId: oldLoanId,
            delta,
            userEmail: oldTransaction.userEmail,
            transactionType: transactionData.type,
          });
        }
      } else {
        if (oldLoanId) {
          await applyLoanPaymentDelta(tx, {
            loanId: oldLoanId,
            delta: -oldTransaction.amount,
            userEmail: oldTransaction.userEmail,
            transactionType: oldTransaction.type,
          });
        }
        if (nextLoanId) {
          await applyLoanPaymentDelta(tx, {
            loanId: nextLoanId,
            delta: transactionData.amount,
            userEmail: oldTransaction.userEmail,
            transactionType: transactionData.type,
          });
        }
      }

      // ── User balance: signed delta between old and new impact ─────────────
      const oldImpact =
        oldTransaction.type === "income"
          ? oldTransaction.amount
          : -oldTransaction.amount;
      const newImpact =
        transactionData.type === "income"
          ? transactionData.amount
          : -transactionData.amount;
      const balanceDelta = newImpact - oldImpact;

      const updated = await tx.transaction.update({
        where: { id },
        data: {
          amount: transactionData.amount,
          type: transactionData.type,
          category: transactionData.category,
          description: transactionData.description,
          date: transactionData.date,
          // Only write the column if the caller passed it; otherwise leave as-is.
          ...(transactionData.appliedToLoanId === undefined
            ? {}
            : { appliedToLoanId: transactionData.appliedToLoanId }),
        },
      });

      if (balanceDelta !== 0) {
        await tx.user.update({
          where: { email: oldTransaction.userEmail },
          data: { totalBalance: { increment: balanceDelta } },
        });
      }

      return updated;
    });

    return {
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
      error: false,
      statusCode: 200,
    } as ApiResponse<Transaction>;
  } catch (error) {
    if (error instanceof LoanPaymentError) {
      return {
        error: true,
        message: error.message,
        data: null,
        success: false,
        statusCode: error.statusCode,
      } as ApiResponse<null>;
    }
    return {
      error: true,
      message: "Transaction not found or error updating transaction",
      data: null,
      success: false,
      statusCode: 500,
    } as ApiResponse<Transaction | null>;
  }
};
