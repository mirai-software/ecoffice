import HeaderContainer from "@/app/_header";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";

import { SafeAreaView, View } from "react-native";

export default function Page() {
  const { slug } = useLocalSearchParams();

  return (
    <HeaderContainer router={router}>
      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Shop Product Page</H1>
        <Muted className="text-center">
          You call this page with slug: {slug}
        </Muted>
      </View>
    </HeaderContainer>
  );
}
