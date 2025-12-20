import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Apple,
  Beef,
  ChevronLeft,
  Droplet,
  Flower2,
  Leaf,
  Sprout,
  Trees,
  Wheat,
} from "lucide-react-native";

/* -------------------- TYPES -------------------- */
type Category = {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
};

/* -------------------- DATA -------------------- */
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

/* -------------------- CARD COMPONENT -------------------- */
const CategoryCard: React.FC<{
  item: Category;
  onPress: (id: string) => void;
}> = ({ item, onPress }) => {
  const Icon = item.icon;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item.id)}
      className="w-[48%] bg-white rounded-xl border border-gray-200 p-4 mb-4"
    >
      <View className="w-12 h-12 rounded-xl bg-emerald-50 items-center justify-center mb-3">
        <Icon size={20} color="#10B981" />
      </View>

      <Text className="text-base font-medium text-gray-800">
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

/* -------------------- SCREEN -------------------- */
const CategoriesScreen: React.FC = () => {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  const handlePress = (id: string) => {
    const selected = CATEGORIES.find((c) => c.id === id);
    if (!selected) return;

    router.push({
      pathname: "/farmerscreen/subcategories",
      params: { category: selected.label },
    });
  };

  const renderItem = ({ item }: ListRenderItemInfo<Category>) => (
    <CategoryCard item={item} onPress={handlePress} />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* -------- Header -------- */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="p-2 rounded-full"
        >
          <ChevronLeft size={20} color="#064E3B" />
        </TouchableOpacity>

        <Text className="text-lg font-heading text-gray-900 ml-2">
          Categories
        </Text>
      </View>

      {/* -------- Grid -------- */}
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
        }}
      />
    </SafeAreaView>
  );
};

export default CategoriesScreen;
