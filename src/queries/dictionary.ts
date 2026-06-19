export enum queryDictionary {
  user = "user",
  session = "session",
  transactions = "transactions",
  categories = "categories",
  // Common prefix for every chart query (see queryKeys.charts in
  // src/utils/query-keys.ts) so they can all be invalidated with a single
  // prefix match: [charts, userEmail].
  charts = "charts",
  transactionsByMonth = "transactions-by-month",
  incomeExpenseData = "income-expense-data",
  incomeExpenseByCategory = "income-expense-by-category",
  trendingMonthly = "trending-monthly",
  dailyActivity = "daily-activity",
  loans = "loans",
  activeLoans = "active-loans",
  loanDebtors = "loan-debtors",
  cards = "cards",
  totalExpenses = "total-expenses",
}
