import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

import { Button } from "./ui/button";

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <main
      className="min-h-[60vh] flex flex-col items-center justify-center px-4"
      role="alert"
      aria-label="Page Not Found"
    >
      <div className="flex flex-col items-center gap-4 bg-white/90 dark:bg-zinc-900/80 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <AlertTriangle
          className="w-14 h-14 text-amber-400 mb-2"
          aria-hidden="true"
        />
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-1">
          404 – Page Not Found
        </h1>
        <div className="text-zinc-600 dark:text-zinc-400 text-center mb-2 text-base">
          {children || (
            <p>
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
          )}
        </div>
        <div className="flex gap-4 mt-4 w-full justify-center">
          <Button
            type="button"
            aria-label="Go back"
            onClick={() => window.history.back()}
            size="lg"
            variant="outline"
          >
            Previous Page
          </Button>
          <Button asChild size="lg" variant="default">
            <Link to="/" aria-label="Go to home page">
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
