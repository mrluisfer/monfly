import type { User } from "@prisma/client";

export const getUsers = async () => {
	try {
		const response = await fetch("/api/users", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("response", response);

		if (!response.ok) {
			throw new Error("Failed to fetch users");
		}

		const users: User[] = await response.json();
		return users;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};
