import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const putTransactionById = async (data: {
  id: string;
  data: {
    amount: number;
    type: string;
    category: string;
    description: string;
    date: Date;
  };
}) => {
  try {
    const { id, data: transactionData } = data;
    const updatedTransaction = await prismaClient.transaction.update({
      where: { id },
      data: transactionData,
    });

    await prismaClient.user.update({
      where: { email: updatedTransaction.userEmail },
      data: {
        updatedAt: new Date(),
        totalBalance: {
          increment:
            updatedTransaction.type === "income"
              ? updatedTransaction.amount
              : -updatedTransaction.amount,
        },
      },
    });

    return {
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
      error: false,
      statusCode: 200,
    } as ApiResponse<Transaction>;
  } catch (error) {
    return {
      error: true,
      message: "Transaction not found or error updating transaction",
      data: null,
      success: false,
      statusCode: 500,
    } as ApiResponse<Transaction | null>;
  }
};
