import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcrypt";
import { prismaClient } from "../prisma";
import { useAppSession } from "./session";

export const loginFn = createServerFn({ method: "POST" })
	.validator((d: { email: string; password: string }) => d)
	.handler(async ({ data }) => {
		// Find the user
		const user = await prismaClient.user.findUnique({
			where: {
				email: data.email,
			},
		});

		// Check if the user exists
		if (!user) {
			return {
				error: true,
				userNotFound: true,
				message: "User not found",
			};
		}

		// Check if the password is correct
		const isPasswordCorrect = await bcrypt.compare(
			data.password,
			user.password,
		);

		if (!isPasswordCorrect) {
			return {
				error: true,
				message: "Incorrect password",
			};
		}

		// Create a session
		const session = await useAppSession();

		// Store the user's email in the session
		await session.update({
			email: user.email,
		});

		return {
			error: false,
			message: "Login successful",
		};
	});
