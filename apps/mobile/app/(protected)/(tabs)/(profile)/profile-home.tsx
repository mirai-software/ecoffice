import { H1, Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import HeaderContainer from "@/app/_header";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Shop() {
  const { signOut } = useSupabase();

  const ResetOnboarding = async () => {
    await AsyncStorage.setItem("@OnboardingIsDone", "false");
    router.push("/(protected)");
  };

  return (
    <HeaderContainer router={router}>
      <View className="flex-1 items-center justify-start bg-background p-4 gap-y-4">
        <H1 className="text-center">Profile</H1>
        <Muted className="text-center">
          You are now authenticated and this session will persist even after
          closing the app.
        </Muted>

        <Button
          className="w-full bg-red-400"
          variant="default"
          size="default"
          onPress={() => {
            router.push("/(profile)/profile");
          }}
        >
          <Text>Il mio Profilo</Text>
        </Button>

        <Button
          className="w-full bg-green-400"
          variant="default"
          size="default"
          onPress={() => {
            router.push("/(profile)/reports");
          }}
        >
          <Text>Segnalazioni Effettuate</Text>
        </Button>

        <Button
          className="w-full bg-sky-400"
          variant="default"
          size="default"
          onPress={() => {
            router.push("/(profile)/requests");
          }}
        >
          <Text>Ritiri richiesti</Text>
        </Button>

        <Button
          className="w-full bg-purple-400"
          variant="default"
          size="default"
          onPress={() => {
            router.push("/(profile)/assistance");
          }}
        >
          <Text>Assistenza</Text>
        </Button>

        <Button
          className="w-full bg-yellow-400"
          variant="default"
          size="default"
          onPress={() => {
            ResetOnboarding();
          }}
        >
          <Text>Reset Onboarding</Text>
        </Button>

        <Button
          className="w-full bg-blue-500"
          variant="default"
          size="default"
          onPress={() => {
            signOut();
            router.push("/(public)/sign-in");
          }}
        >
          <Text>Esci</Text>
        </Button>
      </View>
    </HeaderContainer>
  );
}
