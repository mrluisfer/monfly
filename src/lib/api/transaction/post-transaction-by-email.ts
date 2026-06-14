import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import { postTransactionByEmail } from "~/server/db/transactions/post-transaction-by-email";
import z from "zod";

export const postTransactionByEmailServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string(),
      transaction: z.object({
        type: z.string(),
        date: z.date(),
        amount: z.number(),
        category: z.string(),
        description: z.string().nullable().optional(),
        appliedToLoanId: z.string().uuid().nullable().optional(),
        cardId: z.string().uuid().nullable().optional(),
      }),
    }),
  )
  .handler(async ({ data: { email, transaction } }) => {
    try {
      const sessionEmail = await resolveSessionEmail(email);
      enforceRateLimit({
        scope: "transaction:create",
        limit: 10,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      const fullTransaction = {
        ...transaction,
        description: transaction.description ?? null,
        appliedToLoanId: transaction.appliedToLoanId ?? null,
        cardId: transaction.cardId ?? null,
        id: crypto.randomUUID(),
        userEmail: sessionEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return await postTransactionByEmail(sessionEmail, fullTransaction);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error creating transaction",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
