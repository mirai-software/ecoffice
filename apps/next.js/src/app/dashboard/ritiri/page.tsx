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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/app/_components/loading";
import { ImageModal } from "./modals/ImageModal";
import { FancyMultiSelect, Framework } from "../segnalazioni/page";
import { CreatePickup, CreatePickupModal } from "./modals/CreatePickup";

export type PickRequest = {
  phone: string | null;
  id: string;
  address: string;
  userId: string;
  type: string;
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

  const [PickRequest, setPickRequest] = useState<[]>([]);
  const [citysData, setCitysData] = useState<Framework[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    if (citys) {
      setCitysData(citys);
    }
  }, [citys]);

  useEffect(() => {
    if (data) {
      setPickRequest(
        // inserisci unicamente i "data" che hanno data.city.id in citysData
        data.filter((data) => {
          return citysData.some((city) => city.value === data.city.id);
        }),
      );
    }
  }, [data, citysData]);

  const table = useReactTable({
    data: PickRequest ?? [],
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

  if (isLoading) {
    return (
      <Container>
        <LoadingComponent />
      </Container>
    );
  } else
    return (
      <Container>
        <div className="flex flex-col gap-2">
          <CreatePickupModal />
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
