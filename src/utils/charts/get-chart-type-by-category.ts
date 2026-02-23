import { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "../prisma";

export const getChartTypeByCategory = async ({ email }: { email: string }) => {
  try {
    const result = await prismaClient.transaction.groupBy({
      by: ["category", "type"],
      where: { userEmail: email },
      _sum: { amount: true },
    });

    const categoryMap = new Map<
      string,
      { category: string; income: number; expense: number }
    >();

    for (const row of result) {
      if (!categoryMap.has(row.category)) {
        categoryMap.set(row.category, {
          category: row.category,
          income: 0,
          expense: 0,
        });
      }
      const entry = categoryMap.get(row.category)!;
      if (row.type === "income") {
        entry.income = row._sum.amount ?? 0;
      } else if (row.type === "expense") {
        entry.expense = row._sum.amount ?? 0;
      }
    }

    const data = Array.from(categoryMap.values());

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
