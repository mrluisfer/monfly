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
  .validator(
    z.object({
      acceptPrivacy: z.boolean(),
      acceptTerms: z.boolean(),
      email: z.string().email(),
      marketingOptIn: z.boolean().optional(),
      name: z.string().trim().min(1).max(80),
      preferredCurrency: z.enum(supportedCurrencies).nullable().optional(),
      productUpdatesOptIn: z.boolean().optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 20,
        scope: "user:profile:update",
        windowMs: 20_000,
      });

      return await updateUserProfile({ ...data, email: sessionEmail });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error updating profile",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
