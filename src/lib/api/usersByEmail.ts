import type { User } from "@prisma/client";

export const getUsersByEmail = async (email: string) => {
	try {
		const response = await fetch(`/api/user/${email}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch user");
		}

		const user: User = await response.json();
		return user;
	} catch (error) {
		console.error("Error fetching user:", error);
		throw error;
	}
};
