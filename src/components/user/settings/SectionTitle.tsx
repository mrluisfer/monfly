import type { LucideIcon } from "lucide-react";

/** Title with a leading accent icon, shared by both columns for a consistent header rhythm. */
export function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
      {children}
    </span>
  );
}
