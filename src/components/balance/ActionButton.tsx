import { useId } from "react";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function ActionButton({
  icon,
  label,
  description,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null;
}) {
  const id = useId();
  const labelId = `${id}-label`;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={"lg"}
            onClick={onClick}
            variant={variant}
            id={id}
            name={label}
            aria-labelledby={labelId}
            className={"flex-1"}
          />
        }
      >
        {icon}
        <span
          id={labelId}
          className="block truncate text-sm font-semibold tracking-tight"
        >
          {label}
        </span>
      </TooltipTrigger>
      {description ? <TooltipContent>{description}</TooltipContent> : null}
    </Tooltip>
  );
}
