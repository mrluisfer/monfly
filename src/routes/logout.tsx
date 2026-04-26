import { createFileRoute } from "@tanstack/react-router";
import { logoutFn } from "~/server/auth/logoutfn";

export const Route = createFileRoute("/logout")({
  preload: false,
  loader: () =>
    logoutFn({
      data: {
        destination: "/",
        manualRedirect: false,
      },
    }),
});
