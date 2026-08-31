import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getTransactionsCountByMonth } from "~/server/db/charts/get-transaction-count-by-month";
import {
  enforceRateLimit,
  resolveSessionEmail,
} from "~/server/security/request-protection";

export const getTransactionsCountByMonthServer = createServerFn({
  method: "GET",
})
  .validator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      scope: "chart:transactions-count-by-month",
      limit: 120,
      windowMs: 60_000,
      identifier: sessionEmail,
    });

    return await getTransactionsCountByMonth({ email: sessionEmail });
  });
