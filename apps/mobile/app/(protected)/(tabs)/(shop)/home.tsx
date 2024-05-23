import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";

export default function Shop() {
  const { navigate } = useRouter();
  return (
    <View className="flex-1 flex">
      <SafeAreaView className="bg-primary h-36 flex">
        <View className="min-h-20 items-center justify-center">
          <Text className="text-black text-xl ">Seconda Mano</Text>
        </View>
      </SafeAreaView>

      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Shop</H1>
        <Muted className="text-center">
          You are now authenticated and this session will persist even after
          closing the app.
        </Muted>
        <Button onPress={() => navigate("(shop)/453536321312")}>
          <Text>Go product page</Text>
        </Button>
      </View>
    </View>
  );
}
