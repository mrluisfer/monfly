import type { Transaction } from "@prisma/client";
import {
  applyLoanPaymentDelta,
  LoanPaymentError,
} from "~/server/db/loans/apply-loan-payment";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

interface PutTransactionInput {
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
    /**
     * undefined = caller didn't touch card linkage; preserve existing.
     * null      = caller explicitly unlinked the transaction from any card.
     * string    = caller wants this transaction attached to that card.
     */
    cardId?: string | null;
  };
  id: string;
}

export const putTransactionById = async (input: PutTransactionInput) => {
  try {
    const { id, data: transactionData } = input;

    const updatedTransaction = await prismaClient.$transaction(async (tx) => {
      const oldTransaction = await tx.transaction.findUniqueOrThrow({
        select: {
          amount: true,
          appliedToLoanId: true,
          cardId: true,
          type: true,
          userEmail: true,
        },
        where: { id },
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
            delta,
            loanId: oldLoanId,
            transactionType: transactionData.type,
            userEmail: oldTransaction.userEmail,
          });
        }
      } else {
        if (oldLoanId) {
          await applyLoanPaymentDelta(tx, {
            delta: -oldTransaction.amount,
            loanId: oldLoanId,
            transactionType: oldTransaction.type,
            userEmail: oldTransaction.userEmail,
          });
        }
        if (nextLoanId) {
          await applyLoanPaymentDelta(tx, {
            delta: transactionData.amount,
            loanId: nextLoanId,
            transactionType: transactionData.type,
            userEmail: oldTransaction.userEmail,
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
        data: {
          amount: transactionData.amount,
          category: transactionData.category,
          date: transactionData.date,
          description: transactionData.description,
          type: transactionData.type,
          // Only write the column if the caller passed it; otherwise leave as-is.
          ...(transactionData.appliedToLoanId === undefined
            ? {}
            : { appliedToLoanId: transactionData.appliedToLoanId }),
          ...(transactionData.cardId === undefined
            ? {}
            : { cardId: transactionData.cardId }),
        },
        where: { id },
      });

      if (balanceDelta !== 0) {
        await tx.user.update({
          data: { totalBalance: { increment: balanceDelta } },
          where: { email: oldTransaction.userEmail },
        });
      }

      // ── Card balance: mirror the same impact on the linked card(s) ───────
      // Same card pre/post: apply just the difference. Different cards (incl.
      // link/unlink): revert old impact on the old card, apply new impact on
      // the new one. Uses the same oldImpact/newImpact as the user balance so
      // totalBalance and the sum of card balances never drift.
      const nextCardId =
        transactionData.cardId === undefined
          ? oldTransaction.cardId
          : transactionData.cardId;
      const oldCardId = oldTransaction.cardId;

      if (oldCardId && oldCardId === nextCardId) {
        if (balanceDelta !== 0) {
          await tx.card.updateMany({
            data: { balance: { increment: balanceDelta } },
            where: { id: oldCardId, userEmail: oldTransaction.userEmail },
          });
        }
      } else {
        if (oldCardId) {
          await tx.card.updateMany({
            data: { balance: { increment: -oldImpact } },
            where: { id: oldCardId, userEmail: oldTransaction.userEmail },
          });
        }
        if (nextCardId) {
          await tx.card.updateMany({
            data: { balance: { increment: newImpact } },
            where: { id: nextCardId, userEmail: oldTransaction.userEmail },
          });
        }
      }

      return updated;
    });

    return {
      data: updatedTransaction,
      error: false,
      message: "Transaction updated successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<Transaction>;
  } catch (error) {
    if (error instanceof LoanPaymentError) {
      return {
        data: null,
        error: true,
        message: error.message,
        statusCode: error.statusCode,
        success: false,
      } as ApiResponse<null>;
    }
    return {
      data: null,
      error: true,
      message: "Transaction not found or error updating transaction",
      statusCode: 500,
      success: false,
    } as ApiResponse<Transaction | null>;
  }
};
