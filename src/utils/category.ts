import { prismaClient as prisma } from "~/server/prisma";

export const createCategory = async (data: {
  userEmail: string;
  name: string;
  icon: string;
}) => prisma.category.create({ data });

export const getCategoriesByUser = async (userEmail: string) =>
  prisma.category.findMany({ where: { userEmail } });
