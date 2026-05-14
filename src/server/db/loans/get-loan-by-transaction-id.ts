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
      error: false,
      message: loan ? "Loan found" : "No loan linked to this transaction",
      data: loan ?? null,
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error fetching loan: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
