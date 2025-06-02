import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { putUserTotalBalance as putUserTotalBalanceUtils } from "../../../utils/user/put-user-total-balance";

export const putUserTotalBalanceServer = createServerFn({ method: "POST" })
	.validator(
		z.object({
			totalBalance: z.number(),
			email: z.string().email(),
		}),
	)
	.handler(async ({ data }) => {
		return await putUserTotalBalanceUtils(data);
	});
