import { createServerFn } from "@tanstack/react-start";

import { getTransactionById as getTransactionByIdUtils } from "~/server/db/transactions/get-transaction-by-id";

export const getTransactionByIdServer = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    return await getTransactionByIdUtils(data);
  });
