// import { useRouter } from "expo-router";
// import React from "react";
// import {
//   FlatList,
//   ListRenderItemInfo,
//   SafeAreaView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import {
//   Apple,
//   Beef,
//   ChevronLeft,
//   Droplet,
//   Flower2,
//   Leaf,
//   Sprout,
//   Trees,
//   Wheat,
// } from "lucide-react-native";

// /* -------------------- TYPES -------------------- */
// type Category = {
//   id: string;
//   label: string;
//   emoji: string;
// };

// /* -------------------- DATA -------------------- */
// const CATEGORIES: Category[] = [
//   { id: "1", label: "Vegetable", emoji: "🥕" },
//   { id: "2", label: "LiveStock", emoji: "🐄" },
//   { id: "3", label: "Fruits", emoji: "🍎" },
//   { id: "4", label: "Flowers", emoji: "🌸" },
//   { id: "5", label: "Herbs", emoji: "🌿" },
//   { id: "6", label: "Oilseeds", emoji: "🌻" },
//   { id: "7", label: "Grains", emoji: "🌾" },
//   { id: "8", label: "Other Crop", emoji: "🌲" },
// ];

// /* -------------------- CARD COMPONENT -------------------- */
// const CategoryCard: React.FC<{
//   item: Category;
//   onPress: (id: string) => void;
// }> = ({ item, onPress }) => {
//   return (
//     <TouchableOpacity
//       activeOpacity={0.8}
//       onPress={() => onPress(item.id)}
//       className="w-[48%] bg-white rounded-lg border border-gray-200 p-4 mb-4"
//     >
//       <View className="w-16 h-16 rounded-2xl bg-emerald-50 items-center justify-center mb-3">
//         <Text
//           style={{
//             fontSize: 42,
//             textAlign: "center",
//             lineHeight: 46, // keeps emoji vertically centered
//           }}
//         >
//           {item.emoji}
//         </Text>
//       </View>

//       <Text className="text-base font-medium text-gray-800">{item.label}</Text>
//     </TouchableOpacity>
//   );
// };

// /* -------------------- SCREEN -------------------- */
// const CategoriesScreen: React.FC = () => {
//   const router = useRouter();

//   const onBack = () => {
//     router.back();
//   };

//   const handlePress = (id: string) => {
//     const selected = CATEGORIES.find((c) => c.id === id);
//     if (!selected) return;

//     router.push({
//       pathname: "/(farmerscreen)/subcategories",
//       params: { category: selected.label },
//     });
//   };

//   const renderItem = ({ item }: ListRenderItemInfo<Category>) => (
//     <CategoryCard item={item} onPress={handlePress} />
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       {/* -------- Header -------- */}
//       <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
//         <TouchableOpacity
//           onPress={onBack}
//           activeOpacity={0.7}
//           className="p-2 rounded-full"
//         >
//           <ChevronLeft size={20} color="#064E3B" />
//         </TouchableOpacity>

//         <Text className="text-lg font-medium text-gray-900 ml-2">
//           Categories
//         </Text>
//       </View>

//       {/* -------- Grid -------- */}
//       <FlatList
//         data={CATEGORIES}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         numColumns={2}
//         columnWrapperStyle={{ justifyContent: "space-between" }}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           padding: 16,
//           paddingBottom: 40,
//         }}
//       />
//     </SafeAreaView>
//   );
// };

// export default CategoriesScreen;




import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface Category {
  _id: string;
  categoryId: string;
  categoryName: string;
  image: string;
}

interface SubCategory {
  _id: string;
  subCategoryId: string;
  subCategoryName: string;
  categoryId: string;
  image: string;
}

const CategorySelectionPage: React.FC = () => {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("https://kisan.etpl.ai/category/all");
    setCategories(res.data.data);
  };

  const fetchSubCategories = async (categoryId: string) => {
    const res = await axios.get(
      `https://kisan.etpl.ai/subcategory/category/${categoryId}`
    );
    setSubCategories(res.data.data);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
    fetchSubCategories(categoryId);
    setStep(2);
  };

  const handleProceed = () => {
    router.push({
      pathname: "/(farmerscreen)/productsales",
      params: {
        categoryId: selectedCategory,
        subCategoryId: selectedSubCategory,
      },
    });
  };
console.log("selectedCategory",selectedCategory)
console.log("selectedSubCategory",selectedSubCategory)
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/100";
    return `https://kisan.etpl.ai/uploads/${imagePath.replace(
      /^uploads[\/\\]/,
      ""
    )}`;
  };

  const handleBackPress = () => {
    if (step === 1) {
      // If on category selection page, go back to home
      router.push("/(farmer)/home");
    } else if (step === 2) {
      // If on sub-category page, go back to category selection
      setStep(1);
      setSelectedSubCategory("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center bg-white">
        <TouchableOpacity
          onPress={handleBackPress}
          className="p-2"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="ml-3 text-xl font-medium text-gray-900">
          {step === 1 ? "Select Category" : "Select Sub-Category"}
        </Text>
      </View>
      
      <ScrollView 
        className="flex-1 bg-white"
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔹 STEP 1 – CATEGORY */}
        {step === 1 && (
          <View className="flex-1">
            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: 15, marginBottom: 15 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-1 border border-gray-200 rounded-lg p-2.5 items-center"
                  onPress={() => handleCategorySelect(item._id)}
                >
                  <Image
                    source={{ uri: getImageUrl(item.image) }}
                    className="w-full h-20 rounded-lg mb-1.5"
                  />
                  <Text className="text-sm text-center font-medium">{item.categoryName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* 🔹 STEP 2 – SUB CATEGORY */}
        {step === 2 && (
          <View className="flex-1">
        

            <FlatList
              data={subCategories}
              keyExtractor={(item) => item._id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-1 border border-gray-200 rounded-lg p-2.5 items-center ${
                    selectedSubCategory === item._id ? 'border-green-300 border' : ''
                  }`}
                  onPress={() => setSelectedSubCategory(item._id)}
                >
                  <Image
                    source={{ uri: getImageUrl(item.image) }}
                    className="w-full h-20 rounded-lg mb-1.5"
                  />
                  <Text className="text-xs text-center font-medium">{item.subCategoryName}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              disabled={!selectedSubCategory}
              onPress={handleProceed}
              className={`mt-5 p-3.5 rounded-md items-center ${!selectedSubCategory ? 'bg-gray-300' : 'bg-green-500'}`}
            >
              <Text className="text-white text-base font-medium">Proceed to Sell Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategorySelectionPage;