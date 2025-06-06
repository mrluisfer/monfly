import { createServerFn } from "@tanstack/react-start";
import { postCategoryByEmail } from "~/utils/category/post-category-by-email";
import z from "zod";

export const postCategoryByEmailServer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string(),
      category: z.object({
        name: z.string(),
        icon: z.string(),
      }),
    })
  )
  .handler(async ({ data: { email, category } }) => {
    return await postCategoryByEmail(category, email);
  });
