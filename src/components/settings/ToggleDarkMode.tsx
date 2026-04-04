import type { ComponentProps } from "react";
import { useDarkMode } from "~/hooks/useDarkMode";
import { cn } from "~/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

import { useAppHaptics } from "@/hooks/useAppHaptics";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ToggleDarkModeProps = {
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
};

export default function ToggleDarkMode({
  className,
  size = "icon",
}: ToggleDarkModeProps) {
  const { theme, setTheme } = useDarkMode();
  const { selection } = useAppHaptics();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size={size}
            className={cn(className)}
            onClick={() => {
              const newTheme = theme === "dark" ? "light" : "dark";
              setTheme(newTheme);
              selection();
            }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          />
        }
      >
        {theme === "light" ? (
          <MoonIcon size={16} aria-hidden="true" />
        ) : (
          <SunIcon size={16} aria-hidden="true" />
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </TooltipContent>
    </Tooltip>
  );
}
