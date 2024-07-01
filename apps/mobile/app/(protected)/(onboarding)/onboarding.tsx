import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { api } from "@/lib/api";
import RNPickerSelect from "react-native-picker-select";
import { useEffect, useState } from "react";
import * as z from "zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import logo from "@/assets/logo.png";
import { Path, Svg } from "react-native-svg";

export default function Onboarding() {
  const router = useRouter();
  const utils = api.useUtils();

  const { data: user, isLoading: userLoading } = api.user.getUser.useQuery({});

  const { data: citys, isLoading: citysLoading } = api.city.getAllcity.useQuery(
    {}
  );

  const [city, setCity] = useState("");
  const [name, setName] = useState(
    user?.firstName + " " + user?.lastName || ""
  );
  const [address, setAddress] = useState(user?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");

  const SetUser = api.user.setUserInformation.useMutation();

  const navigation = useNavigation();
  useEffect(() => {
    if (user) {
      if (user.city) setCity(user.city.id);
      if (user.firstName && user.lastName)
        setName(user.firstName + " " + user.lastName);
      if (user.address) setAddress(user.address);
      if (user.phone) setPhoneNumber(user.phone);
    }
  }, [user]);

  const HandleSubmit = async () => {
    // check if the user has filled all the fields and if the type is correct
    if (!name || !city || !address || !phoneNumber) {
      alert("Assicurati di aver compilato tutti i campi");
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
    const phoneNumberResult = phoneNumberSchema.safeParse(phoneNumber);

    if (!phoneNumberResult.success) {
      alert("Il numero di telefono non è valido");
      return;
    }

    // check if the address is correct using zod
    const addressSchema = z.string().min(2);
    const addressResult = addressSchema.safeParse(address);

    if (
      !addressResult.success ||
      !address.includes(citys.find((cityd) => cityd.value == city)?.label || "")
    ) {
      alert("L'indirizzo non è valido o non è appartenente al comune scelto");
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
      phoneNumber,
    }).then(async () => {
      await AsyncStorage.setItem("@OnboardingIsDone", "true").then(() => {
        utils.invalidate();
        navigation.dispatch(
          CommonActions.reset({
            routes: [{ key: "(tabs)", name: "(tabs)" }],
          })
        );
        router.push("/(protected)/(tabs)/(home)/home");
      });
    });
  };

  if (citysLoading || userLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background p-4 h-full">
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </SafeAreaView>
    );
  } else
    return (
      <SafeAreaView className="flex-1 bg-background p-4 relative">
        <View className="absolute top-0 right-0 h-fit w-max z-10">
          <Svg width="217" height="215" viewBox="0 0 217 215" fill="none">
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M186.687 -30.6726C209.433 -28.1102 216.217 2.47366 231.068 19.8913C245.339 36.6276 265.386 48.8154 272.274 69.7033C279.676 92.149 281.369 118.214 270.393 139.145C259.617 159.693 237.067 171.757 214.999 178.92C196.061 185.068 175.888 171.382 156.546 176.104C128.581 182.93 104.541 226.755 79.8833 211.901C55.2934 197.089 89.3178 153.068 76.0469 127.613C62.0732 100.81 17.0001 100.342 6.87358 71.8616C-3.55946 42.5195 -3.3349 -3.58988 24.2708 -18.0028C56.705 -34.9367 92.0594 11.1866 128.537 8.34102C152.289 6.48817 163.013 -33.3396 186.687 -30.6726Z"
              fill="#D9F9E3"
            />
          </Svg>
        </View>
        <View className="flex-1 z-20">
          <View className="flex items-center">
            <Image source={logo} className="w-fit h-fit mt-3 z-10" />
          </View>
          <H1 className="self-start mt-10 font-semibold">Ehi ciao!</H1>
          <Muted className="self-start mb-5 text-lg">
            Abbiamo bisogno di qualche informazione per migliorare la tua
            esperienza nell’applicazione.
          </Muted>

          <View className="flex flex-col gap-5">
            <View className="flex gap-2">
              <Text className="">Nome e Cognome</Text>
              <TextInput
                className="border-[1px] border-gray-500 rounded-2xl dark:text-white text-black p-4"
                value={name}
                onChange={(
                  value: NativeSyntheticEvent<TextInputChangeEventData>
                ) => setName(value.nativeEvent.text)}
              />
            </View>

            <View className="flex gap-2">
              <Text className="">Comune di Residenza</Text>
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

            <View className="flex gap-2 z-20 relative w-full">
              <Text className="">Indirizzo</Text>
              <GooglePlacesAutocomplete
                placeholder={address || "Inserisci il tuo indirizzo"}
                query={{
                  key: process.env.GOOGLE_MAPS_API_KEY as string,
                  language: "it",
                  components: "country:it",
                }}
                fetchDetails={true}
                onPress={(data, details) => {
                  // get the city from the address
                  setAddress(details!["formatted_address"]);
                }}
                autoFillOnNotFound={true}
                onFail={(error) => console.log(error)}
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

            <View className="flex gap-2">
              <Text className="">Numero di Telefono</Text>
              <View className="flex flex-row">
                <View className="border-[1px] border-gray-500 rounded-lg ">
                  <Text className="text-black dark:text-white p-4 rounded-2xl">
                    🇮🇹 +39
                  </Text>
                </View>
                <TextInput
                  className="border-[1px] border-gray-500 rounded-2xl  dark:text-white text-black p-4 flex-1 ml-5"
                  value={phoneNumber}
                  placeholder="Numero di Telefono"
                  onChange={(
                    value: NativeSyntheticEvent<TextInputChangeEventData>
                  ) => setPhoneNumber(value.nativeEvent.text)}
                />
              </View>
            </View>
          </View>
          <View className="flex-1 justify-end pb-4">
            <Button
              className="mt-5 bg-[#334493] dark:text-white text-black w-full rounded-lg p-3"
              onPress={HandleSubmit}
            >
              <Text className="font-bold">Continua</Text>
            </Button>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 h-fit w-max z-10">
          <Svg width="206" height="220" viewBox="0 0 206 220" fill="none">
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M70.3921 11.9057C93.8053 14.1391 121.103 4.68551 138.724 20.1662C156.264 35.5751 144.815 65.3669 155.058 86.2858C168.178 113.083 208.196 127.659 205.906 157.373C203.699 186.005 168.475 198.91 145.077 215.764C121.707 232.598 99.2516 254.454 70.3921 254.987C41.3406 255.523 13.1825 239.947 -6.33603 218.559C-23.9486 199.259 -25.277 171.544 -29.2563 145.793C-32.5851 124.252 -30.6845 103.59 -27.4325 82.0372C-23.4424 55.5924 -30.0106 21.7977 -8.1868 6.15195C13.6466 -9.50067 43.5925 9.34919 70.3921 11.9057Z"
              fill="#D9F9E3"
            />
          </Svg>
        </View>
      </SafeAreaView>
    );
}
