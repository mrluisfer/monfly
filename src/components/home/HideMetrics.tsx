import { hideMetricsAtom } from "@/state";
import { useAtom } from "jotai";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";

export const HideMetrics = ({ className }: { className?: string }) => {
  const [hideMetrics, setHideMetrics] = useAtom(hideMetricsAtom);
  const VisibilityIcon = hideMetrics ? EyeOffIcon : EyeIcon;

  return (
    <Card
      className={cn(
        "finance-panel rounded-[1.4rem] border-0 p-0 shadow-none",
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="finance-chip flex size-10 shrink-0 items-center justify-center rounded-full">
                <VisibilityIcon className="size-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Quick metrics
                </p>
                <label
                  className="mt-1 block cursor-pointer text-sm font-semibold tracking-tight text-foreground"
                  htmlFor="hide-metrics"
                >
                  {hideMetrics
                    ? "Hidden to keep focus on balance"
                    : "Visible in your overview"}
                </label>
              </div>
            </div>
          </div>

          <div className="finance-chip flex items-center justify-between gap-3 rounded-full px-3 py-2 sm:justify-center">
            <span className="text-xs font-medium text-muted-foreground">
              {hideMetrics ? "Show cards" : "Hide cards"}
            </span>
            <Switch
              id="hide-metrics"
              size="default"
              checked={hideMetrics}
              onCheckedChange={setHideMetrics}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
