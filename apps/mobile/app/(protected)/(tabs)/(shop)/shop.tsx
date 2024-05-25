import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { View } from "react-native";

import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import HeaderContainer from "@/app/_header";

export default function Shop() {
  const router = useRouter();
  return (
    <HeaderContainer router={router}>
      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Shop</H1>
        <Muted className="text-center">
          You are now authenticated and this session will persist even after
          closing the app.
        </Muted>
        <Button onPress={() => router.navigate("(shop)/453536321312")}>
          <Text>Go product page</Text>
        </Button>
      </View>
    </HeaderContainer>
  );
}