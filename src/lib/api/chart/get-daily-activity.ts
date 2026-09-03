import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDailyActivity } from "~/server/db/charts/get-daily-activity";
import {
  enforceRateLimit,
  resolveSessionEmail,
} from "~/server/security/request-protection";

export const getDailyActivityServer = createServerFn({ method: "GET" })
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
      scope: "chart:daily-activity",
      windowMs: 60_000,
    });

    return await getDailyActivity({ cardId: data.cardId, email: sessionEmail });
  });
