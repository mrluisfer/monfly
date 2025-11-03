import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const deleteTransactionsById = async (transactionIds: string[]) => {
  try {
    // Validate input
    if (!transactionIds || transactionIds.length === 0) {
      return {
        success: false,
        message: "No transaction IDs provided",
        data: null,
        error: true,
        statusCode: 400,
      } as ApiResponse<null>;
    }

    // Delete multiple transactions by IDs
    const deleteResult = await prismaClient.transaction.deleteMany({
      where: {
        id: {
          in: transactionIds,
        },
      },
    });

    // Check if any transactions were actually deleted
    if (deleteResult.count === 0) {
      return {
        success: false,
        message: "No transactions found with the provided IDs",
        data: null,
        error: true,
        statusCode: 404,
      } as ApiResponse<null>;
    }

    const message =
      deleteResult.count === 1
        ? "Transaction deleted successfully"
        : `${deleteResult.count} transactions deleted successfully`;

    return {
      success: true,
      message,
      data: { count: deleteResult.count, deletedIds: transactionIds },
      error: false,
      statusCode: 200,
    } as ApiResponse<{ count: number; deletedIds: string[] }>;
  } catch (error) {
    console.error("Error deleting transactions:", error);
    return {
      success: false,
      message: "Error deleting transactions",
      data: null,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
