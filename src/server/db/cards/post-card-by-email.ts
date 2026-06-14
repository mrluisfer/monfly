import type { Card } from "@prisma/client";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { CreateCardInput } from "~/zod-schemas/card-schema";

export const postCardByEmail = async (
  email: string,
  input: CreateCardInput,
): Promise<ApiResponse<Card | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    const openingBalance = input.balance ?? 0;

    // Create the card and, if it has an opening balance, propagate that amount
    // to the user's total in the same atomic transaction so totalBalance stays
    // equal to the sum of card balances (+ card-less transactions).
    const card = await prismaClient.$transaction(async (tx) => {
      const created = await tx.card.create({
        data: {
          userEmail: email,
          name: input.name.trim(),
          type: input.type ?? null,
          last4: input.last4 ?? null,
          provider: input.provider ?? null,
          balance: openingBalance,
          color: input.color ?? null,
          status: "active",
        },
      });

      if (openingBalance !== 0) {
        await tx.user.update({
          where: { email },
          data: { totalBalance: { increment: openingBalance } },
        });
      }

      return created;
    });

    return {
      error: false,
      message: "Card created successfully",
      data: card,
      success: true,
      statusCode: 201,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error creating card: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
