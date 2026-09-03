import { prismaClient as prisma } from "~/server/prisma";

export const createPot = async (data: {
  userEmail: string;
  title: string;
  goalAmount: number;
  category?: string;
}) => prisma.pot.create({ data });

export const getPotsByUser = async (userEmail: string) =>
  prisma.pot.findMany({ where: { userEmail } });
