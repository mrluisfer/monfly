import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/server/prisma";

export type ActiveLoanRow = {
  id: string;
  debtor: string;
  amount: number;
  amountPaid: number;
  status: string;
  direction: string;
  dueAt: Date | null;
};

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
  options: { includeId?: string | null } = {}
): Promise<ApiResponse<ActiveLoanRow[] | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    const includeId = options.includeId ?? null;
    const where = includeId
      ? {
          userEmail: email,
          OR: [
            { status: { in: ["pending", "partial"] } },
            { id: includeId },
          ],
        }
      : {
          userEmail: email,
          status: { in: ["pending", "partial"] },
        };

    const loans = await prismaClient.loan.findMany({
      where,
      select: {
        id: true,
        debtor: true,
        amount: true,
        amountPaid: true,
        status: true,
        direction: true,
        dueAt: true,
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    });

    return {
      error: false,
      message: "Active loans fetched successfully",
      data: loans,
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error fetching active loans: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
