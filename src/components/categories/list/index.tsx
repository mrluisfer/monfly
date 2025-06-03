import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Card from "~/components/card";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useCategoriesList } from "~/hooks/use-categories-list";
import CategoryItem from "./category-item";

const CategoryFormSchema = z.object({
  categories: z.array(z.string()),
});

type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

export const CategoriesList = () => {
  const {
    data,
    isPending,
    error,
    selectedCategories,
    handleCheckboxChange,
    handleDeleteCategories,
  } = useCategoriesList();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      categories: [],
    },
  });

  return (
    <Card title="Categories" subtitle="List of your categories">
      {isPending && <div>Loading...</div>}
      {error && <div>Error: {error?.message}</div>}

      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleDeleteCategories();
          }}
        >
          <FormItem>
            <FormLabel>Categories</FormLabel>
            <FormDescription>Select your preferred categories:</FormDescription>
            {data?.data && (
              <div className="flex flex-col gap-2">
                {data.data.map((category) => (
                  <FormItem
                    key={category.id}
                    className="flex items-center gap-2 space-y-0 hover:bg-muted rounded-md transition-colors px-2"
                  >
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(category.id, !!checked)
                      }
                    />
                    <FormLabel
                      htmlFor={category.id}
                      className="cursor-pointer w-full"
                    >
                      <CategoryItem category={category} />
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
          <Button
            type="submit"
            variant="destructive"
            disabled={selectedCategories.length === 0}
          >
            Delete selected categories
          </Button>
        </form>
      </Form>
    </Card>
  );
};
