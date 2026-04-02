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

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={toggleBalanceVisibility}
            aria-label={
              isBalanceHidden ? "Show total balance" : "Hide total balance"
            }
            aria-pressed={isBalanceHidden}
            title={isBalanceHidden ? "Show balance" : "Hide balance"}
            className="finance-chip rounded-full text-foreground"
          />
        }
      >
        {isBalanceHidden ? (
          <EyeIcon aria-hidden="true" />
        ) : (
          <EyeOffIcon aria-hidden="true" />
        )}
      </TooltipTrigger>
      <TooltipContent>Hide information</TooltipContent>
    </Tooltip>
  );
};
