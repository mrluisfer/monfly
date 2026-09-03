import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export const getChartTypeByCategory = async ({
  email,
  cardId,
}: {
  email: string;
  cardId?: string | null;
}) => {
  try {
    const result = await prismaClient.transaction.groupBy({
      _sum: { amount: true },
      by: ["category", "type"],
      where: { userEmail: email, ...(cardId ? { cardId } : {}) },
    });

    const categoryMap = new Map<
      string,
      { category: string; income: number; expense: number }
    >();

    for (const row of result) {
      let entry = categoryMap.get(row.category);
      if (!entry) {
        entry = { category: row.category, expense: 0, income: 0 };
        categoryMap.set(row.category, entry);
      }
      if (row.type === "income") {
        entry.income = row._sum.amount ?? 0;
      } else if (row.type === "expense") {
        entry.expense = row._sum.amount ?? 0;
      }
    }

    const data = Array.from(categoryMap.values());

    return {
      data,
      error: false,
      message: "Income and expense by category retrieved successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<typeof data>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Failed to retrieve income/expense by category",
      statusCode: 500,
      success: false,
    } as ApiResponse<null>;
  }
};
