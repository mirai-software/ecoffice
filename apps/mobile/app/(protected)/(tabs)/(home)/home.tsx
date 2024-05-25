import { router } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

import HeaderContainer from "@/app/_header";

export default function TabOneScreen() {
  return (
    <HeaderContainer router={router}>
      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Home</H1>
        <Muted className="text-center">
          You are now authenticated and this session will persist even after
          closing the app.
        </Muted>

        <Button
          className="w-full bg-red-400"
          variant="default"
          size="default"
          onPress={() => {
            router.push("/create-report");
          }}
        >
          <Text>Effettua una Segnalazione</Text>
        </Button>

        <Button
          className="w-full bg-green-400"
          variant="default"
          size="default"
          onPress={() => {
            router.push("/create-request");
          }}
        >
          <Text>Richiedi ritiro a Domicilio</Text>
        </Button>
      </View>
    </HeaderContainer>
  );
}
