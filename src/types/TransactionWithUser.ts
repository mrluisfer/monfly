export type TransactionWithUser = {
  user: {
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
};

export type TransactionsWithUser = TransactionWithUser[];
