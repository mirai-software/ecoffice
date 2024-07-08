import { useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";

import { useSupabase } from "@/context/supabase-provider";
import { Button } from "@/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { api } from "@/lib/api";
import { router } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import HeaderContainer from "@/app/_header";
import AddImage from "@/assets/icons/add-image";

import { FadeIn, FadeOut } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import * as z from "zod";
import { toast } from "@backpackapp-io/react-native-toast";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { AntDesign } from "@expo/vector-icons";

export default function CreateHomeRequest() {
  // Form States
  const [images, setImages] = useState([] as ImagePicker.ImagePickerAsset[]);
  const [type, setType] = useState(null);
  const [address, setAddress] = useState("");

  // API Calls
  const { data, isLoading } = api.user.getUser.useQuery({});
  const { uploadRequestImage } = useSupabase();
  const AddRequest = api.user.addPickupRequest.useMutation();
  const utils = api.useUtils();

  /**
   * Opens the image library and allows the user to pick an image.
   * Adds the selected image to the `images` state array.
   */
  const pickImage = async () => {
    await ImagePicker.requestCameraPermissionsAsync().then(async (res) => {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
        base64: true,
      });
      if (!result.canceled) {
        setImages([...images, result.assets[0]]);
      }
    });
  };

  const HandleSubmit = async () => {
    // check if the address and type are not empty -> we can send the request without images
    if (!address || !type) {
      alert("Assicurati di aver compilato tutti i campi");
      return;
    }

    // check if the address is correct using zod
    const addressSchema = z.string().min(2);
    const addressResult = addressSchema.safeParse(address);

    if (!addressResult.success || !address.includes(data?.city?.name ?? "")) {
      alert(
        "L'indirizzo non risulta nel formato corretto o non è valido per la tua città"
      );
      return;
    }

    if (images.length === 0) {
      const data = {
        address: address,
        type: type,
        images: [],
      };
      await AddRequest.mutateAsync(data).then(() => {
        router.back();
        toast.success(
          "Ritiro a domicilio richiesto correttamente. Puoi seguirne lo stato dal tuo Profilo.",
          {
            styles: {
              view: {
                backgroundColor: "#00930F",
                borderRadius: 8,
              },
              indicator: {
                backgroundColor: "white",
              },
            },
          }
        );
      });
    } else {
      const imagesUrl: string[] = [];
      try {
        images.map(async (image) => {
          const imageId = uuidv4();
          imagesUrl.push(imageId);
          await uploadRequestImage(image.base64 as string, imageId);
        });
      } finally {
        const data = {
          address: address,
          type: type,
          images: imagesUrl,
        };
        await AddRequest.mutateAsync(data).then(() => {
          router.back();
          utils.user.getUserPickupRequests.invalidate();
          toast.success(
            "Ritiro a domicilio richiesto correttamente. Puoi seguirne lo stato dal tuo Profilo.",
            {
              styles: {
                view: {
                  backgroundColor: "#00930F",
                  borderRadius: 8,
                },
                indicator: {
                  backgroundColor: "white",
                },
              },
            }
          );
        });
      }
    }
  };
  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 bg-background p-4 relative">
          <View className="flex-1 z-1 flex gap-4">
            <View className="flex gap-2 z-20 relative">
              <Text className="">Indirizzo</Text>
              <GooglePlacesAutocomplete
                placeholder="Scrivi il tuo Indirizzo"
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string,
                  language: "it",
                  components: "country:it",
                }}
                fetchDetails={true}
                onPress={(data, details) => {
                  setAddress(details!["formatted_address"]);
                }}
                autoFillOnNotFound={true}
                onFail={(error) => {
                  toast.success(
                    "Sembra esserci un problema con la geolocalizzazione, contatta l'assistenza citando : " +
                      error,
                    {
                      styles: {
                        view: {
                          backgroundColor: "#00930F",
                          borderRadius: 8,
                        },
                        indicator: {
                          backgroundColor: "white",
                        },
                      },
                    }
                  );
                }}
                onNotFound={() => console.log("no results")}
                styles={{
                  container: {
                    flex: 1,
                    height: 44,
                    marginBottom: 40,
                    zIndex: 999,
                    position: "relative",
                  },
                  textInputContainer: {
                    flexDirection: "row",
                    zIndex: 999,
                  },
                  textInput: {
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#6B7280",
                    height: 44,
                    borderRadius: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    flex: 1,
                    zIndex: 999,
                  },
                  poweredContainer: {
                    justifyContent: "flex-end",
                    alignItems: "center",
                    borderBottomRightRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderColor: "#c8c7cc",
                    borderTopWidth: 0.5,
                    zIndex: 999,
                  },
                  powered: {},
                  listView: {
                    zIndex: 100,
                    // set absolute to prevent keyboard from covering the results
                    position: "absolute",
                    top: 50,
                    backgroundColor: "white",
                    // set border color to light grey
                    borderColor: "lightgrey",
                    // set border width to 1
                    borderWidth: 1,
                    borderRadius: 5,
                  },
                  row: {
                    padding: 13,
                    height: 44,
                    flexDirection: "row",
                    backgroundColor: "white",
                  },
                  separator: {
                    height: 0.5,
                    backgroundColor: "#c8c7cc",
                  },
                  description: {},
                  loader: {
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    height: 20,
                    zIndex: 999,
                  },
                }}
              />
            </View>

            <View className="flex flex-col gap-5">
              <View className="flex gap-2">
                <Text className="">Tipo di Rifiuti</Text>
                <RNPickerSelect
                  onValueChange={(value) => setType(value)}
                  placeholder={{ label: "Select a type", value: null }}
                  style={{
                    inputIOS: {
                      fontSize: 16,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: "rgb(107 114 128)",
                      borderRadius: 16,
                      color: "black",
                      paddingRight: 30, // to ensure the text is never behind the icon
                    },
                  }}
                  value={type}
                  items={[
                    { label: "RAEE", value: "RAEE-1" },
                    {
                      label: "Pannolini e Pannoloni",
                      value: "Pannolini-Pannoloni",
                    },
                    {
                      label: "Sfalci di Potatura",
                      value: "Sfalci-di-Potatura",
                    },
                  ]}
                />
              </View>
            </View>

            <View className="flex gap-2">
              <Text className="">Numero di Telefono</Text>
              <Text className="border-[1px] border-gray-500 rounded-2xl dark:text-white text-black p-4">
                {data?.phone}
              </Text>
            </View>

            <View className="flex gap-4">
              <Text className="">
                Carica Immagini per fornirci più dettagli
              </Text>
              <View className="flex flex-row gap-4">
                {images.length > 0
                  ? images.map((image) => (
                      <View className="relative" key={image.assetId}>
                        <Pressable
                          onPress={() => {
                            setImages(images.filter((img) => img !== image));
                          }}
                          key={image.uri}
                          className="absolute top-1 right-1 z-30  rounded-full p-1"
                        >
                          <AntDesign
                            name="close"
                            size={20}
                            color="white"
                            className="shadow-lg"
                          />
                        </Pressable>
                        <Animated.Image
                          entering={FadeIn}
                          exiting={FadeOut}
                          key={image.assetId}
                          source={{ uri: image.uri }}
                          style={{ width: 100, height: 100, borderRadius: 8 }}
                          className="h-28 w-28 rounded-lg"
                        />
                      </View>
                    ))
                  : null}
                {images.length < 3 ? (
                  <Pressable
                    onPress={pickImage}
                    className="h-28 w-28 flex justify-center items-center rounded-lg border-dashed border-2 border-gray-300"
                  >
                    <AddImage />
                  </Pressable>
                ) : null}
              </View>
            </View>

            <View className="flex-1 justify-end pb-32">
              <Button
                className="mt-5 bg-[#334493] dark:text-white text-black w-full rounded-lg p-3"
                onPress={HandleSubmit}
              >
                <Text className="font-bold text-white">Continua</Text>
              </Button>
            </View>
          </View>
        </View>
      </HeaderContainer>
    );
}
