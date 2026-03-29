import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_THEMES, SCALED_THEMES } from "~/constants/themes";
import { useThemeConfig } from "~/hooks/useThemeConfig";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/user/theme/")({
  component: ThemePage,
});

type ThemeColorSet = { primary: string; bg: string };

const THEME_COLORS: Record<
  string,
  { light: ThemeColorSet; dark: ThemeColorSet }
> = {
  default: {
    light: {
      primary: "oklch(0.21 0.006 285.885)",
      bg: "oklch(0.967 0.001 286.375)",
    },
    dark: {
      primary: "oklch(0.92 0.004 286.32)",
      bg: "oklch(0.274 0.006 286.033)",
    },
  },
  red: {
    light: {
      primary: "oklch(0.637 0.237 25.331)",
      bg: "oklch(0.967 0.001 286.375)",
    },
    dark: {
      primary: "oklch(0.637 0.237 25.331)",
      bg: "oklch(0.274 0.006 286.033)",
    },
  },
  rose: {
    light: {
      primary: "oklch(0.645 0.246 16.439)",
      bg: "oklch(0.967 0.001 286.375)",
    },
    dark: {
      primary: "oklch(0.645 0.246 16.439)",
      bg: "oklch(0.274 0.006 286.033)",
    },
  },
  orange: {
    light: {
      primary: "oklch(0.705 0.213 47.604)",
      bg: "oklch(0.967 0.001 286.375)",
    },
    dark: {
      primary: "oklch(0.646 0.222 41.116)",
      bg: "oklch(0.274 0.006 286.033)",
    },
  },
  green: {
    light: {
      primary: "oklch(0.723 0.219 149.579)",
      bg: "oklch(0.967 0.001 286.375)",
    },
    dark: {
      primary: "oklch(0.696 0.17 162.48)",
      bg: "oklch(0.274 0.006 286.033)",
    },
  },
  blue: {
    light: {
      primary: "oklch(0.623 0.214 259.815)",
      bg: "oklch(0.967 0.001 286.375)",
    },
    dark: {
      primary: "oklch(0.546 0.245 262.881)",
      bg: "oklch(0.274 0.006 286.033)",
    },
  },
  yellow: {
    light: {
      primary: "oklch(0.795 0.184 86.047)",
      bg: "oklch(0.967 0.001 286.375)",
    },
    dark: {
      primary: "oklch(0.795 0.184 86.047)",
      bg: "oklch(0.274 0.006 286.033)",
    },
  },
  violet: {
    light: {
      primary: "oklch(0.606 0.25 292.717)",
      bg: "oklch(0.967 0.001 286.375)",
    },
    dark: {
      primary: "oklch(0.541 0.281 293.009)",
      bg: "oklch(0.274 0.006 286.033)",
    },
  },
  "deep-dark": {
    light: {
      primary: "oklch(0.21 0.006 285.885)",
      bg: "oklch(0.274 0.006 286.033)",
    },
    dark: { primary: "oklch(0.985 0 0)", bg: "oklch(0.141 0.005 285.823)" },
  },
  zinc: {
    light: {
      primary: "oklch(0.21 0.006 285.884)",
      bg: "oklch(1 0 0)",
    },
    dark: {
      primary: "oklch(0.985 0 0)",
      bg: "oklch(0.141 0.004 285.824)",
    },
  },
  slate: {
    light: {
      primary: "oklch(0.208 0.04 265.727)",
      bg: "oklch(1 0 0)",
    },
    dark: {
      primary: "oklch(0.984 0.003 247.858)",
      bg: "oklch(0.137 0.036 258.526)",
    },
  },
  stone: {
    light: {
      primary: "oklch(0.216 0.006 56.044)",
      bg: "oklch(1 0 0)",
    },
    dark: {
      primary: "oklch(0.985 0 0)",
      bg: "oklch(0.147 0.004 49.314)",
    },
  },
  gray: {
    light: {
      primary: "oklch(0.21 0.032 264.652)",
      bg: "oklch(1 0 0)",
    },
    dark: {
      primary: "oklch(0.984 0 0)",
      bg: "oklch(0.129 0.027 261.671)",
    },
  },
  neutral: {
    light: {
      primary: "oklch(0.204 0 0)",
      bg: "oklch(1 0 0)",
    },
    dark: {
      primary: "oklch(0.985 0 0)",
      bg: "oklch(0.145 0 0)",
    },
  },
  "mono-scaled": {
    light: { primary: "oklch(0.4891 0 0)", bg: "oklch(0.967 0.001 286.375)" },
    dark: { primary: "oklch(0.7572 0 0)", bg: "oklch(0.21 0.006 285.885)" },
  },
  "quantum-rose": {
    light: {
      primary: "oklch(0.6002 0.2414 0.1348)",
      bg: "oklch(0.955 0.019 325.014)",
    },
    dark: {
      primary: "oklch(0.7543 0.2319 332.0212)",
      bg: "oklch(0.22 0.012 325.014)",
    },
  },
  "cosmic-night": {
    light: {
      primary: "oklch(0.5417 0.179 288.0332)",
      bg: "oklch(0.945 0.017 286.375)",
    },
    dark: {
      primary: "oklch(0.7162 0.1597 290.3962)",
      bg: "oklch(0.2 0.01 286.375)",
    },
  },
  "neo-brutalism": {
    light: {
      primary: "oklch(0.6489 0.237 26.9728)",
      bg: "oklch(0.962 0.044 94.585)",
    },
    dark: {
      primary: "oklch(0.7044 0.1872 23.1858)",
      bg: "oklch(0.22 0.02 94.585)",
    },
  },
};

