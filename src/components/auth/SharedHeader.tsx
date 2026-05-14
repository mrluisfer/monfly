import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "../ui/button";

export function SharedHeader({ children }: { children: ReactNode }) {
  return (
    <header className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
      <Button
        variant="outline"
        size="lg"
        className="bg-background/75 rounded-full"
        render={
          <Link to="/" className="inline-flex items-center gap-1.5">
            <ArrowLeftIcon className="size-4" />
            Back to home
          </Link>
        }
      />
      {children}
    </header>
  );
}
