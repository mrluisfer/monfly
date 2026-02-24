import { createServerFn } from "@tanstack/react-start";

import { getMonthlySummaryByEmail as getMonthlySummaryByEmailUtils } from "../../../utils/monthly-summary/get-monthly-summary-by-email";

export const getMonthlySummaryByEmailServer = createServerFn({ method: "GET" })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    return await getMonthlySummaryByEmailUtils(data);
  });
