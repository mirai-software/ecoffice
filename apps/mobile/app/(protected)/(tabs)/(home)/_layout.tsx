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
    >
      <Stack.Screen
        name="orari"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen name="home" />
      <Stack.Screen
        name="create-report"
        options={{
          presentation: "card",
        }}
      />

      <Stack.Screen
        name="create-request"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
}
