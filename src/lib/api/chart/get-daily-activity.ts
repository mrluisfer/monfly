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
      email: z.string(),
      cardId: z.uuid().nullable().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      scope: "chart:daily-activity",
      limit: 120,
      windowMs: 60_000,
      identifier: sessionEmail,
    });

    return await getDailyActivity({ email: sessionEmail, cardId: data.cardId });
  });