function ThemeCard({
  name,
  value,
  isActive,
  isDark,
  onSelect,
}: {
  name: string;
  value: string;
  isActive: boolean;
  isDark: boolean;
  onSelect: () => void;
}) {
  const themeColors = THEME_COLORS[value] ?? THEME_COLORS.default;
  const colors = isDark ? themeColors.dark : themeColors.light;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all",
        "hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isActive
          ? "border-primary shadow-sm"
          : "border-border hover:border-primary/40"
      )}
    >
      {/* Preview area */}
      <div
        className="flex h-24 items-end gap-1.5 p-3"
        style={{ backgroundColor: colors.bg }}
      >
        <div
          className="h-full w-10 rounded-md"
          style={{ backgroundColor: colors.primary }}
        />
        <div className="flex flex-1 flex-col gap-1.5">
          <div
            className="h-3 w-3/4 rounded-sm opacity-25"
            style={{ backgroundColor: colors.primary }}
          />
          <div
            className="h-3 w-1/2 rounded-sm opacity-20"
            style={{ backgroundColor: colors.primary }}
          />
          <div
            className="h-3 w-full rounded-sm opacity-15"
            style={{ backgroundColor: colors.primary }}
          />
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center justify-between bg-card px-3 py-2.5">
        <span className="text-sm font-medium">{name}</span>
        {isActive && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckIcon className="size-3" />
          </span>
        )}
      </div>
    </button>
  );
}

function ThemePage() {
  const { activeTheme, setActiveTheme, isDark } = useThemeConfig();

  return (
    <div className="min-h-dvh bg-background px-3 py-4 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Theme
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Choose a theme for the app.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Default
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {DEFAULT_THEMES.map((theme) => (
                <ThemeCard
                  key={theme.value}
                  name={theme.name}
                  value={theme.value}
                  isActive={activeTheme === theme.value}
                  isDark={isDark}
                  onSelect={() => setActiveTheme(theme.value)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Scaled
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {SCALED_THEMES.map((theme) => (
                <ThemeCard
                  key={theme.value}
                  name={theme.name}
                  value={theme.value}
                  isActive={activeTheme === theme.value}
                  isDark={isDark}
                  onSelect={() => setActiveTheme(theme.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
