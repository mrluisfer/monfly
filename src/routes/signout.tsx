import { createFileRoute, redirect } from "@tanstack/react-router";
import { logoutFn } from "~/server/auth/logoutfn";
import { getUserSession } from "~/server/db/users/get-user-session";

export const Route = createFileRoute("/signout")({
  preload: false,
  loader: async () => {
    const session = await getUserSession();

    if (!session.success || !session.data) {
      throw redirect({ to: "/" });
    }

    await logoutFn({
      data: {
        destination: "/",
        manualRedirect: true,
      },
    });

    throw redirect({ to: "/" });
  },
});
