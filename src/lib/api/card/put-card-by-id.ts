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
  .inputValidator(UpdateCardInputSchema)
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "card:update",
        limit: 20,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      return await putCardById(sessionEmail, data);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error updating card",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
