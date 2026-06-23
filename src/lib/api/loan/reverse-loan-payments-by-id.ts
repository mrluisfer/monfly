import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { deleteTransactionById } from "~/server/db/transactions/delete-transaction-by-id";
import { prismaClient } from "~/server/prisma";
import {
  enforceRateLimit,
  resolveSessionEmail,
  toSecurityErrorResponse,
} from "~/server/security/request-protection";
import type { ApiResponse } from "~/types/ApiResponse";

/**
 * Reopen a loan by reversing every payment transaction linked to it
 * (`appliedToLoanId`). Deleting each payment runs the existing balance + loan
 * reversal, so totalBalance, card balances and `Loan.amountPaid`/`status` all
 * return to where they were before the payments were recorded.
 */
export const reverseLoanPaymentsByIdServer = createServerFn({ method: "POST" })
  .inputValidator(z.object({ loanId: z.string().uuid() }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        scope: "loan:reopen",
        limit: 30,
        windowMs: 20_000,
        identifier: sessionEmail,
      });

      const payments = await prismaClient.transaction.findMany({
        where: { appliedToLoanId: data.loanId, userEmail: sessionEmail },
        select: { id: true },
      });

      // ponytail: delete each payment in its own atomic tx, reusing the existing
      // balance+loan reversal. Fine for the handful of payments a loan carries;
      // batch into one $transaction if a loan ever accrues many.
      for (const p of payments) {
        await deleteTransactionById(p.id);
      }

      // Legacy loans marked paid before payments were transactions have no
      // payment rows to reverse — reset their state directly so Reopen still works.
      if (payments.length === 0) {
        await prismaClient.loan.updateMany({
          where: { id: data.loanId, userEmail: sessionEmail },
          data: {
            amountPaid: 0,
            status: "pending",
            paidAt: null,
            updatedAt: new Date(),
          },
        });
      }

      return {
        error: false,
        message: "Loan reopened",
        data: null,
        success: true,
        statusCode: 200,
      } as ApiResponse<null>;
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        error: true,
        message: "Error reopening loan",
        data: null,
        success: false,
        statusCode: 500,
      } as ApiResponse<null>;
    }
  });
