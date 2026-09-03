export type HeaderIconName =
  | "BookOpenIcon"
  | "LifeBuoyIcon"
  | "InfoIcon"
  | "ShieldCheckIcon"
  | "ScaleIcon"
  | "MailIcon";

interface NavigationBaseItem {
  href: string;
  label: string;
}

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
    items: [
      {
        description: "Alerts and forecasts that prevent money surprises.",
        href: "/#features",
        label: "Decision Feed",
      },
      {
        description: "Operate your plan quickly with thumb-first actions.",
        href: "/#features",
        label: "Mobile Workflow",
      },
    ],
    label: "Features",
    submenu: true,
    type: "description",
  },
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    items: [
      {
        href: "/#features",
        icon: "BookOpenIcon",
        label: "How It Works",
      },
      { href: "/#pricing", icon: "LifeBuoyIcon", label: "Plans" },
      { href: "/#about", icon: "InfoIcon", label: "About Monfly" },
    ],
    label: "About",
    submenu: true,
    type: "icon",
  },
  {
    items: [
      { href: "/privacy", icon: "ShieldCheckIcon", label: "Privacy Policy" },
      { href: "/terms", icon: "ScaleIcon", label: "Terms & Conditions" },
      { href: "/contact", icon: "MailIcon", label: "Contact" },
    ],
    label: "Legal",
    submenu: true,
    type: "icon",
  },
];
