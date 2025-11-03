import { transactionTypes } from "~/constants/transaction-types";
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon } from "lucide-react";

import ChartByCategoryRadar from "../charts/chart-by-category-radar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const ChartTabs = () => {
  return (
    <Tabs defaultValue={transactionTypes.EXPENSE}>
      <TabsList>
        <TabsTrigger value={transactionTypes.EXPENSE} className="capitalize gap-2">
          <BanknoteArrowDownIcon className="text-destructive" />
          {transactionTypes.EXPENSE}
        </TabsTrigger>
        <TabsTrigger value={transactionTypes.INCOME} className="capitalize gap-2">
          <BanknoteArrowUpIcon className="text-primary" />
          {transactionTypes.INCOME}
        </TabsTrigger>
      </TabsList>
      <TabsContent value={transactionTypes.EXPENSE}>
        <ChartByCategoryRadar type={transactionTypes.EXPENSE} />
      </TabsContent>
      <TabsContent value={transactionTypes.INCOME}>
        <ChartByCategoryRadar type={transactionTypes.INCOME} />
      </TabsContent>
    </Tabs>
  );
};
