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
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";

type Indicator = {
  id: number;
  name: string;
  data: string;
};

export function StatisticModal() {
  const { data: cityIndicator, isLoading: cityIndicatorLoading } =
    api.city.getCityStatistics.useQuery();
  const [open, setOpen] = useState(false);
  const [productionIndicators, setProductionIndicators] = useState(
    [] as unknown[],
  );
  const [specificIndicators, setSpecificIndicators] = useState([] as unknown[]);
  const [done, setDone] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();

  const setCityStatistics = api.admin.setCityStatistics.useMutation();
  const utils = api.useUtils();

  useEffect(() => {
    if (cityIndicator && !done) {
      // Assuming indicators can be categorized by some property, e.g., type
      setProductionIndicators(
        cityIndicator.filter((ind) => ind.type == "ProductionIndicator"),
      );
      setSpecificIndicators(
        cityIndicator.filter((ind) => ind.type == "SpecificIndicator"),
      );
      setDone(true);
    }
  }, [cityIndicator]);

  const handleSave = () => {
    // Merge the two arrays and send them to the server (add type property)
    const indicators = [
      ...productionIndicators.map((ind) => ({
        ...(ind as Indicator),
        type: "ProductionIndicator",
      })),
      ...specificIndicators.map((ind) => ({
        ...(ind as Indicator),
        type: "SpecificIndicator",
      })),
    ];

    setCityStatistics.mutate({ indicators });
    setTimeout(() => {
      utils.invalidate();
      setOpen(false);
      toast({
        title: "Indicatori aggiornati",
        description: "Gli indicatori sono stati aggiornati con successo",
      });
    }, 1000);
  };

  const handleNewProductionIndicator = () => {
    setProductionIndicators([
      ...productionIndicators,
      {
        id: productionIndicators.length + 1,
        name: "",

        data: "",
      },
    ]);
  };

  const handleNewSpecificIndicator = () => {
    setSpecificIndicators([
      ...specificIndicators,
      {
        id: specificIndicators.length + 1,
        name: "",
        data: "",
      },
    ]);
  };

  const handleProductionChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    type: unknown,
  ) => {
    if (type === "name") {
      const newIndicators = [...productionIndicators];
      (newIndicators[index] as Indicator).name = e.target.value;
      setProductionIndicators(newIndicators);
    } else {
      const newIndicators = [...productionIndicators];
      (newIndicators[index] as Indicator).data = e.target.value;
      setProductionIndicators(newIndicators);
    }
  };

  const handleSpecificChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    type: unknown,
  ) => {
    if (type === "name") {
      const newIndicators = [...specificIndicators];
      (newIndicators[index] as Indicator).name = e.target.value;
      setSpecificIndicators(newIndicators);
    } else {
      const newIndicators = [...specificIndicators];
      (newIndicators[index] as Indicator).data = e.target.value;
      setSpecificIndicators(newIndicators);
    }
  };

  const renderContent = () => (
    <div className="overflow-y-auto p-4">
      <h3>Indicatori di Produzione</h3>
      {productionIndicators.map((ind, index) => (
        <div key={(ind as Indicator).id} className="mb-2 flex items-center">
          <Input
            type="text"
            value={(ind as Indicator).name}
            className="mr-2"
            onChange={(e) => handleProductionChange(e, index, "name")}
          />
          <Input
            type="text"
            value={(ind as Indicator).data}
            className="flex-grow"
            onChange={(e) => handleProductionChange(e, index, "data")}
          />
        </div>
      ))}
      <Button
        className="mb-4 w-full border-2 border-dashed border-foreground/50 bg-foreground/10 text-foreground"
        onClick={() => handleNewProductionIndicator()}
      >
        + Nuovo indicatore
      </Button>

      <h3>Indicatori Specifici</h3>
      {specificIndicators.map((ind, index) => (
        <div key={(ind as Indicator).id} className="mb-2 flex items-center">
          <Input
            type="text"
            value={(ind as Indicator).name}
            className="mr-2"
            onChange={(e) => handleSpecificChange(e, index, "name")}
          />
          <Input
            type="text"
            value={(ind as Indicator).data}
            className="flex-grow"
            onChange={(e) => handleSpecificChange(e, index, "data")}
          />
        </div>
      ))}
      <Button
        className="mb-4 w-full border-2 border-dashed border-foreground/50 bg-foreground/10 text-foreground"
        onClick={() => handleNewSpecificIndicator()}
      >
        + Nuovo indicatore
      </Button>

      <Button className="mt-4 w-full bg-foreground" onClick={handleSave}>
        Salva modifiche
      </Button>
    </div>
  );

  if (cityIndicatorLoading) return null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p className="cursor-pointer text-sm text-foreground underline">
            Modifica
          </p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80%] rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle>Indicatori</DialogTitle>
            <DialogDescription>
              Modifica gli indicatori del tuo profilo qui. Clicca su salva
              quando hai finito.
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
        <DrawerContent className="max-h-[80%]  rounded-lg bg-white">
          <DrawerHeader className="text-left">
            <DrawerTitle>Indicatori</DrawerTitle>
            <DrawerDescription>
              Modifica gli indicatori del tuo profilo qui. Clicca su salva
              quando hai finito.
            </DrawerDescription>
          </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }
}
