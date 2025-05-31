import { createServerFn } from "@tanstack/react-start";
import { prismaClient } from "./prisma";

export const putUserTotalBalance = createServerFn({ method: "POST" })
	.validator((d: { totalBalance: number; email: string }) => d)
	.handler(async ({ data }) => {
		try {
			const user = await prismaClient.user.findUnique({
				where: {
					email: data.email,
				},
			});

			if (!user) {
				return {
					error: true,
					userNotFound: true,
					message: "User not found",
				};
			}

			const updatedUser = await prismaClient.user.update({
				where: {
					email: data.email,
				},
				data: {
					totalBalance: data.totalBalance,
				},
			});

			if (!updatedUser) {
				return {
					error: true,
					userNotFound: true,
					message: "User not found",
				};
			}

			return {
				success: true,
				message: "User total balance updated",
			};
		} catch (error) {
			return {
				error: true,
				message: "Error updating user total balance",
			};
		}
	});
