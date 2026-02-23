import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const postTransactionByEmail = async (
  email: string,
  data: Transaction
) => {
  try {
    const transaction = await prismaClient.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          ...data,
          userEmail: email,
        },
      });

      await tx.user.update({
        where: { email },
        data: {
          totalBalance: {
            increment: data.type === "income" ? data.amount : -data.amount,
          },
        },
      });

      return created;
    });

    return {
      error: false,
      message: "Transaction created successfully",
      data: transaction,
      success: true,
      statusCode: 200,
    } as ApiResponse<Transaction>;
  } catch (error) {
    return {
      error: true,
      message: "Error creating transaction",
      data: null,
      success: false,
      statusCode: 500,
    } as ApiResponse<string | null>;
  }
};
