import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { ApiResponse } from "~/types/ApiResponse";
import { hashPassword, prismaClient } from "../prisma";
import { useAppSession } from "./session";

export const signupFn = createServerFn({ method: "POST" })
	.validator(
		(d: {
			email: string;
			password: string;
			redirectUrl?: string;
			name: string;
		}) => d,
	)
	.handler(async ({ data }) => {
		try {
			// Check if the user already exists
			const found = await prismaClient.user.findUnique({
				where: {
					email: data.email,
				},
			});

			// Encrypt the password using Sha256 into plaintext
			const password = await hashPassword(data.password);

			// Create a session
			const session = await useAppSession();

			if (found) {
				if (found.password !== password) {
					return {
						error: true,
						userExists: true,
						message: "User already exists",
						success: false,
						statusCode: 400,
						data: null,
					} as ApiResponse<string | null>;
				}

				// Store the user's email in the session
				await session.update({
					email: found.email,
				});

				// Redirect to the prev page stored in the "redirect" search param
				throw redirect({
					href: data.redirectUrl || "/home",
				});
			}

			// Create the user
			const user = await prismaClient.user.create({
				data: {
					email: data.email,
					password,
					name: data.name,
				},
			});

			// Store the user's email in the session
			await session.update({
				email: user.email,
			});

			// Redirect to the prev page stored in the "redirect" search param
			throw redirect({
				href: data.redirectUrl || "/home",
			});
		} catch (error) {
			return {
				error: true,
				message: "Error signing up",
				data: null,
				success: false,
				statusCode: 500,
			} as ApiResponse<string | null>;
		}
	});
