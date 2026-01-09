// import Entypo from "@expo/vector-icons/Entypo";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { useRouter } from "expo-router";
// import React, { JSX } from "react";
// import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import KisanHeader from "../(traderscreen)/kisanHeader";
// import renderCategoryItem from "../(traderscreen)/renderCategoryItem";
// import renderSliderItem from "../(traderscreen)/renderSliderItem";

// const Home = () => {
//   const router=useRouter()

//   type ActionItem = {
//   title: string;
//   icon: JSX.Element;
//   link: string; // MUST be string (not optional)
// };


//   const postRequired:ActionItem[] = [
//     {
//       link: "/(traderscreen)/PostRequirement",
//       title: "Post Requirement",
//       icon: <FontAwesome6 name="file-lines" size={26} color="#4CAF50" />,
//     },
//     {
//       link: "/(traderscreen)/Allcrops",
//       title: "All Crops",
//       icon: <Entypo name="crop" size={26} color="#4CAF50" />,
//     },
//     {
//       link: "/(traderscreen)/TraderOrderHistory",
//       title: "My Order",
//       icon: <MaterialCommunityIcons name="truck-delivery" size={26} color="#4CAF50" />,
//     },
//   ];

//   const slider = [
//     {
//       id: "1",
//       img: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
//       title: "Fresh Tomatoes Arrived",
//       des: "Premium Quality Tomatoes available now.",
//     },
//     {
//       id: "2",
//       img: "https://thumbs.dreamstime.com/b/vegetables-group-white-background-vector-illustration-48246562.jpg",
//       title: "Fresh Vegetables Arrived",
//       des: "Premium Quality vegetables available now.",
//     },
//     {
//       id: "3",
//       img: "https://happyharvestfarms.com/blog/wp-content/uploads/2024/01/Vegetables-3.jpg",
//       title: "Fresh Vegetables Arrived",
//       des: "Premium Quality vegetables available now.",
//     },
//   ];

//   const Category=[
//     {
//       id: "1",
//       img: "https://cdn.firstcry.com/education/2022/11/08143105/Green-Vegetables-Names-in-English-for-Kids.jpg",
//       title: "Tomatoes",
//     },
//     {
//       id: "2",
//       img: "https://images.squarespace-cdn.com/content/v1/578753d7d482e9c3a909de40/1475214227717-ZZC578EFLPPMNHNRTKQH/444B0502.jpg?format=2500w",
//       title: "Tomatoes",
//     },
//     {
//       id: "3",
//       img: "https://hips.hearstapps.com/hmg-prod/images/fresh-vegetables-in-basket-on-wooden-background-royalty-free-image-1676394780.jpg?crop=1xw:0.84415xh;0,0.108xh",
//       title: "Tomatoes",
//     },
//     {
//       id: "4",
//       img: "https://cdn.britannica.com/63/186963-138-AEE87658/vegetables.jpg?w=800&h=450&c=crop",
//       title: "Tomatoes",
//     },
//     {
//       id: "5",
//       img: "https://5.imimg.com/data5/ANDROID/Default/2024/11/469480228/YS/EE/TL/63667197/product-jpeg-500x500.jpg",
//       title: "Tomatoes",
//     },
//     {
//       id: "6",
//       img: "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2025/05/healthful-vegetables-GettyImages-1251268295-Facebook.jpg",
//       title: "Tomatoes",
//     },
//     {
//       id: "7",
//       img: "https://agricultureguruji.com/wp-content/uploads/2021/05/best-vegetable-grow-in-greenhouse-scaled.jpeg",
//       title: "Tomatoes",
//     },
//     {
//       id: "8",
//       img: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
//       title: "Tomatoes",
//     },
//   ]

//   return (
//     <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
//       <KisanHeader />
//       <ScrollView 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       >
    
