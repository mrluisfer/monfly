export const LOAN_STATUSES = ["pending", "partial", "paid"] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];

export const LOAN_STATUS_LABEL: Record<LoanStatus, string> = {
  pending: "Pending",
  partial: "Partial",
  paid: "Paid",
};
