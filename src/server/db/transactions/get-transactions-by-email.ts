import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { TransactionWithUser } from "~/types/TransactionWithUser";

type GetTransactionsParams = {
  email: string;
  cardId?: string | null;
};

interface TransactionsResponse<T> extends ApiResponse<T> {
  total: number;
  limit?: number;
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
        where,
        take: limit,
        select: {
          id: true,
          userEmail: true,
          amount: true,
          type: true,
          category: true,
          description: true,
          date: true,
          cardId: true,
          appliedToLoanId: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { loans: true } },
        },
        orderBy: { createdAt: "desc" },
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
      error: false,
      message: "Transactions fetched successfully",
      data: enriched,
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
