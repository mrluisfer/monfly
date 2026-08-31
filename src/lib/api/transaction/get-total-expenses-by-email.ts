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
      email: z.string(),
      cardId: z.uuid().nullable().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const sessionEmail = await resolveSessionEmail(data.email);
    enforceRateLimit({
      scope: "transaction:total-expenses",
      limit: 120,
      windowMs: 60_000,
      identifier: sessionEmail,
    });

    return await getTotalExpensesByEmail({
      email: sessionEmail,
      cardId: data.cardId,
    });
  });
