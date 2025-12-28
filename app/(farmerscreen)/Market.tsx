import { router } from "expo-router";
import {
  ChevronLeft,
  MapPin,
  Star
} from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MarketScreen() {
  const markets = [
    {
      id: 1,
      name: "APMC Market, Mysore",
      distance: "2.5 km",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
      rating: 4.5
    },
    {
      id: 2,
      name: "City Vegetable Market",
      distance: "5.0 km",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
      rating: 4.2
    },
    {
      id: 3,
      name: "Central Farmers Mandi",
      distance: "8.2 km",
      image: "https://images.unsplash.com/photo-1573486145949-18214724159f?w=800&q=80",
      rating: 4.8
    }
  ];

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
          Nearby Markets
        </Text>
      </View>

      <View className="px-4">
        {markets.map((market) => (
          <TouchableOpacity key={market.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
            <Image
              source={{ uri: market.image }}
              className="w-full h-40"
              resizeMode="cover"
            />
            <View className="p-4">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-lg font-medium text-gray-900">{market.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={14} color="#6b7280" />
                    <Text className="text-gray-500 ml-1 text-sm">{market.distance} near</Text>
                  </View>
                </View>
                <View className="bg-yellow-50 px-2 py-1 rounded-lg flex-row items-center">
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-yellow-700 font-medium ml-1 text-xs">{market.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
