import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import HeaderContainer from "@/app/_header";
import { Pressable, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { api } from "@/lib/api";

export default function Shop() {
  const { signOut } = useSupabase();
  const navigation = useNavigation();

  const ResetOnboarding = async () => {
    await AsyncStorage.setItem("@OnboardingIsDone", "false");
  };

  const { isLoading, data } = api.user.getActiveSupportRequest.useQuery();
  return (
    <HeaderContainer router={router}>
      <View className="flex-1 items-center  justify-start bg-background gap-y-2">
        <View className="w-full flex pl-3 mb-2 pt-4">
          <Text className="font-normal text-md text-gray-400">
            IMPOSTAZIONI
          </Text>
        </View>
        <Pressable
          className="w-full flex flex-row justify-between border-b-2 p-2 border-[#CACACA]"
          onPress={() => {
            router.push("/(profile)/profile");
          }}
        >
          <Text className="font-normal text-xl pl-2">Il mio Profilo</Text>
          <FontAwesome name="angle-right" size={24} color="black" />
        </Pressable>

        <Pressable
          className="w-full flex flex-row justify-between border-b-2 p-2 border-[#CACACA]"
          onPress={() => {
            router.push("/(profile)/reports");
          }}
        >
          <Text className="font-normal text-xl pl-2">
            Segnalazioni Effettuate
          </Text>
          <FontAwesome name="angle-right" size={24} color="black" />
        </Pressable>

        <Pressable
          className="w-full flex flex-row justify-between border-b-2 p-2 border-[#CACACA]"
          onPress={() => {
            router.push("/(profile)/requests");
          }}
        >
          <Text className="font-normal text-xl pl-2">Ritiri Richiesti</Text>
          <FontAwesome name="angle-right" size={24} color="black" />
        </Pressable>

        <Pressable
          className="w-full flex flex-row justify-between border-b-2 p-2 border-[#CACACA]"
          onPress={() => {
            router.push("/(profile)/assistance");
          }}
        >
          <View className="flex flex-row gap-2 justify-center items-center">
            <Text className="font-normal text-xl pl-2">Assistenza</Text>
            {!isLoading &&
              data!.length > 0 &&
              data![0].messages[data![0].messages.length - 1].userId !=
                data![0].userId && (
                <View className=" bg-red-500 rounded-full z-10 h-3 w-3"></View>
              )}
          </View>
          <FontAwesome name="angle-right" size={24} color="black" />
        </Pressable>

        <Pressable
          className="w-full flex flex-row justify-between border-b-2 p-2 border-[#CACACA]"
          onPress={() => {
            signOut();
            ResetOnboarding();
            navigation.dispatch(
              CommonActions.reset({
                routes: [{ key: "(tabs)", name: "(tabs)" }],
              })
            );
            router.navigate("/(public)/sign-in");
          }}
        >
          <Text className="font-normal text-xl pl-2">Esci</Text>
          <FontAwesome name="angle-right" size={24} color="black" />
        </Pressable>
      </View>
    </HeaderContainer>
  );
}
