import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export function SystemStatusBadge() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="secondary" className="gap-1.5 select-none uppercase">
          <span
            className="size-1.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          ></span>
          all ok
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <span className="text-xs">All systems are operational.</span>
      </TooltipContent>
    </Tooltip>
  );
}
