import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { deleteCategoryById } from "~/utils/category/delete-category-by-id";

export const deleteCategoryByIdServer = createServerFn({method: 'POST'}).validator(z.object({
  id: z.string(),
})).handler(async ({data}) => {
  const {id} = data;
  return await deleteCategoryById(id);
});
