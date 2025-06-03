export type TransactionWithUser = {
  user: {
    name: string | null;
    email: string;
    createdAt: Date;
    id: string;
    password: string;
    totalBalance: number;
  };
  type: string;
  amount: number;
  createdAt: Date;
  id: string;
  userEmail: string;
  category: string;
  description: string | null;
  date: Date;
};

export type TransactionsWithUser = TransactionWithUser[];
