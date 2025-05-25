import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./session";

export const logoutFn = createServerFn({ method: "POST" })
	.validator((d: { destination?: string; manualRedirect?: boolean }) => d)
	.handler(async ({ data: { destination = "/", manualRedirect = false } }) => {
		const session = await useAppSession();

		await session.clear();

		if (manualRedirect) {
			return {
				error: false,
				message: "Logout successful",
			};
		}
		throw redirect({ href: destination ?? "/" });
	});
