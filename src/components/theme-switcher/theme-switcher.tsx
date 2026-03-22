import type { JSX } from "react";
import { useAppHaptics } from "~/hooks/useAppHaptics";
import { useDarkMode } from "~/hooks/useDarkMode";
import { cn } from "~/lib/utils";
import type { DarkModeTheme } from "~/state/atoms/ui/preferencesAtoms";
import { MoonStarIcon, SunIcon } from "lucide-react";
import { motion } from "motion/react";

function ThemeOption({
  icon,
  value,
  isActive,
  onClick,
}: {
  icon: JSX.Element;
  value: DarkModeTheme;
  isActive?: boolean;
  onClick: (value: DarkModeTheme) => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex size-8 cursor-default items-center justify-center rounded-full transition-[color] [&_svg]:size-4",
        isActive
          ? "text-zinc-950 dark:text-zinc-50"
          : "text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50"
      )}
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => onClick(value)}
    >
      {icon}

      {isActive && (
        <motion.div
          layoutId="theme-option"
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700"
        />
      )}
    </button>
  );
}

const THEME_OPTIONS: { icon: JSX.Element; value: DarkModeTheme }[] = [
  {
    icon: <SunIcon />,
    value: "light",
  },
  {
    icon: <MoonStarIcon />,
    value: "dark",
  },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useDarkMode();
  const { selection } = useAppHaptics();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-700"
      role="radiogroup"
      aria-label="Theme switcher"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={(value) => {
            setTheme(value);
            selection();
          }}
        />
      ))}
    </motion.div>
  );
}

export { ThemeSwitcher };
