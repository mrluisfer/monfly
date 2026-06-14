export const transactionFormNames = {
  amount: "amount",
  type: "type",
  category: "category",
  description: "description",
  date: "date",
  // Optional card/account this transaction belongs to. null = no card.
  cardId: "cardId",
  /**
   * Tri-state mode for the loan section of the transaction form:
   *  - "none"   → regular transaction (no loan linkage)
   *  - "create" → also create a new Loan tied to this transaction
   *  - "apply"  → record this transaction as a payment to an existing Loan
   */
  loanMode: "loanMode",
  // Field used by mode = "create"
  loanDebtor: "loanDebtor",
  loanDueAt: "loanDueAt",
  // Field used by mode = "apply"
  appliedToLoanId: "appliedToLoanId",
  // Legacy boolean kept for back-compat with any callers still toggling it.
  // Internally derived from loanMode === "create".
  markAsLoan: "markAsLoan",
} as const;

export const LOAN_MODES = ["none", "create", "apply"] as const;
export type LoanMode = (typeof LOAN_MODES)[number];
