import type { Loan } from "@prisma/client";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { CreateLoanInput } from "~/zod-schemas/loan-schema";

export const postLoanByEmail = async (
  email: string,
  input: CreateLoanInput,
): Promise<ApiResponse<Loan | null>> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    // If transactionId provided, ensure it belongs to the same user.
    if (input.transactionId) {
      const tx = await prismaClient.transaction.findFirst({
        select: { id: true },
        where: { id: input.transactionId, userEmail: email },
      });
      if (!tx) {
        return {
          data: null,
          error: true,
          message: "Linked transaction not found",
          statusCode: 404,
          success: false,
        };
      }
    }

    const loan = await prismaClient.loan.create({
      data: {
        amount: input.amount,
        amountPaid: 0,
        debtor: input.debtor.trim(),
        direction: input.direction ?? "lent",
        dueAt: input.dueAt ?? null,
        issuedAt: input.issuedAt ?? new Date(),
        notes: input.notes ?? null,
        status: "pending",
        transactionId: input.transactionId ?? null,
        userEmail: email,
      },
    });

    return {
      data: loan,
      error: false,
      message: "Loan created successfully",
      statusCode: 201,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error creating loan: ${message}`,
      statusCode: 500,
      success: false,
    };
  }
};
