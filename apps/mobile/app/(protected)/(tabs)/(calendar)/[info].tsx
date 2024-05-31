import HeaderContainer from "@/app/_header";
import { H1, Muted } from "@/components/ui/typography";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { ActivityIndicator, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "@/components/safe-area-view";
import { FontAwesome } from "@expo/vector-icons";

export default function Page() {
  const { info } = useLocalSearchParams();

  if (typeof info !== "string") {
    throw new Error("Invalid info");
  }

  const { data: wasteType, isLoading } = api.city.getWasteType.useQuery({
    id: info,
  });

  if (isLoading) {
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
            <FontAwesome name="recycle" size={24} color="white" />
            <Text className="text-2xl text-white font-semibold">
              {wasteType.name}
            </Text>
          </View>
          <View className="p-4">
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <FontAwesome name="check-circle" size={24} color="green" />
                <Text className="text-xl font-semibold ml-2">
                  Cosa conferire
                </Text>
              </View>
              <Text className="font-normal">
                Imballaggi in cartone ondulato e cartoncino sempre appiattiti,
                contenitori per pizza puliti, sacchetti di carta (es. pane,
                ortofrutta, farina, zucchero, ecc.), giornali, riviste, fumetti,
                stampa commerciale, fogli di carta di ogni dimensione, fascette
                di cartoncino, parti in carta o cartoncino di confezioni come
                conserve, scatole delle scarpe, tutte le confezioni in
                cartoncino di prodotti per l’igiene della casa e della persona,
                scatole dei medicinali.
              </Text>
            </View>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <FontAwesome name="times-circle" size={24} color="red" />
                <Text className="text-xl font-semibold ml-2">
                  Cosa non conferire
                </Text>
              </View>
              <Text className="font-normal">
                Scontrini, carta oleata, plastificata, da forno, fazzoletti di
                carta usati, imballaggi di cartone con residui di cibo o terra o
                sporchi di sostanze chimiche. In generale tutto ciò che non è
                carta. I cartoni per liquidi vanno conferiti con plastica,
                acciaio e alluminio.
              </Text>
            </View>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <FontAwesome name="info-circle" size={24} color="blue" />
                <Text className="text-xl font-semibold ml-2">
                  Come conferire
                </Text>
              </View>
              <Text className="font-normal">
                La carta in sacchetti di carta (no sacchi di plastica o
                bioplastica) o scatole di cartone. I cartoni da imballaggio
                piegati e legati, davanti al proprio portone o attività.
              </Text>
            </View>
          </View>
        </ScrollView>
      </HeaderContainer>
    );
  }
}
