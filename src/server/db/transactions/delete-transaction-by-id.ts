import type { Transaction } from "@prisma/client";
import {
  applyLoanPaymentDelta,
  LoanPaymentError,
} from "~/server/db/loans/apply-loan-payment";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteTransactionById = async (transactionId: string) => {
  try {
    const transactionDeleted = await prismaClient.$transaction(async (tx) => {
      // Read transaction before deleting to know the balance impact and any
      // linked loan we need to refund.
      const transaction = await tx.transaction.findUniqueOrThrow({
        select: {
          amount: true,
          appliedToLoanId: true,
          cardId: true,
          type: true,
          userEmail: true,
        },
        where: { id: transactionId },
      });

      // If the transaction was applied to a loan, undo that payment first so
      // the loan totals stay consistent before the row goes away.
      if (transaction.appliedToLoanId) {
        await applyLoanPaymentDelta(tx, {
          delta: -transaction.amount,
          loanId: transaction.appliedToLoanId,
          transactionType: transaction.type,
          userEmail: transaction.userEmail,
        });
      }

      const deleted = await tx.transaction.delete({
        where: { id: transactionId },
      });

      const balanceReversal =
        transaction.type === "income"
          ? -transaction.amount
          : transaction.amount;

      await tx.user.update({
        data: { totalBalance: { increment: balanceReversal } },
        where: { email: transaction.userEmail },
      });

      // Mirror the reversal on the linked card so its balance stays in sync
      // with totalBalance.
      if (transaction.cardId) {
        await tx.card.updateMany({
          data: { balance: { increment: balanceReversal } },
          where: { id: transaction.cardId, userEmail: transaction.userEmail },
        });
      }

      return deleted;
    });

    return {
      data: transactionDeleted,
      error: false,
      message: "Transaction deleted successfully",
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
      message: "Error deleting transaction",
      statusCode: 500,
      success: false,
    } as ApiResponse<null>;
  }
};
