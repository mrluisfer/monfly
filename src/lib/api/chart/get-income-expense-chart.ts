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
      email: z.string(),
      cardId: z.uuid().nullable().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      scope: "chart:income-expense",
      limit: 120,
      windowMs: 60_000,
      identifier: sessionEmail,
    });

    return await getIncomeExpenseData({
      email: sessionEmail,
      cardId: data.cardId,
    });
  });
