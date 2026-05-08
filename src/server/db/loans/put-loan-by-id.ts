import type { Loan } from "@prisma/client";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { UpdateLoanInput } from "~/zod-schemas/loan-schema";

export const putLoanById = async (
  email: string,
  input: UpdateLoanInput
): Promise<ApiResponse<Loan | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    const existing = await prismaClient.loan.findFirst({
      where: { id: input.id, userEmail: email },
    });

    if (!existing) {
      return {
        error: true,
        message: "Loan not found",
        data: null,
        success: false,
        statusCode: 404,
      };
    }

    // Resolve next amounts and derived status.
    const nextAmount = input.amount ?? existing.amount;
    let nextAmountPaid = clamp(
      input.amountPaid ?? existing.amountPaid,
      0,
      nextAmount
    );

    let nextStatus = input.status ?? existing.status;
    // If amountPaid changed and caller did not pass an explicit status,
    // derive the status from the totals so it stays consistent.
    if (input.amountPaid !== undefined && input.status === undefined) {
      if (nextAmountPaid <= 0) nextStatus = "pending";
      else if (nextAmountPaid >= nextAmount) nextStatus = "paid";
      else nextStatus = "partial";
    }
    // If the caller set status explicitly without an amountPaid, derive
    // amountPaid from the status so the two fields can't disagree
    // (e.g. status="paid" but amountPaid < amount).
    if (input.status !== undefined && input.amountPaid === undefined) {
      if (input.status === "paid") nextAmountPaid = nextAmount;
      else if (input.status === "pending") nextAmountPaid = 0;
      // "partial" leaves the existing amountPaid as-is (clamped above).
    }

    const paidAt =
      nextStatus === "paid"
        ? (existing.paidAt ?? new Date())
        : null;

    const loan = await prismaClient.loan.update({
      where: { id: input.id },
      data: {
        debtor: input.debtor?.trim() ?? existing.debtor,
        amount: nextAmount,
        amountPaid: nextAmountPaid,
        status: nextStatus,
        direction: input.direction ?? existing.direction,
        issuedAt: input.issuedAt ?? existing.issuedAt,
        dueAt: input.dueAt === undefined ? existing.dueAt : input.dueAt,
        notes: input.notes === undefined ? existing.notes : input.notes,
        paidAt,
        updatedAt: new Date(),
      },
    });

    return {
      error: false,
      message: "Loan updated successfully",
      data: loan,
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error updating loan: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
