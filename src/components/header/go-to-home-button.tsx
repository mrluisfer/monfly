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
      <Button
        variant="default"
        className="group"
        size="lg"
        render={
          <Link to={url || "/"}>
            <ArrowLeft className="-ms-1" size={16} aria-hidden="true" />
            Go to home
          </Link>
        }
      />
    </div>
  );
}
