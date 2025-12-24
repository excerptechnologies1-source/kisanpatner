import { Tabs } from "expo-router";
import { Home, PlusCircle, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#8e8e8e",
        tabBarStyle: {
          backgroundColor: "#ffffff",
        
          paddingBottom: 8,
        },
      }}
    >
      {/* HOME TAB */}
      <Tabs.Screen
        name="LabourListScreen"
        options={{
          title: "LabourList",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

   
    </Tabs>
  );
}
