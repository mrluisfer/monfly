import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

import { HeaderLogo } from "../global-header/header-logo";
import { navigationLinks } from "../global-header/navigation-links";

export const FooterNavigation = () => {
  return (
    <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
      <div className="flex flex-col gap-4">
        <HeaderLogo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Monfly. All rights reserved.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm text-muted-foreground sm:flex sm:justify-between sm:gap-8">
        {navigationLinks.map((link) => (
          <div key={link.label} className="flex flex-col gap-2">
            {link.href ? (
              <Button
                variant="link"
                className="h-auto justify-start px-0 py-0 text-left font-semibold text-foreground"
                render={<Link to={link.href}>{link.label}</Link>}
              />
            ) : (
              <p className="font-semibold text-foreground">{link.label}</p>
            )}

            {link.submenu && (
              <ul className="flex flex-col gap-1 text-xs">
                {link.items.map((item) => (
                  <li key={item.label}>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto justify-start px-0 py-0 text-xs"
                      render={<Link to={item.href}>{item.label}</Link>}
                    />
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
