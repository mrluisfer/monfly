import { createServerFn } from "@tanstack/react-start";
import { transactionTypes } from "~/constants/transaction-types";
import { enforceRateLimit, resolveSessionEmail } from "~/utils/security/request-protection";
import { getChartTypeByCategory } from "~/utils/charts/get-chart-type-by-category";
import { z } from "zod";

const TransactionTypesEnum = z.enum([
  transactionTypes.INCOME,
  transactionTypes.EXPENSE,
]);

export const getChartTypeByCategoryServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
    })
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
