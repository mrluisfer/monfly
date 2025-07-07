import { useId } from "react";
import { MailIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import { Input } from "@/components/ui/input";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

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
              className="peer pe-9"
              placeholder="jhondoe@gmail.com"
              type="email"
              {...field}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
              <MailIcon size={16} aria-hidden="true" />
            </div>
          </div>
        </FormControl>
        <FormDescription>
          This is your email address. Be sure to use a valid email.
        </FormDescription>
        <FormMessage />
      </div>
    </FormItem>
  );
}
