import type { ComponentProps } from "react";
import { useAppHaptics } from "~/hooks/haptics/useAppHaptics";
import { useDarkMode } from "~/hooks/ui/useDarkMode";
import { useIsMounted } from "~/hooks/ui/useIsMounted";
import { cn } from "~/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ToggleDarkModeProps = {
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
};

export default function ToggleDarkMode({
  className,
  size = "icon-lg",
}: ToggleDarkModeProps) {
  const { theme, setTheme } = useDarkMode();
  const { selection } = useAppHaptics();
  const isMounted = useIsMounted();

  // Until mounted, render with the SSR default theme so the first client
  // render matches the server HTML (avoids a hydration mismatch). The real
  // theme from localStorage is applied right after mount.
  const displayTheme = isMounted ? theme : "light";

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
            aria-label={`Switch to ${displayTheme === "dark" ? "light" : "dark"} mode`}
          />
        }
      >
        {displayTheme === "light" ? (
          <MoonIcon size={16} aria-hidden="true" />
        ) : (
          <SunIcon size={16} aria-hidden="true" />
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {displayTheme === "light"
          ? "Switch to dark mode"
          : "Switch to light mode"}
      </TooltipContent>
    </Tooltip>
  );
}
