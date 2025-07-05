import type { ApiResponse } from "~/types/ApiResponse";
import { TransactionWithUser } from "~/types/TransactionWithUser";

import { prismaClient } from "../prisma";

type GetTransactionsParams = {
  email: string;
  page?: number; // default 1
  pageSize?: number; // default 6
};

interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number; // total number of transactions for this user
  page: number; // current page
  pageSize: number; // number of items per page
  totalPages: number; // total number of pages
}

export const getTransactionsByEmail = async ({
  email,
  page = 1,
  pageSize = 6,
}: GetTransactionsParams) => {
  try {
    const skip = (page - 1) * pageSize;

    const [transactions, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where: { userEmail: email },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
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
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    } as PaginatedResponse<TransactionWithUser[]>;
  } catch (error) {
    return {
      error: true,
      message: "Error fetching transactions",
      data: null,
      statusCode: 500,
      total: 0,
      page: 1,
      pageSize: 7,
      totalPages: 0,
      success: false,
    } as PaginatedResponse<TransactionWithUser[] | null>;
  }
};
