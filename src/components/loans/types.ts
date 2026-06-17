import type { LoanDirection, LoanStatus } from "~/constants/loan-status";

export type StatusFilter = "all" | LoanStatus;
export type DirectionFilter = "all" | LoanDirection;

/** The shape a loan row needs to render — a structural subset of the API model. */
export type LoanRow = {
  id: string;
  debtor: string;
  amount: number;
  amountPaid: number;
  status: string;
  direction?: string | null;
  dueAt?: Date | string | null;
  notes?: string | null;
};

/** Editable fields surfaced by the edit dialog. */
export type EditLoanPatch = {
  debtor?: string;
  amount?: number;
  direction?: LoanDirection;
};
