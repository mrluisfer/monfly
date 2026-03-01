export type HeaderIconName = "BookOpenIcon" | "LifeBuoyIcon" | "InfoIcon";

type NavigationBaseItem = {
  href: string;
  label: string;
};

type NavigationDescriptionItem = NavigationBaseItem & {
  description: string;
};

type NavigationIconItem = NavigationBaseItem & {
  icon: HeaderIconName;
};

type NavigationLink =
  | {
      href: string;
      label: string;
      submenu?: false;
      items?: never;
      type?: never;
    }
  | {
      label: string;
      submenu: true;
      type: "description";
      items: NavigationDescriptionItem[];
      href?: never;
    }
  | {
      label: string;
      submenu: true;
      type: "icon";
      items: NavigationIconItem[];
      href?: never;
    };

export const navigationLinks: NavigationLink[] = [
  { href: "/", label: "Home" },
  {
    label: "Features",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/#features",
        label: "Cashflow Intelligence",
        description: "Insights and projections to avoid surprises.",
      },
      {
        href: "/#features",
        label: "Goal Tracking",
        description: "Stay focused on savings and debt milestones.",
      },
    ],
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "About",
    submenu: true,
    type: "icon",
    items: [
      {
        href: "/#features",
        label: "Getting Started",
        icon: "BookOpenIcon",
      },
      { href: "/#pricing", label: "Playbook", icon: "LifeBuoyIcon" },
      { href: "/#about", label: "About Monfly", icon: "InfoIcon" },
    ],
  },
];
