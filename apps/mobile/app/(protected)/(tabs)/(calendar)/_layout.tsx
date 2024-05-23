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
      initialRouteName="calendar"
    >
      <Stack.Screen name="calendar" />
      <Stack.Screen
        name="[info]"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
}
