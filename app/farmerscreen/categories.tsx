// CategoriesScreen.tsx
import { useRouter } from "expo-router";

import {
    Apple,
    Beef,
    ChevronLeft,
    ChevronRight,
    Droplet,
    Flower2,
    Leaf,
    Sprout,
    Trees,
    Wheat
} from "lucide-react-native";

import React from "react";
import {
    FlatList,
    ListRenderItemInfo,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Category = {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
};

const CATEGORIES: Category[] = [
  { id: "1", label: "Vegetable", icon: Leaf },
  { id: "2", label: "LiveStock", icon: Beef },
  { id: "3", label: "Fruits", icon: Apple },
  { id: "4", label: "Flowers", icon: Flower2 },
  { id: "5", label: "Herbs", icon: Sprout },
  { id: "6", label: "Oilseeds", icon: Droplet },
  { id: "7", label: "Grains", icon: Wheat },
  { id: "8", label: "Other Crop", icon: Trees },
];

const CategoryRow: React.FC<{
  item: Category;
  onPress?: (id: string) => void;
}> = ({ item, onPress }) => {
  const Icon = item.icon;
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress?.(item.id)}
      className="bg-white rounded-lg border border-gray-200 px-4 py-3 mb-3 flex-row items-center"
    >
      <View className="w-10 h-10 rounded-lg bg-emerald-50 items-center justify-center mr-4">
        <Icon size={18} color="#10B981" />
      </View>

      <View className="flex-1">
        <Text className="text-base text-gray-800 font-medium">
          {item.label}
        </Text>
      </View>

      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

const CategoriesScreen: React.FC = () => {
  const router = useRouter();

  const onBack = () => router.back?.();

  const handlePress = (id: string) => {
    const selected = CATEGORIES.find((c) => c.id === id);
    if (!selected) {
      console.warn("Category not found for id:", id);
      return;
    }

    // navigate to subcategories screen and pass category label as param
    router.push({
      pathname: "/farmerscreen/subcategories",
      params: { category: selected.label },
    });
  };

  const renderItem = ({ item }: ListRenderItemInfo<Category>) => (
    <CategoryRow item={item} onPress={handlePress} />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Top bar */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="p-2 rounded-full"
        >
          <ChevronLeft size={20} color="#064E3B" />
        </TouchableOpacity>

        <Text className="text-lg font-subheading text-gray-900 ml-2">
          Categories
        </Text>
      </View>

      {/* Content */}
      <View className="px-4 pt-4">
        <FlatList
          data={CATEGORIES}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 36 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
