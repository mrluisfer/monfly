import { createServerFn } from "@tanstack/react-start";
import { getIncomeExpenseData } from "~/utils/charts/get-income-expense-chart";
import { z } from "zod";

export const getIncomeExpenseDataServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
    })
  )
  .handler(async ({ data }) => {
    return await getIncomeExpenseData(data);
  });
