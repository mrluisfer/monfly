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
  .validator(
    z.object({
      card: CreateCardInputSchema,
      email: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 10,
        scope: "card:create",
        windowMs: 20_000,
      });

      return await postCardByEmail(sessionEmail, data.card);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error creating card",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
