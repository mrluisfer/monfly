import { hideBalanceAtom } from "@/state";
import { useAtom } from "jotai";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const HideData = () => {
  const [isBalanceHidden, setIsBalanceHidden] = useAtom(hideBalanceAtom);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => !prev);
  };

  const label = isBalanceHidden ? "Show information" : "Hide information";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={toggleBalanceVisibility}
            aria-label={label}
            aria-pressed={isBalanceHidden}
            title={label}
          />
        }
      >
        {isBalanceHidden ? (
          <EyeIcon aria-hidden="true" />
        ) : (
          <EyeOffIcon aria-hidden="true" />
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
};
