import type { Loan } from "@prisma/client";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { UpdateLoanInput } from "~/zod-schemas/loan-schema";

export const putLoanById = async (
  email: string,
  input: UpdateLoanInput,
): Promise<ApiResponse<Loan | null>> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const existing = await prismaClient.loan.findFirst({
      where: { id: input.id, userEmail: email },
    });

    if (!existing) {
      return {
        data: null,
        error: true,
        message: "Loan not found",
        statusCode: 404,
        success: false,
      };
    }

    // Resolve next amounts and derived status.
    const nextAmount = input.amount ?? existing.amount;
    let nextAmountPaid = clamp(
      input.amountPaid ?? existing.amountPaid,
      0,
      nextAmount,
    );

    let nextStatus = input.status ?? existing.status;
    // If amountPaid changed and caller did not pass an explicit status,
    // derive the status from the totals so it stays consistent.
    if (input.amountPaid !== undefined && input.status === undefined) {
      if (nextAmountPaid <= 0) {
        nextStatus = "pending";
      } else if (nextAmountPaid >= nextAmount) {
        nextStatus = "paid";
      } else {
        nextStatus = "partial";
      }
    }
    // If the caller set status explicitly without an amountPaid, derive
    // amountPaid from the status so the two fields can't disagree
    // (e.g. status="paid" but amountPaid < amount).
    if (input.status !== undefined && input.amountPaid === undefined) {
      if (input.status === "paid") {
        nextAmountPaid = nextAmount;
      } else if (input.status === "pending") {
        nextAmountPaid = 0;
      }
      // "partial" leaves the existing amountPaid as-is (clamped above).
    }

    const paidAt =
      nextStatus === "paid" ? (existing.paidAt ?? new Date()) : null;

    const loan = await prismaClient.loan.update({
      data: {
        amount: nextAmount,
        amountPaid: nextAmountPaid,
        debtor: input.debtor?.trim() ?? existing.debtor,
        direction: input.direction ?? existing.direction,
        dueAt: input.dueAt === undefined ? existing.dueAt : input.dueAt,
        issuedAt: input.issuedAt ?? existing.issuedAt,
        notes: input.notes === undefined ? existing.notes : input.notes,
        paidAt,
        status: nextStatus,
        updatedAt: new Date(),
      },
      where: { id: input.id },
    });

    return {
      data: loan,
      error: false,
      message: "Loan updated successfully",
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error updating loan: ${message}`,
      statusCode: 500,
      success: false,
    };
  }
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
