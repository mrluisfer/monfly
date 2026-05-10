import { userFormNames } from "~/constants/forms/user-form-names";
import { z } from "zod";

export const supportedCurrencies = ["MXN", "USD", "EUR", "GBP"] as const;
export type SupportedCurrency = (typeof supportedCurrencies)[number];

export const userFormSchema = z
  .object({
    [userFormNames.name]: z
      .string()
      .min(1, { message: "Name is required" })
      .max(80, { message: "Name is too long" }),
    [userFormNames.email]: z
      .string()
      .email({ message: "Invalid email address" }),
    [userFormNames.password]: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: "Password must be at least 8 characters",
      }),
    [userFormNames.confirmPassword]: z.string().optional(),
    [userFormNames.totalBalance]: z
      .number()
      .min(0, { message: "Total balance must be a positive number" })
      .optional(),
    [userFormNames.preferredCurrency]: z
      .enum(supportedCurrencies)
      .optional(),
    [userFormNames.marketingOptIn]: z.boolean().optional(),
    [userFormNames.productUpdatesOptIn]: z.boolean().optional(),
    [userFormNames.acceptTerms]: z.boolean().refine((v) => v === true, {
      message: "You must accept the Terms & Conditions to continue",
    }),
    [userFormNames.acceptPrivacy]: z.boolean().refine((v) => v === true, {
      message: "You must acknowledge the Privacy Policy to continue",
    }),
  })
  .refine(
    (data) => !data.password || data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: [userFormNames.confirmPassword],
    }
  );
