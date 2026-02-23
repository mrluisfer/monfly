import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const deleteTransactionsById = async (transactionIds: string[]) => {
  try {
    if (!transactionIds || transactionIds.length === 0) {
      return {
        success: false,
        message: "No transaction IDs provided",
        data: null,
        error: true,
        statusCode: 400,
      } as ApiResponse<null>;
    }

    const result = await prismaClient.$transaction(async (tx) => {
      // Read transactions before deleting to calculate balance impact
      const transactions = await tx.transaction.findMany({
        where: { id: { in: transactionIds } },
        select: { id: true, amount: true, type: true, userEmail: true },
      });

      if (transactions.length === 0) {
        return { count: 0 };
      }

      // Calculate balance delta per user
      const balanceByUser = new Map<string, number>();
      for (const t of transactions) {
        const impact = t.type === "income" ? -t.amount : t.amount;
        balanceByUser.set(
          t.userEmail,
          (balanceByUser.get(t.userEmail) ?? 0) + impact
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
            where: { email },
            data: {
              totalBalance: { increment: delta },
            },
          });
        }
      }

      return deleteResult;
    });

    if (result.count === 0) {
      return {
        success: false,
        message: "No transactions found with the provided IDs",
        data: null,
        error: true,
        statusCode: 404,
      } as ApiResponse<null>;
    }

    const message =
      result.count === 1
        ? "Transaction deleted successfully"
        : `${result.count} transactions deleted successfully`;

    return {
      success: true,
      message,
      data: { count: result.count, deletedIds: transactionIds },
      error: false,
      statusCode: 200,
    } as ApiResponse<{ count: number; deletedIds: string[] }>;
  } catch (error) {
    return {
      success: false,
      message: "Error deleting transactions",
      data: null,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
