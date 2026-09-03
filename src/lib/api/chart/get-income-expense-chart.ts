import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getIncomeExpenseData } from "~/server/db/charts/get-income-expense-chart";
import {
  enforceRateLimit,
  resolveSessionEmail,
} from "~/server/security/request-protection";

export const getIncomeExpenseDataServer = createServerFn({ method: "GET" })
  .validator(
    z.object({
      cardId: z.uuid().nullable().optional(),
      email: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      identifier: sessionEmail,
      limit: 120,
      scope: "chart:income-expense",
      windowMs: 60_000,
    });

    return await getIncomeExpenseData({
      cardId: data.cardId,
      email: sessionEmail,
    });
  });
