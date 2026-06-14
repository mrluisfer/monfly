import { queryDictionary } from "~/queries/dictionary";

/**
 * Appends an optional cardId as the LAST key segment. When no card is active
 * the key is unchanged (so the aggregate "all cards" query keeps its identity
 * and existing cache stays valid); when a card is selected the key gets a
 * trailing cardId, keeping the shared prefix intact for prefix-invalidation.
 */
const withCard = <T extends readonly unknown[]>(
  key: T,
  cardId?: string | null,
) => (cardId ? ([...key, cardId] as const) : key);

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
    byEmail: (email: string, cardId?: string | null) =>
      withCard([queryDictionary.transactions, email] as const, cardId),
    // Kept under the [transactions, email] prefix so transaction mutations
    // (which invalidate that prefix) also refresh the total-expenses query.
    totalExpenses: (email: string, cardId?: string | null) =>
      withCard(
        [
          queryDictionary.transactions,
          email,
          queryDictionary.totalExpenses,
        ] as const,
        cardId,
      ),
  },

  // Category queries
  categories: {
    all: () => [queryDictionary.categories] as const,
    byEmail: (email: string) => [queryDictionary.categories, email] as const,
  },

  // Card queries
  cards: {
    all: (email: string) => [queryDictionary.cards, email] as const,
    byEmail: (email: string) => [queryDictionary.cards, email] as const,
  },

  // Chart queries. They all share the [charts, email] prefix so a single
  // invalidateQueries({ queryKey: queryKeys.charts.all(email) }) refreshes
  // every chart after a transaction/category mutation. An optional cardId is
  // appended last so card-scoped charts still match the [charts, email] prefix.
  charts: {
    all: (email: string) => [queryDictionary.charts, email] as const,
    incomeExpense: (email: string, cardId?: string | null) =>
      withCard(
        [
          queryDictionary.charts,
          email,
          queryDictionary.incomeExpenseData,
        ] as const,
        cardId,
      ),
    byCategory: (email: string, cardId?: string | null) =>
      withCard(
        [
          queryDictionary.charts,
          email,
          queryDictionary.incomeExpenseByCategory,
        ] as const,
        cardId,
      ),
    byMonth: (email: string, cardId?: string | null) =>
      withCard(
        [
          queryDictionary.charts,
          email,
          queryDictionary.transactionsByMonth,
        ] as const,
        cardId,
      ),
    trending: (
      email: string,
      type: "income" | "expense",
      cardId?: string | null,
    ) =>
      withCard(
        [
          queryDictionary.charts,
          email,
          queryDictionary.trendingMonthly,
          type,
        ] as const,
        cardId,
      ),
    dailyActivity: (email: string, cardId?: string | null) =>
      withCard(
        [queryDictionary.charts, email, queryDictionary.dailyActivity] as const,
        cardId,
      ),
  },
} as const;

/**
 * Type helper for query keys
 */
export type QueryKey = ReturnType<
  (typeof queryKeys)[keyof typeof queryKeys][keyof (typeof queryKeys)[keyof typeof queryKeys]]
>;
