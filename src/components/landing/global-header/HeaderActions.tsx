import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variant="secondary"
        size="lg"
        render={
          <Link to="/login">
            Sign In <ChevronRight />
          </Link>
        }
      />
      <Button
        size="lg"
        render={
          <Link to="/signup" className="inline-flex items-center gap-1.5">
            <span className="hidden sm:inline">Create account</span>
            <span className="sm:hidden">Start</span>
            <ChevronRight />
          </Link>
        }
      />
    </div>
  );
}
