import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getAllUsers } from "~/utils/user/get-all-users";

export const getAllUsersServer = createServerFn({ method: "GET" })
	.validator(() => z.object({}))
	.handler(async () => {
		return await getAllUsers();
	});
