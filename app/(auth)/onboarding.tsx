// app/(role)/SelectRoleScreen.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Role = "farmer" | "trader" | "employee" | "partner" | "transport";

const SelectRoleScreen: React.FC = () => {
  const handleSelect = (role: Role) => {
    router.push({
      pathname: "/(auth)/Login",
      params: { role },
    });

    if (role == "employee"){
      router.replace("/(labour)/LabourListScreen")
      return;
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-10">
      <View className="items-center mt-4">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-28 h-28"
          resizeMode="contain"
        />
      </View>


      {/* Card container */}
      <View className="bg-white px-5 py-10 ">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          <View className="h-10 w-10 rounded-full bg-emerald-500/10 items-center justify-center mr-3">
            <MaterialCommunityIcons name="tractor" size={22} color="#16a34a" />
          </View>
          <View>
            <Text className="text-lg font-heading text-slate-900 ">
              Today Crops
            </Text>
            <Text className="text-xs text-slate-500 font-subheading">
              Farmer · Trader · Partner · Employee · Transport
            </Text>
          </View>
        </View>

        <Text className="text-xs text-slate-500 mb-4">Choose your role</Text>

        {/* Row 1: Farmer + Trader */}
        <View className="flex-row mb-3">
          <TouchableOpacity
            className="flex-1 mr-2  px-4 py-3 bg-emerald-50"
            activeOpacity={0.8}
            onPress={() => handleSelect("farmer")}
          >
            <View className="flex-row items-center mb-2">
              <View className="h-9 w-9 rounded-full bg-emerald-500 items-center justify-center mr-2">
                <MaterialCommunityIcons
                  name="sprout"
                  size={20}
                  color="#ffffff"
                />
              </View>
              <Text className="text-base text-emerald-900 font-heading">
                Farmer
              </Text>
            </View>
            <Text className="text-[11px] text-emerald-800 font-subheading">Grow · Sell</Text>
            <Text className="text-[11px] text-emerald-800 font-subheading">Manage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 ml-2 px-4 py-3 bg-orange-50"
            activeOpacity={0.8}
            onPress={() => handleSelect("trader")}
          >
            <View className="flex-row items-center mb-2">
              <View className="h-9 w-9 rounded-full bg-orange-500 items-center justify-center mr-2">
                <MaterialCommunityIcons
                  name="scale-balance"
                  size={20}
                  color="#ffffff"
                />
              </View>
              <Text className="text-base font-heading text-orange-900 ">
                Trader
              </Text>
            </View>
            <Text className="text-[11px] text-orange-800 font-subheading">Buy · Bid</Text>
            <Text className="text-[11px] text-orange-800 font-subheading">Settle</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Employee (full width) */}
        <TouchableOpacity
          className="w-full  px-4 py-3 bg-blue-50 mb-3"
          activeOpacity={0.8}
          onPress={() => handleSelect("employee")}
        >
          <View className="flex-row items-center mb-2">
            <View className="h-9 w-9 rounded-full bg-blue-500 items-center justify-center mr-2">
              <MaterialCommunityIcons
                name="badge-account"
                size={20}
                color="#ffffff"
              />
            </View>
            <Text className="text-base font-heading text-blue-900 ">
              Employee
            </Text>
          </View>
          <Text className="text-[11px] text-blue-800 font-subheading">Work · Track</Text>
          <Text className="text-[11px] text-blue-800 font-subheading">Assist</Text>
        </TouchableOpacity>

        {/* Row 3: Partner + Transport */}
        <View className="flex-row">
          <TouchableOpacity
            className="flex-1 mr-2 px-4 py-3 bg-amber-50"
            activeOpacity={0.8}
            onPress={() => handleSelect("partner")}
          >
            <View className="flex-row items-center mb-2">
              <View className="h-9 w-9 rounded-full bg-amber-500 items-center justify-center mr-2">
                <MaterialCommunityIcons
                  name="handshake-outline"
                  size={20}
                  color="#ffffff"
                />
              </View>
              <Text className="text-base font-heading text-amber-900">
                Partner
              </Text>
            </View>
            <Text className="text-[11px] text-amber-800 font-subheading">
              Network &amp; Grow
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 ml-2 px-4 py-3 bg-teal-50"
            activeOpacity={0.8}
            onPress={() => handleSelect("transport")}
          >
            <View className="flex-row items-center mb-2">
              <View className="h-9 w-9 rounded-full bg-teal-500 items-center justify-center mr-2">
                <MaterialCommunityIcons
                  name="truck-delivery-outline"
                  size={20}
                  color="#ffffff"
                />
              </View>
              <Text className="text-base font-heading text-teal-900">
                Transport
              </Text>
            </View>
            <Text className="text-[11px] text-teal-800 font-subheading">
              Fleet · Loads · POD
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectRoleScreen;
