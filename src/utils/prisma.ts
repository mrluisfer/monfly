import pkg from "@prisma/client";
import type { PrismaClient as PrismaClientType } from "@prisma/client";
import bcrypt from "bcrypt";

const { PrismaClient } = pkg;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined;
}

export const prismaClient = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

const saltRounds = 12;

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
