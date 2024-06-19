import { Muted } from "@/components/ui/typography";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import HeaderContainer from "@/app/_header";
import { api } from "@/lib/api";
import CalendarComponent from "@/components/CalendarComponent";
export default function Shop() {
  const { data: Calendar, isLoading } = api.city.getCityCalendar.useQuery({});

  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else if (Calendar?.length === 0) {
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-center  justify-center bg-background p-4 gap-y-4">
          <Muted className="text-center">
            Nessun Calendario attualmente caricato.{" "}
          </Muted>
        </View>
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-start justify-start bg-background gap-y-4">
          {/* Implementare Shopify ScrollView */}
          {Calendar?.map((day) => (
            <CalendarComponent
              key={day.id}
              day={day.day}
              garbages={day.wasteTypes}
            />
          ))}
        </View>
      </HeaderContainer>
    );
}
