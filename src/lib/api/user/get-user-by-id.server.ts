import { createServerFn } from "@tanstack/react-start";
import { getUserById } from "~/utils/user/get-user-by-id";

export const getUserByIdServer = createServerFn({ method: "GET" })
  .validator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    return await getUserById(data.userId);
  });
