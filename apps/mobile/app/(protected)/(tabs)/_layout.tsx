import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";

// import { theme } from "@/lib/constants";
// import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
  // const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          height: 80,
          borderWidth: 1,
          borderRadius: 40,
          marginHorizontal: 10,
          backgroundColor: "#243239",
          position: "absolute",
          bottom: 30,
          paddingHorizontal: 20,
          borderColor: "#243239",
          flex: 1,
          justifyContent: "center",
          borderTopWidth: 0,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
        tabBarItemStyle: {
          height: 65,
        },
        headerStyle: {
          shadowColor: "transparent",
          height: 120,
        },
      }}
    >
      <Tabs.Screen
        name="(shop)"
        options={{
          title: "Seconda Mano",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="shopping-bag" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(home)"
        options={{
          title: "EcoOffice",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(calendar)"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="calendar" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
