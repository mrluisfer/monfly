// lib/api/transaction/get-expense-by-category.server.ts
import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const getChartTypeByCategory = async ({ email }: { email: string }) => {
  try {
    const incomeResult = await prismaClient.transaction.groupBy({
      by: ["category"],
      where: { userEmail: email, type: "income" },
      _sum: { amount: true },
    });

    const expenseResult = await prismaClient.transaction.groupBy({
      by: ["category"],
      where: { userEmail: email, type: "expense" },
      _sum: { amount: true },
    });

    const categories = new Set([
      ...incomeResult.map((r) => r.category),
      ...expenseResult.map((r) => r.category),
    ]);

    const data = Array.from(categories).map((category) => ({
      category,
      income:
        incomeResult.find((r) => r.category === category)?._sum.amount || 0,
      expense:
        expenseResult.find((r) => r.category === category)?._sum.amount || 0,
    }));

    return {
      data,
      message: "Income and expense by category retrieved successfully",
      success: true,
      error: false,
      statusCode: 200,
    } as ApiResponse<typeof data>;
  } catch (error) {
    return {
      data: null,
      message: "Failed to retrieve income/expense by category",
      success: false,
      error: true,
      statusCode: 500,
    } as ApiResponse<null>;
  }
};
