import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { useCategoriesList } from "~/hooks/use-categories-list";
import { FolderOpen, Loader2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  const shouldRenderDeleteButton = data?.data?.length && data?.data?.length > 0;
  const categoriesCount = data?.data?.length || 0;
  const selectedCount = selectedCategories.length;

  return (
    <div className="w-full max-w-4xl xl:max-w-5xl m-0">
      <Card className="shadow-sm border backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <FolderOpen className="h-5 w-5 text-primary" />
                Categories
                {categoriesCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {categoriesCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Manage and organize your expense categories
              </CardDescription>
            </div>
            {selectedCount > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                {selectedCount} selected
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isPending && (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="flex flex-col sm:flex-row items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 sm:h-4 sm:w-4 animate-spin" />
                <span className="text-sm sm:text-base">
                  Loading categories...
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-destructive">
                  Error loading categories
                </p>
                <p className="text-xs text-muted-foreground max-w-md">
                  {error?.message}
                </p>
              </div>
            </div>
          )}

          {!isPending && !error && categoriesCount === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center space-y-4">
              <div className="p-4 rounded-full bg-muted/50">
                <FolderOpen className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-base sm:text-lg text-muted-foreground">
                  No categories found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Create your first category to organize your expenses and get
                  started
                </p>
              </div>
            </div>
          )}

          {!isPending && !error && data?.data && categoriesCount > 0 && (
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleDeleteCategories();
                }}
              >
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Available Categories
                  </FormLabel>
                  <FormDescription className="text-sm">
                    Select categories to manage or delete them in bulk
                  </FormDescription>

                  <div className="mt-4">
                    <ScrollArea className="h-[300px] sm:h-[400px] w-full rounded-md border bg-background/50 dark:bg-background/20">
                      <div className="space-y-1 p-2 sm:p-4">
                        {data.data.map((category, index) => (
                          <div key={category.id}>
                            <FormItem className="flex items-center gap-2 sm:gap-3 space-y-0 rounded-lg border border-transparent p-2 sm:p-3 hover:bg-accent/50 hover:border-border transition-all duration-200 group">
                              <Checkbox
                                id={category.id}
                                checked={selectedCategories.includes(
                                  category.id
                                )}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(category.id, !!checked)
                                }
                                className="shrink-0"
                              />
                              <FormLabel
                                htmlFor={category.id}
                                className="cursor-pointer flex-1 min-w-0"
                              >
                                <CategoryItem category={category} />
                              </FormLabel>
                            </FormItem>
                            {index < data.data.length - 1 && (
                              <Separator className="my-1 opacity-50" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <FormMessage />
                </FormItem>

                {shouldRenderDeleteButton && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {selectedCount > 0
                        ? `${selectedCount} ${selectedCount === 1 ? "category" : "categories"} selected`
                        : "No categories selected"}
                    </p>
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={selectedCategories.length === 0}
                      className="flex items-center gap-2 w-full sm:w-auto"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete selected</span>
                      <span className="sm:hidden">Delete</span>
                      {selectedCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-1 bg-destructive-foreground text-destructive"
                        >
                          {selectedCount}
                        </Badge>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