//         {/* POST REQUIRED SECTION */}
//         <View className="px-6 mt-2">
//           <Text className="text-lg font-medium text-gray-700 mb-4">Quick Actions</Text>
//           <View className="flex-row flex-wrap justify-between">
//             {postRequired.map((item, i) => (
//               <TouchableOpacity
//                 key={i}
//                 className="bg-white w-28 h-28 rounded-lg mb-4 border border-gray-100 justify-center items-center shadow-sm"
//                 activeOpacity={0.8}
//                 onPress={() => router.push(item.link as any)}
//               >
//                 <View className="mb-3 p-3 rounded-full bg-green-50">
//                   {item.icon}
//                 </View>
//                 <Text className="text-center text-sm font-medium text-gray-600">
//                   {item.title}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* SLIDER SECTION */}
//         <View className="mt-6">
//           <View className="px-6 mb-3">
//             <Text className="text-lg font-medium text-gray-700">Featured Products</Text>
//           </View>
          
//           <FlatList
//             data={slider}
//             keyExtractor={(item) => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 16 }}
//             renderItem={renderSliderItem}
//             snapToInterval={272} // w-64 (256) + mr-4 (16) = 272
//             decelerationRate="fast"
//           />
//         </View>

//         {/* Add more sections as needed */}
//         <View className="px-6 mt-8">
//           <Text className="text-lg font-medium text-gray-700 mb-4">
//            Explore Category
//           </Text>
//           {/* Add your recently viewed items here */}
//         </View>
//        <FlatList
//   data={Category}
//   numColumns={2}
//   keyExtractor={(item) => item.id}
//   renderItem={renderCategoryItem}
//   scrollEnabled={false}  // because ScrollView already scrolls
//   columnWrapperStyle={{ justifyContent: "space-between" }}
//   contentContainerStyle={{ paddingHorizontal: 16 }}
// />


    
//       </ScrollView>

//     </SafeAreaView>
//   );
// };

// export default Home;



