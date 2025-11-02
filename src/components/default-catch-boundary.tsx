import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

import { Button } from "./ui/button";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  // Log error but prevent stream issues
  console.error("Route error:", error);

  // Check if it's a stream-related error
  const isStreamError =
    error?.message?.includes("Controller is already closed") ||
    (error as any)?.code === "ERR_INVALID_STATE";

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-4">
      <ErrorComponent error={error} />
      <div className="flex gap-4 items-center flex-wrap">
        <Button
          onClick={() => {
            // For stream errors, do a hard refresh instead of router invalidate
            if (isStreamError) {
              window.location.reload();
            } else {
              router.invalidate();
            }
          }}
          className={
            "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
          }
        >
          {isStreamError ? "Reload Page" : "Try Again"}
        </Button>
        {isRoot ? (
          <Link
            to="/"
            className={
              "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
            }
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className={
              "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
            }
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
}
