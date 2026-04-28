import { z } from "zod";

import { LOAN_STATUSES } from "~/constants/loan-status";

/**
 * Form-level schema (string inputs from React Hook Form).
 * The server function receives a different shape (numbers + Date).
 */
export const LoanFormSchema = z.object({
  debtor: z
    .string()
    .trim()
    .min(1, { message: "Debtor name is required" })
    .max(120, { message: "Debtor name is too long" }),
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine((v) => Number.isFinite(Number(v)) && Number(v) > 0, {
      message: "Amount must be a positive number",
    }),
  issuedAt: z.date().optional(),
  dueAt: z.date().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  transactionId: z.string().uuid().optional().nullable(),
});

export type LoanFormValues = z.infer<typeof LoanFormSchema>;

/**
 * Server-level schema for creating a loan.
 */
export const CreateLoanInputSchema = z.object({
  debtor: z.string().trim().min(1).max(120),
  amount: z.number().positive(),
  issuedAt: z.date().optional(),
  dueAt: z.date().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
  transactionId: z.string().uuid().nullable().optional(),
});

export type CreateLoanInput = z.infer<typeof CreateLoanInputSchema>;

/**
 * Server-level schema for updating a loan. All fields optional except id.
 */
export const UpdateLoanInputSchema = z.object({
  id: z.string().uuid(),
  debtor: z.string().trim().min(1).max(120).optional(),
  amount: z.number().positive().optional(),
  amountPaid: z.number().min(0).optional(),
  status: z.enum(LOAN_STATUSES).optional(),
  issuedAt: z.date().optional(),
  dueAt: z.date().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export type UpdateLoanInput = z.infer<typeof UpdateLoanInputSchema>;
