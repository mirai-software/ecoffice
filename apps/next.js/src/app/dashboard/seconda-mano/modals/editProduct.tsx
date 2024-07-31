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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useMediaQuery } from "@uidotdev/usehooks";

import { api } from "@/trpc/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import { ChangeEvent, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function EditProductModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const supabase = createClientComponentClient();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data, isLoading } = api.city.getSecondHandProduct.useQuery({
    id: id,
  });

  const utils = api.useUtils();
  const { toast } = useToast();

  const SetSecondHandProduct = api.admin.setSecondHandProduct.useMutation();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [images, setImages] = useState([]);
  const [imagesUrl, setImagesUrl] = useState<string[]>();

  useEffect(() => {
    const fetchImages = async () => {
      if (!data) {
        return;
      }
      const urls = await Promise.all(
        data?.images.map((image) => {
          return getProductImageUrl(image, id);
        }),
      );
      setImagesUrl(urls);
    };
    if (!done && data && !isLoading) {
      setName(data.name);
      setPrice(data.price);
      setDescription(data.description);
      setStatus(data.status);
      setImages(data.images as never[]);
      fetchImages();
      setDone(true);
    }
  }, [isLoading, data]);

  const handleSave = () => {
    SetSecondHandProduct.mutate({
      id: id,
      name: name,
      price: price,
      description: description,
      status: status,
      images: images,
    });

    setTimeout(() => {
      utils.invalidate();
      setOpen(false);
      setDone(false);
      toast({
        title: "Prodotto aggiornato",
        description: "Il prodotto è stato aggiornato con successo",
      });
    }, 1500);
  };

  const getProductImageUrl = async (fileUUID: string, cityUUID: string) => {
    const { data } = await supabase.storage
      .from("shop")
      .getPublicUrl(cityUUID + "/" + fileUUID);

    if (!data) {
      return "";
    }
    return data.publicUrl;
  };

  const isChanged = () => {
    return (
      name !== data?.name ||
      price !== data?.price ||
      description !== data?.description ||
      status !== data?.status ||
      images !== data?.images
    );
  };

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const prepareBase64DataUrl = (base64: string) =>
    base64
      .replace("data:image/jpeg;", "data:image/jpeg;charset=utf-8;")
      .replace(/^.+,/, "");

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event!.target!.files![0];
    let base64 = await toBase64(file as File);
    // compress image
    const image = document.createElement("img");
    image.src = base64 as string;
    image.onload = async () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Mantieni le proporzioni dell'immagine
      const scaleFactor = 0.5;
      canvas.width = image.width * scaleFactor;
      canvas.height = image.height * scaleFactor;

      context?.drawImage(image, 0, 0, canvas.width, canvas.height);
      base64 = canvas.toDataURL("image/png") as string;
      const uuid = uuidv4();

      const { error } = await supabase.storage
        .from("shop")
        .upload(
          id + "/" + uuid,
          Buffer.from(prepareBase64DataUrl(base64 as string), "base64"),
          {
            contentType: "image/png",
            cacheControl: "3600",
            upsert: true,
          },
        );
      // Handle error if upload failed
      if (error) {
        alert("Error uploading file.");
        return;
      }
      // @ts-expect-error ts-migrate(2532) FIXME: never type
      setImages([...images, uuid]);
      // @ts-expect-error ts-migrate(2532) FIXME: never type
      setImagesUrl([...imagesUrl, await getProductImageUrl(uuid, id)]);
    };
  };

  const renderContent = () => (
    <div className="overflow-y-auto p-4">
      <section className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-400">
            Nome Articolo
          </label>
          <input
            type="text"
            className="sm:text-sm mt-1 block w-full rounded-xl border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-foreground"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-400">
            Prezzo
          </label>
          <input
            type="number"
            className="sm:text-sm mt-1 block w-full rounded-xl border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-foreground"
            defaultValue={price || ""}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-400">
            Status
          </label>
          <Select
            defaultValue={status as string}
            onValueChange={(event) => setStatus(event)}
          >
            <SelectTrigger className="w-full rounded-xl border-2 border-gray-200 bg-white">
              <SelectValue placeholder="Definisci lo stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Stato</SelectLabel>
                <SelectItem value="Online">Disponibile</SelectItem>
                <SelectItem value="Venduto">Venduto</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-400">
            Descrizione
          </label>
          <textarea
            className="sm:text-sm mt-1 block w-full rounded-xl border-2 border-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-foreground"
            rows={4}
            defaultValue={description || ""}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-400">
            Carica immagini del prodotto
          </label>
          <div className="mt-1 flex space-x-2">
            {images?.map((image: string, index: number) => (
              <div key={index} className="relative">
                <Image
                  src={imagesUrl?.[index] || ""}
                  alt={`Product Image ${index + 1}`}
                  width={100}
                  height={100}
                  className="h-24 w-24 rounded-md"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 -mr-1 -mt-2 rounded-full bg-gray-500 p-1 text-white"
                  onClick={() => {
                    setImages(images.filter((_, i) => i !== index));
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
            <div className="flex h-24 w-24 items-center justify-center rounded-md border-2 border-dashed border-gray-300">
              <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-gray-300">
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg
                    className="h-6 w-6 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={uploadFile}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <button
            type="button"
            className="mt-4 inline-flex w-full justify-center rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-500"
            disabled={!isChanged()}
            onClick={handleSave}
          >
            Salva modifiche
          </button>
        </div>
      </section>
    </div>
  );

  if (isLoading || !data || !done) {
    return null;
  } else if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild disabled={!isLoading}>
          <p className="cursor-pointer text-sm text-foreground underline disabled:text-gray-400">
            Modifica
          </p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-y-auto rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle>
              {"Modifica " + id.slice(0, 4).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild disabled={!isLoading}>
          <p className="cursor-pointer text-sm text-foreground underline disabled:text-gray-400">
            Modifica
          </p>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90%] rounded-lg bg-white">
          <DrawerHeader className="text-left">
            <DrawerTitle>
              {"Modifica " + id.slice(0, 4).toUpperCase()}
            </DrawerTitle>
          </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }
}
