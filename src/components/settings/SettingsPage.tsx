import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { Switch } from "~/components/ui/switch";
import {
  disableTransactionHoverAtom,
  hideBalanceAtom,
  hideMetricsAtom,
} from "~/state";
import { type PrimitiveAtom, useAtom } from "jotai";
import {
  ArrowUpRight,
  BellRingIcon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  GlobeIcon,
  KeyboardIcon,
  LockKeyholeIcon,
  type LucideIcon,
  MailIcon,
  PaletteIcon,
  ScaleIcon,
  ShieldIcon,
  SlidersHorizontalIcon,
  Sparkles,
  UserIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { ChangePasswordRow } from "./ChangePasswordRow";
import { NumberFormatSelector } from "./NumberFormatSelector";
import { SonnerPositionSelector } from "./SonnerPositionSelector";
import ToggleDarkMode from "./ToggleDarkMode";

export function SettingsPage() {
  return (
    <div className="bg-background relative min-h-dvh overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--primary)/8%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 right-0 -z-10 size-72 rounded-full bg-[radial-gradient(circle,#0f766e_0%,transparent_72%)] opacity-15 blur-3xl dark:opacity-20"
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14 md:max-w-6xl lg:container lg:max-w-none lg:pt-0 lg:pb-16">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="from-primary/20 via-primary/10 text-primary ring-primary/20 relative inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br to-transparent ring-1"
            >
              <SlidersHorizontalIcon className="size-5" />
            </span>
            <div className="space-y-1">
              <span className="bg-foreground/5 text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.13em] uppercase">
                <Sparkles className="size-3" aria-hidden="true" />
                Workspace settings
              </span>
              <h1 className="text-foreground font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight sm:text-3xl">
                Settings
              </h1>
              <p className="text-muted-foreground max-w-xl text-sm">
                Personalize the look, behavior, and notifications of your Monfly
                workspace. Changes save instantly to this device.
              </p>
            </div>
          </div>
        </header>

        <div className="divide-border/60 mt-10 divide-y sm:mt-14">
          <SettingsSection
            icon={PaletteIcon}
            title="Appearance"
            description="Switch between light and dark surfaces."
          >
            <SettingsRow
              title="Dark mode"
              description="Switch between light and dark surfaces. Saved per device."
              control={<ToggleDarkMode size="default" />}
            />
            <SettingsRow
              title="Theme gallery"
              description="Preview every available theme side-by-side."
              control={
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="Coming soon"
                  className="bg-foreground/5 text-muted-foreground inline-flex cursor-not-allowed items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium opacity-70"
                >
                  Open gallery
                  <span className="bg-muted-foreground/15 rounded-full px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-wide uppercase">
                    Soon
                  </span>
                </button>
              }
            />
          </SettingsSection>

          <SettingsSection
            icon={BellRingIcon}
            title="Notifications"
            description="Where toast notifications appear on the screen."
          >
            <SettingsRow
              title="Notification position"
              description="Affects all toasts emitted by the app."
              control={
                <div className="w-full sm:w-56">
                  <SonnerPositionSelector />
                </div>
              }
            />
          </SettingsSection>

          <SettingsSection
            icon={ShieldIcon}
            title="Privacy"
            description="Mask sensitive data in shared views and screenshots."
          >
            <PrivacyToggleRow
              atom={hideBalanceAtom}
              title="Hide total balance by default"
              description="Replaces your balance with placeholders until you reveal it."
            />
            <PrivacyToggleRow
              atom={hideMetricsAtom}
              title="Hide metrics on dashboards"
              description="Useful for screen sharing or recording demos."
            />
          </SettingsSection>

          <SettingsSection
            icon={GlobeIcon}
            title="Regional"
            description="Number and currency formatting used across the workspace."
          >
            <SettingsRow
              title="Number format"
              description="Affects how pasted values are parsed in the balance calculator and future inputs."
              control={<NumberFormatSelector />}
            />
          </SettingsSection>

          <SettingsSection
            icon={KeyboardIcon}
            title="Productivity"
            description="Refine micro-interactions across the workspace."
          >
            <PrivacyToggleRow
              atom={disableTransactionHoverAtom}
              title="Disable transaction hover effects"
              description="Reduces motion when scanning long transaction lists."
            />
          </SettingsSection>

          <SettingsSection
            icon={LockKeyholeIcon}
            title="Security"
            description="Keep your account protected with a strong password."
          >
            <ChangePasswordRow />
          </SettingsSection>

          <SettingsSection
            icon={ScaleIcon}
            title="Account & legal"
            description="Quick links to your profile, terms, and privacy policy."
          >
            <SettingsRow
              title="Profile"
              description="Update your name, password, currency, and consents."
              control={
                <NavLink to="/home" label="Back to home" hint="Workspace" />
              }
            />
            <SettingsRow
              title="Privacy Policy"
              description="How Monfly handles the data you store with us."
              control={
                <NavLink to="/privacy" label="Read policy" icon={ShieldIcon} />
              }
            />
            <SettingsRow
              title="Terms & Conditions"
              description="The rules that govern your use of the service."
              control={
                <NavLink to="/terms" label="Read terms" icon={FileTextIcon} />
              }
            />
            <SettingsRow
              title="Contact"
              description="Talk to the team or request data deletion."
              control={
                <NavLink to="/contact" label="Open contact" icon={MailIcon} />
              }
            />
          </SettingsSection>
        </div>
      </main>
    </div>
  );
}

type SettingsSectionProps = {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  children: React.ReactNode;
};

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="grid gap-6 py-8 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10">
      <header className="flex items-start gap-3 md:sticky md:top-24 md:self-start">
        <span
          aria-hidden="true"
          className="from-primary/15 to-primary/0 text-primary ring-primary/15 after:to-foreground/5 relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ring-1 after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tr after:from-transparent"
        >
          <Icon className="size-4" aria-hidden={true} />
        </span>
        <div className="min-w-0 space-y-1">
          <h2 className="text-foreground font-(family-name:--font-syne) text-sm font-semibold tracking-tight sm:text-base">
            {title}
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed sm:text-[0.8rem]">
            {description}
          </p>
        </div>
      </header>
      <ul className="divide-border/50 min-w-0 divide-y">{children}</ul>
    </section>
  );
}

