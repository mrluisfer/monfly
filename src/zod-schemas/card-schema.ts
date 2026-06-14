import { z } from "zod";

import { CARD_STATUSES } from "~/constants/card-status";

/**
 * Form-level schema (string inputs from React Hook Form).
 * The server function receives a different shape (numbers).
 */
export const CardFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Card name is required" })
    .max(60, { message: "Card name is too long" }),
  type: z.string().max(40).optional().nullable(),
  last4: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || /^\d{4}$/.test(v), {
      message: "Last 4 must be exactly 4 digits",
    }),
  provider: z.string().max(60).optional().nullable(),
  balance: z
    .string()
    .optional()
    .refine((v) => !v || Number.isFinite(Number(v)), {
      message: "Balance must be a number",
    }),
  color: z.string().max(20).optional().nullable(),
});

export type CardFormValues = z.infer<typeof CardFormSchema>;

/**
 * Server-level schema for creating a card.
 */
export const CreateCardInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  type: z.string().max(40).nullable().optional(),
  last4: z
    .string()
    .regex(/^\d{4}$/)
    .nullable()
    .optional(),
  provider: z.string().max(60).nullable().optional(),
  balance: z.number().nullable().optional(),
  color: z.string().max(20).nullable().optional(),
});

export type CreateCardInput = z.infer<typeof CreateCardInputSchema>;

/**
 * Server-level schema for updating a card. All fields optional except id.
 */
export const UpdateCardInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(60).optional(),
  type: z.string().max(40).nullable().optional(),
  last4: z
    .string()
    .regex(/^\d{4}$/)
    .nullable()
    .optional(),
  provider: z.string().max(60).nullable().optional(),
  balance: z.number().nullable().optional(),
  color: z.string().max(20).nullable().optional(),
  status: z.enum(CARD_STATUSES).optional(),
});

export type UpdateCardInput = z.infer<typeof UpdateCardInputSchema>;
