import { View } from "react-native";
import { Text } from "./ui/text";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

type wasteTypes = {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
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
    <View className="flex flex-row">
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
            <View className="flex-1 flex flex-row justify-between items-center pl-2 pr-5">
              <Text className="font-semibold text-xl text-white ">
                {garbage.name}
              </Text>
              <FontAwesome
                name="info"
                size={24}
                color="white"
                onPress={() => router.push(`/${garbage.id}`)}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
