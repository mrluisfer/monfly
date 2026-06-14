import { createFileRoute, redirect } from "@tanstack/react-router";
import { logoutFn } from "~/server/auth/logoutfn";
import { queryDictionary } from "~/queries/dictionary";
import { getUserSession } from "~/server/db/users/get-user-session";

export const Route = createFileRoute("/signout")({
  preload: false,
  loader: async ({ context }) => {
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

    // Drop any cached auth state so the header (and other session-aware UI)
    // re-evaluates as logged out after the redirect.
    await context.queryClient.invalidateQueries({
      queryKey: [queryDictionary.session],
    });
    context.queryClient.removeQueries({
      queryKey: [queryDictionary.user],
    });

    throw redirect({ to: "/" });
  },
});
