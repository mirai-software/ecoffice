import { H1, Muted } from "@/components/ui/typography";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
export default function Shop() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
      <H1 className="text-center">Calendar</H1>
      <Muted className="text-center">
        You are now authenticated and this session will persist even after
        closing the app.
      </Muted>
      <Button
        className="w-full bg-red-400"
        variant="default"
        size="default"
        onPress={() => {
          router.push("/(calendar)/Spazzatura-23231");
        }}
      >
        <Text>Go to Spazzatura</Text>
      </Button>
    </View>
  );
}
