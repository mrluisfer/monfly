import { createServerFn } from "@tanstack/react-start";
import { getCardsByEmail } from "~/server/db/cards/get-cards-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";
import { z } from "zod";

export const getCardsByEmailServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
      status: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        scope: "card:list",
        limit: 120,
        windowMs: 60_000,
        identifier: sessionEmail,
      });

      return await getCardsByEmail({
        email: sessionEmail,
        status: data.status,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error fetching cards",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
