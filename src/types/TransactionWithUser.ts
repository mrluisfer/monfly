export interface TransactionWithUser {
  amount: number;
  /** Loan this transaction is recorded as a payment of, if any. */
  appliedToLoanId?: string | null;
  cardId: string | null;
  category: string;
  createdAt: Date;
  date: Date;
  description: string | null;
  id: string;
  /** Number of Loan rows linked to this transaction (>= 0). */
  loanCount?: number;
  type: string;
  updatedAt: Date;
  user?: {
    name: string | null;
    email: string;
    createdAt: Date;
    id: string;
    password: string;
    totalBalance: number;
    updatedAt: Date;
  };
  userEmail: string;
}

export type TransactionsWithUser = TransactionWithUser[];
