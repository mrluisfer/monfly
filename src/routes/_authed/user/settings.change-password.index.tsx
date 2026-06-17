import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftIcon,
  BanIcon,
  FingerprintIcon,
  KeyRoundIcon,
  LockKeyholeIcon,
  type LucideIcon,
  ShieldCheckIcon,
  ShuffleIcon,
} from "lucide-react";

import { PageHeader } from "~/components/layout/PageHeader";
import { Section } from "~/components/layout/Section";
import { ChangePasswordForm } from "~/components/settings/ChangePasswordForm";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_authed/user/settings/change-password/")({
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

type PasswordTip = {
  icon: LucideIcon;
  text: string;
};

const PASSWORD_TIPS: PasswordTip[] = [
  {
    icon: FingerprintIcon,
    text: "Use a unique password you don't reuse anywhere else.",
  },
  {
    icon: ShuffleIcon,
    text: "Mix uppercase, lowercase, numbers, and symbols.",
  },
  {
    icon: BanIcon,
    text: "Avoid names, dates, or common dictionary words.",
  },
  {
    icon: LockKeyholeIcon,
    text: "Consider a password manager to store it safely.",
  },
];

/** Title with a leading accent icon, shared by both columns for a consistent header rhythm. */
function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="text-primary size-4 shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}

function ChangePasswordRoute() {
  const reduceMotion = useReducedMotion();

  // Subtle, restrained entrance: the card rises and fades. Skipped entirely
  // when the user prefers reduced motion.
  const card = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: "easeOut" as const },
        };

  const list = reduceMotion
    ? {}
    : {
        initial: "hidden",
        animate: "show",
        variants: {
          hidden: {},
          show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
        },
      };

  const listItem = reduceMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, x: -8 },
          show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        },
      };

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        icon={<KeyRoundIcon className="size-5" aria-hidden="true" />}
        title="Change password"
        description="Keep your account secure by updating your password regularly."
        actions={
          <Button
            variant="outline"
            render={
              <Link to="/user/settings">
                <ArrowLeftIcon aria-hidden="true" className={"text-primary"} />
                Back to settings
              </Link>
            }
          />
        }
      />

      {/* items-start stops the shorter tips column from stretching to the form's
          height (the source of the uneven gap). */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <Section
          title={
            <SectionTitle icon={LockKeyholeIcon}>
              Update your password
            </SectionTitle>
          }
          description="You'll need your current password to set a new one."
        >
          <motion.div
            {...card()}
            className="bg-card border-border/60 rounded-2xl border p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6"
          >
            <ChangePasswordForm />
          </motion.div>
        </Section>

        <Section
          className="lg:sticky lg:top-6"
          title={
            <SectionTitle icon={ShieldCheckIcon}>
              Tips for a strong password
            </SectionTitle>
          }
          description="Small habits that keep your account safe."
        >
          <motion.div
            {...card(0.08)}
            className="bg-card border-border/60 rounded-2xl border p-5 shadow-sm sm:p-6"
          >
            <motion.ul
              className="space-y-3"
              aria-label="Password tips"
              {...list}
            >
              {PASSWORD_TIPS.map((tip) => (
                <motion.li
                  key={tip.text}
                  className="group flex items-center-safe gap-3"
                  {...listItem}
                >
                  <span
                    aria-hidden="true"
                    className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
                  >
                    <tip.icon className="size-4" />
                  </span>
                  <span className="text-muted-foreground pt-1.5 text-sm leading-relaxed">
                    {tip.text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </Section>
      </div>
    </div>
  );
}
