import { prismaClient } from "./prisma";

export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  error?: string;
  latency?: number;
}> {
  try {
    const start = Date.now();
    await prismaClient.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return { connected: true, latency };
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function ensureDatabaseConnection(): Promise<void> {
  const check = await checkDatabaseConnection();
  if (!check.connected) {
    throw new Error(`Database connection failed: ${check.error}`);
  }
}

export async function gracefulDatabaseOperation<T>(
  operation: () => Promise<T>,
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      await ensureDatabaseConnection();
      return await operation();
    } catch (error) {
      console.error(`Database operation attempt ${i + 1} failed:`, error);

      if (i === retries - 1) {
        throw error;
      }

      // Wait before retry with exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, i))
      );
    }
  }

  throw new Error("All database operation attempts failed");
}
