import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

import { HeaderLogo } from "../global-header/HeaderLogo";
import { navigationLinks } from "../global-header/NavigationLinks";

export const FooterNavigation = () => {
  return (
    <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
      <div className="flex flex-col gap-4">
        <HeaderLogo />
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Monfly. All rights reserved.
        </p>
        <ul className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-xs">
          <li>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </li>
          <li aria-hidden="true">·</li>
          <li>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </li>
          <li aria-hidden="true">·</li>
          <li>
            <Link
              to="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <div className="text-muted-foreground grid grid-cols-2 gap-6 text-sm sm:flex sm:justify-between sm:gap-8">
        {navigationLinks.map((link) => (
          <div key={link.label} className="flex flex-col gap-2">
            {link.href ? (
              <Button
                variant="link"
                size="lg"
                className="text-foreground hover:text-primary h-auto justify-start px-0 py-0 text-left font-semibold no-underline hover:no-underline"
                render={<Link to={link.href}>{link.label}</Link>}
              />
            ) : (
              <p className="text-foreground font-semibold">{link.label}</p>
            )}

            {link.submenu && (
              <ul className="flex flex-col gap-1 text-xs">
                {link.items.map((item) => (
                  <li key={item.label}>
                    <Button
                      variant="link"
                      size="lg"
                      className="text-muted-foreground hover:text-foreground h-auto justify-start px-0 py-0 text-xs no-underline hover:no-underline"
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
