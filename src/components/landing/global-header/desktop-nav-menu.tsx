import { Link } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";

import { HeaderMenuIcon } from "./header-menu-icon";
import { navigationLinks } from "./navigation-links";

export function DesktopNavMenu() {
  return (
    <NavigationMenu className="hidden md:block" aria-label="Primary navigation">
      <NavigationMenuList className="gap-1">
        {navigationLinks.map((link) => (
          <NavigationMenuItem key={link.label}>
            {link.submenu ? (
              <>
                <NavigationMenuTrigger className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-sm font-medium text-foreground/75 transition-colors hover:border-border/70 hover:bg-muted/40 hover:text-foreground *:[svg]:-me-0.5 *:[svg]:size-3.5">
                  {link.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50 rounded-xl border border-border/70 bg-background/95 p-1 shadow-lg backdrop-blur-md">
                  <ul
                    className={cn(
                      "grid gap-1",
                      link.type === "description" ? "min-w-72" : "min-w-52"
                    )}
                  >
                    {link.items.map((item) => (
                      <li key={`${item.href}-${item.label}`}>
                        <NavigationMenuLink
                          className="rounded-lg px-3 py-2"
                          render={<Link to={item.href} />}
                        >
                          {link.type === "icon" && "icon" in item && (
                            <HeaderMenuIcon
                              icon={item.icon}
                              label={item.label}
                            />
                          )}
                          {link.type === "description" &&
                          "description" in item ? (
                            <div className="space-y-1">
                              <div className="text-sm font-semibold">
                                {item.label}
                              </div>
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          ) : (
                            !link.type && <span>{item.label}</span>
                          )}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted/40 hover:text-foreground"
                render={<Link to={link.href} />}
              >
                {link.label}
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
