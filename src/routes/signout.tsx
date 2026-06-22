import { createFileRoute, redirect } from "@tanstack/react-router";
import { logoutFn } from "~/server/auth/logoutfn";

export const Route = createFileRoute("/signout")({
  preload: false,
  loader: async ({ context }) => {
    // Already logged out (e.g. stale cookie cleared by the root session check)?
    // Just bounce to the landing page.
    if (!context.userEmail) {
      throw redirect({ to: "/" });
    }

    await logoutFn({
      data: {
        destination: "/",
        manualRedirect: true,
      },
    });

    // Redirect with a full document reload so the root `beforeLoad` re-runs with
    // the cleared cookie. A plain SPA redirect would reuse the root match and
    // keep the stale `userEmail` context, leaving the header "logged in".
    throw redirect({ to: "/", reloadDocument: true });
  },
});
