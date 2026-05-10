import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { Switch } from "~/components/ui/switch";
import {
  disableTransactionHoverAtom,
  hideBalanceAtom,
  hideMetricsAtom,
} from "~/state";
import { useAtom } from "jotai";
import {
  ArrowUpRight,
  BellRingIcon,
  EyeIcon,
  EyeOffIcon,
  KeyboardIcon,
  PaletteIcon,
  ScaleIcon,
  ShieldIcon,
  SlidersHorizontalIcon,
  Sparkles,
  UserIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import FontDisplaySelect from "./FontDisplaySelect";
import { SonnerPositionSelector } from "./SonnerPositionSelector";
import { ThemeSelector } from "./ThemeSelector";
import ToggleDarkMode from "./ToggleDarkMode";

export function SettingsPage() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--primary)/8%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-40 -z-10 size-72 rounded-full bg-[radial-gradient(circle,#0f766e_0%,transparent_72%)] opacity-15 blur-3xl dark:opacity-20"
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14 lg:max-w-6xl lg:py-16">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary ring-1 ring-primary/20"
            >
              <SlidersHorizontalIcon className="size-5" />
            </span>
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                <Sparkles className="size-3" aria-hidden="true" />
                Workspace settings
              </span>
              <h1 className="font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Settings
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                Personalize the look, behavior, and notifications of your
                Monfly workspace. Changes save instantly to this device.
              </p>
            </div>
          </div>
        </header>

        <div className="mt-10 divide-y divide-border/60 sm:mt-14">
          <SettingsSection
            icon={PaletteIcon}
            title="Appearance"
            description="Theme color, dark mode, and display font."
          >
            <SettingsRow
              title="Color theme"
              description="Pick the accent palette for buttons, charts, and highlights."
              control={<ThemeSelector />}
            />
            <SettingsRow
              title="Dark mode"
              description="Switch between light and dark surfaces. Saved per device."
              control={<ToggleDarkMode size="default" />}
            />
            <SettingsRow
              title="Display font"
              description="Used across headings and dashboard panels."
              control={
                <div className="w-full sm:w-60">
                  <FontDisplaySelect />
                </div>
              }
            />
            <SettingsRow
              title="Theme gallery"
              description="Preview every available theme side-by-side."
              control={
                <Link
                  to="/user/theme"
                  className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
                >
                  Open gallery
                  <ArrowUpRight
                    className="size-3.5"
                    aria-hidden="true"
                  />
                </Link>
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
              control={<NavLink to="/privacy" label="Read policy" />}
            />
            <SettingsRow
              title="Terms & Conditions"
              description="The rules that govern your use of the service."
              control={<NavLink to="/terms" label="Read terms" />}
            />
            <SettingsRow
              title="Contact"
              description="Talk to the team or request data deletion."
              control={<NavLink to="/contact" label="Open contact" />}
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
          className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/0 text-primary ring-1 ring-primary/15 after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tr after:from-transparent after:to-foreground/5"
        >
          <Icon className="size-4" aria-hidden={true} />
        </span>
        <div className="min-w-0 space-y-1">
          <h2 className="font-[family-name:var(--font-syne)] text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {title}
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-[0.8rem]">
            {description}
          </p>
        </div>
      </header>
      <ul className="min-w-0 divide-y divide-border/50">{children}</ul>
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
        className
      )}
    >
      <div className="min-w-0 space-y-0.5 pr-4">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="shrink-0">{control}</div>
    </li>
  );
}

type PrivacyToggleRowProps = {
  atom: Parameters<typeof useAtom<boolean>>[0];
  title: string;
  description: string;
};

function PrivacyToggleRow({
  atom,
  title,
  description,
}: PrivacyToggleRowProps) {
  const id = useId();
  const [enabled, setEnabled] = useAtom(atom);
  return (
    <li className="flex flex-row items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0 space-y-0.5 pr-4">
        <label
          htmlFor={id}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          {enabled ? (
            <EyeOffIcon
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <EyeIcon
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          {title}
        </label>
        <p className="text-xs leading-relaxed text-muted-foreground">
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
};

function NavLink({ to, label, hint }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
    >
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : (
        <UserIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
      )}
      {label}
      <ArrowUpRight
        className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
