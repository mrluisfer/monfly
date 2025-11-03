/**
 * Stream and Router utilities to prevent common TanStack Router stream issues
 */

export class StreamTimeoutError extends Error {
  constructor(message = "Operation timed out") {
    super(message);
    this.name = "StreamTimeoutError";
  }
}

/**
 * Wraps a promise with a timeout to prevent hanging requests
 * that can cause stream controller issues
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  timeoutMessage?: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(
        new StreamTimeoutError(
          timeoutMessage || `Operation timed out after ${timeoutMs}ms`
        )
      );
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Debounces a function to prevent multiple rapid calls
 * that can cause stream issues
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Creates a safe query wrapper that handles stream errors gracefully
 */
export function createSafeQuery<TData = unknown>(
  queryFn: () => Promise<TData>,
  timeoutMs: number = 8000
) {
  return async () => {
    try {
      return await withTimeout(queryFn(), timeoutMs);
    } catch (error) {
      // Log stream-related errors but don't throw them
      if (error instanceof StreamTimeoutError) {
        console.warn("Query timed out, returning fallback:", error.message);
        throw error;
      }

      // Handle stream controller errors gracefully
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string" &&
        error.message.includes("Controller is already closed")
      ) {
        console.warn(
          "Stream controller error detected, preventing cascade:",
          error.message
        );
        throw new Error("Connection issue - please refresh the page");
      }

      throw error;
    }
  };
}
