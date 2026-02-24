import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { putTransactionById as putTransactionByIdUtils } from "../../../utils/transactions/put-transaction-by-id";

export const putTransactionByIdServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: z.object({
        amount: z.number(),
        type: z.string(),
        category: z.string(),
        description: z.string(),
        date: z.date(),
      }),
    })
  )
  .handler(async ({ data }) => {
    return await putTransactionByIdUtils(data);
  });
