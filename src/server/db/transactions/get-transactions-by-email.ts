import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { TransactionWithUser } from "~/types/TransactionWithUser";

interface GetTransactionsParams {
  cardId?: string | null;
  email: string;
}

interface TransactionsResponse<T> extends ApiResponse<T> {
  limit?: number;
  total: number;
}

export const getTransactionsByEmail = async ({
  email,
  limit,
  cardId,
}: GetTransactionsParams & { limit?: number }) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const where = { userEmail: email, ...(cardId ? { cardId } : {}) };

    const [transactions, total] = await Promise.all([
      prismaClient.transaction.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          _count: { select: { loans: true } },
          amount: true,
          appliedToLoanId: true,
          cardId: true,
          category: true,
          createdAt: true,
          date: true,
          description: true,
          id: true,
          type: true,
          updatedAt: true,
          userEmail: true,
        },
        take: limit,
        where,
      }),
      prismaClient.transaction.count({
        where,
      }),
    ]);

    const enriched = transactions.map(({ _count, ...rest }) => ({
      ...rest,
      loanCount: _count.loans,
    }));

    return {
      data: enriched,
      error: false,
      message: "Transactions fetched successfully",
      statusCode: 200,
      success: true,
      total,
    } as TransactionsResponse<TransactionWithUser[]>;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      data: null,
      error: true,
      message: `Error fetching transactions: ${errorMessage}`,
      statusCode: 500,
      success: false,
      total: 0,
    } as TransactionsResponse<TransactionWithUser[] | null>;
  }
};
