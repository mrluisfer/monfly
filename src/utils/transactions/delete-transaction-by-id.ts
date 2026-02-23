import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const deleteTransactionById = async (transactionId: string) => {
  try {
    const transactionDeleted = await prismaClient.$transaction(async (tx) => {
      // Read transaction before deleting to know the balance impact
      const transaction = await tx.transaction.findUniqueOrThrow({
        where: { id: transactionId },
        select: { amount: true, type: true, userEmail: true },
      });

      const deleted = await tx.transaction.delete({
        where: { id: transactionId },
      });

      // Reverse the balance impact of the deleted transaction
      const balanceReversal =
        transaction.type === "income"
          ? -transaction.amount
          : transaction.amount;

      await tx.user.update({
        where: { email: transaction.userEmail },
        data: {
          totalBalance: { increment: balanceReversal },
        },
      });

      return deleted;
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
