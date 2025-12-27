import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  ChevronLeft,
} from 'lucide-react-native';
import { router } from "expo-router";

export default function ShoppingScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row items-center bg-white">
                <TouchableOpacity
                  onPress={() => router.push("/(farmer)/home")}
                  className="p-2"
                >
                  <ChevronLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="ml-3 text-xl font-medium text-gray-900">
                  {" "}
                  Shopping
                </Text>
              </View>

      <Text className="text-xl font-bold text-gray-800 mb-3">Shopping</Text>

      <View className="bg-white rounded-xl p-4 shadow mb-3">
        <Text className="text-lg font-medium text-gray-800">Fertilizer</Text>
        <Text className="text-gray-600 mt-1">Best quality for crops</Text>

        <TouchableOpacity className="bg-orange-500 mt-3 p-3 rounded-lg">
          <Text className="text-white text-center font-medium">Buy Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
