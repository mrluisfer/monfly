import { createServerFn } from "@tanstack/react-start";
import { getTransactionById as getTransactionByIdUtils } from "../../../utils/transactions/get-transaction-by-id";

export const getTransactionByIdServer = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    return await getTransactionByIdUtils(data);
  });
