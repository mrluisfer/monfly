import type { Transaction } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";
import {
  applyLoanPaymentDelta,
  LoanPaymentError,
} from "~/server/db/loans/apply-loan-payment";

export const postTransactionByEmail = async (
  email: string,
  data: Transaction,
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

      const signedDelta = data.type === "income" ? data.amount : -data.amount;

      await tx.user.update({
        where: { email },
        data: {
          totalBalance: {
            increment: signedDelta,
          },
        },
      });

      // Keep the per-card balance in sync within the same atomic transaction
      // using the SAME signed delta, so totalBalance and the sum of card
      // balances can never drift. updateMany scoped by userEmail enforces that
      // the card belongs to this user.
      if (data.cardId) {
        const { count } = await tx.card.updateMany({
          where: { id: data.cardId, userEmail: email },
          data: { balance: { increment: signedDelta } },
        });
        if (count === 0) {
          throw new Error("Card not found for this user");
        }
      }

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
