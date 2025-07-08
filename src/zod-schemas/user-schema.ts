import { userFormNames } from "~/constants/forms/user-form-names";
import { z } from "zod";

export const userFormSchema = z.object({
  [userFormNames.name]: z.string().min(1, { message: "Name is required" }),
  [userFormNames.email]: z.string().email({ message: "Invalid email address" }),
  [userFormNames.password]: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional(),
  [userFormNames.totalBalance]: z
    .number()
    .min(0, { message: "Total balance must be a positive number" })
    .optional(),
});
