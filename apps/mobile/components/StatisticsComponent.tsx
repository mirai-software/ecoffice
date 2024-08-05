import { Pressable, View } from "react-native";
import { Text } from "./ui/text";
import { useState } from "react";

enum StatisticType {
  ProductionIndicator = "ProductionIndicator",
  SpecificIndicator = "SpecificIndicator",
}

import { FadeIn, FadeOut } from "react-native-reanimated";
import Animated from "react-native-reanimated";
export default function StatisticsComponent({
  statistics,
}: {
  statistics: {
    id: string;
    name: string;
    data: string;
    type: string;
    cityId: string;
    createdAt: Date;
    updatedAt: Date;
  }[] | undefined;
}) {
  const [selected, setSelected] = useState<StatisticType>(
    StatisticType.ProductionIndicator
  );

  if (!statistics || statistics.length === 0) {
    return (
      <View className="items-center justify-center flex-1 w-full mt-3">
        <Text className="font-normal text-center text-gray-600">
          Nessuna Statistica Presente
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 w-full mt-3">
      <View className="flex flex-row items-center justify-between w-full mt-4 border-2 border-gray-300 rounded-3xl">
        <Pressable
          onPress={() => setSelected(StatisticType.ProductionIndicator)}
          className="w-[50%]"
        >
          <View
            className={
              selected === StatisticType.ProductionIndicator
                ? "bg-[#334493] flex-1 w-full rounded-3xl p-4"
                : "text-secondary flex-1 w-full rounded-3xl p-4"
            }
          >
            <Text
              className={
                selected === StatisticType.ProductionIndicator
                  ? "text-white text-md text-center"
                  : "text-black text-md text-center"
              }
            >
              Indicatori di Produzione
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => setSelected(StatisticType.SpecificIndicator)}
          className="w-[50%]"
        >
          <View
            className={
              selected === StatisticType.SpecificIndicator
                ? "bg-[#334493] flex-1 w-full rounded-3xl p-4"
                : "text-secondary flex-1 w-full rounded-3xl p-4"
            }
          >
            <Text
              className={
                selected === StatisticType.SpecificIndicator
                  ? "text-white text-md text-center"
                  : "text-black text-md text-center"
              }
            >
              {" "}
              Indicatori Specifici
            </Text>
          </View>
        </Pressable>
      </View>

      <View className="w-full mt-3">
        {statistics.map((statistic) => {
          if (statistic.type === selected) {
            return (
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(100)}
                key={statistic.id}
                className="flex flex-row items-center justify-between w-full p-3 border-b-2 border-gray-300"
              >
                <Text className="text-lg text-gray-500 uppercase ">
                  {statistic.name}
                </Text>
                <Text className="text-lg font-medium text-black">
                  {statistic.data}
                </Text>
              </Animated.View>
            );
          }
        })}
      </View>
    </View>
  );
}
