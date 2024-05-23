import { useRouter } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { SafeAreaView } from "@/components/safe-area-view";

export default function TabOneScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 flex">
      <SafeAreaView className="bg-primary h-36 flex">
        <View className="min-h-20 items-center justify-center">
          <Text className="text-black text-xl ">EcoOffice</Text>
        </View>
      </SafeAreaView>

      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Home</H1>
        <Muted className="text-center">
          You are now authenticated and this session will persist even after
          closing the app.
        </Muted>

        <Button
          className="w-full bg-red-400"
          variant="default"
          size="default"
          onPress={() => {
            router.push("/create-report");
          }}
        >
          <Text>Effettua una Segnalazione</Text>
        </Button>

        <Button
          className="w-full bg-green-400"
          variant="default"
          size="default"
          onPress={() => {
            router.push("/create-request");
          }}
        >
          <Text>Richiedi ritiro a Domicilio</Text>
        </Button>
      </View>
    </View>
  );
}
