import { createServerFn } from "@tanstack/react-start";
import { transactionTypes } from "~/constants/transaction-types";
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
    console.log("Fetching chart type by category with data:", data);
    return await getChartTypeByCategory(data);
  });