type SettingsRowProps = {
  title: string;
  description: string;
  control: React.ReactNode;
  className?: string;
};

function SettingsRow({
  title,
  description,
  control,
  className,
}: SettingsRowProps) {
  return (
    <li
      className={cn(
        "flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-0.5 pr-4">
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {description}
        </p>
      </div>
      <div className="shrink-0">{control}</div>
    </li>
  );
}

type PrivacyToggleRowProps = {
  atom: PrimitiveAtom<boolean>;
  title: string;
  description: string;
};

function PrivacyToggleRow({ atom, title, description }: PrivacyToggleRowProps) {
  const id = useId();
  const [enabled, setEnabled] = useAtom(atom);
  return (
    <li className="flex flex-row items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0 space-y-0.5 pr-4">
        <label
          htmlFor={id}
          className="text-foreground flex items-center gap-1.5 text-sm font-medium"
        >
          {enabled ? (
            <EyeOffIcon
              className="text-muted-foreground size-3.5"
              aria-hidden="true"
            />
          ) : (
            <EyeIcon
              className="text-muted-foreground size-3.5"
              aria-hidden="true"
            />
          )}
          {title}
        </label>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {description}
        </p>
      </div>
      <Switch id={id} checked={enabled} onCheckedChange={setEnabled} />
    </li>
  );
}

type NavLinkProps = {
  to: string;
  label: string;
  hint?: string;
  icon?: LucideIcon;
};

function NavLink({ to, label, hint, icon: Icon = UserIcon }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="group bg-foreground/5 text-foreground hover:bg-foreground/10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
    >
      {hint ? (
        <span className="text-muted-foreground text-xs">{hint}</span>
      ) : (
        <Icon className="text-muted-foreground size-3.5" aria-hidden="true" />
      )}
      {label}
      <ArrowUpRight
        className="text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
