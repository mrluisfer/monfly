import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { deleteTransactionById as deleteTransactionByIdUtils } from "../../../utils/transactions/delete-transaction-by-id";

export const deleteTransactionByIdServer = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return await deleteTransactionByIdUtils(data.id);
  });
