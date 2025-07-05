export enum transactionTypes  {
  INCOME= "income",
  EXPENSE = "expense",
};

export type TransactionType = (typeof transactionTypes)[keyof typeof transactionTypes];
