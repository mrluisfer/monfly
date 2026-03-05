import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { navigationLinks } from "./navigation-links";

export function MobileMenuPopover() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className="group size-9 rounded-full border border-border/70 bg-background/85 lg:hidden"
            variant="ghost"
            size="lg"
            aria-label="Open navigation menu"
          >
            <svg
              className="pointer-events-none"
              width={16}
              height={16}
              viewBox="0 0 24 24"
            >
              <path
                d="M4 12L20 12"
                className="origin-center -translate-y-[7px] transition-transform duration-150 ease-out group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
              />
              <path
                d="M4 12H20"
                className="origin-center transition-transform duration-150 ease-out group-aria-expanded:rotate-45"
              />
              <path
                d="M4 12H20"
                className="origin-center translate-y-[7px] transition-transform duration-150 ease-out group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
              />
            </svg>
          </Button>
        }
      />
      <PopoverContent
        align="end"
        className="mt-3 w-[min(19rem,calc(100vw-1.2rem))] rounded-2xl border border-border/75 bg-background/96 p-2 shadow-[0_30px_48px_-30px_rgba(2,6,23,0.85)] backdrop-blur-md lg:hidden"
      >
        <NavigationMenu
          className="max-w-none *:w-full"
          aria-label="Mobile navigation"
        >
          <NavigationMenuList className="flex-col items-start gap-1">
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.label} className="w-full">
                {link.submenu ? (
                  <>
                    <div className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {link.label}
                    </div>
                    <ul className="space-y-1">
                      {link.items.map((item) => (
                        <li key={`${item.href}-${item.label}`}>
                          <NavigationMenuLink
                            className="rounded-xl px-2.5 py-2.5 text-sm"
                            render={<Link to={item.href} />}
                          >
                            {item.label}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <NavigationMenuLink
                    className="rounded-xl px-2.5 py-2.5 text-sm"
                    render={<Link to={link.href} />}
                  >
                    {link.label}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </PopoverContent>
    </Popover>
  );
}
