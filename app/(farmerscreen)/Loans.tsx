import { router } from "expo-router";
import {
  ChevronLeft,
  Phone
} from 'lucide-react-native';
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function LoansScreen() {
  const handleCall = () => {
    Linking.openURL('tel:+919876543210');
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
          Loans
        </Text>
      </View>

      <View className="p-4 items-center justify-center flex-1 mt-10">
        <View className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 items-center w-full max-w-sm">
          <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4">
            <Phone size={32} color="#2563eb" />
          </View>
          <Text className="text-xl font-medium text-gray-900 mb-2">Need a Loan?</Text>
          <Text className="text-gray-500 text-center mb-6">
            For loan assistance and inquiries, please contact our support team directly.
          </Text>

          <TouchableOpacity
            onPress={handleCall}
            className="bg-blue-600 px-6 py-3 rounded-xl flex-row items-center space-x-2 w-full justify-center"
          >
            <Phone size={20} color="white" />
            <Text className="text-white font-medium text-lg ml-2">+91 98765 43210</Text>
          </TouchableOpacity>

          <Text className="text-gray-400 text-sm mt-4">Please Contact Us</Text>
        </View>
      </View>
    </ScrollView>
  );
}
