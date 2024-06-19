import { router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  View,
  ScrollView,
} from "react-native";

import PagerView from "react-native-pager-view";

import { Text } from "@/components/ui/text";
import CalendarComponent from "@/components/CalendarComponent";
import HeaderContainer from "@/app/_header";
import { api } from "@/lib/api";
import { SecondHandProductComponent } from "../(shop)/shop";
import { RequestComponent } from "../(profile)/requests";

export default function TabOneScreen() {
  const { data: Calendar, isLoading: calendarLoading } =
    api.city.getCityCalendar.useQuery({});
  const { data: secondHand, isLoading: secondHandLoading } =
    api.city.getAllSecondHandProducts.useQuery({});
  const { data: requests, isLoading: requestLoadings } =
    api.user.getUserPickupRequests.useQuery();

  const { data: user, isLoading: userLoading } = api.user.getUser.useQuery({});

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const currentDay = Calendar?.find((day) => day.day === today);

  if (calendarLoading || secondHandLoading || requestLoadings || userLoading) {
    return (
      <HeaderContainer>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <ScrollView snapToStart className="">
          <View className="flex w-full gap-1">
            <View className="flex flex-row justify-between items-center w-full p-4">
              <Text className="font-semibold text-xl">
                Calendario Utenze Domestiche
              </Text>
              <Pressable
                onPress={() => router.navigate("/(calendar)/calendar")}
              >
                <Text className="font-normal text-md underline">Vedi</Text>
              </Pressable>
            </View>
            <CalendarComponent
              day={"Oggi"}
              garbages={currentDay?.wasteTypes || []}
            />
          </View>
          <View className="flex flex-row gap-4 pt-4 mb-4 mx-4">
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
          </View>
          <View className="flex flex-row justify-between items-center w-full p-4">
            <Text className="font-semibold text-2xl">Seconda Mano</Text>
            <Pressable onPress={() => router.navigate("/(shop)/shop")}>
              <Text className="font-normal text-md underline">Vedi tutto</Text>
            </Pressable>
          </View>
          {secondHand?.length === 0 ? (
            <View className="min-h-10 flex items-center justify-center">
              <Text className="text-center font-normal text-gray-600">
                Nessun prodotto attualmente caricato
              </Text>
            </View>
          ) : (
            <View className="w-full h-80">
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
            </View>
          )}
          <View className="flex flex-row justify-between items-center w-full p-4">
            <Text className="font-semibold text-2xl">Richieste Effettuate</Text>
          </View>
          <View className="mx-5">
            {requests?.length === 0 ? (
              <View className="min-h-10 flex items-center justify-center">
                <Text className="text-center font-normal text-gray-600">
                  Nessuna richiesta effettuata
                </Text>
              </View>
            ) : (
              <View className="w-full h-20">
                <PagerView style={{ flex: 1 }} initialPage={0}>
                  {requests?.map((request, index) => (
                    <View key={index} className="relative w-full">
                      <RequestComponent
                        request={{
                          ...request,
                          customRoute: "/(profile)/requests",
                        }}
                        number={request.number}
                      />
                    </View>
                  ))}
                </PagerView>
              </View>
            )}
          </View>
          <View className="flex flex-row justify-between items-center w-full p-4 pb-60">
            <Text className="font-semibold text-2xl">
              Comune di {user?.city?.name}
            </Text>
          </View>
        </ScrollView>
      </HeaderContainer>
    );
}
