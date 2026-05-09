import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";
import {
  applyLoanPaymentDelta,
  LoanPaymentError,
} from "~/server/db/loans/apply-loan-payment";

export const postTransactionByEmail = async (
  email: string,
  data: Transaction
) => {
  try {
    const transaction = await prismaClient.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          ...data,
          userEmail: email,
        },
      });

      // If the transaction is being applied as a payment to an existing loan,
      // update Loan.amountPaid / status / paidAt in the same DB transaction
      // so we never end up with a transaction-without-loan-update inconsistency.
      if (data.appliedToLoanId) {
        await applyLoanPaymentDelta(tx, {
          loanId: data.appliedToLoanId,
          delta: data.amount,
          userEmail: email,
          transactionType: data.type,
        });
      }

      await tx.user.update({
        where: { email },
        data: {
          totalBalance: {
            increment: data.type === "income" ? data.amount : -data.amount,
          },
        },
      });

      return created;
    });

    return {
      error: false,
      message: "Transaction created successfully",
      data: transaction,
      success: true,
      statusCode: 200,
    } as ApiResponse<Transaction>;
  } catch (error) {
    if (error instanceof LoanPaymentError) {
      return {
        error: true,
        message: error.message,
        data: null,
        success: false,
        statusCode: error.statusCode,
      } as ApiResponse<null>;
    }
    return {
      error: true,
      message: "Error creating transaction",
      data: null,
      success: false,
      statusCode: 500,
    } as ApiResponse<string | null>;
  }
};
