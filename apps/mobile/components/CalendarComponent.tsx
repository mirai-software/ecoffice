import { Pressable, View } from "react-native";
import { Text } from "./ui/text";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import InfoCircle from "@/assets/icons/info-circle";

import { FadeIn, FadeOut } from "react-native-reanimated";
import Animated from "react-native-reanimated";

type wasteTypes = {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  icon?: string;
  info: string[];
  updatedAt: Date;
};

export default function CalendarComponent({
  day,
  garbages,
}: {
  day: string;
  garbages: wasteTypes[];
}) {
  return (
    <Animated.View
      className="flex flex-row"
      entering={FadeIn}
      exiting={FadeOut}
    >
      <View className="flex-1 justify-center items-center">
        <Text>{day}</Text>
      </View>
      <View className="flex-[3] min-h-12">
        {garbages.map((garbage) => (
          <View
            key={garbage.id}
            className={`min-h-12 justify-center pl-2`}
            style={{
              backgroundColor: garbage.color,
            }}
          >
            <View className="flex-1 flex flex-row justify-between items-center pl-1 pr-5">
              <View className="flex flex-row gap-2">
                {garbage.icon && garbage.icon != "default" ? (
                  <SvgUri
                    width="24"
                    height="24"
                    uri={"http://localhost:3000/icon/" + garbage.icon}
                    fill="white"
                  />
                ) : (
                  <FontAwesome name="recycle" size={24} color="white" />
                )}
                <Text className="font-semibold text-xl text-white ">
                  {garbage.name}
                </Text>
              </View>
              <Pressable onPress={() => router.push("/" + garbage.id)}>
                <InfoCircle />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
