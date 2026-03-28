import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

import { RouteStatusCard } from "./RouteStatusCard";
import { Button } from "./ui/button";

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <RouteStatusCard
      icon={
        <AlertTriangle className="size-8 text-amber-500" aria-hidden="true" />
      }
      title="404 - Page Not Found"
      description={
        children ||
        "The page you are looking for doesn't exist or has been moved."
      }
      actions={
        <>
          <Button
            type="button"
            aria-label="Go back"
            onClick={() => window.history.back()}
            size="lg"
            variant="outline"
          >
            Previous Page
          </Button>
          <Button
            size="lg"
            variant="default"
            render={
              <Link to="/" aria-label="Go to home page">
                Go to Home
              </Link>
            }
          />
        </>
      }
    />
  );
}
