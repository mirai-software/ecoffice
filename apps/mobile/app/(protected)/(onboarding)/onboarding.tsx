import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  return (
    <View className="flex-1 flex">
      <SafeAreaView className="bg-primary h-36 flex">
        <View className="min-h-20 items-center justify-center">
          <Text className="text-black text-xl ">Onboarding</Text>
        </View>
      </SafeAreaView>

      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Shop</H1>
        <Muted className="text-center">
          You are now authenticated and this session will persist even after
          closing the app.
        </Muted>
      </View>
    </View>
  );
}
