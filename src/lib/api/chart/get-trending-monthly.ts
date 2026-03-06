import { createServerFn } from "@tanstack/react-start";
import { enforceRateLimit, resolveSessionEmail } from "~/utils/security/request-protection";
import { getTrendingMonthly } from "~/utils/charts/get-trending-monthly";
import { z } from "zod";

export const getTrendingMonthlyServer = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({ email: z.string(), type: z.enum(["income", "expense"]) })
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      scope: "chart:trending-monthly",
      limit: 120,
      windowMs: 60_000,
      identifier: sessionEmail,
    });

    return await getTrendingMonthly({
      ...data,
      email: sessionEmail,
    });
  });
