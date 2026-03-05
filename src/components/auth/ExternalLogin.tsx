import { FcGoogle } from "react-icons/fc";

import { Button } from "../ui/button";

export function ExternalLogin({
  label = "Continue with Google",
}: {
  label?: string;
}) {
  return (
    <div className="flex w-full flex-col space-y-2">
      <Button
        variant="outline"
        type="button"
        className="h-11 w-full"
        size="lg"
        disabled
      >
        <FcGoogle />
        {label}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        This feature is coming soon.
      </p>
    </div>
  );
}
