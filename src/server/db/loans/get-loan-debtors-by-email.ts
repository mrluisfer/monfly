import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "~/server/prisma";

/**
 * Distinct counterparty names (the `debtor` column, used for both debtors and
 * creditors) the user has saved on past loans, ordered most-used then
 * most-recent first. Powers the autocomplete in the loan form so a name typed
 * once can be picked again instead of retyped.
 *
 * Capped to a small payload — the client filters as the user types and only
 * shows a handful of matches — so we never ship the whole history.
 */
export const getLoanDebtorsByEmail = async (
  email: string,
): Promise<ApiResponse<string[] | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    const grouped = await prismaClient.loan.groupBy({
      by: ["debtor"],
      where: { userEmail: email },
      _count: { debtor: true },
      _max: { createdAt: true },
      orderBy: [
        { _count: { debtor: "desc" } },
        { _max: { createdAt: "desc" } },
      ],
      take: 50,
    });

    const debtors = grouped
      .map((group) => group.debtor.trim())
      .filter((name) => name.length > 0);

    return {
      error: false,
      message: "Loan debtors fetched successfully",
      data: debtors,
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error fetching loan debtors: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
