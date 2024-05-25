import HeaderContainer from "@/app/_header";

import { H1, Muted } from "@/components/ui/typography";

import { router, useLocalSearchParams } from "expo-router";

import { View } from "react-native";

export default function Page() {
  const { info } = useLocalSearchParams();

  return (
    <HeaderContainer router={router}>
      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Garbage Info</H1>
        <Muted className="text-center">
          You call this page with slug: {info}
        </Muted>
      </View>
    </HeaderContainer>
  );
}
