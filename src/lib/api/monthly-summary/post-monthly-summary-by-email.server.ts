import { createServerFn } from "@tanstack/react-start";
import { postMonthlySummaryByEmail as postMonthlySummaryByEmailUtils } from "../../../utils/monthly-summary/post-monthly-summary-by-email";

export const postMonthlySummaryByEmailServer = createServerFn({
  method: "POST",
})
  .validator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    return await postMonthlySummaryByEmailUtils(data);
  });
