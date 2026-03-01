import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useIsMobile } from "~/hooks/use-mobile";
import { ChevronRight } from "lucide-react";

export function HeaderActions() {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        className="hidden sm:inline-flex"
        render={
          <Link to="/login" className="text-sm">
            Sign In
          </Link>
        }
      />
      <Button
        size={isMobile ? "lg" : "default"}
        render={
          <Link to="/signup" className="text-sm">
            <span className="hidden sm:inline">Sign Up</span>
            <span className="sm:hidden">Join</span>
            <ChevronRight className="size-5" />
          </Link>
        }
      />
    </div>
  );
}
