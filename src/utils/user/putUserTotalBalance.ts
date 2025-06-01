import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prismaClient } from "../prisma";

export const putUserTotalBalance = createServerFn({ method: "POST" })
	.validator(
		z.object({
			totalBalance: z.number(),
			email: z.string().email(),
		}),
	)
	.handler(async ({ data }) => {
		try {
			await prismaClient.user.update({
				where: { email: data.email },
				data: { totalBalance: data.totalBalance },
			});

			return {
				success: true,
				message: "User total balance updated",
			};
		} catch (error) {
			return {
				error: true,
				message: "User not found or error updating user total balance",
			};
		}
	});
