import { Stack } from "expo-router";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="shop"
    >
      <Stack.Screen name="shop" />
      <Stack.Screen
        name="[slug]"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
}
