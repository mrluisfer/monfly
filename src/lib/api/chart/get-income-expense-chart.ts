import { createServerFn } from "@tanstack/react-start";
import { enforceRateLimit, resolveSessionEmail } from "~/utils/security/request-protection";
import { getIncomeExpenseData } from "~/utils/charts/get-income-expense-chart";
import { z } from "zod";

export const getIncomeExpenseDataServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      scope: "chart:income-expense",
      limit: 120,
      windowMs: 60_000,
      identifier: sessionEmail,
    });

    return await getIncomeExpenseData({ email: sessionEmail });
  });
