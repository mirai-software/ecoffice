import { H1, Muted } from "@/components/ui/typography";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/safe-area-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function CreateReport() {
  const router = useRouter();

  return (
    <View className="flex-1 flex">
      <SafeAreaView className="bg-primary h-36 flex">
        {router.canGoBack() ? (
          <View className="flex-row items-center justify-between w-full min-h-20 ">
            <Button onPress={() => router.back()} className="absolute left-0">
              <FontAwesome name="arrow-left" size={18} color="black" />
            </Button>
            <View className="mx-auto">
              <Text className="text-black text-xl ">Segnalazione</Text>
            </View>
          </View>
        ) : (
          <View className="min-h-20 items-center justify-center">
            <Text className="text-black text-xl ">Segnalazione</Text>
          </View>
        )}
      </SafeAreaView>

      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Create Report</H1>
        <Muted className="text-center">
          You are now authenticated and this session will persist even after
          closing the app.
        </Muted>

        {router.canGoBack() && (
          <Button onPress={() => router.back()}>
            <Text>Go Back</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
