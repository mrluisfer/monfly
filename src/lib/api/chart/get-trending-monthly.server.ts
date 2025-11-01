import { createServerFn } from "@tanstack/react-start";
import { getTrendingMonthly } from "~/utils/charts/get-trending-monthly";
import { z } from "zod";

export const getTrendingMonthlyServer = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({ email: z.string(), type: z.enum(["income", "expense"]) })
  )
  .handler(async ({ data }) => {
    return await getTrendingMonthly(data);
  });
