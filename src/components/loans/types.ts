import type { LoanDirection, LoanStatus } from "~/constants/loan-status";
import { Loan } from "@prisma/client";

export type StatusFilter = "all" | LoanStatus;
export type DirectionFilter = "all" | LoanDirection;

/** The shape a loan row needs to render — a structural subset of the API model. */
export type LoanRow = Loan;

/** Editable fields surfaced by the edit dialog. */
export type EditLoanPatch = {
  debtor?: string;
  amount?: number;
  direction?: LoanDirection;
};
