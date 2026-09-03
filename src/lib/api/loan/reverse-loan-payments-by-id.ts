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
  .validator(z.object({ loanId: z.uuid() }))
  .handler(async ({ data }) => {
    try {
      const sessionEmail = await resolveSessionEmail();
      enforceRateLimit({
        identifier: sessionEmail,
        limit: 30,
        scope: "loan:reopen",
        windowMs: 20_000,
      });

      const payments = await prismaClient.transaction.findMany({
        select: { id: true },
        where: { appliedToLoanId: data.loanId, userEmail: sessionEmail },
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
          data: {
            amountPaid: 0,
            paidAt: null,
            status: "pending",
            updatedAt: new Date(),
          },
          where: { id: data.loanId, userEmail: sessionEmail },
        });
      }

      return {
        data: null,
        error: false,
        message: "Loan reopened",
        statusCode: 200,
        success: true,
      } as ApiResponse<null>;
    } catch (error) {
      const securityErrorResponse = toSecurityErrorResponse(error);
      if (securityErrorResponse) {
        return securityErrorResponse as ApiResponse<null>;
      }

      return {
        data: null,
        error: true,
        message: "Error reopening loan",
        statusCode: 500,
        success: false,
      } as ApiResponse<null>;
    }
  });
