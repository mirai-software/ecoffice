import { H1, Muted } from "@/components/ui/typography";
import { View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import HeaderContainer from "@/app/_header";

export default function CreateReport() {
  return (
    <HeaderContainer router={router}>
      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Create Report</H1>
        <Muted className="text-center">
          You are now authenticated and this session will persist even after
          closing the app.
        </Muted>

        {router.canGoBack() && (
          <Button onPress={() => router.back()}>
            <Text>Go Back</Text>
          </Button>
        )}
      </View>
    </HeaderContainer>
  );
}
