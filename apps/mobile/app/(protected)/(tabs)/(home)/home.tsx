import { router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  View,
  ScrollView,
} from "react-native";

import { FadeIn, FadeOut } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import PagerView from "react-native-pager-view";

import { Text } from "@/components/ui/text";
import CalendarComponent from "@/components/CalendarComponent";
import HeaderContainer from "@/app/_header";
import { api } from "@/lib/api";
import { SecondHandProductComponent } from "../(shop)/shop";
import { RequestComponent } from "../(profile)/requests";
import StatisticsComponent from "@/components/StatisticsComponent";
import { CategoryType } from "../(calendar)/calendar";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabOneScreen() {
  const { data: Calendar, isLoading: calendarLoading } =
    api.city.getCityCalendar.useQuery({});
  const { data: secondHand, isLoading: secondHandLoading } =
    api.city.getAllSecondHandProducts.useQuery({});
  const { data: requests, isLoading: requestLoadings } =
    api.user.getUserPickupRequests.useQuery();

  const { data: statistics, isLoading: statisticsLoading } =
    api.city.getCityStatistics.useQuery();

  const { data: user, isLoading: userLoading } = api.user.getUser.useQuery({});

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const currentDay = useState(Calendar?.find((day) => day.day === today));

  const [category, setCategory] = useState<CategoryType>(CategoryType.Citizen);

  useEffect(() => {
    const getCategory = async () => {
      const category = await AsyncStorage.getItem("category");
      if (category) {
        setCategory(category as CategoryType);
      }
    };
    getCategory();
  }, []);

  if (
    calendarLoading ||
    secondHandLoading ||
    requestLoadings ||
    userLoading ||
    statisticsLoading
  ) {
    return (
      <HeaderContainer>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <ScrollView snapToStart className="">
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="flex w-full gap-1"
          >
            <View className="flex flex-row justify-between items-center w-full p-4">
              <Text className="font-semibold text-xl">
                Calendario Utenze{" "}
                {category === CategoryType.Citizen
                  ? "Cittadino"
                  : "Commerciale"}
              </Text>
              <Pressable
                onPress={() => router.navigate("/(calendar)/calendar")}
              >
                <Text className="font-normal text-md underline">Vedi</Text>
              </Pressable>
            </View>
            <CalendarComponent
              day={"Oggi"}
              garbages={currentDay[0]?.wasteTypes || []}
              category={category}
            />
          </Animated.View>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="flex flex-row gap-4 pt-4 mb-4 mx-4"
          >
            <Pressable
              onPress={() => {
                router.push("/create-report");
              }}
              className="flex-1 flex gap-2 shadow-sm bg-white rounded-2xl items-center p-2 "
            >
              <Text className="text-center font-bold text-xl text-[#BE0B00]">
                Effettua una Segnalazione
              </Text>
              <Image
                source={require("../../../../assets/HomeReportImage.png")}
                style={{ width: 120, height: 120 }}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/create-request");
              }}
              className="flex-1 flex gap-2 shadow-sm bg-white rounded-2xl items-center p-2"
            >
              <Text className="text-center font-bold text-xl text-[#00930F]">
                Richiedi un ritiro a domicilio
              </Text>
              <Image
                source={require("../../../../assets/HomeRequestImage.png")}
                style={{ width: 120, height: 120 }}
              />
            </Pressable>
          </Animated.View>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="flex flex-row justify-between items-center w-full p-4"
          >
            <Text className="font-semibold text-2xl">Seconda Mano</Text>
            <Pressable onPress={() => router.navigate("/(shop)/shop")}>
              <Text className="font-normal text-md underline">Vedi tutto</Text>
            </Pressable>
          </Animated.View>
          {secondHand?.length === 0 ? (
            <View className="min-h-10 flex items-center justify-center">
              <Text className="text-center font-normal text-gray-600">
                Nessun prodotto attualmente caricato
              </Text>
            </View>
          ) : (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="w-full h-80"
            >
              <PagerView style={{ flex: 1 }} initialPage={0}>
                {secondHand?.map((product, index) => (
                  <View key={index} className="relative w-full">
                    <SecondHandProductComponent
                      key={product.id}
                      name={product.name}
                      description={product.description}
                      cityid={product.cityId}
                      price={product.price}
                      date={product.createdAt}
                      id={product.id}
                      images={product.images}
                      customRoute={"(shop)/shop?slug=" + product.id}
                    />
                  </View>
                ))}
              </PagerView>
            </Animated.View>
          )}
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="flex flex-row justify-between items-center w-full p-4"
          >
            <Text className="font-semibold text-2xl">Richieste Effettuate</Text>
          </Animated.View>
          <Animated.View entering={FadeIn} exiting={FadeOut} className="mx-5">
            {requests?.length === 0 ? (
              <View className="min-h-10 flex items-center justify-center">
                <Text className="text-center font-normal text-gray-600">
                  Nessuna richiesta effettuata
                </Text>
              </View>
            ) : (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="w-full h-20"
              >
                <PagerView style={{ flex: 1 }} initialPage={0}>
                  {requests?.map((request, index) => (
                    <View key={index} className="relative w-full">
                      <RequestComponent
                        request={{
                          ...request,
                          customRoute: "/(profile)/requests",
                        }}
                        number={index}
                      />
                    </View>
                  ))}
                </PagerView>
              </Animated.View>
            )}
          </Animated.View>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="flex flex-col justify-between items-start w-full p-4 pb-60 pt-10"
          >
            <View className="flex flex-row justify-between w-full items-center">
              <Text className="font-semibold text-2xl">
                Comune di {user?.city?.name}
              </Text>

              <Pressable onPress={() => router.push("/(home)/orari")}>
                <Text className="font-normal text-md underline text-[#334493]">
                  Vedi orari
                </Text>
              </Pressable>
            </View>
            <StatisticsComponent statistics={statistics} />
          </Animated.View>
        </ScrollView>
      </HeaderContainer>
    );
}
