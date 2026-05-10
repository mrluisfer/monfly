import {
  BookOpenIcon,
  InfoIcon,
  LifeBuoyIcon,
  MailIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { HeaderIconName } from "./NavigationLinks";

const iconMap: Record<HeaderIconName, typeof BookOpenIcon> = {
  BookOpenIcon,
  LifeBuoyIcon,
  InfoIcon,
  ShieldCheckIcon,
  ScaleIcon,
  MailIcon,
};

export function HeaderMenuIcon({
  icon,
  label,
}: {
  icon: HeaderIconName;
  label: string;
}) {
  const Icon = iconMap[icon];
  if (!Icon) return <span>{label}</span>;

  return (
    <span className="flex items-center gap-2">
      <Icon
        size={16}
        className="text-foreground opacity-60"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}
