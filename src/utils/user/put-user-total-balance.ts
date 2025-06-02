import type { User } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";
import { prismaClient } from "../prisma";

export const putUserTotalBalance = async (data: {
	totalBalance: number;
	email: string;
}) => {
	try {
		await prismaClient.user.update({
			where: { email: data.email },
			data: { totalBalance: data.totalBalance },
		});

		return {
			success: true,
			message: "User total balance updated",
			data: null,
			error: false,
			statusCode: 200,
		} as ApiResponse<User | null>;
	} catch (error) {
		return {
			error: true,
			message: "User not found or error updating user total balance",
			data: null,
			success: false,
			statusCode: 500,
		} as ApiResponse<User | null>;
	}
};
