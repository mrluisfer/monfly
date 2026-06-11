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
  },

  // Category queries
  categories: {
    all: () => [queryDictionary.categories] as const,
    byEmail: (email: string) => [queryDictionary.categories, email] as const,
  },

  // Chart queries. They all share the [charts, email] prefix so a single
  // invalidateQueries({ queryKey: queryKeys.charts.all(email) }) refreshes
  // every chart after a transaction/category mutation.
  charts: {
    all: (email: string) => [queryDictionary.charts, email] as const,
    incomeExpense: (email: string) =>
      [
        queryDictionary.charts,
        email,
        queryDictionary.incomeExpenseData,
      ] as const,
    byCategory: (email: string) =>
      [
        queryDictionary.charts,
        email,
        queryDictionary.incomeExpenseByCategory,
      ] as const,
    byMonth: (email: string) =>
      [
        queryDictionary.charts,
        email,
        queryDictionary.transactionsByMonth,
      ] as const,
    trending: (email: string, type: "income" | "expense") =>
      [
        queryDictionary.charts,
        email,
        queryDictionary.trendingMonthly,
        type,
      ] as const,
  },
} as const;

/**
 * Type helper for query keys
 */
export type QueryKey = ReturnType<
  (typeof queryKeys)[keyof typeof queryKeys][keyof (typeof queryKeys)[keyof typeof queryKeys]]
>;
