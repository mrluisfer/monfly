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

    const updatedTransaction = await prismaClient.$transaction(async (tx) => {
      // Read the old transaction to calculate the correct balance delta
      const oldTransaction = await tx.transaction.findUniqueOrThrow({
        where: { id },
        select: { amount: true, type: true, userEmail: true },
      });

      const oldImpact =
        oldTransaction.type === "income"
          ? oldTransaction.amount
          : -oldTransaction.amount;
      const newImpact =
        transactionData.type === "income"
          ? transactionData.amount
          : -transactionData.amount;
      const balanceDelta = newImpact - oldImpact;

      const updated = await tx.transaction.update({
        where: { id },
        data: transactionData,
      });

      if (balanceDelta !== 0) {
        await tx.user.update({
          where: { email: oldTransaction.userEmail },
          data: {
            totalBalance: { increment: balanceDelta },
          },
        });
      }

      return updated;
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
