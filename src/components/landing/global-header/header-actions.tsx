import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variant="ghost"
        size="lg"
        className="hidden md:inline-flex rounded-full px-3 text-foreground/80 hover:text-foreground"
        render={<Link to="/login">Sign In</Link>}
      />
      <Button
        size="lg"
        className="rounded-full bg-foreground px-3 text-background shadow-[0_10px_30px_-20px_rgba(0,0,0,0.75)] transition-colors duration-150 ease-out hover:bg-foreground/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
        render={
          <Link to="/signup" className="inline-flex items-center gap-1.5">
            <span className="hidden sm:inline">Start Free</span>
            <span className="sm:hidden">Join</span>
            <ChevronRight className="size-4" />
          </Link>
        }
      />
    </div>
  );
}
