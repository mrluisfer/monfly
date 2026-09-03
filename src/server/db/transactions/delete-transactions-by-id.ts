import {
  applyLoanPaymentDelta,
  LoanPaymentError,
} from "~/server/db/loans/apply-loan-payment";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const deleteTransactionsById = async (transactionIds: string[]) => {
  try {
    if (transactionIds.length === 0) {
      return {
        data: null,
        error: true,
        message: "No transaction IDs provided",
        statusCode: 400,
        success: false,
      } as ApiResponse<null>;
    }

    const result = await prismaClient.$transaction(async (tx) => {
      // Read transactions before deleting to calculate balance impact
      const transactions = await tx.transaction.findMany({
        select: {
          amount: true,
          appliedToLoanId: true,
          id: true,
          type: true,
          userEmail: true,
        },
        where: { id: { in: transactionIds } },
      });

      if (transactions.length === 0) {
        return { count: 0 };
      }

      // Refund any loan that this batch was paying. Done sequentially so
      // each loan's totals stay consistent if multiple transactions in the
      // batch reference the same loan.
      for (const t of transactions) {
        if (t.appliedToLoanId) {
          await applyLoanPaymentDelta(tx, {
            delta: -t.amount,
            loanId: t.appliedToLoanId,
            transactionType: t.type,
            userEmail: t.userEmail,
          });
        }
      }

      // Calculate balance delta per user
      const balanceByUser = new Map<string, number>();
      for (const t of transactions) {
        const impact = t.type === "income" ? -t.amount : t.amount;
        balanceByUser.set(
          t.userEmail,
          (balanceByUser.get(t.userEmail) ?? 0) + impact,
        );
      }

      // Delete the transactions
      const deleteResult = await tx.transaction.deleteMany({
        where: { id: { in: transactionIds } },
      });

      // Update balance for each affected user
      for (const [email, delta] of balanceByUser) {
        if (delta !== 0) {
          await tx.user.update({
            data: {
              totalBalance: { increment: delta },
            },
            where: { email },
          });
        }
      }

      return deleteResult;
    });

    if (result.count === 0) {
      return {
        data: null,
        error: true,
        message: "No transactions found with the provided IDs",
        statusCode: 404,
        success: false,
      } as ApiResponse<null>;
    }

    const message =
      result.count === 1
        ? "Transaction deleted successfully"
        : `${result.count} transactions deleted successfully`;

    return {
      data: { count: result.count, deletedIds: transactionIds },
      error: false,
      message,
      statusCode: 200,
      success: true,
    } as ApiResponse<{ count: number; deletedIds: string[] }>;
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
      message: "Error deleting transactions",
      statusCode: 500,
      success: false,
    } as ApiResponse<null>;
  }
};
