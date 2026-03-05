import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

import { MobileMenuPopover } from "./MobileMenuPopover";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <MobileMenuPopover />
      <Button
        variant="ghost"
        size="lg"
        className="hidden rounded-full px-3 text-foreground/80 hover:bg-background/85 hover:text-foreground sm:inline-flex"
        render={<Link to="/login">Sign In</Link>}
      />
      <Button
        size="lg"
        className="rounded-full bg-primary px-3 text-primary-foreground shadow-[0_18px_30px_-22px_rgba(15,118,110,0.72)] transition-colors duration-150 ease-out hover:bg-primary/90"
        render={
          <Link to="/signup" className="inline-flex items-center gap-1.5">
            <span className="hidden sm:inline">Launch App</span>
            <span className="sm:hidden">Start</span>
            <ChevronRight className="size-4" />
          </Link>
        }
      />
    </div>
  );
}
