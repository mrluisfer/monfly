export const navigationLinks = [
  { href: "/", label: "Home" },
  {
    label: "Features",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/#features",
        label: "User Management",
        description: "Coming soon...",
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
        href: "/#getting-started",
        label: "Getting Started",
        icon: "BookOpenIcon",
      },
      { href: "/#tutorials", label: "Tutorials", icon: "LifeBuoyIcon" },
      { href: "/#about", label: "About Us", icon: "InfoIcon" },
    ],
  },
];
