import { z } from "zod";

import { CARD_STATUSES } from "~/constants/card-status";

/**
 * Form-level schema (string inputs from React Hook Form).
 * The server function receives a different shape (numbers).
 */
const FOUR_DIGITS = /^\d{4}$/;

export const CardFormSchema = z.object({
  balance: z
    .string()
    .optional()
    .refine((v) => !v || Number.isFinite(Number(v)), {
      message: "Balance must be a number",
    }),
  color: z.string().max(20).optional().nullable(),
  last4: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || FOUR_DIGITS.test(v), {
      message: "Last 4 must be exactly 4 digits",
    }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Card name is required" })
    .max(60, { message: "Card name is too long" }),
  provider: z.string().max(60).optional().nullable(),
  type: z.string().max(40).optional().nullable(),
});

export type CardFormValues = z.infer<typeof CardFormSchema>;

/**
 * Server-level schema for creating a card.
 */
export const CreateCardInputSchema = z.object({
  balance: z.number().nullable().optional(),
  color: z.string().max(20).nullable().optional(),
  last4: z
    .string()
    .regex(/^\d{4}$/)
    .nullable()
    .optional(),
  name: z.string().trim().min(1).max(60),
  provider: z.string().max(60).nullable().optional(),
  type: z.string().max(40).nullable().optional(),
});

export type CreateCardInput = z.infer<typeof CreateCardInputSchema>;

/**
 * Server-level schema for updating a card. All fields optional except id.
 */
export const UpdateCardInputSchema = z.object({
  balance: z.number().nullable().optional(),
  color: z.string().max(20).nullable().optional(),
  id: z.uuid(),
  last4: z
    .string()
    .regex(/^\d{4}$/)
    .nullable()
    .optional(),
  name: z.string().trim().min(1).max(60).optional(),
  provider: z.string().max(60).nullable().optional(),
  status: z.enum(CARD_STATUSES).optional(),
  type: z.string().max(40).nullable().optional(),
});

export type UpdateCardInput = z.infer<typeof UpdateCardInputSchema>;
