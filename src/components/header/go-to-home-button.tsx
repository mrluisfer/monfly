import { Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { ArrowLeft } from "lucide-react";

import { Button } from "../ui/button";

export function GoToHomeButton({
  url,
  position = "left",
}: {
  url?: string;
  position?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "absolute top-4 z-10",
        position === "right" ? "right-4" : "left-4"
      )}
    >
      <Button variant="default" asChild className="group" size="sm">
        <Link to={url || "/"}>
          <ArrowLeft
            className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5 text-white"
            size={16}
            aria-hidden="true"
          />
          Go to home
        </Link>
      </Button>
    </div>
  );
}
