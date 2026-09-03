import { PiggyBankIcon } from "lucide-react";

import { MetricTile } from "~/components/shared/MetricTile";
import { SavingsRing } from "./SavingsRing";
import type { Tone } from "./types";

interface SavingsRateTileProps {
  hidden: boolean;
  rate: number | null;
}

const HEALTHY_THRESHOLD = 0.2;

function resolveTone(rate: number | null, safeRate: number): Tone {
  if (rate === null) {
    return "neutral";
  }
  if (safeRate >= HEALTHY_THRESHOLD) {
    return "success";
  }
  if (safeRate >= 0) {
    return "warning";
  }
  return "destructive";
}

function resolveHint(rate: number | null, safeRate: number): string {
  if (rate === null) {
    return "needs income";
  }
  if (safeRate >= HEALTHY_THRESHOLD) {
    return "healthy savings";
  }
  if (safeRate >= 0) {
    return "modest savings";
  }
  return "spending exceeds income";
}

export function SavingsRateTile({ rate, hidden }: SavingsRateTileProps) {
  const safeRate = rate ?? 0;
  const clamped = Math.max(-1, Math.min(1, safeRate));
  const tone = resolveTone(rate, safeRate);
  let display = `${(clamped * 100).toFixed(0)}%`;
  if (rate === null) {
    display = "—";
  } else if (hidden) {
    display = "••";
  }

  return (
    <MetricTile
      label="Savings rate"
      value={display}
      valueTone={tone}
      icon={PiggyBankIcon}
      iconTone={tone}
      aside={
        <SavingsRing
          value={Math.max(0, clamped)}
          tone={tone}
          dimmed={hidden || rate === null}
        />
      }
      footer={
        <p className="truncate text-muted-foreground text-xs">
          {resolveHint(rate, safeRate)}
        </p>
      }
    />
  );
}
