import type { Loan } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const getLoanByTransactionId = async (
  transactionId: string,
  userEmail: string,
): Promise<ApiResponse<Loan | null>> => {
  try {
    const loan = await prismaClient.loan.findFirst({
      where: { transactionId, userEmail },
    });

    return {
      data: loan ?? null,
      error: false,
      message: loan ? "Loan found" : "No loan linked to this transaction",
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error fetching loan: ${message}`,
      statusCode: 500,
      success: false,
    };
  }
};
