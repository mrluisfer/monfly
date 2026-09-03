import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export interface ActiveLoanRow {
  amount: number;
  amountPaid: number;
  debtor: string;
  direction: string;
  dueAt: Date | null;
  id: string;
  status: string;
}

/**
 * Returns the user's loans that still have an outstanding balance
 * (status in "pending" | "partial"), projected to the minimum fields
 * the transaction form needs for its picker.
 *
 * `includeId` lets the edit flow keep showing the loan the transaction is
 * already applied to even if that loan is now fully paid — otherwise the
 * trigger label would fall back to "Select a loan" mid-edit.
 */
export const getActiveLoansByEmail = async (
  email: string,
  options: { includeId?: string | null } = {},
): Promise<ApiResponse<ActiveLoanRow[] | null>> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const includeId = options.includeId ?? null;
    const where = includeId
      ? {
          OR: [{ status: { in: ["pending", "partial"] } }, { id: includeId }],
          userEmail: email,
        }
      : {
          status: { in: ["pending", "partial"] },
          userEmail: email,
        };

    const loans = await prismaClient.loan.findMany({
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      select: {
        amount: true,
        amountPaid: true,
        debtor: true,
        direction: true,
        dueAt: true,
        id: true,
        status: true,
      },
      where,
    });

    return {
      data: loans,
      error: false,
      message: "Active loans fetched successfully",
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error fetching active loans: ${message}`,
      statusCode: 500,
      success: false,
    };
  }
};
