import type { Transaction } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const getTransactionById = async (data: { id: string }) => {
  try {
    if (!data.id) {
      return {
        data: null,
        error: true,
        message: "Transaction ID is required",
        statusCode: 400,
        success: false,
      } as ApiResponse<Transaction | null>;
    }

    const transaction = await prismaClient.transaction.findUnique({
      where: { id: data.id },
    });

    if (!transaction) {
      return {
        data: null,
        error: true,
        message: "Transaction not found",
        statusCode: 404,
        success: false,
      } as ApiResponse<Transaction | null>;
    }

    return {
      data: transaction,
      error: false,
      message: "Transaction fetched successfully",
      status: 200,
      success: true,
      transaction,
    } as ApiResponse<Transaction>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Error fetching transaction",
      statusCode: 500,
      success: false,
    } as ApiResponse<Transaction | null>;
  }
};
