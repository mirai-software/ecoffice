import HeaderContainer from "@/app/_header";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { api } from "@/lib/api";
import { ScrollView } from "react-native-gesture-handler";

const getDayItalian = (day: string) => {
  switch (day) {
    case "Monday":
      return "Lunedì";
    case "Tuesday":
      return "Martedì";
    case "Wednesday":
      return "Mercoledì";
    case "Thursday":
      return "Giovedì";
    case "Friday":
      return "Venerdì";
    case "Saturday":
      return "Sabato";
    case "Sunday":
      return "Domenica";
    default:
      return "Errore";
  }
};

export default function Orari() {
  const { data: user, isLoading } = api.user.getUser.useQuery({});
  if (isLoading) {
    return (
      <HeaderContainer>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <ScrollView>
          <View className="w-full h-full flex flex-col pt-4 pb-40">
            <Text className="text-2xl font-normal text-center">
              Comune di {user?.city?.name}
            </Text>
            <Text className="text-xl font-normal text-center text-gray-400">
              Comune di {user?.city?.address}
            </Text>

            {user?.city?.openingHours &&
              user?.city?.openingHours.map((orario) => (
                <View
                  className="flex flex-row justify-between items-center p-4 mx-5 mt-3"
                  key={orario.id}
                >
                  <Text className="font-normal text-xl">
                    {getDayItalian(orario.day)}
                  </Text>
                  <View className="flex-1 items-end">
                    {
                      <View className="flex flex-row gap-4">
                        <Text className="font-normal text-xl">
                          {orario.openTime1}
                        </Text>
                        <Text className="font-normal text-xl">
                          {orario.closeTime1}
                        </Text>
                      </View>
                    }
                    {orario.openTime2 && orario.closeTime2 && (
                      <View className="flex flex-row gap-4">
                        <Text className="font-normal text-xl">
                          {orario.openTime2}
                        </Text>
                        <Text className="font-normal text-xl">
                          {orario.closeTime2}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      </HeaderContainer>
    );
}
