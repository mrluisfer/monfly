import { Prisma } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

const monthsToShow = 6;

export const getIncomeExpenseData = async ({
  email,
  cardId,
}: {
  email: string;
  cardId?: string | null;
}) => {
  try {
    const now = new Date();
    // Work in UTC end-to-end: stored dates are UTC and date_trunc below
    // returns UTC, so the month frame must be built the same way or buckets
    // could shift by one month on non-UTC machines.
    const windowStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsToShow + 1, 1),
    );

    // Aggregate in the database instead of loading every transaction row;
    // this stays O(months) in transfer size no matter how large the history.
    const cardFilter = cardId
      ? Prisma.sql`AND "cardId" = ${cardId}`
      : Prisma.empty;

    const rows = await prismaClient.$queryRaw<
      { month: Date; type: string; total: number }[]
    >`
      SELECT date_trunc('month', "date") AS month,
             "type",
             SUM("amount")::float AS total
      FROM "Transaction"
      WHERE "userEmail" = ${email}
        AND "date" >= ${windowStart}
        AND "date" <= ${now}
        ${cardFilter}
      GROUP BY 1, 2
    `;

    interface ChartRow {
      expense: number;
      income: number;
      month: string;
      year: number;
    }

    const summaryMap = new Map<string, ChartRow>();
    for (const row of rows) {
      const date = new Date(row.month);
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      let entry = summaryMap.get(key);
      if (!entry) {
        entry = {
          expense: 0,
          income: 0,
          // Fixed locale so labels are deterministic across environments
          // ("default" yields e.g. "enero" on a Spanish-locale machine).
          month: date.toLocaleString("en-US", {
            month: "long",
            timeZone: "UTC",
          }),
          year: date.getUTCFullYear(),
        };
        summaryMap.set(key, entry);
      }
      if (row.type === "income") {
        entry.income = row.total;
      }
      if (row.type === "expense") {
        entry.expense = row.total;
      }
    }

    // Fill the full window so months without transactions still chart as 0.
    const chartData: ChartRow[] = [];
    for (let i = monthsToShow - 1; i >= 0; i -= 1) {
      const date = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
      );
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      chartData.push(
        summaryMap.get(key) ?? {
          expense: 0,
          income: 0,
          month: date.toLocaleString("en-US", {
            month: "long",
            timeZone: "UTC",
          }),
          year: date.getUTCFullYear(),
        },
      );
    }

    return {
      data: chartData,
      error: false,
      message: "Income and expense data retrieved successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<typeof chartData>;
  } catch {
    return {
      data: null,
      error: true,
      message: "Failed to retrieve income and expense data",
      statusCode: 500,
      success: false,
    } as ApiResponse<null>;
  }
};
