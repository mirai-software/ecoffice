"use client";
import Container from "../../_components/container";
import { api } from "@/trpc/react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/app/_components/loading";
import { ImageModal } from "../ritiri/modals/ImageModal";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { CreateReportModal } from "./modals/CreateReport";

export type Framework = Record<"value" | "label", string>;

export function FancyMultiSelect({
  allCitys,
  citys,
  setCitys,
}: {
  allCitys: Framework[];
  citys: Framework[];
  setCitys: (citys: Framework[]) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);

  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((framework: Framework) => {
    setCitys((prev) => prev.filter((s) => s.value !== framework.value));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setCitys((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [],
  );

  const selectables = allCitys.filter((city) => !citys.includes(city));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="h-fit overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {citys.map((framework) => {
            return (
              <Badge
                key={framework.value}
                variant="secondary"
                className="bg-gray-200"
              >
                {framework.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Seleziona una città"
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((framework) => {
                  return (
                    <CommandItem
                      key={framework.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setCitys((prev) => [...prev, framework]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {framework.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}

export type PickRequest = {
  phone: string | null;
  id: string;
  address: string;
  userId: string;
  type: string;
  otherSpecs: string;
  images: string[];
};

const columns: ColumnDef<PickRequest>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">
        {(row.getValue("id") as string).slice(0, 8) + "..."}
      </div>
    ),
  },

  {
    accessorKey: "address",
    header: "Indirizzo",
    cell: ({ row }) => (
      <div className="">{row.getValue("address") as string}</div>
    ),
  },

  {
    accessorKey: "otherSpecs",
    header: "Altre Specifiche",
    cell: ({ row }) => (
      <div className="">{row.getValue("otherSpecs") as string}</div>
    ),
  },

  {
    accessorKey: "type",
    header: "Tipo di Rifiuto",
    cell: ({ row }) => (
      <div className="">
        {(row.getValue("type") as string) === "other"
          ? (row.getValue("otherSpecs") as string)
          : (row.getValue("type") as string)}
      </div>
    ),
  },

  {
    accessorKey: "phone",
    header: "Telefono",
    cell: ({ row }) => (
      <div className="">{("+39 " + row.getValue("phone")) as string}</div>
    ),
  },

  {
    accessorKey: "images",
    header: "Immagini",
    cell: ({ row }) => (
      <ImageModal images={row.getValue("images") as string[]} />
    ),
  },
];

export default function home() {
  const { data, isLoading } = api.admin.getAllCityReports.useQuery();
  const { data: citys, isLoading: citysLoading } = api.city.getAllcity.useQuery(
    {},
  );

  const [ReportsData, setReportsData] = useState<[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [citysData, setCitysData] = useState<Framework[]>([]);

  useEffect(() => {
    if (citys) {
      setCitysData(citys);
    }
  }, [citys]);

  useEffect(() => {
    if (data) {
      setReportsData(
        // inserisci unicamente i "data" che hanno data.city.id in citysData
        data.filter((data) => {
          return citysData.some((city) => city.value === data.city.id);
        }),
      );
    }
  }, [data, citysData]);

  const table = useReactTable({
    data: ReportsData || [],

    // @ts-expect-error overload
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      columnVisibility: {
        id: true,
        address: true,
        type: true,
        phone: true,
        images: true,
        otherSpecs: false,
      },
    },
  });

  if (isLoading || citysLoading) {
    return (
      <Container>
        <LoadingComponent />
      </Container>
    );
  } else
    return (
      <Container>
        <div className="flex flex-col gap-2">
          <CreateReportModal />
          <FancyMultiSelect
            citys={citysData || []}
            setCitys={setCitysData}
            allCitys={citys || []}
          />
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-full text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </Container>
    );
}
