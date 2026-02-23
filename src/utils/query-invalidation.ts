import { QueryClient } from "@tanstack/react-query";
import { queryDictionary } from "~/queries/dictionary";

/**
 * Invalidates all queries related to transaction data for a specific user.
 * This should be called after any CRUD operation on transactions to ensure
 * all charts and transaction lists are updated with fresh data.
 *
 * @param queryClient - The TanStack Query client instance
 * @param userEmail - The email of the user whose data should be invalidated
 */
export const invalidateTransactionQueries = async (
  queryClient: QueryClient,
  userEmail: string
): Promise<void> => {
  await Promise.all([
    // Core transaction and user data (categories excluded — they don't depend on transactions)
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.transactions, userEmail],
    }),
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.user, userEmail],
    }),
    // Chart data queries - these display transaction statistics and aggregations
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.transactionsByMonth, userEmail],
    }),
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.incomeExpenseData, userEmail],
    }),
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.incomeExpenseByCategory, userEmail],
    }),
    // Trending data queries - invalidate for both income and expense
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.trendingMonthly, userEmail, "income"],
    }),
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.trendingMonthly, userEmail, "expense"],
    }),
  ]);
};

/**
 * Invalidates all category-related queries for a specific user.
 * This should be called after creating, updating, or deleting categories.
 *
 * @param queryClient - The TanStack Query client instance
 * @param userEmail - The email of the user whose data should be invalidated
 */
export const invalidateCategoryQueries = async (
  queryClient: QueryClient,
  userEmail: string
): Promise<void> => {
  await Promise.all([
    // Core category data
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.categories, userEmail],
    }),
    // Also invalidate queries without userEmail (for global category queries)
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.categories],
    }),
    // Chart queries that depend on category data
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.incomeExpenseByCategory, userEmail],
    }),
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.transactionsByMonth, userEmail],
    }),
    // Trending data queries - categories affect trending calculations
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.trendingMonthly, userEmail, "income"],
    }),
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.trendingMonthly, userEmail, "expense"],
    }),
  ]);
};

/**
 * Invalidates user-related queries, particularly useful after balance updates.
 * This should be called after updating user balance or other user-specific data.
 *
 * @param queryClient - The TanStack Query client instance
 * @param userEmail - The email of the user whose data should be invalidated
 */
export const invalidateUserQueries = async (
  queryClient: QueryClient,
  userEmail: string
): Promise<void> => {
  await Promise.all([
    // User data
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.user, userEmail],
    }),
    // Global user queries (if any)
    queryClient.invalidateQueries({
      queryKey: [queryDictionary.user],
    }),
  ]);
};

/**
 * Invalidates ALL queries for a specific user. Use this sparingly,
 * only when you need a complete cache refresh (e.g., after major data changes).
 *
 * @param queryClient - The TanStack Query client instance
 * @param userEmail - The email of the user whose data should be invalidated
 */
export const invalidateAllUserQueries = async (
  queryClient: QueryClient,
  userEmail: string
): Promise<void> => {
  await Promise.all([
    invalidateTransactionQueries(queryClient, userEmail),
    invalidateCategoryQueries(queryClient, userEmail),
    invalidateUserQueries(queryClient, userEmail),
  ]);
};

/**
 * Invalidates queries by pattern. Useful for more granular control.
 *
 * @param queryClient - The TanStack Query client instance
 * @param queryKeys - Array of query key patterns to invalidate
 */
export const invalidateQueriesByPattern = async (
  queryClient: QueryClient,
  queryKeys: (string | (string | any)[])[]
): Promise<void> => {
  await Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      })
    )
  );
};
