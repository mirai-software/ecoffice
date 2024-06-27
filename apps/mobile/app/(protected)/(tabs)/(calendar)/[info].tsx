import HeaderContainer from "@/app/_header";
import { H1, Muted } from "@/components/ui/typography";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { ActivityIndicator, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "@/components/safe-area-view";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";

export default function Page() {
  const { info } = useLocalSearchParams();

  if (typeof info !== "string") {
    throw new Error("Invalid info");
  }

  const { data: wasteType, isLoading } = api.city.getWasteType.useQuery({
    id: info,
  });

  if (isLoading || !wasteType) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  } else {
    return (
      <HeaderContainer router={router}>
        <ScrollView className="flex-1 bg-background">
          <View
            className="flex-1 flex-row min-h-16 items-center justify-center gap-3"
            style={{
              backgroundColor: wasteType.color,
            }}
          >
            {wasteType.icon && wasteType.icon != "default" ? (
              <SvgUri
                width="24"
                height="24"
                uri={"http://localhost:3000/icon/" + wasteType.icon}
                fill="white"
              />
            ) : (
              <FontAwesome name="recycle" size={24} color="white" />
            )}
            <Text className="text-2xl text-white font-semibold">
              {wasteType.name}
            </Text>
          </View>
          <View className="p-4">
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <AntDesign name="checkcircleo" size={24} color="green" />
                <Text className="text-xl font-semibold ml-2">
                  Cosa conferire
                </Text>
              </View>
              <Text className="font-normal">
                {wasteType?.info[0] || "Non ci sono informazioni"}
              </Text>
            </View>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <AntDesign name="closecircleo" size={24} color="red" />
                <Text className="text-xl font-semibold ml-2">
                  Cosa non conferire
                </Text>
              </View>
              <Text className="font-normal">
                {wasteType?.info[1] || "Non ci sono informazioni"}
              </Text>
            </View>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <AntDesign name="infocirlceo" size={24} color="black" />
                <Text className="text-xl font-semibold ml-2">
                  Come conferire
                </Text>
              </View>
              <Text className="font-normal">
                {wasteType?.info[2] || "Non ci sono informazioni"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </HeaderContainer>
    );
  }
}
