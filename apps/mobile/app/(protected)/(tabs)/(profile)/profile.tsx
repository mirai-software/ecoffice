import HeaderContainer from "@/app/_header";

import { router } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";

import { Text } from "@/components/ui/text";

const EditButton = () => {
  return (
    <Pressable onPress={() => router.push("/(profile)/profile-edit")}>
      <Feather name="edit" size={24} color="black" />
    </Pressable>
  );
};

export default function Page() {
  const { data: user, isLoading } = api.user.getUser.useQuery({});

  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router} rightComponent={EditButton()}>
        <ScrollView>
          <View className="flex-1 items-start justify-start bg-background p-4 gap-y-4">
            <View className="flex gap-2 w-full">
              <Text className="">Nome e Cognome</Text>
              <View className="flex flex-row">
                <Text className="border-[1px] border-gray-500 rounded-2xl   text-black p-4 flex-1 ">
                  {user?.firstName} {user?.lastName}
                </Text>
              </View>
            </View>

            <View className="flex gap-2 w-full">
              <Text className="">Email</Text>
              <View className="flex flex-row">
                <Text className="border-[1px] border-gray-500 rounded-2xl   text-black p-4 flex-1 ">
                  {user?.email}
                </Text>
              </View>
            </View>

            <View className="flex gap-2 w-full">
              <Text className="">Password</Text>
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
                <Text className="border-[1px] border-gray-500 rounded-2xl   text-black p-4 flex-1 ml-5">
                  {user?.phone}
                </Text>
              </View>
            </View>

            <View className="flex gap-2 w-full">
              <Text className="">Comune di Residenza</Text>
              <View className="flex flex-row">
                <Text className="border-[1px] border-gray-500 rounded-2xl   text-black p-4 flex-1 ">
                  {user?.city?.name}
                </Text>
              </View>
            </View>

            <View className="flex gap-2 w-full">
              <Text className="">Indirizzo di Residenza</Text>
              <View className="flex flex-row">
                <Text className="border-[1px] border-gray-500 rounded-2xl   text-black p-4 flex-1 ">
                  {user?.address}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </HeaderContainer>
    );
}
