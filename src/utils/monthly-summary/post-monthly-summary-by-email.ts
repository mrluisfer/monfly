import type { MonthlySummary } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const postMonthlySummaryByEmail = async (data: { email: string }) => {
  try {
    const monthlySummary = await prismaClient.monthlySummary.create({
      data: {
        userEmail: data.email,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
    });

    return {
      success: true,
      message: "Monthly summary created successfully",
      monthlySummary,
      data: monthlySummary,
      error: false,
      statusCode: 200,
    } as ApiResponse<MonthlySummary>;
  } catch (error) {
    return {
      error: true,
      message: "Error creating monthly summary",
      data: null,
      success: false,
      statusCode: 500,
    } as ApiResponse<MonthlySummary | null>;
  }
};
