import type { Card } from "@prisma/client";

import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";
import type { UpdateCardInput } from "~/zod-schemas/card-schema";

export const putCardById = async (
  email: string,
  input: UpdateCardInput,
): Promise<ApiResponse<Card | null>> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const card = await prismaClient.$transaction(async (tx) => {
      const existing = await tx.card.findFirst({
        where: { id: input.id, userEmail: email },
      });

      if (!existing) {
        return null;
      }

      // A manual balance edit must move the user's total by the same delta so
      // totalBalance stays equal to the sum of card balances (+ card-less
      // transactions). Transaction-driven balance changes go through the
      // transaction mutations, not here.
      if (input.balance !== undefined && input.balance !== null) {
        const delta = input.balance - (existing.balance ?? 0);
        if (delta !== 0) {
          await tx.user.update({
            data: { totalBalance: { increment: delta } },
            where: { email },
          });
        }
      }

      return tx.card.update({
        data: {
          balance:
            input.balance === undefined || input.balance === null
              ? existing.balance
              : input.balance,
          color: input.color === undefined ? existing.color : input.color,
          last4: input.last4 === undefined ? existing.last4 : input.last4,
          name: input.name?.trim() ?? existing.name,
          provider:
            input.provider === undefined ? existing.provider : input.provider,
          status: input.status ?? existing.status,
          type: input.type === undefined ? existing.type : input.type,
          updatedAt: new Date(),
        },
        where: { id: input.id },
      });
    });

    if (!card) {
      return {
        data: null,
        error: true,
        message: "Card not found",
        statusCode: 404,
        success: false,
      };
    }

    return {
      data: card,
      error: false,
      message: "Card updated successfully",
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error updating card: ${message}`,
      statusCode: 500,
      success: false,
    };
  }
};
