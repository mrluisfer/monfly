import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getTotalExpensesByEmail } from "~/server/db/transactions/get-total-expenses-by-email";
import {
  enforceRateLimit,
  resolveSessionEmail,
} from "~/server/security/request-protection";

export const getTotalExpensesByEmailServer = createServerFn({ method: "GET" })
  .validator(
    z.object({
      cardId: z.uuid().nullable().optional(),
      email: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      identifier: sessionEmail,
      limit: 120,
      scope: "transaction:total-expenses",
      windowMs: 60_000,
    });

    return await getTotalExpensesByEmail({
      cardId: data.cardId,
      email: sessionEmail,
    });
  });
