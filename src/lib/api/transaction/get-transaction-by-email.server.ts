import { createServerFn } from "@tanstack/react-start";
import { getTransactionByEmail } from "~/utils/transactions/get-transaction-by-email";
import { z } from "zod";

export const getTransactionByEmailServer = createServerFn({ method: "GET" })
  .validator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    return await getTransactionByEmail(data.email);
  });
