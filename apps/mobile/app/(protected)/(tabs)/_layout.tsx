import { Tabs } from "expo-router";

import React from "react";
import { theme } from "@/lib/constants";

import UserIcon from "@/assets/icons/user";
import BankIcon from "@/assets/icons/bank";
import CalendarIcon from "@/assets/icons/calendar";
import ShopIcon from "@/assets/icons/shop";

// import { theme } from "@/lib/constants";
// import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
  // const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: theme.light.tabs_muted,
        tabBarStyle: {
          height: 80,
          borderWidth: 1,
          borderRadius: 40,
          marginHorizontal: 10,
          backgroundColor: theme.light.tabs,
          position: "absolute",
          bottom: 30,
          paddingHorizontal: 20,
          borderColor: "#243239",
          flex: 1,
          borderTopWidth: 0,
        },
        headerShown: false,

        headerStyle: {
          height: 120,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
        tabBarItemStyle: {
          height: 65,
        },
      }}
      initialRouteName="(home)"
    >
      <Tabs.Screen
        name="(shop)"
        options={{
          title: "Seconda Mano",
          tabBarIcon: ({ color }) => (
            <ShopIcon width={28} height={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <BankIcon width={28} height={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(calendar)"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color }) => (
            <CalendarIcon width={28} height={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profilo",
          tabBarIcon: ({ color }) => (
            <UserIcon width={28} height={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
