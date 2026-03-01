"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

export function SimplePasswordInput({
  field,
}: {
  field: ControllerRenderProps<any, "password">;
}) {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <FormItem>
      <div className="*:not-first:mt-2">
        <FormLabel htmlFor={id}>Password</FormLabel>

        <FormControl>
          <div className="relative">
            <Input
              id={id}
              className="pe-9"
              placeholder="Enter your password..."
              type={isVisible ? "text" : "password"}
              {...field}
            />
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls={id}
            >
              {isVisible ? (
                <EyeOffIcon size={16} aria-hidden="true" />
              ) : (
                <EyeIcon size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
}
