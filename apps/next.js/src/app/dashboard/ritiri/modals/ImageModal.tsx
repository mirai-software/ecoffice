"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import Image from "next/image";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function ImageModal({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const RedirectToImage = async (fileUUIDs: string[]) => {
    const supabase = createClientComponentClient();
    // get supabase user id

    await supabase.auth.getUser().then(async ({ data: userData }) => {
      const { data } = await supabase.storage
        .from("requests")
        .getPublicUrl(userData.user?.id + "/" + fileUUIDs[0]);

      if (!data) {
        return "";
      }

      const url =
        data.publicUrl.split("/").slice(0, -1).join("/") + "/" + fileUUIDs[0];
      window.open(url);
    });
  };

  const GetImageUrl = async (fileUUIDs: string) => {
    const supabase = createClientComponentClient();
    // get supabase user id

    const url = await supabase.auth
      .getUser()
      .then(async ({ data: userData }) => {
        const { data } = await supabase.storage
          .from("requests")
          .getPublicUrl(userData.user?.id + "/" + fileUUIDs);

        if (!data) {
          return "";
        }

        const url =
          data.publicUrl.split("/").slice(0, -1).join("/") + "/" + fileUUIDs;
        return url;
      });

    return url;
  };

  const renderContent = () => (
    <div className=" p-4">
      <section className="grid grid-cols-2 gap-4">
        {images.map(async (image, index) => (
          <div key={index} className="relative">
            <Image
              src={await GetImageUrl(image)}
              alt="image"
              width={400}
              height={400}
              objectFit="cover"
              onClick={() => RedirectToImage([image])}
            />
          </div>
        ))}
      </section>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild disabled={images.length === 0}>
          <p className="cursor-pointer text-sm text-foreground underline disabled:text-gray-400">
            Visualizza
          </p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80%] rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle>Immagini</DialogTitle>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild disabled={images.length === 0}>
          <p className="cursor-pointer text-sm text-foreground underline disabled:text-gray-400">
            Visualizza
          </p>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80%] rounded-lg bg-white">
          <DrawerHeader className="text-left">
            <DrawerTitle>Immagini</DrawerTitle>
          </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }
}
