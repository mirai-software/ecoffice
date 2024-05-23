import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";

import { SafeAreaView, View } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 flex">
      <SafeAreaView className="bg-primary h-36 flex">
        {router.canGoBack() ? (
          <View className="flex-row items-center justify-between w-full min-h-20 ">
            <Button onPress={() => router.back()} className="absolute left-0">
              <FontAwesome name="arrow-left" size={18} color="black" />
            </Button>
            <View className="mx-auto">
              <Text className="text-black text-xl ">
                Segnalazioni Effettuate
              </Text>
            </View>
          </View>
        ) : (
          <View className="min-h-20 items-center justify-center">
            <Text className="text-black text-xl ">Segnalazioni Effettuate</Text>
          </View>
        )}
      </SafeAreaView>

      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Segnalazioni Effettuate</H1>
      </View>
    </View>
  );
}
