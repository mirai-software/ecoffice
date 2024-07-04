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
  statistics: any[] | undefined;
}) {
  const [selected, setSelected] = useState<StatisticType>(
    StatisticType.ProductionIndicator
  );

  if (!statistics || statistics.length === 0) {
    return (
      <View className="flex-1 w-full mt-3 justify-center items-center">
        <Text className="text-center font-normal text-gray-600">
          Nessuna Statistica Presente
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 w-full mt-3">
      <View className="w-full flex flex-row justify-evenly items-center border-2 rounded-3xl border-gray-300">
        <Pressable
          onPress={() => setSelected(StatisticType.ProductionIndicator)}
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
                  ? "text-white text-md"
                  : "text-black text-md"
              }
            >
              Indicatori di Produzione
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => setSelected(StatisticType.SpecificIndicator)}>
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
                  ? "text-white text-md"
                  : "text-black text-md"
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
                className="w-full flex flex-row justify-between items-center p-3 border-b-2 border-gray-300"
              >
                <Text className=" text-lg uppercase text-gray-500">
                  {statistic.name}
                </Text>
                <Text className="text-black text-lg font-medium">
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
