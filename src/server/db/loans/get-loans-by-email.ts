import type { Loan } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

interface GetLoansParams {
  email: string;
  status?: string;
}

interface LoansResponse<T> extends ApiResponse<T> {
  total: number;
}

export const getLoansByEmail = async ({
  email,
  status,
}: GetLoansParams): Promise<LoansResponse<Loan[] | null>> => {
  if (!email) {
    return {
      data: null,
      error: true,
      message: "Email is required",
      statusCode: 400,
      success: false,
      total: 0,
    };
  }

  try {
    const where = {
      userEmail: email,
      ...(status ? { status } : {}),
    };

    const [loans, total] = await Promise.all([
      prismaClient.loan.findMany({
        // ponytail: status desc happens to order pending→partial→paid
        // alphabetically, so paid loans sink to the bottom; within each group,
        // newest first. Switch to an explicit ordinal if statuses ever change.
        orderBy: [{ status: "desc" }, { createdAt: "desc" }],
        where,
      }),
      prismaClient.loan.count({ where }),
    ]);

    return {
      data: loans,
      error: false,
      message: "Loans fetched successfully",
      statusCode: 200,
      success: true,
      total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error fetching loans: ${message}`,
      statusCode: 500,
      success: false,
      total: 0,
    };
  }
};
