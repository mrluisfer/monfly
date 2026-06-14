import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { updateUserProfile } from "~/server/db/users/update-user-profile";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";
import { supportedCurrencies } from "~/zod-schemas/user-schema";

export const updateUserProfileServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      name: z.string().trim().min(1).max(80),
      preferredCurrency: z.enum(supportedCurrencies).nullable().optional(),
      marketingOptIn: z.boolean().optional(),
      productUpdatesOptIn: z.boolean().optional(),
      acceptTerms: z.boolean(),
      acceptPrivacy: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "user:profile:update",
        limit: 20,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      return await updateUserProfile({ ...data, email: sessionEmail });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error updating profile",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
