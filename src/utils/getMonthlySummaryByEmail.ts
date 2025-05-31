import { createServerFn } from "@tanstack/react-start";
import { prismaClient } from "./prisma";

export const getMonthlySummaryByEmail = createServerFn({ method: "GET" })
	.validator((d: { email: string }) => d)
	.handler(async ({ data }) => {
		try {
			const monthlySummary = await prismaClient.monthlySummary.findMany({
				where: {
					userEmail: data.email,
				},
			});

			if (!monthlySummary) {
				return {
					error: true,
					message: "No monthly summary found",
				};
			}

			return {
				success: true,
				message: "Monthly summary fetched successfully",
				monthlySummary,
			};
		} catch (error) {
			return {
				error: true,
				message: "Error fetching monthly summary",
			};
		}
	});
