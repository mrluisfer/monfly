import type { Loan } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

type GetLoansParams = {
  email: string;
  status?: string;
};

interface LoansResponse<T> extends ApiResponse<T> {
  total: number;
}

export const getLoansByEmail = async ({
  email,
  status,
}: GetLoansParams): Promise<LoansResponse<Loan[] | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    const where = {
      userEmail: email,
      ...(status ? { status } : {}),
    };

    const [loans, total] = await Promise.all([
      prismaClient.loan.findMany({
        where,
        // ponytail: status desc happens to order pending→partial→paid
        // alphabetically, so paid loans sink to the bottom; within each group,
        // newest first. Switch to an explicit ordinal if statuses ever change.
        orderBy: [{ status: "desc" }, { createdAt: "desc" }],
      }),
      prismaClient.loan.count({ where }),
    ]);

    return {
      error: false,
      message: "Loans fetched successfully",
      data: loans,
      success: true,
      statusCode: 200,
      total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error fetching loans: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
      total: 0,
    };
  }
};
