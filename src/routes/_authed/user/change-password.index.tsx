import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRoundIcon, ShieldCheckIcon } from "lucide-react";

import { PageHeader } from "~/components/layout/PageHeader";
import { Section } from "~/components/layout/Section";
import { ChangePasswordForm } from "~/components/settings/ChangePasswordForm";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_authed/user/change-password/")({
  head: () => ({
    title: "Change password | Monfly",
    meta: [
      {
        name: "description",
        content:
          "Update your Monfly account password. Verify your current password and choose a new, stronger one.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: ChangePasswordRoute,
});

function ChangePasswordRoute() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        icon={<KeyRoundIcon className="size-5" aria-hidden="true" />}
        title="Change password"
        description="Keep your account secure by updating your password regularly."
        actions={
          <Button
            variant="outline"
            render={<Link to="/user/settings">Back to settings</Link>}
          />
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <Section
          title="Update your password"
          description="You'll need your current password to set a new one."
        >
          <div className="bg-card border-border/60 rounded-2xl border p-5 sm:p-6">
            <ChangePasswordForm />
          </div>
        </Section>

        <Section title="Tips for a strong password">
          <div className="bg-card border-border/60 flex flex-col gap-3 rounded-2xl border p-5">
            <span
              aria-hidden="true"
              className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
            >
              <ShieldCheckIcon className="size-5" />
            </span>
            <ul className="text-muted-foreground space-y-2 text-sm leading-relaxed">
              <li>Use a unique password you don&apos;t reuse elsewhere.</li>
              <li>Mix uppercase, lowercase, numbers, and symbols.</li>
              <li>Avoid names, dates, or common words.</li>
              <li>Consider a password manager to store it safely.</li>
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
}
