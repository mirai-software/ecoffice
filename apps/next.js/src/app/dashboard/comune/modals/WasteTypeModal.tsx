"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useState } from "react";

import { api } from "@/trpc/react";
import Image from "next/image";

export function WasteTypeModal() {
  const { data: wasteTypes, isLoading: wasteTypesLoading } =
    api.admin.getWasteTypes.useQuery();

  const utils = api.useUtils();

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const [wasteTypesState, setWasteTypesState] = useState<
    {
      id: string;
      name: string;
      color: string;
      category: string;
      info: string[];
      icon: string;
      createdAt: Date;
      updatedAt: Date;
      selected: boolean;
    }[]
  >([]);

  useEffect(() => {
    if (wasteTypes && !done) {
      // Assuming indicators can be categorized by some property, e.g., type
      setWasteTypesState(
        wasteTypes.map((type, index) => ({
          ...type,
          selected: index == 0 ? true : false,
        })),
      );
      setDone(true);
    }
  }, [wasteTypes]);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const setWasteTypes = api.admin.setWasteTypes.useMutation();

  const handleSave = () => {
    setWasteTypes.mutate({ wasteTypes: wasteTypesState });
    setTimeout(() => {
      utils.invalidate();
      setOpen(false);
    }, 1000);
  };

  const renderContent = () => (
    <div className="overflow-y-auto p-4">
      <section className="flex flex-row gap-4 overflow-x-auto overflow-y-auto  p-5">
        {wasteTypesState.map((wasteType) => (
          <div key={wasteType.id} className="flex flex-col items-center">
            <div
              className="flex items-center justify-center rounded-full p-3"
              style={{
                backgroundColor: wasteType.color,
                opacity: wasteType.selected ? 1 : 0.5,
              }}
              onClick={() =>
                // Assuming only one waste type can be selected at a time
                setWasteTypesState((prev) =>
                  prev.map((prevWasteType) => ({
                    ...prevWasteType,
                    selected: prevWasteType.id === wasteType.id,
                  })),
                )
              }
            >
              <Image
                src={
                  process.env.NEXT_PUBLIC_WEBSITE_URL +
                  `/icon/${wasteType.icon}`
                }
                width={20}
                height={20}
                alt={wasteType.name}
                className={"h-3 w-3"}
              />
            </div>
            <p
              className="mt-2 text-center text-sm font-normal"
              style={{
                color: wasteType.color,
              }}
            >
              {wasteType.name}
            </p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4 pt-4">
        <div className="flex min-h-36  w-full flex-col gap-2">
          <h3 className="text-lg font-semibold text-black">Cosa Conferire</h3>
          <textarea
            id="message"
            rows={4}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Write your thoughts here..."
            value={
              wasteTypesState.find((wasteType) => wasteType.selected)
                ?.info[0] || ""
            }
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              // update the selected waste type info
              setWasteTypesState((prev) =>
                prev.map((prevWasteType) =>
                  prevWasteType.selected
                    ? {
                        ...prevWasteType,
                        info: [e.target.value],
                      }
                    : prevWasteType,
                ),
              );
            }}
          ></textarea>
        </div>
        <div className="flex h-full w-full flex-col gap-2">
          <h3 className="text-lg font-semibold text-black">
            Cosa non Conferire
          </h3>
          <textarea
            id="message"
            rows={4}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Write your thoughts here..."
            value={
              wasteTypesState.find((wasteType) => wasteType.selected)
                ?.info[1] || ""
            }
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              // update the selected waste type info
              setWasteTypesState((prev) =>
                prev.map((prevWasteType) =>
                  prevWasteType.selected
                    ? {
                        ...prevWasteType,
                        info: [e.target.value],
                      }
                    : prevWasteType,
                ),
              );
            }}
          ></textarea>
        </div>

        <div className="flex min-h-36 w-full flex-col gap-2">
          <h3 className="text-lg font-semibold text-black">Come Conferire</h3>
          <textarea
            id="message"
            rows={4}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Write your thoughts here..."
            value={
              wasteTypesState.find((wasteType) => wasteType.selected)
                ?.info[2] || ""
            }
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              // update the selected waste type info
              setWasteTypesState((prev) =>
                prev.map((prevWasteType) =>
                  prevWasteType.selected
                    ? {
                        ...prevWasteType,
                        info: [e.target.value],
                      }
                    : prevWasteType,
                ),
              );
            }}
          ></textarea>
        </div>
      </section>

      <Button className="mt-4 w-full bg-foreground" onClick={handleSave}>
        Salva modifiche
      </Button>
    </div>
  );

  if (wasteTypesLoading) return null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p className="cursor-pointer text-sm text-foreground underline">
            Modifica
          </p>
        </DialogTrigger>
        <DialogContent className="max-h-[90%] max-w-[700px] overflow-y-auto  rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle>Gestione Rifiuti</DialogTitle>
            <DialogDescription>
              Gestici i rifiuti del tuo comune qui. Clicca su salva quando hai
              concluso
            </DialogDescription>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <p className="cursor-pointer text-sm text-foreground underline">
            Modifica
          </p>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90%] overflow-y-auto rounded-lg bg-white">
          <DrawerHeader className="text-left">
            <DrawerTitle>Gestione Rifiuti</DrawerTitle>
            <DrawerDescription>
              Gestici i rifiuti del tuo comune qui. Clicca su salva quando hai
              concluso
            </DrawerDescription>
          </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }
}
