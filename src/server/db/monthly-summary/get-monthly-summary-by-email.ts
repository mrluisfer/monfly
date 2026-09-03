import type { MonthlySummary } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const getMonthlySummaryByEmail = async (data: { email: string }) => {
  try {
    const monthlySummary: MonthlySummary[] | null =
      await prismaClient.monthlySummary.findMany({
        where: {
          userEmail: data.email,
        },
      });

    if (!monthlySummary) {
      return {
        data: [],
        error: true,
        message: "No monthly summary found",
        statusCode: 404,
        success: false,
      } as ApiResponse<MonthlySummary[]>;
    }

    return {
      data: monthlySummary,
      error: false,
      message: "Monthly summary fetched successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<MonthlySummary[]>;
  } catch {
    return {
      data: [],
      error: true,
      message: "Error fetching monthly summary",
      statusCode: 500,
      success: false,
    } as ApiResponse<MonthlySummary[]>;
  }
};
