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
    <NavigationMenu viewport={false} className="max-md:hidden">
      <NavigationMenuList className="gap-2">
        {navigationLinks.map((link) => (
          <NavigationMenuItem key={link.label}>
            {link.submenu ? (
              <>
                <NavigationMenuTrigger className="text-muted-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5">
                  {link.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50 p-1">
                  <ul
                    className={cn(
                      link.type === "description" ? "min-w-64" : "min-w-48"
                    )}
                  >
                    {link.items.map((item) => (
                      <li key={`${item.href}-${item.label}`}>
                        <NavigationMenuLink
                          asChild
                          href={item.href}
                          className="py-1.5"
                        >
                          <Link to={item.href}>
                            {link.type === "icon" && "icon" in item && (
                              <HeaderMenuIcon
                                icon={item.icon}
                                label={item.label}
                              />
                            )}
                            {link.type === "description" &&
                            "description" in item ? (
                              <div className="space-y-1">
                                <div className="font-medium">{item.label}</div>
                                <p className="text-muted-foreground line-clamp-2 text-xs">
                                  {item?.description}
                                </p>
                              </div>
                            ) : (
                              !link.type ||
                              (link.type !== "icon" &&
                                link.type !== "description" && (
                                  <span>{item.label}</span>
                                ))
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                href={link.href}
                className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                asChild
              >
                <Link to={link.href}>{link.label}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
