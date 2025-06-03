import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CATEGORY_ICONS } from "~/constants/categories-icon";
import { categoryFormNames } from "~/constants/category-form-names";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email.server";
import { CategoryFormSchema } from "~/zod-schemas/category-schema";
import Card from "../card";
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

const AddCategory = () => {
  const useEmail = useRouteUser();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      [categoryFormNames.name]: "",
      [categoryFormNames.icon]: "",
    },
  });

  const postCategoryByEmail = useMutation({
    fn: postCategoryByEmailServer,
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await postCategoryByEmail.mutate({
        data: {
          email: useEmail,
          category: {
            name: data[categoryFormNames.name],
            icon: data[categoryFormNames.icon],
          },
        },
      });
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  return (
    <Card title="Add Category">
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
                  <Input id={categoryFormNames.name} {...field} />
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
          <Button type="submit" className="w-full">
            Create new category
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default AddCategory;
