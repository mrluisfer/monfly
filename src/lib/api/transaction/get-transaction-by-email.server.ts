import { createServerFn } from "@tanstack/react-start";
import { getTransactionsByEmail } from "~/utils/transactions/get-transactions-by-email";
import { z } from "zod";

export const getTransactionByEmailServer = createServerFn({ method: "GET" })
  .validator(
    z.object({
      email: z.string(),
      page: z.number().optional(),
      pageSize: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    return await getTransactionsByEmail(data);
  });
