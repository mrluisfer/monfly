import { Table as TanstackTable } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function DataTablePagination({
  table,
}: {
  table: TanstackTable<TransactionWithUser>;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <Badge variant={"outline"}>
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </Badge>
      <div className="flex items-center justify-end gap-2">
        <Badge>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(1, table.getPageCount())}
        </Badge>
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
          Next
        </Button>
      </div>
    </div>
  );
}
