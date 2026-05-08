import type { Loan } from "@prisma/client";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { CreateLoanInput } from "~/zod-schemas/loan-schema";

export const postLoanByEmail = async (
  email: string,
  input: CreateLoanInput
): Promise<ApiResponse<Loan | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    // If transactionId provided, ensure it belongs to the same user.
    if (input.transactionId) {
      const tx = await prismaClient.transaction.findFirst({
        where: { id: input.transactionId, userEmail: email },
        select: { id: true },
      });
      if (!tx) {
        return {
          error: true,
          message: "Linked transaction not found",
          data: null,
          success: false,
          statusCode: 404,
        };
      }
    }

    const loan = await prismaClient.loan.create({
      data: {
        userEmail: email,
        debtor: input.debtor.trim(),
        amount: input.amount,
        amountPaid: 0,
        status: "pending",
        direction: input.direction ?? "lent",
        issuedAt: input.issuedAt ?? new Date(),
        dueAt: input.dueAt ?? null,
        notes: input.notes ?? null,
        transactionId: input.transactionId ?? null,
      },
    });

    return {
      error: false,
      message: "Loan created successfully",
      data: loan,
      success: true,
      statusCode: 201,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error creating loan: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
