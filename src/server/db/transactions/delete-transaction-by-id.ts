import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";
import {
  applyLoanPaymentDelta,
  LoanPaymentError,
} from "~/server/db/loans/apply-loan-payment";

export const deleteTransactionById = async (transactionId: string) => {
  try {
    const transactionDeleted = await prismaClient.$transaction(async (tx) => {
      // Read transaction before deleting to know the balance impact and any
      // linked loan we need to refund.
      const transaction = await tx.transaction.findUniqueOrThrow({
        where: { id: transactionId },
        select: {
          amount: true,
          type: true,
          userEmail: true,
          appliedToLoanId: true,
        },
      });

      // If the transaction was applied to a loan, undo that payment first so
      // the loan totals stay consistent before the row goes away.
      if (transaction.appliedToLoanId) {
        await applyLoanPaymentDelta(tx, {
          loanId: transaction.appliedToLoanId,
          delta: -transaction.amount,
          userEmail: transaction.userEmail,
          transactionType: transaction.type,
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
        where: { email: transaction.userEmail },
        data: { totalBalance: { increment: balanceReversal } },
      });

      return deleted;
    });

    return {
      success: true,
      message: "Transaction deleted successfully",
      data: transactionDeleted,
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
      success: false,
      message: "Error deleting transaction",
      data: null,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
