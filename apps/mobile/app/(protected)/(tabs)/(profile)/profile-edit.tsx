import HeaderContainer from "@/app/_header";

import { router } from "expo-router";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { api } from "@/lib/api";
import RNPickerSelect from "react-native-picker-select";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { TextInputChangeEventData } from "react-native";
import { useSupabase } from "@/context/supabase-provider";

import * as z from "zod";
import { toast } from "@backpackapp-io/react-native-toast";
export default function Profile_Edit() {
  const SetUser = api.user.setUserInformation.useMutation();
  const { data: user, isLoading } = api.user.getUser.useQuery({});
  const { data: citys, isLoading: citysLoading } = api.city.getAllcity.useQuery(
    {}
  );

  const { PasswordReset } = useSupabase();

  const [name, setName] = useState(user?.firstName + " " + user?.lastName);
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [city, setCity] = useState(user?.city?.id);

  const utils = api.useUtils();

  const SaveButton = () => {
    if (hadMadeChanges()) {
      return (
        <Pressable onPress={HandleSubmit}>
          <Text className="text-[#334493] underline font-medium pr-2">
            Salva
          </Text>
        </Pressable>
      );
    } else {
      return (
        <Text className="text-[#949B9E] underline font-medium pr-2">Salva</Text>
      );
    }
  };

  const hadMadeChanges = () => {
    if (
      name != user?.firstName + " " + user?.lastName ||
      phone != user?.phone ||
      address != user?.address ||
      city != user?.city?.id
    ) {
      return true;
    }
    return false;
  };

  const HandleSubmit = async () => {
    // check if the user has filled all the fields and if the type is correct
    if (!name || !city || !address || !phone) {
      alert("Assicurati di aver compilato tutti i campi");
      return;
    }

    if (!citys) {
      alert("Sembra esserci un problema con la geolocalizzazione");
      return;
    }

    // check if the name is correct using zod (it should contain a space in the middle to separate the first name and the last name) can contain "'"

    const nameSchema = z.string().regex(/^[a-zA-Z]+ [a-zA-Z]+$/);
    const nameResult = nameSchema.safeParse(name as string);

    if (!nameResult.success) {
      alert(
        "Assicurati di aver inserito il nome e il cognome correttamente (es. Mario Rossi)"
      );
      return;
    }

    // check if the phone number is correct using zod
    const phoneNumberSchema = z
      .string()
      .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
    const phoneNumberResult = phoneNumberSchema.safeParse(phone);

    if (!phoneNumberResult.success) {
      alert("Il numero di telefono non è valido");
      return;
    }

    // check if the address is correct using zod
    const addressSchema = z.string().min(2);
    const addressResult = addressSchema.safeParse(address);

    if (!addressResult.success) {
      alert("L'indirizzo non è valido o non è incluso nel comune selezionato");
      return;
    }

    // check if the city is correct using zod (it should contain in citys array)
    const citySchema = z
      .string()
      .refine((city) => citys.map((city) => city.value).includes(city));
    const cityResult = citySchema.safeParse(city);

    if (!cityResult.success) {
      alert("Il comune non è valido");
      return;
    }

    await SetUser.mutateAsync({
      firstName: name.split(" ")[0],
      lastname: name.split(" ")[1],
      city,
      address,
      phoneNumber: phone,
    }).then(async () => {
      utils.invalidate();
      router.back();
      toast.success("Le modifiche sono state salvate correttamente.", {
        styles: {
          view: {
            backgroundColor: "#00930F",
            borderRadius: 8,
          },
          indicator: {
            backgroundColor: "white",
          },
        },
      });
    });
  };

  if (isLoading || citysLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router} rightComponent={SaveButton()}>
        <ScrollView>
          <View className="flex-1 items-start justify-start bg-background p-4 gap-y-4">
            <View className="flex gap-2 w-full">
              <Text className="">Nome e Cognome</Text>
              <TextInput
                className="border-[1px] border-gray-500 rounded-2xl   text-black p-4"
                value={name}
                onChange={(
                  value: NativeSyntheticEvent<TextInputChangeEventData>
                ) => setName(value.nativeEvent.text)}
              />
            </View>

            <View className="flex gap-2 w-full">
              <Text className="">Email</Text>
              <View className="flex flex-row border-gray-500 border-[1px] rounded-2xl bg-gray-600/20">
                <Text className="   text-gray-600 p-4 flex-1">
                  {user?.email}
                </Text>
              </View>
            </View>

            <View className="flex gap-2 w-full">
              <View className="flex flex-row justify-between">
                <Text className="">Password</Text>
                <Pressable
                  onPress={async () => {
                    await PasswordReset(user?.email as string);
                    toast.success(
                      "Abbiamo inviato una mail per il reset della password",
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
                >
                  <Text className="text-[#334493] underline font-medium pr-2">
                    Cambia Password
                  </Text>
                </Pressable>
              </View>
              <View className="flex flex-row">
                <Text className="border-[1px] border-gray-500 rounded-2xl   text-black p-4 flex-1 font-bold text-xl">
                  {"•••••••••"}
                </Text>
              </View>
            </View>

            <View className="flex gap-2 w-full">
              <Text className="">Numero di Telefono</Text>
              <View className="flex flex-row">
                <View className="border-[1px] border-gray-500 rounded-2xl ">
                  <Text className="text-black   p-4 rounded-2xl">🇮🇹 +39</Text>
                </View>
                <TextInput
                  className="border-[1px] border-gray-500 rounded-2xl    text-black p-4 flex-1 ml-5"
                  value={phone}
                  placeholder="Numero di Telefono"
                  onChange={(
                    value: NativeSyntheticEvent<TextInputChangeEventData>
                  ) => setPhone(value.nativeEvent.text)}
                />
              </View>
            </View>

            <View className="flex gap-2 w-full">
              <Text className="">Comune di Residenza</Text>
              <View className="flex ">
                <RNPickerSelect
                  onValueChange={(value) => setCity(value)}
                  placeholder={{ label: "Select a city", value: null }}
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
                  value={city}
                  items={citys as []}
                />
              </View>
            </View>
            <View className="flex gap-2 w-full">
              <Text className="">Indirizzo</Text>
              <TextInput
                className="border-[1px] border-gray-500 rounded-2xl w-full  text-black p-4"
                value={address}
                placeholder="Inserisci l'indirizzo"
                onChange={(
                  value: NativeSyntheticEvent<TextInputChangeEventData>
                ) => setAddress(value.nativeEvent.text)}
              />
            </View>
          </View>
        </ScrollView>
      </HeaderContainer>
    );
}
