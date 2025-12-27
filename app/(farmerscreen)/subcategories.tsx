// SubCategoryList.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    Image,
    ListRenderItemInfo,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";

type SubItem = {
  id: string;
  label: string;
  avgPrice?: string;
  image?: string;
};

const SAMPLE: SubItem[] = [
  { id: "1", label: "Leafy greens", avgPrice: "—", image: "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "2", label: "Root vegetables", avgPrice: "—", image: "https://images.pexels.com/photos/1109979/pexels-photo-1109979.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "3", label: "Nightshades", avgPrice: "—", image: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "4", label: "Cruciferous vegetables", avgPrice: "—", image: "https://images.pexels.com/photos/1435909/pexels-photo-1435909.jpeg?auto=compress&cs=tinysrgb&w=200" },
  { id: "5", label: "Gourds", avgPrice: "—", image: "https://images.pexels.com/photos/65174/vegetables-gourd-luffa-vegetable-65174.jpeg?auto=compress&cs=tinysrgb&w=200" },
];

const Row: React.FC<{
  item: SubItem;
  onView: (item: SubItem) => void;
  onPost: (item: SubItem) => void;
}> = ({ item, onView, onPost }) => {
  return (
    <View className="bg-white rounded-xl border border-gray-200 px-3 py-3 mb-3 flex-row items-center shadow-sm">
      {/* Image */}
      <Image
        source={{ uri: item.image }}
        className="w-14 h-14 rounded-lg mr-3"
        resizeMode="cover"
      />

      {/* Text */}
      <View className="flex-1">
        <Text className="text-base text-gray-800 font-medium">
          {item.label}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">Avg. Price: {item.avgPrice}</Text>
      </View>

      {/* Buttons */}
      <View className="flex-row items-center space-x-2">
        <TouchableOpacity
          onPress={() => onPost(item)}
          className="px-3 py-1.5 bg-green-600 rounded-lg"
        >
          <Text className="text-xs text-white font-medium">Post now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SubCategoryList: React.FC = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams(); // optional use

  const onView = (item: SubItem) => {
    // navigate to details / list
    router.push({ pathname: "/", params: { sub: item.label } });
  };

  const onPost = (item: SubItem) => {
    // navigate to Add Crop form with category/sub info
    router.push({ pathname: "/", params: { category: category || "Category", sub: item.label } });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity className="p-2 rounded-full" onPress={() => router.back()}>
          <ChevronLeft size={20} color="#064E3B" />
        </TouchableOpacity>
        <Text className="text-lg font-subheading text-gray-900 ml-2">
          {category ? String(category) : "Sub Categories"}
        </Text>
      </View>

      {/* List */}
      <View className="px-4 pt-4">
        <FlatList
          data={SAMPLE}
          keyExtractor={(i) => i.id}
          renderItem={({ item }: ListRenderItemInfo<SubItem>) => (
            <Row item={item} onView={onView} onPost={onPost} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SubCategoryList;
