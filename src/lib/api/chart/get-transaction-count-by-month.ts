import { createServerFn } from "@tanstack/react-start";
import { enforceRateLimit, resolveSessionEmail } from "~/utils/security/request-protection";
import { getTransactionsCountByMonth } from "~/utils/charts/get-transaction-count-by-month";
import { z } from "zod";

export const getTransactionsCountByMonthServer = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ email: z.string() }))
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
