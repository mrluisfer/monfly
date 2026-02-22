import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

import { HeaderLogo } from "../global-header/header-logo";
import { navigationLinks } from "../global-header/navigation-links";

export const FooterNavigation = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 items-start">
      <div className="flex flex-col gap-4">
        <HeaderLogo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Monfly. All rights reserved.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:flex gap-6 sm:gap-8 justify-between w-full text-sm text-muted-foreground">
        {navigationLinks.map((link) => (
          <div key={link.label} className="flex flex-col gap-2">
            <Button asChild variant="link">
              <Link to={link.href} className="text-left justify-start p-0">
                {link.label}
              </Link>
            </Button>
            {link.items && (
              <ul className="flex flex-col gap-1 text-xs">
                {link.items.map((item) => (
                  <li key={item.label}>
                    <Button asChild variant="link" size="sm">
                      <Link to={item.href} className="text-xs p-0">
                        {item.label}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
