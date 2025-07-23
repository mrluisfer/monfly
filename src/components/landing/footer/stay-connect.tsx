import { useId } from "react";
import { Button } from "~/components/ui/button";
import { AtSignIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StayConnect() {
  const id = useId();
  return (
    <div className="*:not-first:mt-2 flex items-start justify-between">
      <Label htmlFor={id} className="flex flex-col items-start gap-2 text-lg">
        Stay connected
        <span className="text-sm text-muted-foreground">
          Subscribe to our newsletter for the latest updates, resources, and
          exclusive offers.
        </span>
      </Label>
      <form className="flex items-center gap-2">
        <div className="relative">
          <Input
            id={id}
            className="peer ps-9 bg-white w-[300px]"
            placeholder="Email"
            type="email"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <AtSignIcon size={16} aria-hidden="true" />
          </div>
        </div>
        <Button>Subscribe</Button>
      </form>
    </div>
  );
}
