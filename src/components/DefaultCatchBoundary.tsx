import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

import { RouteStatusCard } from "./RouteStatusCard";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

function getErrorMessage(error: unknown) {
  if (!error) {
    return "Unexpected error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return "Unexpected error";
}

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });
  const errorMessage = getErrorMessage(error);

  // Log error but prevent stream issues
  console.error("Route error:", error);

  // Check if it's a stream-related error
  const errorCode =
    typeof error === "object" && error && "code" in error
      ? (error as { code?: unknown }).code
      : undefined;
  const isStreamError =
    errorMessage.includes("Controller is already closed") ||
    errorCode === "ERR_INVALID_STATE";

  return (
    <RouteStatusCard
      icon={
        <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
      }
      title="Something went wrong"
      description="An unexpected error occurred while loading this page."
      details={
        <Alert variant="destructive">
          <AlertCircle className="size-4" aria-hidden="true" />
          <AlertTitle>Error details</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      }
      actions={
        <>
          <Button
            onClick={() => {
              // For stream errors, do a hard refresh instead of router invalidate
              if (isStreamError) {
                window.location.reload();
              } else {
                router.invalidate();
              }
            }}
            size="lg"
          >
            {isStreamError ? "Reload Page" : "Try Again"}
          </Button>
          {isRoot ? (
            <Button
              size="lg"
              variant="outline"
              render={
                <Link to="/" aria-label="Go to home page">
                  Go to Home
                </Link>
              }
            />
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
              aria-label="Go back to previous page"
            >
              Previous Page
            </Button>
          )}
        </>
      }
    />
  );
}
