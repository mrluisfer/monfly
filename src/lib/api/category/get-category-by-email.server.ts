import { createServerFn } from "@tanstack/react-start";
import { getCategoryByEmail } from "~/utils/category/get-category-by-email";
import { z } from "zod";

export const getCategoryByEmailServer = createServerFn({
  method: "GET",
})
  .validator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    return await getCategoryByEmail(data.email);
  });
