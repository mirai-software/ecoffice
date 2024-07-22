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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
import { ChangeEvent, useState } from "react";

import { api } from "@/trpc/react";

export function AddMemberModal() {
  const { data: user, isLoading: userLoading } = api.user.getUser.useQuery({});
  const { data: citys, isLoading: citysLoading } = api.city.getAllcity.useQuery(
    {},
  );
  const [open, setOpen] = useState(false);
  const supabase = createClientComponentClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const utils = api.useUtils();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [cityId, setcityId] = useState("");
  const [password, setPassword] = useState("");

  const CreateUser = api.user.addUser.useMutation();
  const SetUser = api.user.setUserInformation.useMutation();

  const handleSave = async () => {
    const firstName = nome.split(" ")[0];
    const lastName = nome.split(" ")[1];

    const { error } = await supabase.auth.admin
      .createUser({
        email: email,
        password: password,
        email_confirm: true,
      })
      .then((res) => {
        CreateUser.mutate({
          email: email,
        });

        SetUser.mutate({
          firstName: firstName ?? "",
          lastname: lastName ?? "",
          address: null,
          phoneNumber: null,
          city: cityId,
        });
      });
    setTimeout(() => {
      utils.invalidate();
      setOpen(false);
    }, 1000);
  };

  const renderContent = () => (
    <div className=" p-4">
      <section className="flex flex-col gap-4 p-5">
        <div className="flex flex-row gap-2">
          <input
            type="text"
            className={
              "w-full rounded-xl border border-gray-300 bg-white p-2 text-foreground " +
              (!nome ? "text-gray-400" : "")
            }
            value={nome ?? "Ancora non definito..."}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNome(e.target.value)
            }
            placeholder="Nome e Cognome"
          />
          <input
            type="email"
            className={
              "w-full rounded-xl border border-gray-300 bg-white p-2 text-foreground " +
              (!email ? "text-gray-400" : "")
            }
            value={email ?? "Ancora non definito..."}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="Email"
          />
        </div>
        <div className="flex flex-row gap-2">
          <input
            type="password"
            className={
              "w-full rounded-xl border border-gray-300 bg-white p-2 text-foreground " +
              (!password ? "text-gray-400" : "")
            }
            value={password ?? "Ancora non definito..."}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
          />
          <Select>
            <SelectTrigger className="text-md w-full rounded-xl border-gray-300 bg-white font-normal text-gray-400">
              <SelectValue placeholder="Seleziona una città" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {citys?.map((city) => (
                  <SelectItem
                    key={city.value}
                    value={city.value}
                    onClick={() => setcityId(city.value)}
                  >
                    {city.label}
                  </SelectItem>
                )) ?? ""}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      <Button className="mt-4 w-full bg-foreground" onClick={handleSave}>
        Aggiungi Membro
      </Button>
    </div>
  );

  if (userLoading) return null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-foreground">Nuovo Membro</Button>
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
          <Button className="bg-foreground">Nuovo Membro</Button>
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
