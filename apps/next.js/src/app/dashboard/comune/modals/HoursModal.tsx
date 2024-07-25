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
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";

export function HoursModal() {
  const { data: user, isLoading: userLoading } = api.user.getUser.useQuery({});
  const [open, setOpen] = useState(false);
  const [done, setdone] = useState(false);
  const UpdateHours = api.admin.setAdminHours.useMutation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const utils = api.useUtils();

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

  const initialDays = [
    {
      name: "Lunedì",
      open: true,
      openTime1: "10:00",
      closeTime1: "14:00",
      openTime2: "16:00",
      closeTime2: "18:00",
    },
    {
      name: "Martedì",
      open: true,
      openTime1: "10:00",
      closeTime1: "14:00",
      openTime2: "16:00",
      closeTime2: "18:00",
    },
    {
      name: "Mercoledì",
      open: true,
      openTime1: "10:00",
      closeTime1: "14:00",
      openTime2: "16:00",
      closeTime2: "18:00",
    },
    {
      name: "Giovedì",
      open: true,
      openTime1: "10:00",
      closeTime1: "14:00",
      openTime2: "16:00",
      closeTime2: "18:00",
    },
    {
      name: "Venerdì",
      open: true,
      openTime1: "10:00",
      closeTime1: "14:00",
      openTime2: "16:00",
      closeTime2: "18:00",
    },
    {
      name: "Sabato",
      open: false,
      openTime1: "",
      closeTime1: "",
      openTime2: "",
      closeTime2: "",
    },
    {
      name: "Domenica",
      open: false,
      openTime1: "",
      closeTime1: "",
      openTime2: "",
      closeTime2: "",
    },
  ];

  const [days, setDays] = useState(initialDays);

  useEffect(() => {
    if (user && user.city && user.city.openingHours && !done) {
      const updatedDays = initialDays.map((day) => {
        const dbDay = user!.city!.openingHours.find(
          (h) => getDayItalian(h.day) === day.name,
        );
        return dbDay
          ? {
              ...day,
              open: dbDay.openTime1 !== null,
              openTime1: dbDay.openTime1 || "",
              closeTime1: dbDay.closeTime1 || "",
              openTime2: dbDay.openTime2 || "",
              closeTime2: dbDay.closeTime2 || "",
            }
          : day;
      });
      setDays(updatedDays);
      setdone(true);
    }
  }, [user]);

  const handleDayChange = (index: number, field: string, value: unknown) => {
    const newDays = [...days];
    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    newDays[index][field] = value;
    console.log(newDays);
    setDays(newDays);
  };

  const handleSave = () => {
    UpdateHours.mutate({
      hours: days,
    });
    setTimeout(() => {
      utils.invalidate();
      setOpen(false);
    }, 1000);
  };

  if (userLoading) return null;

  const renderContent = () => (
    <div className="overflow-y-auto p-4">
      {days.map((day, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center justify-between">
            <span>{day.name}</span>
            <Switch
              checked={day.open}
              onCheckedChange={() => handleDayChange(index, "open", !day.open)}
            />
          </div>
          {day.open && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={day.openTime1}
                  onChange={(e) => {
                    handleDayChange(index, "openTime1", e.target.value);
                  }}
                />
                <span>-</span>
                <Input
                  type="time"
                  value={day.closeTime1}
                  onChange={(e) =>
                    handleDayChange(index, "closeTime1", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={day.openTime2}
                  onChange={(e) =>
                    handleDayChange(index, "openTime2", e.target.value)
                  }
                />
                <span>-</span>
                <Input
                  type="time"
                  value={day.closeTime2}
                  onChange={(e) =>
                    handleDayChange(index, "closeTime2", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button className="mt-4 w-full bg-foreground" onClick={handleSave}>
        Salva modifiche
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p className="cursor-pointer text-sm text-foreground underline">
            Modifica
          </p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80%] overflow-y-auto  rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle>Orari</DialogTitle>
            <DialogDescription>
              Modifica gli orari del tuo profilo qui. Clicca su salva quando hai
              finito.
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
        <DrawerContent className="max-h-[80%] overflow-y-auto rounded-lg bg-white">
          <DrawerHeader className="text-left">
            <DrawerTitle>Orari</DrawerTitle>
            <DrawerDescription>
              Modifica gli orari del tuo profilo qui. Clicca su salva quando hai
              finito.
            </DrawerDescription>
          </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }
}
