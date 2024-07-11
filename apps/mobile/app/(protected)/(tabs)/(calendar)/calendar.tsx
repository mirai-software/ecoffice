import { Muted } from "@/components/ui/typography";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import HeaderContainer from "@/app/_header";
import { api } from "@/lib/api";
import CalendarComponent from "@/components/CalendarComponent";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

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

export enum CategoryType {
  Commercial = "Commercial",
  Citizen = "Citizen",
}

export default function Shop() {
  const { data: Calendar, isLoading } = api.city.getCityCalendar.useQuery({});
  const [category, setCategory] = useState(CategoryType.Citizen);
  const navigation = useNavigation();
  const utils = api.useUtils();

  useEffect(() => {
    const getCategory = async () => {
      const category = await AsyncStorage.getItem("category");
      if (category) {
        setCategory(category as CategoryType);
      }
    };
    getCategory();
  }, []);

  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else if (Calendar?.length === 0) {
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-center  justify-center bg-background p-4 gap-y-4">
          <Muted className="text-center">
            Nessun Calendario attualmente caricato.{" "}
          </Muted>
        </View>
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <ScrollView>
          <View className="w-[90%] flex flex-row justify-between items-center border-2 rounded-3xl border-gray-300 mt-4 mx-5">
            <Pressable
              onPress={async () => {
                await AsyncStorage.setItem("category", CategoryType.Citizen);
                setCategory(CategoryType.Citizen);
                utils.city.getCityCalendar.invalidate();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "home" as never }], // your stack screen name
                });
              }}
              className="w-[50%]"
            >
              <View
                className={
                  category === CategoryType.Citizen
                    ? "bg-[#334493] flex-1 w-full rounded-3xl p-4"
                    : "text-secondary  w-full rounded-3xl p-4"
                }
              >
                <Text
                  className={
                    category === CategoryType.Citizen
                      ? "text-white text-md text-center"
                      : "text-black text-md text-center"
                  }
                >
                  Cittadino
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={async () => {
                await AsyncStorage.setItem("category", CategoryType.Commercial);
                setCategory(CategoryType.Commercial);
                utils.city.getCityCalendar.invalidate();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "home" as never }], // your stack screen name
                });
              }}
              className="w-[50%]"
            >
              <View
                className={
                  category === CategoryType.Commercial
                    ? "bg-[#334493] flex-1 w-full rounded-3xl p-4"
                    : "text-secondary w-full rounded-3xl p-4"
                }
              >
                <Text
                  className={
                    category === CategoryType.Commercial
                      ? "text-white text-md text-center"
                      : "text-black text-md text-center"
                  }
                >
                  {" "}
                  Commerciale
                </Text>
              </View>
            </Pressable>
          </View>
          <View className="flex-1 items-start justify-start bg-background gap-y-4 pt-4 pb-40">
            <Text className="w-full text-center text-gray-500 font-normal">
              Orario di ritiro 18:00 - 24:00
            </Text>
            {Calendar?.map((day) => (
              <CalendarComponent
                key={day.id}
                day={getDayItalian(day.day)}
                garbages={day.wasteTypes}
                category={category}
              />
            ))}
          </View>
        </ScrollView>
      </HeaderContainer>
    );
}
