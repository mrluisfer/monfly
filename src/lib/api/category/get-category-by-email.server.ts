import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCategoryByEmail } from "~/utils/category/get-category-by-email";

export const getCategoryByEmailServer = createServerFn({
	method: "GET",
})
	.validator(z.object({ email: z.string() }))
	.handler(async ({ data }) => {
		return await getCategoryByEmail(data.email);
	});
