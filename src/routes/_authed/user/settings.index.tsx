import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "~/components/settings/SettingsPage";

export const Route = createFileRoute("/_authed/user/settings/")({
  head: () => ({
    title: "Settings | Monfly",
    meta: [
      {
        name: "description",
        content:
          "Personalize your Monfly workspace — appearance, notifications, privacy, and account links.",
      },
    ],
  }),
  component: SettingsPage,
});
