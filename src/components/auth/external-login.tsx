import { FcGoogle } from "react-icons/fc";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function ExternalLogin() {
  return (
    <div className="flex flex-col space-y-4 w-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              size="lg"
              disabled
            >
              <FcGoogle />
              Log in with Google
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">This feature is coming soon!</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
