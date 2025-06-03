import z from "zod";
import { categoryFormNames } from "~/constants/category-form-names";

export const CategoryFormSchema = z.object({
	[categoryFormNames.name]: z.string().min(1, {
		message: "Please enter a name",
	}),
	[categoryFormNames.icon]: z.string().min(1, {
		message: "Please select an icon",
	}),
});
