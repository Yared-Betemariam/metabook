import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { timeRangeOptions } from "@/data";
import { TimeRange } from "@/types";
import { IoRefresh } from "react-icons/io5";
import { GoFilter } from "react-icons/go";
import { toast } from "sonner";
import SimpleLoader from "../custom/SimpleLoader";
import Dropdown from "../custom/dropdown";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  paginationLimit?: number;
  onRefresh?: () => void;
  paginated?: boolean;
  loading?: boolean;
  timeRange?: TimeRange;
  setTimeRange?: (timeRange: TimeRange) => void;
  dropdowns?: {
    id: string;
    label: string;
    value?: string;
    options: {
      value: string;
      label?: string;
    }[];
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRefresh,
  setTimeRange,
  timeRange,
  loading,
  dropdowns,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dropdownFilters, setDropdownFilters] = useState<
    { id: string; value: string }[]
  >(
    dropdowns
      ? dropdowns.map((item) => ({ id: item.id, value: item.value || "" }))
      : []
  );

  const table = useReactTable({
    data,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="flex flex-col">
      <div
        style={
          {
            "--border": "#ddd",
          } as React.CSSProperties
        }
        className="flex w-full flex-col border bg-white"
      >
        {/* Top Controls */}
        <div className="flex flex-wrap items-center px-2 py-2">
          <Input
            placeholder="Search by pair, tags"
            value={globalFilter}
            onChange={(e) => {
              table.setGlobalFilter(String(e.target.value));
            }}
            className="flex-1 bg-zinc-900/5 shadow-none rounded-none border-border text-base"
          />
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm opacity-60 ml-2.5 mr-1">
              <GoFilter className="size-5" />
            </span>
            {dropdowns &&
              dropdowns.map((item) => (
                <Dropdown
                  key={item.id}
                  placeholder={item.label}
                  ghost
                  options={item.options.map((opt) => ({
                    value: opt.value,
                    label: opt.label || opt.value,
                  }))}
                  value={dropdownFilters.find((m) => m.id == item.id)?.value}
                  onChange={(value) => {
                    table.getColumn(item.id)?.setFilterValue(value);

                    setDropdownFilters((state) =>
                      state.map((i) =>
                        i.id == item.id ? { id: item.id, value: value } : i
                      )
                    );
                  }}
                />
              ))}
            {timeRange && setTimeRange && (
              <Dropdown
                placeholder={"Select time"}
                ghost
                options={timeRangeOptions}
                value={timeRange}
                onChange={(value) => {
                  setTimeRange(value as TimeRange);
                }}
              />
            )}
            {onRefresh && (
              <span
                onClick={() => {
                  toast.success("Refreshed Successfuly!");
                  onRefresh();
                }}
                className="border flex items-center gap-0.5 px-2 py-1 hover:bg-zinc-50 cursor-pointer text-sm hover:opacity-80 duration-200"
              >
                <IoRefresh /> Refresh
              </span>
            )}
            {(dropdownFilters.filter((item) => item.value).length > 0 ||
              globalFilter) && (
              <span
                onClick={() => {
                  if (dropdownFilters.filter((item) => item.value).length > 0) {
                    setDropdownFilters(
                      dropdownFilters.map((item) => {
                        table.getColumn(item.id)?.setFilterValue("");
                        return { id: item.id, value: "" };
                      })
                    );
                  }

                  if (globalFilter) {
                    table.resetGlobalFilter();

                    table.setGlobalFilter("");
                  }
                }}
                className="border px-2 py-1 hover:bg-zinc-50 cursor-pointer text-sm hover:opacity-80 duration-200"
              >
                Clear
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="h-10" key={headerGroup.id}>
                {headerGroup.headers.map((header, cellIdx, arr) => (
                  <TableHead
                    className={
                      cellIdx === 0
                        ? "pl-6"
                        : cellIdx === arr.length - 1
                        ? "pr-6"
                        : undefined
                    }
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-16 opacity-50 px-6"
                >
                  <SimpleLoader className="" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell, cellIdx, arr) => (
                    <TableCell
                      className={
                        cellIdx === 0
                          ? "pl-6"
                          : cellIdx === arr.length - 1
                          ? "pr-6"
                          : ""
                      }
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-16 opacity-50 px-6"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
