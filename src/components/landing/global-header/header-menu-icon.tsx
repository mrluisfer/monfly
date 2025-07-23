import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from "lucide-react";

export function HeaderMenuIcon({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  if (icon === "BookOpenIcon")
    return (
      <span className="flex items-center gap-2">
        <BookOpenIcon
          size={16}
          className="text-foreground opacity-60"
          aria-hidden="true"
        />
        <span>{label}</span>
      </span>
    );
  if (icon === "LifeBuoyIcon")
    return (
      <span className="flex items-center gap-2">
        <LifeBuoyIcon
          size={16}
          className="text-foreground opacity-60"
          aria-hidden="true"
        />
        <span>{label}</span>
      </span>
    );
  if (icon === "InfoIcon")
    return (
      <span className="flex items-center gap-2">
        <InfoIcon
          size={16}
          className="text-foreground opacity-60"
          aria-hidden="true"
        />
        <span>{label}</span>
      </span>
    );
  return <span>{label}</span>;
}
