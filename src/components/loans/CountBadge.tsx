import { Badge } from "~/components/ui/badge";

/** Small numeric pill shown next to filter tabs; renders nothing when zero. */
export function CountBadge({ n, variant }: { n: number; variant?: "default" | "secondary" }) {
  if (!n) return null;
  return (
    <Badge
      variant={variant ?? "default"}
      className="ml-1 h-4 min-w-4 rounded-full px-1 text-[10px] tabular-nums"
    >
      {n}
    </Badge>
  );
}
