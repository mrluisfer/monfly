import { createServerFn } from "@tanstack/react-start";
import { getUserByEmail } from "~/utils/user/get-user-by-email";

export const getUserByEmailServer = createServerFn({ method: "GET" })
	.validator((d: { email: string }) => d)
	.handler(async ({ data }) => {
		return await getUserByEmail(data.email);
	});
