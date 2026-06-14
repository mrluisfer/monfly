import type { Card } from "@prisma/client";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { UpdateCardInput } from "~/zod-schemas/card-schema";

export const putCardById = async (
  email: string,
  input: UpdateCardInput,
): Promise<ApiResponse<Card | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    const card = await prismaClient.$transaction(async (tx) => {
      const existing = await tx.card.findFirst({
        where: { id: input.id, userEmail: email },
      });

      if (!existing) return null;

      // A manual balance edit must move the user's total by the same delta so
      // totalBalance stays equal to the sum of card balances (+ card-less
      // transactions). Transaction-driven balance changes go through the
      // transaction mutations, not here.
      if (input.balance !== undefined && input.balance !== null) {
        const delta = input.balance - (existing.balance ?? 0);
        if (delta !== 0) {
          await tx.user.update({
            where: { email },
            data: { totalBalance: { increment: delta } },
          });
        }
      }

      return tx.card.update({
        where: { id: input.id },
        data: {
          name: input.name?.trim() ?? existing.name,
          type: input.type === undefined ? existing.type : input.type,
          last4: input.last4 === undefined ? existing.last4 : input.last4,
          provider:
            input.provider === undefined ? existing.provider : input.provider,
          balance:
            input.balance === undefined || input.balance === null
              ? existing.balance
              : input.balance,
          color: input.color === undefined ? existing.color : input.color,
          status: input.status ?? existing.status,
          updatedAt: new Date(),
        },
      });
    });

    if (!card) {
      return {
        error: true,
        message: "Card not found",
        data: null,
        success: false,
        statusCode: 404,
      };
    }

    return {
      error: false,
      message: "Card updated successfully",
      data: card,
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error updating card: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
