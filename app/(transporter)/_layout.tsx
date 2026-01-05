import { Tabs } from "expo-router";
import { Car, Home, Truck, User, UserCog } from "lucide-react-native";
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
        name="TransportOrderss"
        options={{
          title: "OrderList",
          tabBarIcon: ({ color, size }) => (
            <UserCog color={color} size={size} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="TransportOrders"
        options={{
          title: "Transport",
          tabBarIcon: ({ color, size }) => <Car color={color} size={size} />,
        }}
      />
 <Tabs.Screen
        name="TransportVehicles"
        options={{
          title: "My Vehicles",
          tabBarIcon: ({ color, size }) => <Truck color={color} size={size} />,
        }}
      />
        <Tabs.Screen
        name="TransportProfile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />

      
    </Tabs>
  );
}
