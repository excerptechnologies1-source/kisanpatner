import { Tabs } from "expo-router";
import { Home, PlusCircle, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1FAD4E",
        tabBarInactiveTintColor: "#8e8e8e",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      {/* HOME TAB */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      {/* FARMER / TRADER AREA */}
      <Tabs.Screen
        name="PostRequirement"
        options={{
          title: "post",
          tabBarIcon: ({ color, size }) => (
            <PlusCircle color={color} size={size} />
          ),
        }}
      />



      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
