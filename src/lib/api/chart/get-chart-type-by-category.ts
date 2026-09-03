import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getChartTypeByCategory } from "~/server/db/charts/get-chart-type-by-category";
import {
  enforceRateLimit,
  resolveSessionEmail,
} from "~/server/security/request-protection";

export const getChartTypeByCategoryServer = createServerFn({ method: "GET" })
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
      scope: "chart:category-breakdown",
      windowMs: 60_000,
    });

    return await getChartTypeByCategory({
      ...data,
      email: sessionEmail,
    });
  });
