/**
 * Wraps a promise with a timeout to prevent hanging requests
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 10_000, // 10 seconds default
  timeoutMessage = "Request timed out",
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(timeoutMessage));
      }, timeoutMs);
    }),
  ]);
}

/**
 * Wraps database operations with timeout and error handling
 */
export async function withDatabaseTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs = 15_000, // 15 seconds for database operations
): Promise<T> {
  try {
    const result = await withTimeout(
      operation(),
      timeoutMs,
      "Database operation timed out",
    );
    return result;
  } catch (error) {
    console.error("Database operation failed:", error);
    throw error;
  }
}
