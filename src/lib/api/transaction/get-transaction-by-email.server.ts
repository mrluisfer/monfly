import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getTransactionByEmail } from "~/utils/transactions/get-transaction-by-email";

export const getTransactionByEmailServer = createServerFn({ method: "GET" })
  .validator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    return await getTransactionByEmail(data.email);
  });
