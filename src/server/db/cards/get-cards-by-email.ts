import type { Card } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

type GetCardsParams = {
  email: string;
  status?: string;
};

interface CardsResponse<T> extends ApiResponse<T> {
  total: number;
}

export const getCardsByEmail = async ({
  email,
  status,
}: GetCardsParams): Promise<CardsResponse<Card[] | null>> => {
  try {
    if (!email) throw new Error("Email is required");

    const where = {
      userEmail: email,
      ...(status ? { status } : {}),
    };

    const [cards, total] = await Promise.all([
      prismaClient.card.findMany({
        where,
        orderBy: [{ createdAt: "asc" }],
      }),
      prismaClient.card.count({ where }),
    ]);

    return {
      error: false,
      message: "Cards fetched successfully",
      data: cards,
      success: true,
      statusCode: 200,
      total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error fetching cards: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
      total: 0,
    };
  }
};
