// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   ScrollView,
// } from "react-native";
// import axios from "axios";
// import { useRouter } from "expo-router";
// import { ChevronLeft } from 'lucide-react-native';
// import { SafeAreaView } from "react-native-safe-area-context";

// interface Category {
//   _id: string;
//   categoryId: string;
//   categoryName: string;
//   image: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
//   image: string;
// }

// const CategorySelectionPage: React.FC = () => {
//   const router = useRouter();

//   const [step, setStep] = useState<number>(1);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     const res = await axios.get("https://kisan.etpl.ai/category/all");
//     setCategories(res.data.data);
//   };

//   const fetchSubCategories = async (categoryId: string) => {
//     const res = await axios.get(
//       `https://kisan.etpl.ai/subcategory/category/${categoryId}`
//     );
//     setSubCategories(res.data.data);
//   };

//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedCategory(categoryId);
//     setSelectedSubCategory("");
//     fetchSubCategories(categoryId);
//     setStep(2);
//   };

//   const handleProceed = () => {
//     router.push({
//       pathname: "/(farmerscreen)/productsales",
//       params: {
//         categoryId: selectedCategory,
//         subCategoryId: selectedSubCategory,
//       },
//     });
//   };
// console.log("selectedCategory",selectedCategory)
// console.log("selectedSubCategory",selectedSubCategory)
//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath) return "https://via.placeholder.com/100";
//     return `https://kisan.etpl.ai/uploads/${imagePath.replace(
//       /^uploads[\/\\]/,
//       ""
//     )}`;
//   };

//   const handleBackPress = () => {
//     if (step === 1) {
//       // If on category selection page, go back to home
//       router.push("/(farmer)/home");
//     } else if (step === 2) {
//       // If on sub-category page, go back to category selection
//       setStep(1);
//       setSelectedSubCategory("");
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <View className="flex-row items-center bg-white">
//         <TouchableOpacity
//           onPress={handleBackPress}
//           className="p-2"
//         >
//           <ChevronLeft size={24} color="#374151" />
//         </TouchableOpacity>
//         <Text className="ml-3 text-xl font-medium text-gray-900">
//           {step === 1 ? "Select Category" : "Select Sub-Category"}
//         </Text>
//       </View>
      
//       <ScrollView 
//         className="flex-1 bg-white"
//         contentContainerStyle={{ padding: 20 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* 🔹 STEP 1 – CATEGORY */}
//         {step === 1 && (
//           <View className="flex-1">
//             <FlatList
//               data={categories}
//               keyExtractor={(item) => item._id}
//               numColumns={2}
//               scrollEnabled={false}
//               columnWrapperStyle={{ gap: 15, marginBottom: 15 }}
//               contentContainerStyle={{ paddingBottom: 20 }}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className="flex-1 border border-gray-200 rounded-lg p-2.5 items-center"
//                   onPress={() => handleCategorySelect(item._id)}
//                 >
//                   <Image
//                     source={{ uri: getImageUrl(item.image) }}
//                     className="w-full h-20 rounded-lg mb-1.5"
//                   />
//                   <Text className="text-sm text-center font-medium">{item.categoryName}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         )}

//         {/* 🔹 STEP 2 – SUB CATEGORY */}
//         {step === 2 && (
//           <View className="flex-1">
        

//             <FlatList
//               data={subCategories}
//               keyExtractor={(item) => item._id}
//               numColumns={3}
//               scrollEnabled={false}
//               columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
//               contentContainerStyle={{ paddingBottom: 20 }}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className={`flex-1 border border-gray-200 rounded-lg p-2.5 items-center ${
//                     selectedSubCategory === item._id ? 'border-green-300 border' : ''
//                   }`}
//                   onPress={() => setSelectedSubCategory(item._id)}
//                 >
//                   <Image
//                     source={{ uri: getImageUrl(item.image) }}
//                     className="w-full h-20 rounded-lg mb-1.5"
//                   />
//                   <Text className="text-xs text-center font-medium">{item.subCategoryName}</Text>
//                 </TouchableOpacity>
//               )}
//             />

//             <TouchableOpacity
//               disabled={!selectedSubCategory}
//               onPress={handleProceed}
//               className={`mt-5 p-3.5 rounded-md items-center ${!selectedSubCategory ? 'bg-gray-300' : 'bg-green-500'}`}
//             >
//               <Text className="text-white text-base font-medium">Proceed to Sell Product</Text>
//             </TouchableOpacity>

            
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default CategorySelectionPage;











// import axios from "axios";
// import { useRouter } from "expo-router";
// import { ChevronLeft } from 'lucide-react-native';
// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   Image,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// interface Category {
//   _id: string;
//   categoryId: string;
//   categoryName: string;
//   image: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
//   image: string;
// }

// const CategorySelectionPage: React.FC = () => {
//   const router = useRouter();

//   const [step, setStep] = useState<number>(1);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     const res = await axios.get("https://kisan.etpl.ai/category/all");
//     setCategories(res.data.data);
//   };

//   const fetchSubCategories = async (categoryId: string) => {
//     const res = await axios.get(
//       `https://kisan.etpl.ai/subcategory/category/${categoryId}`
//     );
//     setSubCategories(res.data.data);
//   };

//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedCategory(categoryId);
//     setSelectedSubCategory("");
//     fetchSubCategories(categoryId);
//     setStep(2);
//   };

//   const handleProceed = () => {
//     router.push({
//       pathname: "/(farmerscreen)/productsales",
//       params: {
//         categoryId: selectedCategory,
//         subCategoryId: selectedSubCategory,
//       },
//     });
//   };
//   const handleAddNewCrop = () => {
//     router.push({
//       pathname: "/(farmerscreen)/AddNewCrop",
//       params: {
//         categoryId: selectedCategory,
//         subCategoryId: selectedSubCategory,
//       },
//     });// 🔁 replace this path with your link later
// };

