import { useQueryClient } from "@tanstack/react-query";

import type { LoanRow } from "~/components/loans/types";
import { type LoanDirection } from "~/constants/loan-status";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { reverseLoanPaymentsByIdServer } from "~/lib/api/loan/reverse-loan-payments-by-id";
import { postTransactionByEmailServer } from "~/lib/api/transaction/post-transaction-by-email";
import { sileo } from "~/lib/toaster";
import { getUserSession } from "~/server/db/users/get-user-session";
import {
  invalidateLoanQueries,
  invalidateTransactionQueries,
} from "~/utils/query-invalidation";

/**
 * Loan payments are real transactions, so they hit the balance:
 * - `lent` → the debtor pays you back → income.
 * - `borrowed` → you pay the creditor → expense.
 */
const PAYMENT_TYPE: Record<LoanDirection, "income" | "expense"> = {
  lent: "income",
  borrowed: "expense",
};

/**
 * Records loan payments as transactions (so totalBalance/card balances move)
 * and reopens loans by reversing those payments. Replaces the old direct
 * `Loan.amountPaid` writes which never touched the balance.
 */
export const useLoanPayment = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const pay = useMutation({
    fn: postTransactionByEmailServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        sileo.error({
          title:
            (data as { message?: string }).message ??
            "Failed to record payment",
        });
        return;
      }
      sileo.success({ title: "Payment recorded" });
      await invalidateTransactionQueries(queryClient, userEmail);
    },
  });

  const reopen = useMutation({
    fn: reverseLoanPaymentsByIdServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        sileo.error({
          title:
            (data as { message?: string }).message ?? "Failed to reopen loan",
        });
        return;
      }
      sileo.success({ title: "Loan reopened" });
      await Promise.all([
        invalidateTransactionQueries(queryClient, userEmail),
        invalidateLoanQueries(queryClient, userEmail),
      ]);
    },
  });

  const recordPayment = async (loan: LoanRow, amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    const { data: sessionEmail } = await getUserSession();
    if (!sessionEmail) return;
    const direction = (loan.direction ?? "lent") as LoanDirection;

    await pay.mutate({
      data: {
        email: sessionEmail,
        transaction: {
          amount,
          type: PAYMENT_TYPE[direction],
          category: "debt",
          // Reuse the loan's notes as the description when present; otherwise
          // leave it empty (the loan link still carries the context).
          description: loan.notes?.trim() || null,
          date: new Date(),
          appliedToLoanId: loan.id,
          // No card by default; the user can assign one later by editing the tx.
          cardId: null,
        },
      },
    });
  };

  /** Pay off the full outstanding balance in one transaction. */
  const markPaid = (loan: LoanRow) =>
    recordPayment(loan, Math.max(loan.amount - loan.amountPaid, 0));

  const markPending = (loan: LoanRow) =>
    reopen.mutate({ data: { loanId: loan.id } });

  return { recordPayment, markPaid, markPending };
};
