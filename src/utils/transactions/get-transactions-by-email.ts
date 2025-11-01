import type { ApiResponse } from "~/types/ApiResponse";
import { TransactionWithUser } from "~/types/TransactionWithUser";

import { prismaClient } from "../prisma";

type GetTransactionsParams = {
  email: string;
};

interface TransactionsResponse<T> extends ApiResponse<T> {
  total: number; // total number of transactions for this user
}

export const getTransactionsByEmail = async ({
  email,
}: GetTransactionsParams) => {
  try {
    console.log("Fetching transactions for email:", email);

    if (!email) {
      throw new Error("Email is required");
    }

    // First, let's check if the user exists
    const user = await prismaClient.user.findUnique({
      where: { email: email },
    });

    console.log(`User lookup for ${email}:`, user ? "Found" : "Not found");

    const [transactions, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where: { userEmail: email },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      }),
      prismaClient.transaction.count({
        where: { userEmail: email },
      }),
    ]);

    console.log(`Found ${transactions.length} transactions for ${email}`);
    console.log("Sample transaction:", transactions[0] || "None");
    console.log("Total count:", total);

    // Debug: if no transactions found, let's check if there are any transactions at all
    if (transactions.length === 0) {
      const allTransactions = await prismaClient.transaction.findMany({
        take: 5,
        include: { user: true },
      });
      console.log("All transactions in DB (sample):", allTransactions);

      const allUsers = await prismaClient.user.findMany({
        take: 5,
        select: { email: true, id: true },
      });
      console.log("All users in DB (sample):", allUsers);
    }

    return {
      error: false,
      message: "Transactions fetched successfully",
      data: transactions,
      success: true,
      statusCode: 200,
      total,
    } as TransactionsResponse<TransactionWithUser[]>;
  } catch (error) {
    console.error("Error fetching transactions:", error);
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
