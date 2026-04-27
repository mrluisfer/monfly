export const transactionFormNames = {
  amount: "amount",
  type: "type",
  category: "category",
  description: "description",
  date: "date",
  // Optional inline-loan fields. When `markAsLoan` is true,
  // submitting the transaction also creates a Loan linked to it.
  markAsLoan: "markAsLoan",
  loanDebtor: "loanDebtor",
  loanDueAt: "loanDueAt",
} as const;
