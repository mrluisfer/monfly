import { z } from "zod";

import {
  LOAN_MODES,
  transactionFormNames,
} from "~/constants/forms/transaction-form-names";

export const TransactionFormSchema = z
  .object({
    [transactionFormNames.amount]: z
      .string()
      .min(1, { message: "Amount is required" })
      .refine((v) => Number.isFinite(Number(v)) && Number(v) > 0, {
        message: "Amount must be a positive number",
      })
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
    // Loan section ─ tri-state mode + per-mode optional fields.
    [transactionFormNames.loanMode]: z.enum(LOAN_MODES).default("none"),
    [transactionFormNames.loanDebtor]: z.string().optional(),
    [transactionFormNames.loanDueAt]: z.date().nullable().optional(),
    [transactionFormNames.appliedToLoanId]: z
      .string()
      .uuid()
      .nullable()
      .optional(),
    // Legacy alias kept so older callers don't break; the form derives this
    // from `loanMode === "create"` before submitting.
    [transactionFormNames.markAsLoan]: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const mode = data[transactionFormNames.loanMode];

    if (mode === "create") {
      const debtor = (data[transactionFormNames.loanDebtor] ?? "").trim();
      if (!debtor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debtor is required when creating a loan",
          path: [transactionFormNames.loanDebtor],
        });
      }
    }

    if (mode === "apply") {
      const loanId = data[transactionFormNames.appliedToLoanId];
      if (!loanId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pick a loan to apply this payment to",
          path: [transactionFormNames.appliedToLoanId],
        });
      }
    }
  });
