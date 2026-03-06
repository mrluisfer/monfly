import { createServerFn } from "@tanstack/react-start";
import {
  enforceRateLimit,
  resolveSessionEmail,
} from "~/utils/security/request-protection";
import { getTotalExpensesByEmail } from "~/utils/transactions/get-total-expenses-by-email";
import z from "zod";

export const getTotalExpensesByEmailServer = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      scope: "transaction:total-expenses",
      limit: 120,
      windowMs: 60_000,
      identifier: sessionEmail,
    });

    return await getTotalExpensesByEmail({ email: sessionEmail });
  });
