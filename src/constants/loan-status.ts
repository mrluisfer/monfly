export const LOAN_STATUSES = ["pending", "partial", "paid"] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];

export const LOAN_STATUS_LABEL: Record<LoanStatus, string> = {
  paid: "Paid",
  partial: "Partial",
  pending: "Pending",
};

export const LOAN_DIRECTIONS = ["lent", "borrowed"] as const;
export type LoanDirection = (typeof LOAN_DIRECTIONS)[number];

export const LOAN_DIRECTION_LABEL: Record<LoanDirection, string> = {
  borrowed: "I owe",
  lent: "Owed to me",
};
