import type { Transaction } from "@prisma/client";
import {
  applyLoanPaymentDelta,
  LoanPaymentError,
} from "~/server/db/loans/apply-loan-payment";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

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
          delta: data.amount,
          loanId: data.appliedToLoanId,
          transactionType: data.type,
          userEmail: email,
        });
      }

      const signedDelta = data.type === "income" ? data.amount : -data.amount;

      await tx.user.update({
        data: {
          totalBalance: {
            increment: signedDelta,
          },
        },
        where: { email },
      });

      // Keep the per-card balance in sync within the same atomic transaction
      // using the SAME signed delta, so totalBalance and the sum of card
      // balances can never drift. updateMany scoped by userEmail enforces that
      // the card belongs to this user.
      if (data.cardId) {
        const { count } = await tx.card.updateMany({
          data: { balance: { increment: signedDelta } },
          where: { id: data.cardId, userEmail: email },
        });
        if (count === 0) {
          throw new Error("Card not found for this user");
        }
      }

      return created;
    });

    return {
      data: transaction,
      error: false,
      message: "Transaction created successfully",
      statusCode: 200,
      success: true,
    } as ApiResponse<Transaction>;
  } catch (error) {
    if (error instanceof LoanPaymentError) {
      return {
        data: null,
        error: true,
        message: error.message,
        statusCode: error.statusCode,
        success: false,
      } as ApiResponse<null>;
    }
    return {
      data: null,
      error: true,
      message: "Error creating transaction",
      statusCode: 500,
      success: false,
    } as ApiResponse<string | null>;
  }
};
