import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORY_ICONS } from "~/constants/categories-icon";
import { categoryFormNames } from "~/constants/category-form-names";
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name={categoryFormNames.name}
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>Select an icon</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an icon" />
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
                          <icon.Icon /> {icon.label}
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : submitText}
        </Button>
      </form>
    </Form>
  );
}
