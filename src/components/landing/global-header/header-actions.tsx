import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="secondary" size="sm">
        <Link to="/login" className="text-sm">
          Sign In
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link to="/signup" className="text-sm flex items-center justify-center">
          Sign Up
          <ChevronRight className="size-5" />
        </Link>
      </Button>
    </div>
  );
}
