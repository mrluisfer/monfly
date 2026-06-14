import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { postCardByEmail } from "~/server/db/cards/post-card-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";
import { CreateCardInputSchema } from "~/zod-schemas/card-schema";

export const postCardByEmailServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string(),
      card: CreateCardInputSchema,
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "card:create",
        limit: 10,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      return await postCardByEmail(sessionEmail, data.card);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error creating card",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
