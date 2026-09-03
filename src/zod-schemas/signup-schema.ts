import { z } from "zod";

export const signupSchema = z.object({
  acceptPrivacy: z.boolean().refine((v) => v === true, {
    message: "You must acknowledge the Privacy Policy to continue",
  }),
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms & Conditions to continue",
  }),
  email: z.string().email("Enter a valid email address."),
  name: z.string().min(3, "Name must be at least 3 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
