import {
  changePasswordFormNames,
  userFormNames,
} from "~/constants/forms/user-form-names";
import { z } from "zod";

export const supportedCurrencies = ["MXN", "USD", "EUR", "GBP"] as const;
export type SupportedCurrency = (typeof supportedCurrencies)[number];

export const userFormSchema = z.object({
  [userFormNames.name]: z
    .string()
    .min(1, { message: "Name is required" })
    .max(80, { message: "Name is too long" }),
  [userFormNames.email]: z.string().email({ message: "Invalid email address" }),
  [userFormNames.totalBalance]: z
    .number()
    .min(0, { message: "Total balance must be a positive number" })
    .optional(),
  [userFormNames.preferredCurrency]: z.enum(supportedCurrencies).optional(),
  [userFormNames.marketingOptIn]: z.boolean().optional(),
  [userFormNames.productUpdatesOptIn]: z.boolean().optional(),
  [userFormNames.acceptTerms]: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms & Conditions to continue",
  }),
  [userFormNames.acceptPrivacy]: z.boolean().refine((v) => v === true, {
    message: "You must acknowledge the Privacy Policy to continue",
  }),
});

export const changePasswordSchema = z
  .object({
    [changePasswordFormNames.currentPassword]: z
      .string()
      .min(1, { message: "Your current password is required" }),
    [changePasswordFormNames.newPassword]: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[a-z]/, { message: "Include at least 1 lowercase letter" })
      .regex(/[A-Z]/, { message: "Include at least 1 uppercase letter" })
      .regex(/[0-9]/, { message: "Include at least 1 number" }),
    [changePasswordFormNames.confirmNewPassword]: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: [changePasswordFormNames.confirmNewPassword],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Your new password must be different from the current one",
    path: [changePasswordFormNames.newPassword],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
