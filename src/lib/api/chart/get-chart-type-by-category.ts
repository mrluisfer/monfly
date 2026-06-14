import { createServerFn } from "@tanstack/react-start";
import {
  enforceRateLimit,
  resolveSessionEmail,
} from "~/server/security/request-protection";
import { getChartTypeByCategory } from "~/server/db/charts/get-chart-type-by-category";
import { z } from "zod";

export const getChartTypeByCategoryServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      scope: "chart:category-breakdown",
      limit: 120,
      windowMs: 60_000,
      identifier: sessionEmail,
    });

    return await getChartTypeByCategory({
      ...data,
      email: sessionEmail,
    });
  });
