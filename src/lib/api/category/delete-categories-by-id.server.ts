import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { deleteCategoriesById } from "~/utils/category/delete-categories-by-id";

export const deleteCategoriesByIdServer = createServerFn({ method: "POST" })
	.validator(
		z.object({
			ids: z.array(z.string()),
		}),
	)
	.handler(async ({ data }) => {
		return deleteCategoriesById(data.ids);
	});
