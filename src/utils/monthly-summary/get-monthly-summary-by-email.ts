import type { MonthlySummary } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "../prisma";

export const getMonthlySummaryByEmail = async (data: { email: string }) => {
	try {
		const monthlySummary: MonthlySummary[] | null =
			await prismaClient.monthlySummary.findMany({
				where: {
					userEmail: data.email,
				},
			});

		if (!monthlySummary) {
			return {
				error: true,
				message: "No monthly summary found",
				data: [],
				success: false,
				statusCode: 404,
			} as ApiResponse<MonthlySummary[]>;
		}

		return {
			success: true,
			message: "Monthly summary fetched successfully",
			data: monthlySummary,
			error: false,
			statusCode: 200,
		} as ApiResponse<MonthlySummary[]>;
	} catch (error) {
		return {
			message: "Error fetching monthly summary",
			error: true,
			statusCode: 500,
			data: [],
			success: false,
		} as ApiResponse<MonthlySummary[]>;
	}
};