// console.log("selectedCategory",selectedCategory)
// console.log("selectedSubCategory",selectedSubCategory)
//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath) return "https://via.placeholder.com/100";
//     return `https://kisan.etpl.ai/uploads/${imagePath.replace(
//       /^uploads[\/\\]/,
//       ""
//     )}`;
//   };

//   const handleBackPress = () => {
//     if (step === 1) {
//       // If on category selection page, go back to home
//       router.push("/(farmer)/home");
//     } else if (step === 2) {
//       // If on sub-category page, go back to category selection
//       setStep(1);
//       setSelectedSubCategory("");
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <View className="flex-row items-center bg-white">
//         <TouchableOpacity
//           onPress={handleBackPress}
//           className="p-2"
//         >
//           <ChevronLeft size={24} color="#374151" />
//         </TouchableOpacity>
//         <Text className="ml-3 text-xl font-medium text-gray-900">
//           {step === 1 ? "Select Category" : "Select Sub-Category"}
//         </Text>
//       </View>
      
//       <ScrollView 
//         className="flex-1 bg-white"
//         contentContainerStyle={{ padding: 20 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* 🔹 STEP 1 – CATEGORY */}
//         {step === 1 && (
//           <View className="flex-1">
//             <FlatList
//               data={categories}
//               keyExtractor={(item) => item._id}
//               numColumns={2}
//               scrollEnabled={false}
//               columnWrapperStyle={{ gap: 15, marginBottom: 15 }}
//               contentContainerStyle={{ paddingBottom: 20 }}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className="flex-1 border border-gray-200 rounded-lg p-2.5 items-center"
//                   onPress={() => handleCategorySelect(item._id)}
//                 >
//                   <Image
//                     source={{ uri: getImageUrl(item.image) }}
//                     className="w-full h-20 rounded-lg mb-1.5"
//                     resizeMode="contain"
//                   />
//                   <Text className="text-sm text-center font-medium">{item.categoryName}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         )}

//         {/* 🔹 STEP 2 – SUB CATEGORY */}
//         {step === 2 && (
//           <View className="flex-1">
        

//             <FlatList
//               data={subCategories}
//               keyExtractor={(item) => item._id}
//               numColumns={3}
//               scrollEnabled={false}
//               columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
//               contentContainerStyle={{ paddingBottom: 20 }}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className={`flex-1 border border-gray-200 rounded-lg p-2.5 items-center ${
//                     selectedSubCategory === item._id ? 'border-green-300 border' : ''
//                   }`}
//                   onPress={() => setSelectedSubCategory(item._id)}
//                 >
//                   <Image
//                     source={{ uri: getImageUrl(item.image) }}
//                     className="w-full h-20 rounded-lg mb-1.5"
//                     resizeMode="contain"
//                   />
//                   <Text className="text-xs text-center font-medium">{item.subCategoryName}</Text>
//                 </TouchableOpacity>
//               )}
//             />

//             <TouchableOpacity
//               disabled={!selectedSubCategory}
//               onPress={handleProceed}
//               className={`mt-5 p-3.5 rounded-md items-center ${!selectedSubCategory ? 'bg-gray-300' : 'bg-green-500'}`}
//             >
//               <Text className="text-white text-base font-medium">Proceed to Sell Product</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//   onPress={handleAddNewCrop}
//   className="mt-3 p-3.5 rounded-md items-center border border-green-500"
// >
//   <Text className="text-green-600 text-base font-medium">
//     Add New Crop
//   </Text>
// </TouchableOpacity>

//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default CategorySelectionPage;


import axios from "axios";
import { useRouter } from "expo-router";
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const handleSellProduct = () => {
    router.push({
      pathname: "/(farmerscreen)/productsales",
      params: {
        categoryId: selectedCategory,
        subCategoryId: selectedSubCategory,
      },
    });
  };

  const handleAddNewCrop = () => {
    router.push({
      pathname: "/(farmerscreen)/AddNewCrop",
      params: {
        categoryId: selectedCategory,
        subCategoryId: selectedSubCategory,
      },
    });
  };

  console.log("selectedCategory", selectedCategory);
  console.log("selectedSubCategory", selectedSubCategory);

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
    } else if (step === 3) {
      // If on action page, go back to sub-category selection
      setStep(2);
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
          {step === 1 ? "Select Category" : step === 2 ? "Select Sub-Category" : "Choose Action"}
        </Text>
      </View>
      
      <ScrollView 
        className="flex-1 bg-white"
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
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
                    resizeMode="cover"
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
                  onPress={() => {
                    setSelectedSubCategory(item._id);
                    setStep(3);
                  }}
                >
                  <Image
                    source={{ uri: getImageUrl(item.image) }}
                    className="w-full h-20 rounded-lg mb-1.5"
                    resizeMode="contain"
                  />
                  <Text className="text-xs text-center font-medium">{item.subCategoryName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* 🔹 STEP 3 – ACTION BUTTONS */}
        {step === 3 && (
          <View className="flex-1 flex-col justify-center items-center px-5">
            <Text className="font-heading text-3xl text-green-700">Welcome, Farmer!</Text>
            <Text className="text-xs font-medium text-gray-900 mb-8 text-center">
              What would you like to do today?
            </Text>

            <TouchableOpacity
              onPress={handleSellProduct}
              className="w-full bg-yellow-400 p-4 rounded-lg items-center mb-4"
            >
              <Text className="text-white text-lg font-medium">Sell Product</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddNewCrop}
              className="w-full border border-green-500 p-4 rounded-lg items-center"
            >
              <Text className="text-green-600 text-lg font-medium">Add New Crop</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategorySelectionPage;