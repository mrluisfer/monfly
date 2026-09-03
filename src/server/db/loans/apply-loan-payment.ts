import type { Prisma } from "@prisma/client";

/**
 * Direction/type compatibility:
 * - A `lent` loan is paid by an `income` transaction (the debtor pays you).
 * - A `borrowed` loan is paid by an `expense` transaction (you pay the creditor).
 */
const COMPATIBLE_TYPE: Record<string, "income" | "expense"> = {
  borrowed: "expense",
  lent: "income",
};

export interface LoanPaymentDelta {
  /** Signed delta to apply to `Loan.amountPaid`. Can be negative when reversing. */
  delta: number;
  /** Loan being paid. */
  loanId: string;
  /** Transaction type ("income" | "expense"); validated against loan direction. */
  transactionType: string;
  /** Used to validate the loan/transaction belong to the same user. */
  userEmail: string;
}

export class LoanPaymentError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "LoanPaymentError";
    this.statusCode = statusCode;
  }
}

/**
 * Inside an existing Prisma `$transaction`, validate a transaction-to-loan
 * payment and apply the resulting delta to `Loan.amountPaid` / `status` /
 * `paidAt`. Centralizes the rules so create/update/delete behave identically.
 *
 * Rules enforced:
 * 1. Loan exists and belongs to the same user.
 * 2. Transaction type matches loan direction (lent↔income, borrowed↔expense).
 * 3. Resulting `amountPaid` stays within `[0, loan.amount]`.
 *
 * Status is derived from the resulting `amountPaid`:
 *   amountPaid <= 0          → "pending"
 *   amountPaid >= loan.amount → "paid"
 *   otherwise                 → "partial"
 */
export const applyLoanPaymentDelta = async (
  tx: Prisma.TransactionClient,
  { loanId, delta, userEmail, transactionType }: LoanPaymentDelta,
) => {
  const loan = await tx.loan.findFirst({
    select: { amount: true, amountPaid: true, direction: true, id: true },
    where: { id: loanId, userEmail },
  });

  if (!loan) {
    throw new LoanPaymentError("Loan not found", 404);
  }

  const expectedType = COMPATIBLE_TYPE[loan.direction];
  if (expectedType && transactionType !== expectedType) {
    throw new LoanPaymentError(
      loan.direction === "lent"
        ? "An 'Owed to me' loan can only be paid by an income transaction"
        : "An 'I owe' loan can only be paid by an expense transaction",
    );
  }

  const nextAmountPaid = loan.amountPaid + delta;

  if (nextAmountPaid < 0) {
    throw new LoanPaymentError(
      "This change would make the loan's paid amount negative",
    );
  }
  if (nextAmountPaid > loan.amount) {
    throw new LoanPaymentError(
      `Payment exceeds the loan's outstanding balance`,
    );
  }

  let nextStatus: "pending" | "partial" | "paid";
  if (nextAmountPaid <= 0) {
    nextStatus = "pending";
  } else if (nextAmountPaid >= loan.amount) {
    nextStatus = "paid";
  } else {
    nextStatus = "partial";
  }

  await tx.loan.update({
    data: {
      amountPaid: nextAmountPaid,
      paidAt: nextStatus === "paid" ? new Date() : null,
      status: nextStatus,
      updatedAt: new Date(),
    },
    where: { id: loan.id },
  });
};
