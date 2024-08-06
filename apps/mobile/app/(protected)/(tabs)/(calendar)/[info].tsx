import HeaderContainer from "@/app/_header";
import { router, useLocalSearchParams } from "expo-router";
import { api, getBaseUrl } from "@/lib/api";
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
            className="flex-row items-center justify-center flex-1 gap-3 min-h-16"
            style={{
              backgroundColor: wasteType.color,
            }}
          >
            {wasteType.icon && wasteType.icon != "default" ? (
              <SvgUri
                width="24"
                height="24"
                uri={getBaseUrl() + `/icon/${wasteType.icon}`}
                fill="white"
              />
            ) : (
              <FontAwesome name="recycle" size={24} color="white" />
            )}
            <Text className="text-2xl font-semibold text-white">
              {wasteType.name}
            </Text>
          </View>
          <View className="p-4">
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <AntDesign name="checkcircleo" size={24} color="green" />
                <Text className="ml-2 text-xl font-semibold">
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
                <Text className="ml-2 text-xl font-semibold">
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
                <Text className="ml-2 text-xl font-semibold">
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
