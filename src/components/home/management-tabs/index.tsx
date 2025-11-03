import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { TabsCategories } from "./categories";

enum ManagementTab {
  CATEGORIES = "categories",
  PARTNERS = "partners",
}

export const ManagementTabs = () => {
  return (
    <Tabs defaultValue={ManagementTab.CATEGORIES}>
      <TabsList>
        <TabsTrigger value={ManagementTab.CATEGORIES} className="capitalize">
          {ManagementTab.CATEGORIES}
        </TabsTrigger>
        <TabsTrigger value={ManagementTab.PARTNERS} className="capitalize">
          {ManagementTab.PARTNERS}
        </TabsTrigger>
      </TabsList>
      <TabsContent value={ManagementTab.CATEGORIES}>
        <TabsCategories />
      </TabsContent>
      <TabsContent value={ManagementTab.PARTNERS}>
        Change your password here.
      </TabsContent>
    </Tabs>
  );
};
