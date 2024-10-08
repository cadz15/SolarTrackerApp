import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <AntDesign name="dashboard" size={24} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#009FBD",
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={24} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#009FBD",
          },
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#009FBD",
          },
        }}
      />
    </Tabs>
  );
}
