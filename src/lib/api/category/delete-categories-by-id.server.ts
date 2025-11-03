import { createServerFn } from "@tanstack/react-start";
import { deleteCategoriesById } from "~/utils/category/delete-categories-by-id";
import { z } from "zod";

export const deleteCategoriesByIdServer = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      ids: z.array(z.string()),
    })
  )
  .handler(async ({ data }) => {
    return deleteCategoriesById(data.ids);
  });