import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { JSX, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KisanHeader from "../(traderscreen)/kisanHeader";
import renderCategoryItem from "../(traderscreen)/renderCategoryItem";
import renderSliderItem from "../(traderscreen)/renderSliderItem";

// Define types for category
interface Category {
  _id: string;
  categoryName: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  img?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Image mapping database for categories without images
const categoryImageDatabase: Record<string, string> = {
  'vegetables': 'https://cdn.firstcry.com/education/2022/11/08143105/Green-Vegetables-Names-in-English-for-Kids.jpg',
  'fruits': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'flowers': 'https://images.unsplash.com/photo-1566385101042-1a0f0c126c96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'grains': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'spices': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'medicinal': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'tomato': 'https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg',
  'potato': 'https://images.squarespace-cdn.com/content/v1/578753d7d482e9c3a909de40/1475214227717-ZZC578EFLPPMNHNRTKQH/444B0502.jpg',
  'onion': 'https://hips.hearstapps.com/hmg-prod/images/fresh-vegetables-in-basket-on-wooden-background-royalty-free-image-1676394780.jpg',
  'carrot': 'https://cdn.britannica.com/63/186963-138-AEE87658/vegetables.jpg',
  'spinach': 'https://5.imimg.com/data5/ANDROID/Default/2024/11/469480228/YS/EE/TL/63667197/product-jpeg-500x500.jpg',
  'cabbage': 'https://media.post.rvohealth.io/wp-content/uploads/sites/3/2025/05/healthful-vegetables-GettyImages-1251268295-Facebook.jpg',
  'pepper': 'https://agricultureguruji.com/wp-content/uploads/2021/05/best-vegetable-grow-in-greenhouse-scaled.jpeg',
  'cucumber': 'https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg',
  'dairy': 'https://www.shutterstock.com/image-photo/dairy-products-milk-cheese-yogurt-600nw-2201258049.jpg',
  'pulses': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'cereals': 'https://images.unsplash.com/photo-1586985289688-cacf016f6b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'herbs': 'https://images.unsplash.com/photo-1587829191301-26b59dc6a8de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'nuts': 'https://images.unsplash.com/photo-1585518419759-590eae66efc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'seeds': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
};

// Fallback categories
const fallbackCategories = [
  {
    id: "1",
    img: "https://cdn.firstcry.com/education/2022/11/08143105/Green-Vegetables-Names-in-English-for-Kids.jpg",
    title: "Vegetables",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "2",
    img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Fruits",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "3",
    img: "https://images.unsplash.com/photo-1566385101042-1a0f0c126c96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Flowers",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "4",
    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Grains",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "5",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Spices",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "6",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Medicinal Plants",
    link: "/(traderscreen)/Allcrops",
  },
];

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  type ActionItem = {
    title: string;
    icon: JSX.Element;
    link: string;
  };

  const postRequired: ActionItem[] = [
    {
      link: "/(traderscreen)/PostRequirement",
      title: "Post Requirement",
      icon: <FontAwesome6 name="file-lines" size={26} color="#4CAF50" />,
    },
    {
      link: "/(traderscreen)/Allcrops",
      title: "All Crops",
      icon: <Entypo name="crop" size={26} color="#4CAF50" />,
    },
    {
      link: "/(traderscreen)/TraderOrderHistory",
      title: "My Order",
      icon: <MaterialCommunityIcons name="truck-delivery" size={26} color="#4CAF50" />,
    },
  ];

  const staticSlider = [
    {
      id: "1",
      img: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
      title: "Fresh Tomatoes Arrived",
      des: "Premium Quality Tomatoes available now.",
      link: "/(traderscreen)/Allcrops"
    },
    {
      id: "2",
      img: "https://thumbs.dreamstime.com/b/vegetables-group-white-background-vector-illustration-48246562.jpg",
      title: "Fresh Vegetables Arrived",
      des: "Premium Quality vegetables available now.",
      link: "/(traderscreen)/Allcrops"
    },
    {
      id: "3",
      img: "https://happyharvestfarms.com/blog/wp-content/uploads/2024/01/Vegetables-3.jpg",
      title: "Fresh Vegetables Arrived",
      des: "Premium Quality vegetables available now.",
      link: "/(traderscreen)/Allcrops"
    },
  ];

  /**
   * Get image URL based on category name
   * First checks database, if no image found, uses fallback images
   */
  const getImageForCategory = (categoryName: string): string => {
    if (!categoryName) {
      return 'https://cdn.britannica.com/63/186963-138-AEE87658/vegetables.jpg';
    }

    const lowerName = categoryName.toLowerCase().trim();

    // Direct match
    if (categoryImageDatabase[lowerName]) {
      return categoryImageDatabase[lowerName];
    }

    // Partial match
    for (const [key, value] of Object.entries(categoryImageDatabase)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        return value;
      }
    }

    // Default fallback
    return 'https://cdn.britannica.com/63/186963-138-AEE87658/vegetables.jpg';
  };

  /**
   * Fetch categories from API
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      setUseFallback(false);

      console.log('🔍 Starting category fetch...');

      // Get traderId from AsyncStorage
      const traderId = await AsyncStorage.getItem('traderId');

      // Try different endpoints
      const endpoints = [
        'https://kisan.etpl.ai/category/all',
        'https://kisan.etpl.ai/category',
        'https://kisan.etpl.ai/api/categories',
      ];

      let response = null;
      let result = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🌐 Trying endpoint: ${endpoint}`);
          
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(traderId && { 'Authorization': `Bearer ${traderId}` })
            },
          });

          if (response.ok) {
            result = await response.json();
            console.log(`✅ Success with endpoint: ${endpoint}`);
            break;
          }
        } catch (err: any) {
          console.log(`❌ Failed with endpoint: ${endpoint}`);
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error('Failed to fetch categories');
      }

      // Extract categories from response
      let categoriesData = [];

      if (result?.data && Array.isArray(result.data)) {
        categoriesData = result.data;
      } else if (result?.categories && Array.isArray(result.categories)) {
        categoriesData = result.categories;
      } else if (Array.isArray(result)) {
        categoriesData = result;
      }

      console.log(`📋 Found ${categoriesData.length} categories from API`);

      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        // Map categories with images
        const mappedCategories = categoriesData.map((cat: any, index: number) => {
          const categoryName = cat.categoryName || cat.name || cat.title || `Category ${index + 1}`;
          const categoryId = cat._id || cat.id || `cat-${index}`;
          
          // Get image from database mapping
          const imageUrl = getImageForCategory(categoryName);

          console.log(`📸 ${categoryName} -> ${imageUrl.substring(0, 50)}...`);

          return {
            id: categoryId,
            img: imageUrl,
            title: categoryName,
            link: "/(traderscreen)/Allcrops",
            description: cat.description || '',
            status: cat.status || 'active'
          };
        });

        console.log('✅ Successfully mapped all categories with images');
        setCategories(mappedCategories);
      } else {
        console.log('⚠️ No categories found, using fallback');
        setCategories(fallbackCategories);
        setUseFallback(true);
      }
    } catch (err: any) {
      console.error('❌ Error:', err.message);
      setError(err.message || 'Failed to load categories');
      setCategories(fallbackCategories);
      setUseFallback(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle category press
   */
  const handleCategoryPress = (categoryTitle: string) => {
    router.push({
      pathname: "/(traderscreen)/Allcrops",
      params: {
        selectedCategory: categoryTitle,
        filterType: 'category'
      }
    });
  };

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
      <KisanHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
            tintColor="#4CAF50"
          />
        }
      >
        {/* POST REQUIRED SECTION */}
        <View className="px-6 mt-2">
          <Text className="text-lg font-medium text-gray-700 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {postRequired.map((item, i) => (
              <TouchableOpacity
                key={i}
                className="bg-white w-28 h-28 rounded-lg mb-4 border border-gray-100 justify-center items-center shadow-sm"
                activeOpacity={0.8}
                onPress={() => router.push(item.link as any)}
              >
                <View className="mb-3 p-3 rounded-full bg-green-50">
                  {item.icon}
                </View>
                <Text className="text-center text-sm font-medium text-gray-600">
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SLIDER SECTION */}
        <View className="mt-6">
          <View className="px-6 mb-3">
            <Text className="text-lg font-medium text-gray-700">Featured Products</Text>
          </View>

          <FlatList
            data={staticSlider}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => renderSliderItem({
              item,
              onPress: () => router.push("/(traderscreen)/Allcrops")
            })}
            snapToInterval={272}
            decelerationRate="fast"
          />
        </View>

        {/* CATEGORIES SECTION */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-medium text-gray-700 mb-4">
            Explore Category
          </Text>

          {useFallback && (
            <View className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Text className="text-blue-800 text-sm font-medium">
                ℹ️ Images loaded from local database
              </Text>
            </View>
          )}

          {loading && !refreshing && (
            <View className="py-10">
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text className="text-center text-gray-500 mt-2">Loading categories...</Text>
            </View>
          )}

          {error && !loading && (
            <View className="py-10 items-center">
              <Text className="text-red-500 text-center mb-2 font-medium">Error</Text>
              <Text className="text-red-400 text-xs text-center mb-4">{error}</Text>
              <TouchableOpacity
                onPress={fetchCategories}
                className="bg-green-500 px-6 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* CATEGORIES LIST */}
        {(!loading || useFallback) && (
          <>
            <FlatList
              data={categories.length > 0 ? categories : fallbackCategories}
              numColumns={2}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderCategoryItem({
                item,
                onPress: () => handleCategoryPress(item.title)
              })}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ListEmptyComponent={
                <View className="py-10 items-center">
                  <Text className="text-gray-500">No categories available</Text>
                </View>
              }
            />

            <View style={{ marginBottom: 100 }} className="flex-row p-3 justify-center items-center">
              <TouchableOpacity
                onPress={() => router.push("/(traderscreen)/Allcrops")}
                className="bg-green-500 p-2 px-5 border border-green-600 rounded-lg shadow-xl"
              >
                <Text className="text-white font-medium">View all crops</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;