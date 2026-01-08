import { router } from "expo-router";
import {
  ChevronLeft,
  MessageCircle // WhatsApp-like icon
} from 'lucide-react-native';
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function LoansScreen() {
  const handleWhatsApp = () => {
    // Replace with the actual phone number (without +)
    const phoneNumber = "918050806006";
    
    // You can also add a pre-defined message
    const message = "Hello, I need assistance with loans.";
    
    // Open WhatsApp with the phone number
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`);
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
          {/* WhatsApp icon with green background */}
          <View className="w-16 h-16 bg-green-50 rounded-full items-center justify-center mb-4">
            <MessageCircle size={32} color="#25D366" />
          </View>
          <Text className="text-xl font-medium text-gray-900 mb-2">Need a Loan?</Text>
          <Text className="text-gray-500 text-center mb-6">
            For loan assistance and inquiries, please contact our support team on WhatsApp.
          </Text>

          <TouchableOpacity
            onPress={handleWhatsApp}
            className="bg-green-600 px-6 py-3 rounded-xl flex-row items-center space-x-2 w-full justify-center"
          >
            <MessageCircle size={20} color="white" />
            <Text className="text-white font-medium text-lg ml-2">Contact on WhatsApp</Text>
          </TouchableOpacity>

          <Text className="text-gray-400 text-sm mt-4">We'll respond as soon as possible</Text>
        </View>
      </View>
    </ScrollView>
  );
}