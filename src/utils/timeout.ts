/**
 * Wraps a promise with a timeout to prevent hanging requests
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000, // 10 seconds default
  timeoutMessage: string = "Request timed out"
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
  timeoutMs: number = 15000 // 15 seconds for database operations
): Promise<T> {
  try {
    const result = await withTimeout(
      operation(),
      timeoutMs,
      "Database operation timed out"
    );
    return result;
  } catch (error) {
    console.error("Database operation failed:", error);
    throw error;
  }
}
