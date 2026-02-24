import { createServerFn } from "@tanstack/react-start";
import { getTransactionsByEmail } from "~/utils/transactions/get-transactions-by-email";

export const getTransactionByEmailServer = createServerFn({ method: "GET" })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    if (!data.email) {
      throw new Error("Email is required");
    }

    try {
      const result = await getTransactionsByEmail(data);
      return result;
    } catch (error) {
      console.error("Server function error:", error);
      throw error;
    }
  });
