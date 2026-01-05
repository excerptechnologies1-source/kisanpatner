import { router } from "expo-router";
import {
  ChevronLeft,
  MessageCircle
} from 'lucide-react-native';
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function GoSchemeScreen() {
  const handleWhatsApp = () => {
    // Replace with actual number if provided, using a placeholder for now
    Linking.openURL('whatsapp://send?phone=918050806006&text=Hi, I want to know about Government Schemes.');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm mb-4">
        <TouchableOpacity
          onPress={() => router.push("/(farmer)/home")}
          className="p-2"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="ml-3 text-xl font-medium text-gray-900">
          Government Schemes
        </Text>
      </View>

      <View className="p-4 items-center justify-center flex-1 mt-10">
        <View className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 items-center w-full max-w-sm">
          <View className="w-16 h-16 bg-green-50 rounded-full items-center justify-center mb-4">
            <MessageCircle size={32} color="#22c55e" />
          </View>
          <Text className="text-xl font-medium text-gray-900 mb-2">Scheme Enquiries</Text>
          <Text className="text-gray-500 text-center mb-6">
            Get the latest details about government schemes directly on WhatsApp.
          </Text>

          <TouchableOpacity
            onPress={handleWhatsApp}
            className="bg-[#25D366] px-6 py-3 rounded-xl flex-row items-center space-x-2 w-full justify-center"
          >
            <MessageCircle size={20} color="white" />
            <Text className="text-white font-medium text-lg ml-2">Chat on WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
