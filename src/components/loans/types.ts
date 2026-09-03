import type { Loan } from "@prisma/client";
import type { LoanDirection, LoanStatus } from "~/constants/loan-status";

export type StatusFilter = "all" | LoanStatus;
export type DirectionFilter = "all" | LoanDirection;

/** The shape a loan row needs to render — a structural subset of the API model. */
export type LoanRow = Loan;

/** Editable fields surfaced by the edit dialog. */
export interface EditLoanPatch {
  amount?: number;
  debtor?: string;
  direction?: LoanDirection;
}
