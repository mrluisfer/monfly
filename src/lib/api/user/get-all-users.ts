import { createServerFn } from "@tanstack/react-start";
import { getAllUsers } from "~/utils/user/get-all-users";
import z from "zod";

export const getAllUsersServer = createServerFn({ method: "GET" })
  .validator(() => z.object({}))
  .handler(async () => {
    return await getAllUsers();
  });
