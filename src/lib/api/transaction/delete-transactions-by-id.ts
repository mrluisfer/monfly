import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { deleteTransactionsById } from "../../../utils/transactions/delete-transactions-by-id";

export const deleteTransactionsByIdServer = createServerFn({ method: "POST" })
  .inputValidator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => {
    return await deleteTransactionsById(data.ids);
  });
