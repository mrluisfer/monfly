import { z } from "zod";

import { LOAN_DIRECTIONS, LOAN_STATUSES } from "~/constants/loan-status";

/**
 * Form-level schema (string inputs from React Hook Form).
 * The server function receives a different shape (numbers + Date).
 */
export const LoanFormSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine((v) => Number.isFinite(Number(v)) && Number(v) > 0, {
      message: "Amount must be a positive number",
    }),
  debtor: z
    .string()
    .trim()
    .min(1, { message: "Debtor name is required" })
    .max(120, { message: "Debtor name is too long" }),
  direction: z.enum(LOAN_DIRECTIONS),
  dueAt: z.date().optional().nullable(),
  issuedAt: z.date().optional(),
  notes: z.string().max(500).optional().nullable(),
  transactionId: z.uuid().optional().nullable(),
});

export type LoanFormValues = z.infer<typeof LoanFormSchema>;

/**
 * Server-level schema for creating a loan.
 */
export const CreateLoanInputSchema = z.object({
  amount: z.number().positive(),
  debtor: z.string().trim().min(1).max(120),
  direction: z.enum(LOAN_DIRECTIONS).optional(),
  dueAt: z.date().nullable().optional(),
  issuedAt: z.date().optional(),
  notes: z.string().max(500).nullable().optional(),
  transactionId: z.uuid().nullable().optional(),
});

export type CreateLoanInput = z.infer<typeof CreateLoanInputSchema>;

/**
 * Server-level schema for updating a loan. All fields optional except id.
 */
export const UpdateLoanInputSchema = z.object({
  amount: z.number().positive().optional(),
  amountPaid: z.number().min(0).optional(),
  debtor: z.string().trim().min(1).max(120).optional(),
  direction: z.enum(LOAN_DIRECTIONS).optional(),
  dueAt: z.date().nullable().optional(),
  id: z.uuid(),
  issuedAt: z.date().optional(),
  notes: z.string().max(500).nullable().optional(),
  status: z.enum(LOAN_STATUSES).optional(),
});

export type UpdateLoanInput = z.infer<typeof UpdateLoanInputSchema>;
