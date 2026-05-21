import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORY_ICONS } from "@/constants/categories/icons";
import { categoryFormNames } from "~/constants/forms/category-form-names";
import { useAppHaptics } from "~/hooks/haptics/useAppHaptics";
import { CategoryFormSchema } from "~/zod-schemas/category-schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PlusIcon } from "lucide-react";

type FormValues = z.infer<typeof CategoryFormSchema>;

type CategoryFormProps = {
  initialValues?: Partial<FormValues>;
  submitText?: string;
  loading?: boolean;
  onSubmit: (values: FormValues) => void | Promise<void>;
};

export function CategoryForm({
  initialValues,
  submitText = "Save Category",
  loading = false,
  onSubmit,
}: CategoryFormProps) {
  const { warning } = useAppHaptics();
  const form = useForm<FormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      [categoryFormNames.name]: initialValues?.[categoryFormNames.name] ?? "",
      [categoryFormNames.icon]: initialValues?.[categoryFormNames.icon] ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => {
          void warning();
        })}
        className="flex flex-col gap-3 md:flex-row md:items-start md:gap-3"
      >
        <FormField
          control={form.control}
          name={categoryFormNames.name}
          render={({ field }) => (
            <FormItem className="md:flex-1">
              <FormLabel htmlFor={categoryFormNames.name}>Name</FormLabel>
              <FormControl>
                <Input
                  id={categoryFormNames.name}
                  placeholder="Some category..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={categoryFormNames.icon}
          render={({ field }) => (
            <FormItem className="md:flex-1">
              <FormLabel>Select an icon</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an icon">
                      {(value: unknown) => {
                        const selected =
                          typeof value === "string" && value.length > 0
                            ? CATEGORY_ICONS.find((i) => i.name === value)
                            : undefined;
                        if (!selected) {
                          return (
                            <span className="text-muted-foreground">
                              Select an icon
                            </span>
                          );
                        }
                        const { Icon, label } = selected;
                        return (
                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md"
                            >
                              <Icon className="size-3.5" />
                            </span>
                            <span className="truncate capitalize">{label}</span>
                          </span>
                        );
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select your type of activity</SelectLabel>
                      {CATEGORY_ICONS.map((icon) => (
                        <SelectItem
                          key={icon.name}
                          value={icon.name}
                          className="capitalize"
                        >
                          <span className="flex items-center gap-2">
                            <icon.Icon className="size-4" />
                            {icon.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Spacer matches the label height so the button aligns with the inputs on md+ */}
        <div className="flex flex-col md:shrink-0">
          <span aria-hidden="true" className="hidden h-[1.125rem] md:block" />
          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? (
              "Saving..."
            ) : (
              <>
                <PlusIcon />
                {submitText}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
