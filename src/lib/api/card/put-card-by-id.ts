import { createServerFn } from "@tanstack/react-start";

import { putCardById } from "~/server/db/cards/put-card-by-id";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";
import { UpdateCardInputSchema } from "~/zod-schemas/card-schema";

export const putCardByIdServer = createServerFn({ method: "POST" })
  .validator(UpdateCardInputSchema)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 20,
        scope: "card:update",
        windowMs: 20_000,
      });

      return await putCardById(sessionEmail, data);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error updating card",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
