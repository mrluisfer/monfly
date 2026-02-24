import type { ComponentProps } from "react";
import { useDarkMode } from "~/hooks/use-dark-mode";
import { cn } from "~/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

import { Toggle } from "../ui/toggle";

type ToggleDarkModeProps = Omit<
  ComponentProps<typeof Toggle>,
  "pressed" | "onPressedChange" | "aria-label" | "children"
>;

export default function ToggleDarkMode({
  className,
  size = "icon",
  ...props
}: ToggleDarkModeProps) {
  const { theme, setTheme } = useDarkMode();

  return (
    <Toggle
      variant="outline"
      size={size}
      className={cn(
        "group relative data-[state=on]:hover:bg-muted data-[state=on]:bg-transparent",
        className
      )}
      pressed={theme === "dark"}
      onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      {...props}
    >
      <span className="relative inline-flex size-4 items-center justify-center">
        <MoonIcon
          size={16}
          className="absolute shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          aria-hidden="true"
        />
        <SunIcon
          size={16}
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
      </span>
    </Toggle>
  );
}
