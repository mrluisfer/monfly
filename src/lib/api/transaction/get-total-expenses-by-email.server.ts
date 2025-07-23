import { createServerFn } from "@tanstack/react-start";
import { getTotalExpensesByEmail } from "~/utils/transactions/get-total-expenses-by-email";
import z from "zod";

export const getTotalExpensesByEmailServer = createServerFn({ method: "GET" })
  .validator(
    z.object({
      email: z.string(),
    })
  )
  .handler(async ({ data }) => {
    return await getTotalExpensesByEmail(data);
  });
