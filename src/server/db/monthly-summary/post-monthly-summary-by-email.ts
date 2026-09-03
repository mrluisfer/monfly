import type { MonthlySummary } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const postMonthlySummaryByEmail = async (data: { email: string }) => {
  try {
    const monthlySummary = await prismaClient.monthlySummary.create({
      data: {
        month: new Date().getMonth(),
        userEmail: data.email,
        year: new Date().getFullYear(),
      },
    });

    return {
      data: monthlySummary,
      error: false,
      message: "Monthly summary created successfully",
      monthlySummary,
      statusCode: 200,
      success: true,
    } as ApiResponse<MonthlySummary>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Error creating monthly summary",
      statusCode: 500,
      success: false,
    } as ApiResponse<MonthlySummary | null>;
  }
};
