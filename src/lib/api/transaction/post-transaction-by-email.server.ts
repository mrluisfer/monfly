import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { postTransactionByEmail } from "~/utils/transactions/post-transaction-by-email";

export const postTransactionByEmailServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string(),
      transaction: z.object({
        type: z.string(),
        date: z.date(),
        amount: z.number(),
        category: z.string(),
        description: z.string().nullable().optional(),
      }),
    }),
  )
  .handler(async ({ data: { email, transaction } }) => {
    const fullTransaction = {
      ...transaction,
      description: transaction.description ?? null,
      id: crypto.randomUUID(),
      userEmail: email,
      createdAt: new Date(),
    };
    return await postTransactionByEmail(email, fullTransaction);
  });
