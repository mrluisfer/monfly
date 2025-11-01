import { createServerFn } from "@tanstack/react-start";
import { getTransactionsByEmail } from "~/utils/transactions/get-transactions-by-email";
import { z } from "zod";

export const getTransactionByEmailServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z
        .string()
        .email("Invalid email format")
        .min(1, "Email is required"),
    })
  )
  .handler(async ({ data }) => {
    console.log("Server function called with data:", data);

    try {
      const result = await getTransactionsByEmail(data);
      console.log("Server function result:", result);
      return result;
    } catch (error) {
      console.error("Server function error:", error);
      throw error;
    }
  });
