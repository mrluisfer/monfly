import type { Card } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

interface GetCardsParams {
  email: string;
  status?: string;
}

interface CardsResponse<T> extends ApiResponse<T> {
  total: number;
}

export const getCardsByEmail = async ({
  email,
  status,
}: GetCardsParams): Promise<CardsResponse<Card[] | null>> => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const where = {
      userEmail: email,
      ...(status ? { status } : {}),
    };

    const [cards, total] = await Promise.all([
      prismaClient.card.findMany({
        orderBy: [{ createdAt: "asc" }],
        where,
      }),
      prismaClient.card.count({ where }),
    ]);

    return {
      data: cards,
      error: false,
      message: "Cards fetched successfully",
      statusCode: 200,
      success: true,
      total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error fetching cards: ${message}`,
      statusCode: 500,
      success: false,
      total: 0,
    };
  }
};
