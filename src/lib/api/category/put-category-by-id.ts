import { createServerFn } from "@tanstack/react-start";
import { putCategoryById } from "~/utils/category/put-category-by-id";
import z from "zod";

export const putCategoryByIdServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      categoryId: z.string(),
      name: z.string(),
      icon: z.string(),
    })
  )
  .handler(async ({ data: { categoryId, name, icon } }) => {
    return await putCategoryById({ categoryId, name, icon });
  });
