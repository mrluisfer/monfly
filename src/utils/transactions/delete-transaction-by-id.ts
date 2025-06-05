import { Transaction } from "@prisma/client";
import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const deleteTransactionById = async (transactionId: string) => {
  try {
    const transactionDeleted = await prismaClient.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    return {
      success: true,
      message: "Transaction deleted successfully",
      data: transactionDeleted,
      error: false,
      statusCode: 200,
    } as ApiResponse<Transaction>;
  } catch (error) {
    return {
      success: false,
      message: "Error deleting transaction",
      data: null,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
