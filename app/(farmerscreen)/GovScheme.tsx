import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  ChevronLeft,
} from 'lucide-react-native';
import { router } from "expo-router";

export default function GoSchemeScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row items-center px-4 py-4 bg-white">
                <TouchableOpacity
                  onPress={() => router.push("/(farmer)/home")}
                  className="p-2"
                >
                  <ChevronLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="ml-3 text-xl font-medium text-gray-900">
                  {" "}
                  Government Schemes
                </Text>
              </View>

      <Text className="text-xl font-bold text-gray-800 mb-3">Government Schemes</Text>

      <View className="bg-white rounded-xl p-4 shadow">
        <Text className="text-lg font-medium text-gray-800">
          PM Kisan Scheme
        </Text>
        <Text className="text-gray-600 mt-1">
          Financial support for farmers
        </Text>

        <TouchableOpacity className="bg-green-600 mt-4 p-3 rounded-lg">
          <Text className="text-white text-center font-medium">View Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
