export type TransactionWithUser = {
  user?: {
    name: string | null;
    email: string;
    createdAt: Date;
    id: string;
    password: string;
    totalBalance: number;
    updatedAt: Date;
  };
  type: string;
  amount: number;
  createdAt: Date;
  id: string;
  userEmail: string;
  category: string;
  description: string | null;
  date: Date;
  updatedAt: Date;
  cardId: string | null;
  /** Loan this transaction is recorded as a payment of, if any. */
  appliedToLoanId?: string | null;
  /** Number of Loan rows linked to this transaction (>= 0). */
  loanCount?: number;
};

export type TransactionsWithUser = TransactionWithUser[];
