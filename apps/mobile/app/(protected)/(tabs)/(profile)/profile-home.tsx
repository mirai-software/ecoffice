import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import HeaderContainer from "@/app/_header";
import { Pressable, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

export default function Shop() {
  const { signOut } = useSupabase();

  const ResetOnboarding = async () => {
    await AsyncStorage.setItem("@OnboardingIsDone", "false");
    router.push("/(protected)");
  };

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
          <Text className="font-normal text-xl pl-2">Assistenza</Text>
          <FontAwesome name="angle-right" size={24} color="black" />
        </Pressable>

        <Pressable
          className="w-full flex flex-row justify-between border-b-2 p-2 border-[#CACACA]"
          onPress={() => {
            signOut();
            router.push("/(public)/sign-in");
            ResetOnboarding();
          }}
        >
          <Text className="font-normal text-xl pl-2">Esci</Text>
          <FontAwesome name="angle-right" size={24} color="black" />
        </Pressable>

        <Button
          className="w-full bg-yellow-400 mt-10"
          variant="default"
          size="default"
          onPress={() => {
            ResetOnboarding();
          }}
        >
          <Text>Reset Onboarding</Text>
        </Button>
      </View>
    </HeaderContainer>
  );
}
