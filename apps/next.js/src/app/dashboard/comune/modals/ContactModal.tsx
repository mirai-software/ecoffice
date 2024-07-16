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

export function ContactModal() {
  const { data: user, isLoading: userLoading } = api.user.getUser.useQuery({});
  const [open, setOpen] = useState(false);

  const [done, setDone] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [email, setEmail] = useState("");
  const utils = api.useUtils();
  const [phone, setPhone] = useState("");

  const setCityContact = api.admin.setCityContact.useMutation();

  useEffect(() => {
    if (user && !done) {
      // Assuming indicators can be categorized by some property, e.g., type
      setEmail(user.city?.email ?? "");
      setPhone(user.city?.whatsappNumber ?? "");
      setDone(true);
    }
  }, [user]);

  const handleSave = () => {
    setCityContact.mutate({ email, phone });
    setTimeout(() => {
      utils.invalidate();
      setOpen(false);
    }, 1000);
  };

  const renderContent = () => (
    <div className=" p-4">
      <section className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal text-gray-500">Email</label>
          <input
            type="email"
            className={
              "w-full rounded-xl border border-gray-300 p-2 text-foreground " +
              (!email ? "text-gray-400" : "")
            }
            value={email ?? "Ancora non definito..."}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal text-gray-500">
            Numero di whatsapp
          </label>
          <div className="flex flex-row gap-2">
            <div className="flex items-center justify-center rounded-xl border border-gray-300 p-2">
              <span role="img" aria-label="Italy flag">
                🇮🇹
              </span>
              <span className="ml-2">+39</span>
            </div>
            <input
              type="text"
              className={
                "w-full rounded-xl border border-gray-300 p-2 text-foreground " +
                (!phone ? "text-gray-400" : "")
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
              value={phone ?? "Ancora non definito..."}
            />
          </div>
        </div>
      </section>

      <Button className="mt-4 w-full bg-foreground" onClick={handleSave}>
        Salva modifiche
      </Button>
    </div>
  );

  if (userLoading) return null;

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
            <DialogTitle>Contatti</DialogTitle>
            <DialogDescription>
              Modifica i contatti del tuo profilo qui. Clicca su salva quando
              hai finito.
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
        <DrawerContent className="max-h-[80%] rounded-lg bg-white">
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
