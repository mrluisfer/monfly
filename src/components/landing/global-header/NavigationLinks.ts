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
        label: "Decision Feed",
        description: "Alerts and forecasts that prevent money surprises.",
      },
      {
        href: "/#features",
        label: "Mobile Workflow",
        description: "Operate your plan quickly with thumb-first actions.",
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
        label: "How It Works",
        icon: "BookOpenIcon",
      },
      { href: "/#pricing", label: "Plans", icon: "LifeBuoyIcon" },
      { href: "/#about", label: "About Monfly", icon: "InfoIcon" },
    ],
  },
];
