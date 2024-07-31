"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleX, LoaderCircle } from "lucide-react";

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
import { useEffect, useState } from "react";

import { api } from "@/trpc/react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

const CalendarSorter = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getDayItalian = (day: string) => {
  switch (day) {
    case "Monday":
      return "Lunedì";
    case "Tuesday":
      return "Martedì";
    case "Wednesday":
      return "Mercoledì";
    case "Thursday":
      return "Giovedì";
    case "Friday":
      return "Venerdì";
    case "Saturday":
      return "Sabato";
    case "Sunday":
      return "Domenica";
    default:
      return "Errore";
  }
};

const AddWasteTypeComponent = ({
  SetCalendar,
  Calendar,
  wasteTypes,
  index,
}: {
  SetCalendar: unknown;
  Calendar: unknown[];
  wasteTypes: {
    id: string;
    name: string;
    color: string;
    category: string;
    info: string[];
    icon: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  index: number;
}) => {
  const [open, setOpen] = useState(false);

  if (!wasteTypes) return null;
  else if (!open) {
    return (
      <Button
        className="w-full border-2 border-dashed border-foreground bg-white text-foreground"
        onClick={() => setOpen(true)}
      >
        + Aggiungi
      </Button>
    );
  } else if (open) {
    return (
      <section className="grid grid-cols-2 gap-1 p-5 lg:grid-cols-2">
        {wasteTypes
          .filter(
            ({ category }: { category: string }) => category === "Commercial",
          )
          .map((wasteType) => (
            <div
              key={wasteType.id}
              className="flex flex-col items-center"
              onClick={() => {
                const newCalendar = Calendar.map((day, i) => {
                  if (i === index) {
                    return {
                      ...(day as { wasteTypes: { id: string }[] }),
                      wasteTypes: [
                        ...(day as { wasteTypes: { id: string }[] }).wasteTypes,
                        {
                          wasteType: wasteType,
                        },
                      ],
                    };
                  }
                  return day;
                });
                // @ts-expect-error ts-migrate(18046) FIXME: 'SetCalendar' is of type 'unknown'.
                SetCalendar(newCalendar);
                setOpen(false);
              }}
            >
              <div
                className="flex items-center justify-center rounded-full p-3"
                style={{ backgroundColor: wasteType.color }}
              >
                <Image
                  src={
                    process.env.NEXT_PUBLIC_WEBSITE_URL +
                    `/icon/${wasteType.icon}`
                  }
                  width={20}
                  height={20}
                  alt={wasteType.name}
                  className="h-3 w-3"
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
    );
  }
};

const WasteTypeComponent = ({
  wastetype,
  SetCalendar,
  Calendar,
}: {
  wastetype: {
    name: string;
    icon: string;
    id: string;
    index: number;
    color: string;
  };
  SetCalendar: unknown;
  Calendar: unknown[];
  wasteTypes: {
    id: string;
    name: string;
    color: string;
    category: string;
    info: string[];
    icon: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  return (
    <div
      className={`flex min-h-10 w-full items-center gap-2 pl-2`}
      style={{
        backgroundColor: wastetype.color,
      }}
    >
      <Image
        src={process.env.NEXT_PUBLIC_WEBSITE_URL + `/icon/${wastetype.icon}`}
        alt="Carta"
        width={25}
        height={25}
      />
      <p className="text-sm text-white">{wastetype.name}</p>

      <CircleX
        className="ml-auto mr-2 text-white"
        onClick={() => {
          const newCalendar = Calendar.map((day, i) => {
            if (i === wastetype.index) {
              return {
                ...(day as { wasteTypes: { id: string }[] }),
                wasteTypes: (
                  day as { wasteTypes: { id: string }[] }
                ).wasteTypes.filter(
                  // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.s
                  ({ wasteType }) => wasteType.id !== wastetype.id,
                ),
              };
            }
            return day;
          });
          // @ts-expect-error ts-migrate(2532) FIXME: the Dispatch type is not correct.
          SetCalendar(newCalendar);
        }}
      />
    </div>
  );
};

export function EditCalendarComModal() {
  const { data: City, isLoading: CalendarLoading } =
    api.user.getAdminCity.useQuery();
  const { data: wasteTypes, isLoading: wasteTypesLoading } =
    api.admin.getWasteTypes.useQuery();

  const setCityCalendar = api.admin.setCityCalendar.useMutation();
  const { toast } = useToast();

  // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
  const [Calendar, SetCalendar] = useState<typeof City.calendars>([]);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (City && !done) {
      SetCalendar(
        City.calendars.sort((a, b) =>
          CalendarSorter.indexOf(a.day) > CalendarSorter.indexOf(b.day)
            ? 1
            : -1,
        ),
      );
      setDone(true);
    }
  }, [City]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const utils = api.useUtils();

  const handleSave = async () => {
    setIsLoading(true);
    setCityCalendar.mutateAsync(Calendar).then(() => {
      utils.invalidate();
      setIsLoading(false);
      setOpen(false);
      toast({
        title: "Calendario Aggiornato",
        description: "Il calendario è stato aggiornato con successo",
      });
    });
  };

  const renderContent = () => (
    <div className=" p-2">
      <section className="flex flex-col gap-4  overflow-y-auto">
        <section className="flex max-h-[300px] min-w-max flex-col rounded-2xl lg:max-h-[500px]">
          <section className="mb-10 flex flex-col gap-4 p-3 lg:mb-0">
            <div className="flex flex-col items-center ">
              <p className="text-md text-gray-400">
                Orario di ritiro: 18:00 - 24:00
              </p>
              <div className="flex w-full flex-col gap-2 p-3">
                {Calendar.map((day, index) => {
                  return (
                    <section className="flex w-full flex-1 flex-row items-center gap-4">
                      <p className="flex min-w-[20%] ">
                        {getDayItalian(day.day)}
                      </p>
                      <section className="flex flex-1 flex-col">
                        {day.wasteTypes
                          .filter(
                            ({ wasteType }) =>
                              wasteType.category === "Commercial",
                          )
                          .map(({ wasteType }) => (
                            <WasteTypeComponent
                              wastetype={{
                                name: wasteType.name,
                                id: wasteType.id,
                                index: index,
                                icon: wasteType.icon,
                                color: wasteType.color,
                              }}
                              SetCalendar={SetCalendar}
                              Calendar={Calendar}
                              wasteTypes={wasteTypes || []}
                            />
                          ))}
                        <AddWasteTypeComponent
                          wasteTypes={wasteTypes || []}
                          SetCalendar={SetCalendar}
                          Calendar={Calendar}
                          index={index}
                        />
                      </section>
                    </section>
                  );
                })}
              </div>
            </div>
          </section>
        </section>
      </section>

      <Button
        className="mt-4 w-full bg-foreground disabled:bg-gray-700"
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          "Salva Modifiche"
        )}
      </Button>
    </div>
  );

  if (CalendarLoading || wasteTypesLoading || !Calendar || !wasteTypes)
    return null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p className="cursor-pointer text-sm text-foreground underline">
            Modifica
          </p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[90%] rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle>Utenze Domestiche</DialogTitle>
            <DialogDescription></DialogDescription>
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
        <DrawerContent className="max-h-[90%] rounded-lg bg-white">
          <DrawerHeader className="text-left">
            <DrawerTitle>Contatti</DrawerTitle>
            <DrawerDescription>
              Modifica i contatti del tuo profilo qui. Clicca su salva quando
              hai finito.
            </DrawerDescription>
          </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }
}
