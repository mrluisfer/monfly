import { createServerFn } from "@tanstack/react-start";
import { getTransactionsCountByMonth } from "~/utils/charts/get-transaction-count-by-month";
import { z } from "zod";

export const getTransactionsCountByMonthServer = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    return await getTransactionsCountByMonth({ email: data.email });
  });
