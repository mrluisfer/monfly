"use client";

import { useId, type ChangeEvent } from "react";
import { ControllerRenderProps } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

export default function UsernameInput({
  field,
}: {
  field: ControllerRenderProps<any, "name">;
}) {
  const id = useId();
  const maxLength = 25;
  const {
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    value: field.value ?? "",
    onChange: field.onChange,
  });

  return (
    <FormItem>
      <div className="*:not-first:mt-2">
        <FormLabel htmlFor={id}>Full name</FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              id={id}
              className="peer h-11 pe-14"
              type="text"
              maxLength={maxLength}
              autoComplete="name"
              aria-describedby={`${id}-description`}
              placeholder="Enter your full name..."
              {...field}
              value={field.value ?? ""}
              onChange={handleChange}
            />
            <div
              id={`${id}-description`}
              className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums peer-disabled:opacity-50"
              aria-live="polite"
              role="status"
            >
              {characterCount}/{limit}
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
}
function useCharacterLimit(arg0: {
  maxLength: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const { maxLength, value, onChange } = arg0;

  const characterCount = value.length;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= maxLength) {
      onChange(event.target.value);
    }
  };

  return { characterCount, handleChange, maxLength };
}
