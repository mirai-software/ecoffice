import { H1, Muted } from "@/components/ui/typography";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import HeaderContainer from "@/app/_header";
import { api } from "@/lib/api";
import { SafeAreaView } from "@/components/safe-area-view";
import CalendarComponent from "@/components/CalendarComponent";
export default function Shop() {
  const { data: Calendar, isLoading } = api.city.getCityCalendar.useQuery({});

  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
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
