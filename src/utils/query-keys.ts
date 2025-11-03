import { queryDictionary } from "~/queries/dictionary";

/**
 * Type-safe query key factories for consistent query key generation
 */
export const queryKeys = {
  // User queries
  user: {
    all: () => [queryDictionary.user] as const,
    byEmail: (email: string) => [queryDictionary.user, email] as const,
  },

  // Transaction queries
  transactions: {
    all: () => [queryDictionary.transactions] as const,
    byEmail: (email: string) => [queryDictionary.transactions, email] as const,
    byMonth: (email: string) =>
      [queryDictionary.transactionsByMonth, email] as const,
  },

  // Category queries
  categories: {
    all: () => [queryDictionary.categories] as const,
    byEmail: (email: string) => [queryDictionary.categories, email] as const,
  },

  // Chart queries
  charts: {
    incomeExpense: (email: string) =>
      [queryDictionary.incomeExpenseData, email] as const,
    byCategory: (email: string) =>
      [queryDictionary.incomeExpenseByCategory, email] as const,
    trending: (email: string, type: "income" | "expense") =>
      [queryDictionary.trendingMonthly, email, type] as const,
  },
} as const;

/**
 * Type helper for query keys
 */
export type QueryKey = ReturnType<
  (typeof queryKeys)[keyof typeof queryKeys][keyof (typeof queryKeys)[keyof typeof queryKeys]]
>;
