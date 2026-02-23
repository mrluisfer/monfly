import type { ApiResponse } from "~/types/ApiResponse";
import type { TransactionWithUser } from "~/types/TransactionWithUser";

import { prismaClient } from "../prisma";

type GetTransactionsParams = {
  email: string;
};

interface TransactionsResponse<T> extends ApiResponse<T> {
  total: number;
}

export const getTransactionsByEmail = async ({
  email,
}: GetTransactionsParams) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const [transactions, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where: { userEmail: email },
        select: {
          id: true,
          userEmail: true,
          amount: true,
          type: true,
          category: true,
          description: true,
          date: true,
          cardId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prismaClient.transaction.count({
        where: { userEmail: email },
      }),
    ]);

    return {
      error: false,
      message: "Transactions fetched successfully",
      data: transactions,
      success: true,
      statusCode: 200,
      total,
    } as TransactionsResponse<TransactionWithUser[]>;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      error: true,
      message: `Error fetching transactions: ${errorMessage}`,
      data: null,
      statusCode: 500,
      total: 0,
      success: false,
    } as TransactionsResponse<TransactionWithUser[] | null>;
  }
};
