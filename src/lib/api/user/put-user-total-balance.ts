import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { putUserTotalBalance as putUserTotalBalanceUtils } from "~/server/db/users/put-user-total-balance";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const putUserTotalBalanceServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      totalBalance: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail(data.email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 12,
        scope: "user:balance:update",
        windowMs: 20_000,
      });

      return await putUserTotalBalanceUtils({
        ...data,
        email: sessionEmail,
      });
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error updating user balance",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
