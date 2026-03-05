import { useId } from "react";
import { MailIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

export default function EmailInput({
  field,
}: {
  field: ControllerRenderProps<any, "email">;
}) {
  const id = useId();

  return (
    <FormItem>
      <div className="*:not-first:mt-2">
        <FormLabel htmlFor={id}>Email</FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              id={id}
              className="peer h-11 pe-9"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              {...field}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
              <MailIcon size={16} aria-hidden="true" />
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
}
