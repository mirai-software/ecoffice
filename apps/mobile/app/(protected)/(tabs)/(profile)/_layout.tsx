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
      initialRouteName="profile-home"
    >
      <Stack.Screen name="profile-home" />
      <Stack.Screen
        name="profile-edit"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="repid"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="reqid"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
