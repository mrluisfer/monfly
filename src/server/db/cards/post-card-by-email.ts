import type { Card } from "@prisma/client";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { CreateCardInput } from "~/zod-schemas/card-schema";

export const postCardByEmail = async (
  email: string,
  input: CreateCardInput,
): Promise<ApiResponse<Card | null>> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const openingBalance = input.balance ?? 0;

    // Create the card and, if it has an opening balance, propagate that amount
    // to the user's total in the same atomic transaction so totalBalance stays
    // equal to the sum of card balances (+ card-less transactions).
    const card = await prismaClient.$transaction(async (tx) => {
      const created = await tx.card.create({
        data: {
          balance: openingBalance,
          color: input.color ?? null,
          last4: input.last4 ?? null,
          name: input.name.trim(),
          provider: input.provider ?? null,
          status: "active",
          type: input.type ?? null,
          userEmail: email,
        },
      });

      if (openingBalance !== 0) {
        await tx.user.update({
          data: { totalBalance: { increment: openingBalance } },
          where: { email },
        });
      }

      return created;
    });

    return {
      data: card,
      error: false,
      message: "Card created successfully",
      statusCode: 201,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error creating card: ${message}`,
      statusCode: 500,
      success: false,
    };
  }
};
