import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const PostCropScreen: React.FC = () => {
  const router = useRouter();

  const handleSell = () => {
    router.push("/farmerscreen/productsales");
  };

  const handleAddCrop = () => {
    router.push("/farmerscreen/categories");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-5 pt-5 pb-5">
        <Text className="text-xl font-inter-semibold text-gray-900">
          Post Crop
        </Text>
      </View>

      <View className="px-5 flex-1 justify-center items-center gap-10">
        {/* Title */}
        <View className="items-center">
          <Text className="text-2xl text-[#0F5132] font-inter-semibold">
            Welcome, Farmer!
          </Text>
          <Text className="text-sm text-gray-500 mt-2">
            What would you like to do today?
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full flex-col gap-3">
          {/* SELL */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSell}
            className="h-14 rounded-lg bg-yellow-400 items-center justify-center shadow-lg"
          >
            <View className="w-full px-4 flex-row items-center justify-center">
              <Text className="text-base text-[#0F1724] font-inter-semibold">
                SELL YOUR PRODUCE
              </Text>
              <View className="absolute right-4">
                <ArrowRight size={18} color="#0F1724" />
              </View>
            </View>
          </TouchableOpacity>

          {/* ADD NEW CROP */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAddCrop}
            className="h-14 rounded-lg bg-green-600 items-center justify-center shadow-lg"
          >
            <View className="w-full px-4 flex-row items-center justify-center">
              <Text className="text-base text-white font-inter-semibold">
                ADD NEW CROP
              </Text>
              <View className="absolute right-4">
                <ArrowRight size={18} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PostCropScreen;
