import { z } from "zod";

import { transactionFormNames } from "~/constants/forms/transaction-form-names";

export const TransactionFormSchema = z
  .object({
    [transactionFormNames.amount]: z
      .string()
      .min(1, { message: "Amount is required" })
      .refine(
        (v) => Number.isFinite(Number(v)) && Number(v) > 0,
        { message: "Amount must be a positive number" }
      )
      .refine((v) => Number(v) < 1_000_000, {
        message: "Amount must be less than 1,000,000",
      }),
    [transactionFormNames.type]: z.enum(["income", "expense"], {
      errorMap: () => ({ message: "Type must be either income or expense" }),
    }),
    [transactionFormNames.category]: z
      .string()
      .min(1, { message: "Category is required" }),
    [transactionFormNames.description]: z.string().optional(),
    [transactionFormNames.date]: z.date().optional(),
    // Inline-loan extension (optional)
    [transactionFormNames.markAsLoan]: z.boolean().optional(),
    [transactionFormNames.loanDebtor]: z.string().optional(),
    [transactionFormNames.loanDueAt]: z.date().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data[transactionFormNames.markAsLoan]) {
      const debtor = (data[transactionFormNames.loanDebtor] ?? "").trim();
      if (!debtor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debtor is required when marking as a loan",
          path: [transactionFormNames.loanDebtor],
        });
      }
    }
  });
