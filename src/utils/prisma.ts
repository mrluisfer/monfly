import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const prismaClient = new PrismaClient();

const saltRounds = 12;

export async function hashPassword(password: string): Promise<string> {
	try {
		const hash = await bcrypt.hash(password, saltRounds);
		return hash;
	} catch (error) {
		console.error("Error hashing password:", error);
		throw new Error("Failed to hash password");
	}
}

export async function verifyPassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (error) {
		console.error("Error verifying password:", error);
		return false;
	}
}
