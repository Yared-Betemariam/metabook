// utils/createColumns.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "./utils";

type ExtraColumn<T> = {
  id?: string;
  accessorKey?: keyof T;
  header?: string | ((props: unknown) => React.ReactNode);
  cell?: (props: { row: Row<T> }) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
  coloring?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRender?: (value: any) => string | React.ReactNode;
  isDate?: boolean;
  isPrice?: boolean;
  isPnl?: boolean;
  isBold?: boolean;
  isLink?: boolean;
};

type ActionItem<T> = {
  title: string;
  onTitle?: (row: Row<T>) => string;
  onClick: (row: Row<T>) => void;
  disabled?: boolean;
};

interface CreateColumnsOptions<T> {
  includeSelect?: boolean;
  includeActions?: boolean;
  extraColumns?: ExtraColumn<T>[];
  customActionsCell?: (row: Row<T>) => React.ReactNode;
  actionsItems?: ActionItem<T>[];
}

export function createColumns<T>({
  includeSelect = false,
  includeActions = false,
  extraColumns = [],
  customActionsCell,
  actionsItems = [],
}: CreateColumnsOptions<T>): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = [];

  if (includeSelect) {
    columns.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  for (const col of extraColumns) {
    const key = col.accessorKey as string;

    const defaultCell = ({ row }: { row: Row<T> }) => {
      const value = row.getValue(key);
      const style: React.CSSProperties = {};

      if (!value) {
        style.opacity = "50%";
      }

      if (col.isBold) {
        style.fontWeight = "600";
      }

      if (col.coloring) {
        const color = col.coloring[row.getValue(key) as string] || "#eee";

        return (
          <Badge
            style={
              value
                ? {
                    backgroundColor: color,
                    color: [""].includes(color) ? "black" : "white",
                  }
                : {}
            }
            variant={value ? "default" : "outline"}
            className={cn(
              "text-xs py-0 px-1 font-normal tracking-tight capitalize rounded-none",
              value ? "uppercase" : "text-zinc-400 bg-zinc-200!"
            )}
          >
            {!value ? "None" : String(value)}
          </Badge>
        );
      }

      return (
        <div
          style={style}
          className={cn(
            "z-10",
            !col.isBold && !col.coloring && "text-zinc-700"
          )}
        >
          {!value ? (
            "None"
          ) : col.isLink ? (
            <Link
              target="_blank"
              href={value}
              className="underline flex font-medium underline-offset-2 text-blue-600 hover:opacity-80 cursor-pointer duration-200 transition-all items-center gap-0.5"
            >
              link
              <ExternalLink className="size-4" />
            </Link>
          ) : col.isDate ? (
            <>{format(new Date(value as string), "dd/MM/yyyy")}</>
          ) : col.isPnl ? (
            <PnlDisplay value={value.toString()} />
          ) : col.onRender ? (
            col.onRender(value)
          ) : (
            String(value)
          )}
        </div>
      );
    };

    columns.push({
      id: col.id,
      accessorKey: key,
      header: col.header,
      cell: col.cell ?? defaultCell,
      enableSorting: col.enableSorting,
      enableHiding: col.enableHiding,
    });
  }

  if (includeActions) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) =>
        customActionsCell ? (
          customActionsCell(row)
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-0 py-2">
              {actionsItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  disabled={item.disabled}
                  onClick={() => item.onClick(row)}
                  className={cn(
                    "p-1.5 px-4",
                    item.title.toLowerCase().includes("delete") &&
                      "text-destructive hover:text-destructive!"
                  )}
                >
                  {item.onTitle ? item.onTitle(row) : item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
    });
  }

  return columns;
}

function PnlDisplay({ value }: { value: string | number }) {
  const num = Number(value);
  if (isNaN(num)) return null;

  const isNegative = num < 0;
  const abs = Math.abs(num);
  const formatted = abs % 1 === 0 ? abs.toString() : abs.toFixed(2); // remove trailing .00

  return (
    <span
      className={cn(
        "font-medium tracking-tight brightness-75",
        isNegative ? "text-red-500" : "text-green-600"
      )}
    >
      {isNegative ? "-$" : "$"}
      {formatted}
    </span>
  );
}
