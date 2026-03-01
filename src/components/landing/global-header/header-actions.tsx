import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="lg"
        className="hidden sm:inline-flex"
        render={<Link to="/login">Sign In</Link>}
      />
      <Button
        size={"lg"}
        render={
          <Link to="/signup">
            <span className="hidden sm:inline">Sign Up</span>
            <span className="sm:hidden">Join</span>
            <ChevronRight className="size-5" />
          </Link>
        }
      />
    </div>
  );
}
