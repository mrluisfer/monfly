import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./session";

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
	// We need to auth on the server so we have access to secure cookies
	const session = await useAppSession();

	if (typeof session === "undefined" || !session.data.email) {
		return null;
	}

	return {
		email: session.data.email,
	};
});
