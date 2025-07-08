import { categoryFormNames } from "~/constants/forms/category-form-names";
import z from "zod";

export const CategoryFormSchema = z.object({
  [categoryFormNames.name]: z.string().min(1, {
    message: "Please enter a name",
  }),
  [categoryFormNames.icon]: z.string().min(1, {
    message: "Please select an icon",
  }),
});
