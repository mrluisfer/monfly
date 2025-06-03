import { prismaClient as prisma } from "./prisma";

export const createCategory = async (data: {
  userEmail: string;
  name: string;
  icon: string;
}) => {
  return prisma.category.create({ data });
};

export const getCategoriesByUser = async (userEmail: string) => {
  return prisma.category.findMany({ where: { userEmail } });
};
