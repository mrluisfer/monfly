import { createServerFn } from "@tanstack/react-start";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

/** Everything we hold for the session user, ready to serialize as JSON. */
export const exportUserDataServer = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const sessionEmail = await resolveSessionEmail();
      // Heavy query: a few exports a minute is plenty.
      enforceRateLimit({
        scope: "user:export",
        limit: 5,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      const where = { userEmail: sessionEmail };
      const [
        user,
        transactions,
        loans,
        categories,
        cards,
        budgets,
        pots,
        recurringBills,
        monthlySummaries,
      ] = await prismaClient.$transaction([
        prismaClient.user.findUniqueOrThrow({
          where: { email: sessionEmail },
          // Never export the password hash.
          omit: { password: true },
        }),
        prismaClient.transaction.findMany({ where, orderBy: { date: "desc" } }),
        prismaClient.loan.findMany({ where, orderBy: { issuedAt: "desc" } }),
        prismaClient.category.findMany({ where, orderBy: { name: "asc" } }),
        prismaClient.card.findMany({ where, orderBy: { createdAt: "asc" } }),
        prismaClient.budget.findMany({ where, orderBy: { startDate: "desc" } }),
        prismaClient.pot.findMany({ where, orderBy: { createdAt: "asc" } }),
        prismaClient.recurringBill.findMany({
          where,
          orderBy: { nextDueDate: "asc" },
        }),
        prismaClient.monthlySummary.findMany({
          where,
          orderBy: [{ year: "desc" }, { month: "desc" }],
        }),
      ]);

      return {
        error: false,
        message: "Export ready",
        success: true,
        statusCode: 200,
        data: {
          // ponytail: no version field until the shape actually changes.
          exportedAt: new Date().toISOString(),
          user,
          transactions,
          loans,
          categories,
          cards,
          budgets,
          pots,
          recurringBills,
          monthlySummaries,
        },
      };
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error exporting your data",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  },
);
