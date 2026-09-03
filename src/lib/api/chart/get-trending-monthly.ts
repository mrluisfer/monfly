import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getTrendingMonthly } from "~/server/db/charts/get-trending-monthly";
import {
  enforceRateLimit,
  resolveSessionEmail,
} from "~/server/security/request-protection";

export const getTrendingMonthlyServer = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      cardId: z.uuid().nullable().optional(),
      email: z.string(),
      type: z.enum(["income", "expense"]),
    }),
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      identifier: sessionEmail,
      limit: 120,
      scope: "chart:trending-monthly",
      windowMs: 60_000,
    });

    return await getTrendingMonthly({
      ...data,
      email: sessionEmail,
    });
  });
