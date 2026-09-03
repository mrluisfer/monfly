import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { postTransactionByEmail } from "~/server/db/transactions/post-transaction-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

export const postTransactionByEmailServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string(),
      transaction: z.object({
        amount: z.number(),
        appliedToLoanId: z.uuid().nullable().optional(),
        cardId: z.uuid().nullable().optional(),
        category: z.string(),
        date: z.date(),
        description: z.string().nullable().optional(),
        type: z.string(),
      }),
    }),
  )
  .handler(async ({ data: { email, transaction } }) => {
    try {
      const sessionEmail = await resolveSessionEmail(email);
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 10,
        scope: "transaction:create",
        windowMs: 20_000,
      });

      const fullTransaction = {
        ...transaction,
        appliedToLoanId: transaction.appliedToLoanId ?? null,
        cardId: transaction.cardId ?? null,
        createdAt: new Date(),
        description: transaction.description ?? null,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        userEmail: sessionEmail,
      };

      return await postTransactionByEmail(sessionEmail, fullTransaction);
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error creating transaction",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
