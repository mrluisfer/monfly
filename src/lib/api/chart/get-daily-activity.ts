import { createServerFn } from "@tanstack/react-start";
import {
  enforceRateLimit,
  resolveSessionEmail,
} from "~/server/security/request-protection";
import { getDailyActivity } from "~/server/db/charts/get-daily-activity";
import { z } from "zod";

export const getDailyActivityServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
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

    return await getDailyActivity({ email: sessionEmail });
  });
