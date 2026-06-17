import { format, formatDistanceStrict } from "date-fns";
import { useNow } from "~/hooks/ui/useNow";
import { cn } from "~/lib/utils";

type RelativeTimeProps = {
  /** The moment to describe — accepts a Date, ISO string, or epoch ms. */
  date: Date | string | number;
  /** Optional text rendered before the relative label, e.g. "Recorded". */
  prefix?: string;
  className?: string;
};

/**
 * Renders a relative time label ("3 minutes ago") that actually keeps up with
 * the clock. The old code called `formatDistanceToNowStrict` once during render,
 * so a freshly added transaction showed "0 seconds ago" forever — it never
 * re-rendered. Here `useNow` ticks every 30s and we measure the distance
 * against that ticking base, so the label rolls forward on its own.
 *
 * Before mount `useNow` is `null`; we fall back to a stable absolute date so the
 * server HTML and first client render match (no hydration mismatch).
 */
export function RelativeTime({ date, prefix, className }: RelativeTimeProps) {
  const now = useNow();
  const target = date instanceof Date ? date : new Date(date);

  const label =
    now === null
      ? format(target, "MMM d, yyyy")
      : formatDistanceStrict(target, now, { addSuffix: true });

  return (
    <time
      dateTime={target.toISOString()}
      title={format(target, "PPpp")}
      className={cn(className)}
    >
      {prefix ? `${prefix} ` : null}
      {label}
    </time>
  );
}
