// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   Alert,
// // //   Modal,
// // // } from "react-native";
// // // import axios from "axios";
// // // import { CropIcon, Check, ShoppingCart, LogOut,ChevronLeft } from "lucide-react-native";
// // // import { router } from "expo-router";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { SafeAreaView } from "react-native-safe-area-context";

// // // /* ===================== INTERFACES ===================== */

// // // interface Category {
// // //   _id: string;
// // //   name: string;
// // //   image?: string;
// // //   status: "active" | "inactive";
// // //   createdAt: string;
// // //   updatedAt: string;
// // // }

// // // interface SubCategory {
// // //   _id: string;
// // //   name: string;
// // //   image?: string;
// // //   categoryId: string | { _id: string; name: string };
// // //   status: "active" | "inactive";
// // //   createdAt: string;
// // //   updatedAt: string;
// // // }

// // // interface TargetPestDisease {
// // //   name: string;
// // //   image?: string;
// // // }

// // // interface RecommendedSeed {
// // //   _id?: string;
// // //   name: string;
// // //   image?: string;
// // //   price: number;
// // // }

// // // interface Product {
// // //   _id: string;
// // //   name: string;
// // //   subCategoryId:
// // //     | string
// // //     | { _id: string; name: string; categoryId: { _id: string; name: string } };
// // //   targetPestsDiseases: TargetPestDisease[];
// // //   recommendedSeeds: RecommendedSeed[];
// // //   status: "active" | "inactive";
// // //   createdAt: string;
// // //   updatedAt: string;
// // // }

// // // interface User {
// // //   _id: string;
// // //   personalInfo: { name: string; mobileNo: string };
// // //   role: string;
// // //   farmerId?: string;
// // // }

// // // interface CartItem {
// // //   productId: string;
// // //   productName: string;
// // //   seedId?: string;
// // //   seedName: string;
// // //   seedPrice: number;
// // //   quantity: number;
// // //   image?: string;
// // // }

// // // /* ===================== COMPONENT ===================== */

// // // export default function Cropcare() {
// // //   // State
// // //   const [categories, setCategories] = useState<Category[]>([]);
// // //   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
// // //   const [products, setProducts] = useState<Product[]>([]);
// // //   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
// // //   const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
// // //     null
// // //   );
// // //   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
// // //   const [cartItems, setCartItems] = useState<CartItem[]>([]);
// // //   const [user, setUser] = useState<User | null>(null);
// // //   const [showLoginModal, setShowLoginModal] = useState(false);
// // //   const [isLoadingUser, setIsLoadingUser] = useState(true);

// // //   // Loading states
// // //   const [loading, setLoading] = useState({
// // //     categories: false,
// // //     subCategories: false,
// // //     products: false,
// // //     cart: false,
// // //   });

// // //   // API URLs
// // //   const CROPCARE_API = "https://kisanadmin.etpl.ai/api/cropcare";
// // //   const CART_API = "https://kisan.etpl.ai/api";

// // //   /* ===================== AUTH ===================== */

// // //   useEffect(() => {
// // //     checkUserAuth();
// // //   }, []);

// // //   const checkUserAuth = async () => {
// // //     setIsLoadingUser(true);
// // //     try {
// // //       // Check all required authentication items
// // //       const [userData, role, userId, farmerId] = await Promise.all([
// // //         AsyncStorage.getItem("userData"),
// // //         AsyncStorage.getItem("userRole"),
// // //         AsyncStorage.getItem("userId"),
// // //         AsyncStorage.getItem("farmerId"),
// // //       ]);

// // //       console.log("Auth check:", { userData, role, userId, farmerId });

// // //       if (userData && role && userId) {
// // //         const parsed = JSON.parse(userData);
// // //         const userObj: User = {
// // //           _id: userId,
// // //           role,
// // //           personalInfo: {
// // //             name: parsed.personalInfo?.name || parsed.name || "User",
// // //             mobileNo: parsed.personalInfo?.mobileNo || parsed.mobileNo || "",
// // //           },
// // //         };

// // //         // Add farmerId if available
// // //         if (farmerId) {
// // //           userObj.farmerId = farmerId;
// // //         }

// // //         setUser(userObj);
// // //         console.log("User authenticated:", userObj);
// // //       } else {
// // //         console.log("User not authenticated, showing login modal");
// // //         setShowLoginModal(true);
// // //         setUser(null);
// // //       }
// // //     } catch (err) {
// // //       console.error("Auth check error:", err);
// // //       setShowLoginModal(true);
// // //       setUser(null);
// // //     } finally {
// // //       setIsLoadingUser(false);
// // //     }
// // //   };

// // //   const handleLogin = () => {
// // //     setShowLoginModal(false);
// // //     router.push("/(auth)/Login?role=farmer");
// // //   };

// // //   const handleLogout = async () => {
// // //     try {
// // //       await AsyncStorage.clear();
// // //       setUser(null);
// // //       setCartItems([]);
// // //       setShowLoginModal(true);
// // //       showAppAlert("Logged out", "You have been logged out successfully");
// // //     } catch (err) {
// // //       console.error("Logout error:", err);
// // //     }
// // //   };

// // //   /* ===================== FETCH DATA ===================== */

// // //   useEffect(() => {
// // //     if (user) {
// // //       fetchCategories();
// // //       fetchSubCategories();
// // //       fetchUserCart();
// // //     }
// // //   }, [user]);

// // //   const fetchCategories = async () => {
// // //     if (!user) return;
    
// // //     setLoading((prev) => ({ ...prev, categories: true }));
// // //     try {
// // //       const res = await axios.get(`${CROPCARE_API}/categories`);
// // //       if (res.data.success) {
// // //         const activeCategories = res.data.data.filter(
// // //           (c: Category) => c.status === "active"
// // //         );
// // //         setCategories(activeCategories);

// // //         // Auto-select first category
// // //         if (activeCategories.length > 0 && !selectedCategory) {
// // //           setSelectedCategory(activeCategories[0]._id);
// // //         }
// // //       }
// // //     } catch (err) {
// // //       console.error("Error fetching categories:", err);
// // //       showAppAlert("Error", "Failed to load categories");
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, categories: false }));
// // //     }
// // //   };

// // //   const fetchSubCategories = async () => {
// // //     if (!user) return;
    
// // //     setLoading((prev) => ({ ...prev, subCategories: true }));
// // //     try {
// // //       const res = await axios.get(`${CROPCARE_API}/subcategories`);
// // //       if (res.data.success) {
// // //         setSubCategories(
// // //           res.data.data.filter((s: SubCategory) => s.status === "active")
// // //         );
// // //       }
// // //     } catch (err) {
// // //       console.error("Error fetching subcategories:", err);
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, subCategories: false }));
// // //     }
// // //   };

// // //   const fetchProducts = async (subId: string) => {
// // //     if (!user) return;
    
// // //     setLoading((prev) => ({ ...prev, products: true }));
// // //     try {
// // //       const res = await axios.get(`${CROPCARE_API}/products`);
// // //       if (res.data.success) {
// // //         // Handle both string and object subCategoryId
// // //         const filteredProducts = res.data.data.filter((p: Product) => {
// // //           const productSubCatId =
// // //             typeof p.subCategoryId === "string"
// // //               ? p.subCategoryId
// // //               : p.subCategoryId._id;
// // //           return productSubCatId === subId && p.status === "active";
// // //         });

// // //         console.log("Filtered products:", filteredProducts.length);
// // //         setProducts(filteredProducts);
// // //       }
// // //     } catch (err) {
// // //       console.error("Error fetching products:", err);
// // //       showAppAlert("Error", "Failed to load products");
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, products: false }));
// // //     }
// // //   };

// // //   /* ===================== CART ===================== */

// // //   const fetchUserCart = async () => {
// // //     if (!user) return;

// // //     setLoading((prev) => ({ ...prev, cart: true }));
// // //     try {
// // //       // Use farmerId if available, otherwise use userId
// // //       const idToUse = user.farmerId || user._id;
// // //       const res = await axios.get(`${CART_API}/cropcare/cart/${idToUse}`);
// // //       if (res.data.success) {
// // //         setCartItems(res.data.data.items || []);
// // //       }
// // //     } catch (err) {
// // //       console.error("Error fetching cart:", err);
// // //       setCartItems([]);
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, cart: false }));
// // //     }
// // //   };

// // //   const addToCart = async (product: Product, seed: RecommendedSeed) => {
// // //     if (!user) {
// // //       setShowLoginModal(true);
// // //       return;
// // //     }

// // //     setLoading((prev) => ({ ...prev, cart: true }));
// // //     try {
// // //       const cartItem = {
// // //         productId: product._id,
// // //         productName: product.name,
// // //         seedId: seed._id || seed.name,
// // //         seedName: seed.name,
// // //         seedPrice: seed.price,
// // //         quantity: 1,
// // //         image: seed.image,
// // //       };

// // //       // Use farmerId if available, otherwise use userId
// // //       const idToUse = user.farmerId || user._id;
      
// // //       const res = await axios.post(`${CART_API}/cropcare/cart/add`, {
// // //         userId: idToUse,
// // //         item: cartItem,
// // //       });

// // //       if (res.data.success) {
// // //         setCartItems(res.data.data.items);
// // //         showAppAlert("Success", `${seed.name} added to cart!`);
// // //       }
// // //     } catch (err: any) {
// // //       console.error("Error adding to cart:", err);
// // //       showAppAlert(
// // //         "Error",
// // //         err.response?.data?.message || "Failed to add to cart"
// // //       );
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, cart: false }));
// // //     }
// // //   };

// // //   const isSeedInCart = (seedName: string): boolean => {
// // //     return cartItems.some((item) => item.seedName === seedName);
// // //   };

// // //   const getSeedCartQuantity = (seedName: string): number => {
// // //     const item = cartItems.find((item) => item.seedName === seedName);
// // //     return item ? item.quantity : 0;
// // //   };

// // //   /* ===================== FILTERING ===================== */

// // //   const getFilteredSubCategories = () => {
// // //     if (!selectedCategory) return [];
// // //     return subCategories.filter((sub) => {
// // //       const catId =
// // //         typeof sub.categoryId === "string"
// // //           ? sub.categoryId
// // //           : sub.categoryId._id;
// // //       return catId === selectedCategory;
// // //     });
// // //   };

// // //   /* ===================== HANDLERS ===================== */

// // //   const handleCategorySelect = (catId: string) => {
// // //     if (!user) {
// // //       setShowLoginModal(true);
// // //       return;
// // //     }
// // //     setSelectedCategory(catId);
// // //     setSelectedSubCategory(null);
// // //     setSelectedProduct(null);
// // //     setProducts([]);
// // //   };

// // //   const handleSubCategorySelect = (subId: string) => {
// // //     if (!user) {
// // //       setShowLoginModal(true);
// // //       return;
// // //     }
// // //     setSelectedSubCategory(subId);
// // //     setSelectedProduct(null);
// // //     fetchProducts(subId);
// // //   };

// // //   /* ===================== RENDER ===================== */

// // //   if (isLoadingUser) {
// // //     return (
// // //       <SafeAreaView className="flex-1 bg-gray-50">
// // //         <View className="flex-1 justify-center items-center">
// // //           <ActivityIndicator size="large" color="#2c5f2d" />
// // //           <Text className="mt-4 text-base text-gray-600">Checking authentication...</Text>
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView className="flex-1 bg-gray-50">
// // //       {/* HEADER */}
// // // <View className="rounded-b-3xl px-4 py-2 border-b border-gray-200">
// // //   <View className="flex-row items-center justify-start">
// // //     <TouchableOpacity
// // //       onPress={() => router.push('/(farmer)/home')}
// // //       className="p-2"
// // //     >
// // //       <ChevronLeft size={24} color="#374151" />
// // //     </TouchableOpacity>
    
// // //     {/* Add icon before the text */}
// // //     <View className="ml-2 flex-row items-center">
// // //       <Text className="text-2xl font-medium text-black ml-2">Crop Care</Text>
// // //     </View>
// // //   </View>

// // //   {user ? (
// // //     <View className="flex-row items-center justify-between mt-2">
// // //       <Text className="font-medium text-black">
// // //         Welcome, {user.personalInfo.name}
// // //       </Text>

// // //       <View className="flex-row items-center">
// // //         <TouchableOpacity
// // //           onPress={handleLogout}
// // //           className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full mr-3"
// // //         >
// // //           <LogOut size={14} color="#920505ff" />
// // //           <Text className="text-black font-medium ml-1 font-medium">Logout</Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           onPress={() => router.push("/(farmerscreen)/cropcarecart")}
// // //           className="bg-emerald-50 p-3 rounded-full relative"
// // //         >
// // //           <ShoppingCart size={22} color="#015e2fff" />
// // //           {cartItems.length > 0 && (
// // //             <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center">
// // //               <Text className="text-black text-xs font-medium">
// // //                 {cartItems.length}
// // //               </Text>
// // //             </View>
// // //           )}
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   ) : (
// // //     <Text className="font-medium text-green-100 mt-1">
// // //       Please login to continue
// // //     </Text>
// // //   )}
// // // </View>

// // // <ScrollView
// // //   className="flex-1 px-4"
// // //   contentContainerStyle={{ paddingBottom: 40 }}
// // //   showsVerticalScrollIndicator={false}
// // // >
// // //   <View className="mt-6">
// // //   <Text className="text-lg font-medium text-gray-800 mb-3">
// // //     Categories
// // //   </Text>

// // //   {loading.categories ? (
// // //     <ActivityIndicator color="#2c5f2d" />
// // //   ) : categories.length === 0 ? (
// // //     <Text className="font-medium text-gray-500">No categories available</Text>
// // //   ) : (
// // //     categories.map((cat) => {
// // //       const isSelected = selectedCategory === cat._id;

// // //       return (
// // //         <TouchableOpacity
// // //           key={cat._id}
// // //           onPress={() => handleCategorySelect(cat._id)}
// // //           className={`
// // //             bg-white rounded-2xl px-4 py-4 mb-2
// // //             flex-row items-center justify-between
// // //             shadow-sm
// // //             ${isSelected
// // //               ? "border-2 border-green-700 bg-green-50"
// // //               : "border border-gray-100"}
// // //           `}
// // //         >
// // //           <Text className="text-base font-medium text-gray-800">
// // //             {cat.name}
// // //           </Text>

// // //           {isSelected && <Check size={18} color="#2c5f2d" />}
// // //         </TouchableOpacity>
// // //       );
// // //     })
// // //   )}
// // // </View>

// // // {selectedCategory && (
// // //   <View className="mt-6">
// // //     <Text className="text-lg font-medium text-gray-800 mb-3">
// // //       Subcategories
// // //     </Text>

// // //     {loading.subCategories ? (
// // //       <ActivityIndicator color="#2c5f2d" />
// // //     ) : getFilteredSubCategories().length === 0 ? (
// // //       <Text className="font-medium text-gray-500">
// // //         No subcategories available
// // //       </Text>
// // //     ) : (
// // //       getFilteredSubCategories().map((sub) => {
// // //         const isSelected = selectedSubCategory === sub._id;

// // //         return (
// // //           <TouchableOpacity
// // //             key={sub._id}
// // //             onPress={() => handleSubCategorySelect(sub._id)}
// // //             className={`
// // //               bg-white rounded-2xl px-4 py-4 mb-2
// // //               flex-row items-center justify-between
// // //               shadow-sm
// // //               ${isSelected
// // //                 ? "border-2 border-green-700 bg-green-50"
// // //                 : "border border-gray-100"}
// // //             `}
// // //           >
// // //             <Text className="text-base font-medium text-gray-800">
// // //               {sub.name}
// // //             </Text>

// // //             {isSelected && <Check size={18} color="#2c5f2d" />}
// // //           </TouchableOpacity>
// // //         );
// // //       })
// // //     )}
// // //   </View>
// // // )}

// // // {selectedSubCategory && (
// // //   <View className="mt-6">
// // //     <Text className="text-lg font-medium text-gray-800 mb-3">
// // //       Products
// // //     </Text>

// // //     {loading.products ? (
// // //       <ActivityIndicator color="#2c5f2d" />
// // //     ) : products.length === 0 ? (
// // //       <Text className="font-medium text-gray-500">
// // //         No products available
// // //       </Text>
// // //     ) : (
// // //       products.map((product) => (
// // //         <View
// // //           key={product._id}
// // //           className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
// // //         >
// // //           {/* Header */}
// // //           <View className="flex-row justify-between items-center">
// // //             <Text className="text-base font-semibold text-gray-800 flex-1">
// // //               {product.name}
// // //             </Text>

// // //             <TouchableOpacity
// // //               onPress={() =>
// // //                 setSelectedProduct(
// // //                   selectedProduct?._id === product._id
// // //                     ? null
// // //                     : product
// // //                 )
// // //               }
// // //             >
// // //               <Text className="font-medium text-green-700 font-medium">
// // //                 {selectedProduct?._id === product._id ? "Hide" : "Details"}
// // //               </Text>
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Expanded details */}
// // //           {selectedProduct?._id === product._id && (
// // //             <View className="mt-3 bg-gray-50 rounded-xl p-3">
// // //               <Text className="text-xs font-semibold text-gray-500 mb-2">
// // //                 Target Pests / Diseases
// // //               </Text>

// // //               {product.targetPestsDiseases.map((pest, i) => (
// // //                 <Text key={i} className="font-medium text-gray-600 ml-1">
// // //                   • {pest.name}
// // //                 </Text>
// // //               ))}
// // //             </View>
// // //           )}

// // //           {/* Seeds */}
// // //           <View className="mt-4">
// // //             <Text className="text-xs font-semibold text-gray-500 mb-2">
// // //               Available Seeds
// // //             </Text>

// // //             {product.recommendedSeeds.map((seed, i) => (
// // //               <View
// // //                 key={i}
// // //                 className="flex-row justify-between items-center bg-green-50 p-3 rounded-xl mb-2"
// // //               >
// // //                 <View>
// // //                   <Text className="font-medium font-semibold text-gray-800">
// // //                     {seed.name}
// // //                   </Text>
// // //                   <Text className="font-medium text-green-700 font-medium">
// // //                     ₹{seed.price.toFixed(2)}
// // //                   </Text>
// // //                 </View>

// // //                 <TouchableOpacity
// // //                   className={`px-4 py-2 rounded-lg ${
// // //                     isSeedInCart(seed.name)
// // //                       ? "bg-green-600"
// // //                       : "bg-green-800"
// // //                   }`}
// // //                   onPress={() => addToCart(product, seed)}
// // //                 >
// // //                   <Text className="text-black text-xs font-semibold">
// // //                     {isSeedInCart(seed.name)
// // //                       ? `Added (${getSeedCartQuantity(seed.name)})`
// // //                       : "Add"}
// // //                   </Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             ))}
// // //           </View>
// // //         </View>
// // //       ))
// // //     )}
// // //   </View>
// // // )}


// // // </ScrollView>

// // //     </SafeAreaView>
// // //   );
// // // }



// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import axios from "axios";
// // // import { router, useNavigation } from "expo-router";
// // // import {
// // //   ArrowLeft,
// // //   Check,
// // //   ChevronRight,
// // //   Leaf,
// // //   LogOut,
// // //   ShoppingCart
// // // } from "lucide-react-native";
// // // import { useEffect, useState } from "react";
// // // import {
// // //   ActivityIndicator,
// // //   Alert,
// // //   Dimensions,
// // //   FlatList,
// // //   Image,
// // //   LayoutAnimation,
// // //   Modal,
// // //   Platform,
// // //   Text,
// // //   TouchableOpacity,
// // //   UIManager,
// // //   View,
// // // } from "react-native";
// // // import { SafeAreaView } from "react-native-safe-area-context";
// // // import CustomAlert from "@/components/CustomAlert";

// // // // Enable LayoutAnimation for Android
// // // if (Platform.OS === 'android') {
// // //   if (UIManager.setLayoutAnimationEnabledExperimental) {
// // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // //   }
// // // }

// // // /* ===================== INTERFACES ===================== */

// // // interface Category {
// // //   _id: string;
// // //   name: string;
// // //   image?: string;
// // //   status: "active" | "inactive";
// // //   createdAt: string;
// // //   updatedAt: string;
// // // }

// // // interface SubCategory {
// // //   _id: string;
// // //   name: string;
// // //   image?: string;
// // //   categoryId: string | { _id: string; name: string };
// // //   status: "active" | "inactive";
// // //   createdAt: string;
// // //   updatedAt: string;
// // // }

// // // interface TargetPestDisease {
// // //   name: string;
// // //   image?: string;
// // // }

// // // interface RecommendedSeed {
// // //   _id?: string;
// // //   name: string;
// // //   image?: string;
// // //   price: number;
// // // }

// // // interface Product {
// // //   _id: string;
// // //   name: string;
// // //   subCategoryId:
// // //   | string
// // //   | { _id: string; name: string; categoryId: { _id: string; name: string } };
// // //   targetPestsDiseases: TargetPestDisease[];
// // //   recommendedSeeds: RecommendedSeed[];
// // //   status: "active" | "inactive";
// // //   createdAt: string;
// // //   updatedAt: string;
// // //   image?: string;
// // // }

// // // interface User {
// // //   _id: string;
// // //   personalInfo: { name: string; mobileNo: string };
// // //   role: string;
// // //   farmerId?: string;
// // // }

// // // interface CartItem {
// // //   productId: string;
// // //   productName: string;
// // //   seedId?: string;
// // //   seedName: string;
// // //   seedPrice: number;
// // //   quantity: number;
// // //   image?: string;
// // // }

// // // /* ===================== CONSTANTS ===================== */

// // // const { width } = Dimensions.get("window");
// // // // Note: Card width calculation isn't strictly needed for flex-wrap but useful if we want exact sizing. 
// // // // Using w-[48%] with gap is a good Tailwind approach.

// // // type ViewState = "categories" | "subCategories" | "products";

// // // /* ===================== COMPONENT ===================== */

// // // export default function Cropcare() {
// // //   const navigation = useNavigation();

// // //   // Navigation State
// // //   const [viewState, setViewState] = useState<ViewState>("categories");
// // //   const [history, setHistory] = useState<ViewState[]>([]);

// // //   // Data State
// // //   const [categories, setCategories] = useState<Category[]>([]);
// // //   const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
// // //   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

// // //   // Selection State
// // //   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
// // //   const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
// // //   const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

// // //   // User & Cart State
// // //   const [cartItems, setCartItems] = useState<CartItem[]>([]);
// // //   const [user, setUser] = useState<User | null>(null);
// // //   const [showLoginModal, setShowLoginModal] = useState(false);
// // //   const [isLoadingUser, setIsLoadingUser] = useState(true);

// // //   const [showAlert, setShowAlert] = useState(false);
// // // const [alertTitle, setAlertTitle] = useState("");
// // // const [alertMessage, setAlertMessage] = useState("");
// // // const [alertAction, setAlertAction] = useState<null | (() => void)>(null);

// // // const showAppAlert = (title: string, message: string, action?: () => void) => {
// // //   setAlertTitle(title);
// // //   setAlertMessage(message);
// // //   setAlertAction(() => action || null);
// // //   setShowAlert(true);
// // // };


// // //   // Loading states
// // //   const [loading, setLoading] = useState({
// // //     categories: false,
// // //     subCategories: false,
// // //     products: false,
// // //     cart: false,
// // //   });

// // //   // API URLs
// // //   const CROPCARE_API = "https://kisanadmin.etpl.ai/api/cropcare";
// // //   const CART_API = "https://kisan.etpl.ai/api";

// // //   /* ===================== AUTH ===================== */

// // //   useEffect(() => {
// // //     checkUserAuth();
// // //   }, []);

// // //   const checkUserAuth = async () => {
// // //     setIsLoadingUser(true);
// // //     try {
// // //       const [userData, role, userId, farmerId] = await Promise.all([
// // //         AsyncStorage.getItem("userData"),
// // //         AsyncStorage.getItem("userRole"),
// // //         AsyncStorage.getItem("userId"),
// // //         AsyncStorage.getItem("farmerId"),
// // //       ]);

// // //       if (userData && role && userId) {
// // //         const parsed = JSON.parse(userData);
// // //         const userObj: User = {
// // //           _id: userId,
// // //           role,
// // //           personalInfo: {
// // //             name: parsed.personalInfo?.name || parsed.name || "User",
// // //             mobileNo: parsed.personalInfo?.mobileNo || parsed.mobileNo || "",
// // //           },
// // //         };
// // //         if (farmerId) userObj.farmerId = farmerId;
// // //         setUser(userObj);
// // //       } else {
// // //         setShowLoginModal(true);
// // //         setUser(null);
// // //       }
// // //     } catch (err) {
// // //       console.error("Auth check error:", err);
// // //       setShowLoginModal(true);
// // //       setUser(null);
// // //     } finally {
// // //       setIsLoadingUser(false);
// // //     }
// // //   };

// // //   const handleLogout = async () => {
// // //     try {
// // //       await AsyncStorage.clear();
// // //       setUser(null);
// // //       setCartItems([]);
// // //       setShowLoginModal(true);
// // //     } catch (err) {
// // //       console.error("Logout error:", err);
// // //     }
// // //   };

// // //   /* ===================== DATA FETCHING ===================== */

// // //   useEffect(() => {
// // //     if (user) {
// // //       fetchCategories();
// // //       fetchUserCart();
// // //     }
// // //   }, [user]);

// // //   const fetchCategories = async () => {
// // //     if (!user) return;
// // //     setLoading((prev) => ({ ...prev, categories: true }));
// // //     try {
// // //       const res = await axios.get(`${CROPCARE_API}/categories`);
// // //       if (res.data.success) {
// // //         const activeCategories = res.data.data.filter(
// // //           (c: Category) => c.status === "active"
// // //         );
// // //         setCategories(activeCategories);
// // //       }
// // //     } catch (err) {
// // //       showAppAlert("Error", "Failed to load categories");
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, categories: false }));
// // //     }
// // //   };

// // //   const fetchSubCategories = async (categoryId: string) => {
// // //     if (!user) return;
// // //     setLoading((prev) => ({ ...prev, subCategories: true }));
// // //     try {
// // //       const res = await axios.get(`${CROPCARE_API}/subcategories`);
// // //       if (res.data.success) {
// // //         const allSubs = res.data.data.filter((s: SubCategory) => s.status === "active");
// // //         const relevantSubs = allSubs.filter((sub: SubCategory) => {
// // //           const cId = typeof sub.categoryId === "string" ? sub.categoryId : sub.categoryId._id;
// // //           return cId === categoryId;
// // //         });
// // //         setFilteredSubCategories(relevantSubs);
// // //       }
// // //     } catch (err) {
// // //       console.error("Error fetching subcategories:", err);
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, subCategories: false }));
// // //     }
// // //   };

// // //   const fetchProducts = async (subId: string) => {
// // //     if (!user) return;
// // //     setLoading((prev) => ({ ...prev, products: true }));
// // //     try {
// // //       const res = await axios.get(`${CROPCARE_API}/products`);
// // //       if (res.data.success) {
// // //         const relevantProducts = res.data.data.filter((p: Product) => {
// // //           const sId = typeof p.subCategoryId === "string" ? p.subCategoryId : p.subCategoryId._id;
// // //           return sId === subId && p.status === "active";
// // //         });
// // //         setFilteredProducts(relevantProducts);
// // //       }
// // //     } catch (err) {
// // //       console.error("Error fetching products:", err);
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, products: false }));
// // //     }
// // //   };

// // //   const fetchUserCart = async () => {
// // //     if (!user) return;
// // //     setLoading((prev) => ({ ...prev, cart: true }));
// // //     try {
// // //       const idToUse = user.farmerId || user._id;
// // //       const res = await axios.get(`${CART_API}/cropcare/cart/${idToUse}`);
// // //       if (res.data.success) {
// // //         setCartItems(res.data.data.items || []);
// // //       }
// // //     } catch (err) {
// // //       setCartItems([]);
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, cart: false }));
// // //     }
// // //   };

// // //   /* ===================== CART OPERATIONS ===================== */

// // //   const addToCart = async (product: Product, seed: RecommendedSeed) => {
// // //     if (!user) {
// // //       setShowLoginModal(true);
// // //       return;
// // //     }

// // //     setLoading((prev) => ({ ...prev, cart: true }));
// // //     try {
// // //       const cartItem = {
// // //         productId: product._id,
// // //         productName: product.name,
// // //         seedId: seed._id || seed.name,
// // //         seedName: seed.name,
// // //         seedPrice: seed.price,
// // //         quantity: 1,
// // //         image: seed.image,
// // //       };

// // //       const idToUse = user.farmerId || user._id;
// // //       const res = await axios.post(`${CART_API}/cropcare/cart/add`, {
// // //         userId: idToUse,
// // //         item: cartItem,
// // //       });

// // //       if (res.data.success) {
// // //         setCartItems(res.data.data.items);
// // //         showAppAlert("Success", `${seed.name} added to cart!`);
// // //       }
// // //     } catch (err: any) {
// // //       showAppAlert("Error", err.response?.data?.message || "Failed to add to cart");
// // //     } finally {
// // //       setLoading((prev) => ({ ...prev, cart: false }));
// // //     }
// // //   };

// // //   const isSeedInCart = (seedName: string): boolean => {
// // //     return cartItems.some((item) => item.seedName === seedName);
// // //   };

// // //   /* ===================== NAVIGATION HANDLERS ===================== */

// // //   const navigateTo = (view: ViewState) => {
// // //     setHistory((prev) => [...prev, viewState]);
// // //     setViewState(view);
// // //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // //   };

// // //   const handleBack = () => {
// // //     if (history.length > 0) {
// // //       const prevView = history[history.length - 1];
// // //       setHistory((prev) => prev.slice(0, -1));
// // //       setViewState(prevView);
// // //       if (viewState === "subCategories") setSelectedCategory(null);
// // //       if (viewState === "products") setSelectedSubCategory(null);
// // //       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // //     } else {
// // //       router.back();
// // //     }
// // //   };

// // //   const onSelectCategory = (category: Category) => {
// // //     setSelectedCategory(category);
// // //     fetchSubCategories(category._id);
// // //     navigateTo("subCategories");
// // //   };

// // //   const onSelectSubCategory = (subCategory: SubCategory) => {
// // //     setSelectedSubCategory(subCategory);
// // //     fetchProducts(subCategory._id);
// // //     navigateTo("products");
// // //   };

// // //   /* ===================== RENDER HELPERS ===================== */

// // //   const renderHeader = () => (
// // //     <View className="bg-white px-5 py-4 shadow-sm elevation-4">
// // //       <View className="flex-row justify-between items-center">
// // //         <View className="flex-row items-center">
// // //           {viewState !== "categories" && (
// // //             <TouchableOpacity onPress={handleBack} className="mr-3 p-1">
// // //               <ArrowLeft size={24} color="#000000ff" />
// // //             </TouchableOpacity>
// // //           )}
// // //           <View>
// // //             <Text className="text-xl font-medium text-black">
// // //               {viewState === "categories"
// // //                 ? "Crop Care"
// // //                 : viewState === "subCategories"
// // //                   ? selectedCategory?.name
// // //                   : selectedSubCategory?.name}
// // //             </Text>
// // //             {user && (
// // //               <Text className="text-xs text-black/80">
// // //                 Hello, {user.personalInfo.name.split(" ")[0]}
// // //               </Text>
// // //             )}
// // //           </View>
// // //         </View>

// // //         <View className="flex-row items-center">
// // //           {user && (
// // //             <TouchableOpacity
// // //               className="mr-4 relative"
// // //               onPress={() => router.push("/(farmerscreen)/cropcarecart")}
// // //             >
// // //               <ShoppingCart size={24} color="#016c17ff" />
// // //               {cartItems.length > 0 && (
// // //                 <View className="absolute -top-2 -right-2 bg-[#FF5252] rounded-full w-[18px] h-[18px] items-center justify-center border-[1.5px] border-[#2c5f2d]">
// // //                   <Text className="text-white text-[9px] font-medium">{cartItems.length}</Text>
// // //                 </View>
// // //               )}
// // //             </TouchableOpacity>
// // //           )}

// // //         </View>
// // //       </View>
// // //     </View>
// // //   );

// // //   const renderCategoryCard = ({ item }: { item: Category }) => (
// // //     <TouchableOpacity
// // //       className="bg-white rounded-lg p-3 mb-4 elevation-[2] border border-black/5 flex-1 m-2"
// // //       onPress={() => onSelectCategory(item)}
// // //       activeOpacity={0.8}
// // //     >
// // //       <View className="w-full h-[100px] rounded-xl overflow-hidden mb-3 bg-gray-100 justify-center items-center">

// // //         <View className="w-full h-full bg-[#e8f5e9] justify-center items-center">
// // //           <Leaf size={32} color="#2c5f2d" />
// // //         </View>

// // //       </View>
// // //       <View className="flex-1">
// // //         <Text className="text-[15px] font-medium text-[#333] mb-1 leading-5" numberOfLines={2}>
// // //           {item.name}
// // //         </Text>
// // //         <View className="flex-row items-center mt-1">
// // //           <Text className="text-xs text-[#2c5f2d] font-medium mr-1">View Items</Text>
// // //           <ChevronRight size={16} color="#2c5f2d" />
// // //         </View>
// // //       </View>
// // //     </TouchableOpacity>
// // //   );

// // //   const renderSubCategoryCard = ({ item }: { item: SubCategory }) => (
// // //     <TouchableOpacity
// // //       className="bg-white rounded-lg p-3 mb-4 elevation-[2] border border-black/5 flex-1 m-2"
// // //       onPress={() => onSelectSubCategory(item)}
// // //       activeOpacity={0.8}
// // //     >
// // //       <View className="w-full h-[100px] rounded-xl overflow-hidden mb-3 bg-gray-100 justify-center items-center">
// // //         {item.image ? (
// // //           <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="contain" />
// // //         ) : (
// // //           <View className="w-full h-full bg-[#e3f2fd] justify-center items-center">
// // //             <Leaf size={32} color="#1565c0" />
// // //           </View>
// // //         )}
// // //       </View>
// // //       <View className="flex-1">
// // //         <Text className="text-[15px] font-medium text-[#333] mb-1 leading-5" numberOfLines={2}>
// // //           {item.name}
// // //         </Text>
// // //         <Text className="text-xs text-gray-500">Tap to explore</Text>
// // //       </View>
// // //     </TouchableOpacity>
// // //   );

// // //   const renderProductCard = ({ item }: { item: Product }) => {
// // //     return (
// // //       <View className="bg-white rounded-2xl mb-4 shadow-sm elevation-[2] border border-black/5 overflow-hidden">
// // //         <View className="flex-row justify-between items-center p-4">
// // //           <View className="flex-row items-center flex-1">
// // //             <View className="w-12 h-12 rounded-xl bg-[#e8f5e9] justify-center items-center mr-3">
// // //               <Leaf size={24} color="#2c5f2d" />
// // //             </View>
// // //             <View className="flex-1">
// // //               <Text className="text-base font-medium text-[#333] mb-0.5">{item.name}</Text>
// // //               <Text className="text-xs text-gray-500">
// // //                 {item.targetPestsDiseases.length} Pests/Diseases Covered
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         <View className="px-4 pb-4 border-t border-gray-100">
// // //           {/* Pests/Diseases */}
// // //           {item.targetPestsDiseases.length > 0 && (
// // //             <View className="mt-4">
// // //               <Text className="text-[13px] font-medium text-gray-400 mb-2 uppercase">Target Pests & Diseases</Text>
// // //               <View className="flex-row flex-wrap gap-2">
// // //                 {item.targetPestsDiseases.map((pest, idx) => (
// // //                   <View key={idx} className="bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
// // //                     <Text className="text-xs text-gray-600">{pest.name}</Text>
// // //                   </View>
// // //                 ))}
// // //               </View>
// // //             </View>
// // //           )}

// // //           {/* Recommended Seeds */}
// // //           <View className="mt-4">
// // //             <Text className="text-[13px] font-medium text-gray-400 mb-2 uppercase">Recommended Seeds / Solutions</Text>
// // //             {item.recommendedSeeds.map((seed, idx) => {
// // //               const added = isSeedInCart(seed.name);
// // //               return (
// // //                 <View key={idx} className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl mb-2 border border-gray-100">
// // //                   <View className="flex-1">
// // //                     <Text className="text-sm font-medium text-[#333]">{seed.name}</Text>
// // //                     <Text className="text-sm font-medium text-[#2c5f2d] mt-0.5">₹{seed.price.toFixed(2)}</Text>
// // //                   </View>
// // //                   <TouchableOpacity
// // //                     className={`flex-row items-center px-3 py-2 rounded-lg ${added ? "bg-[#4CAF50]" : "bg-[#2c5f2d]"
// // //                       }`}
// // //                     onPress={() => addToCart(item, seed)}
// // //                     disabled={loading.cart}
// // //                   >
// // //                     {added ? (
// // //                       <>
// // //                         <Check size={16} color="#fff" />
// // //                         <Text className="text-white text-xs font-medium ml-1.5">Added</Text>
// // //                       </>
// // //                     ) : (
// // //                       <>
// // //                         <ShoppingCart size={16} color="#fff" />
// // //                         <Text className="text-white text-xs font-medium ml-1.5">Add</Text>
// // //                       </>
// // //                     )}
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               );
// // //             })}
// // //             {item.recommendedSeeds.length === 0 && (
// // //               <Text className="text-center text-gray-400 text-sm italic">No recommendations available.</Text>
// // //             )}
// // //           </View>
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   /* ===================== MAIN RENDER ===================== */

// // //   if (isLoadingUser) {
// // //     return (
// // //       <View className="flex-1 justify-center items-center bg-[#F4F6F8]">
// // //         <ActivityIndicator size="large" color="#2c5f2d" />
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //     <SafeAreaView className="flex-1 bg-white">
// // //       {renderHeader()}

// // //       <View className="flex-1">
// // //         {/* Categories View */}
// // //         {viewState === "categories" && (
// // //           loading.categories ? (
// // //             <ActivityIndicator size="large" color="#2c5f2d" className="mt-12" />
// // //           ) : (
// // //             <FlatList
// // //               data={categories}
// // //               renderItem={renderCategoryCard}
// // //               keyExtractor={(item) => item._id}
// // //               numColumns={2}
// // //               contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
// // //               columnWrapperStyle={{ justifyContent: 'space-between' }}
// // //               showsVerticalScrollIndicator={false}
// // //               ListHeaderComponent={
// // //                 <View className="mb-5 mt-2">
// // //                   <Text className="text-[22px] font-medium text-[#1a1a1a]">Select Category</Text>
// // //                   <Text className="text-sm text-gray-500 mt-1">Browse by crop type</Text>
// // //                 </View>
// // //               }
// // //               ListEmptyComponent={<Text className="text-center text-gray-400 mt-8 text-base">No categories found.</Text>}
// // //             />
// // //           )
// // //         )}

// // //         {/* SubCategories View */}
// // //         {viewState === "subCategories" && (
// // //           loading.subCategories ? (
// // //             <ActivityIndicator size="large" color="#2c5f2d" className="mt-12" />
// // //           ) : (
// // //             <FlatList
// // //               data={filteredSubCategories}
// // //               renderItem={renderSubCategoryCard}
// // //               keyExtractor={(item) => item._id}
// // //               numColumns={2}
// // //               contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
// // //               columnWrapperStyle={{ justifyContent: 'space-between' }}
// // //               showsVerticalScrollIndicator={false}
// // //               ListHeaderComponent={
// // //                 <View className="mb-5 mt-2">
// // //                   <Text className="text-[22px] font-medium text-[#1a1a1a]">{selectedCategory?.name}</Text>
// // //                   <Text className="text-sm text-gray-500 mt-1">Select a crop to view diseases</Text>
// // //                 </View>
// // //               }
// // //               ListEmptyComponent={<Text className="text-center text-gray-400 mt-8 text-base">No subcategories found.</Text>}
// // //             />
// // //           )
// // //         )}

// // //         {/* Products View */}
// // //         {viewState === "products" && (
// // //           loading.products ? (
// // //             <ActivityIndicator size="large" color="#2c5f2d" className="mt-12" />
// // //           ) : (
// // //             <FlatList
// // //               data={filteredProducts}
// // //               renderItem={renderProductCard}
// // //               keyExtractor={(item) => item._id}
// // //               contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
// // //               showsVerticalScrollIndicator={false}
// // //               ListHeaderComponent={
// // //                 <View className="mb-5 mt-2">
// // //                   <Text className="text-[22px] font-medium text-[#1a1a1a]">Diseases & Solutions</Text>
// // //                   <Text className="text-sm text-gray-500 mt-1 mb-4">{selectedSubCategory?.name}</Text>

// // //                   {/* Video Demo Section */}
// // //                   <View className="w-full h-48 bg-black/90 rounded-xl overflow-hidden justify-center items-center mb-6 relative shadow-sm elevation-4">
// // //                     <Image
// // //                       source={{ uri: "https://img.freepik.com/free-photo/smart-farming-with-iot-futuristic-agriculture-concept_53876-124627.jpg" }}
// // //                       className="absolute w-full h-full opacity-60"
// // //                       resizeMode="cover"
// // //                     />
// // //                     <View className="w-16 h-16 bg-white/20 rounded-full justify-center items-center backdrop-blur-sm border border-white/30">
// // //                       <View className="w-12 h-12 bg-[#2c5f2d] rounded-full justify-center items-center pl-1">
// // //                         <Leaf size={24} color="#fff" fill="#fff" />
// // //                       </View>
// // //                     </View>
// // //                     <Text className="text-white font-medium mt-3 bg-black/40 px-3 py-1 rounded-full text-xs">
// // //                       Watch Demo: How to treat {selectedSubCategory?.name}
// // //                     </Text>
// // //                   </View>

// // //                   <Text className="text-lg font-medium text-[#333] mb-2">Recommended Products</Text>
// // //                 </View>
// // //               }
// // //               ListEmptyComponent={<Text className="text-center text-gray-400 mt-8 text-base">No products found.</Text>}
// // //             />
// // //           )
// // //         )}
// // //       </View>

// // //       {/* Login Modal */}
// // //       <Modal
// // //         visible={showLoginModal}
// // //         transparent={true}
// // //         animationType="fade"
// // //         onRequestClose={() => setShowLoginModal(false)}
// // //       >
// // //         <View className="flex-1 bg-black/50 justify-center items-center">
// // //           <View className="bg-white rounded-[20px] p-6 w-4/5 items-center elevation-[5]">
// // //             <View className="w-[60px] h-[60px] rounded-full bg-[#FF5252] justify-center items-center mb-4">
// // //               <LogOut size={32} color="#fff" />
// // //             </View>
// // //             <Text className="text-xl font-medium mb-2 text-[#333]">Login Required</Text>
// // //             <Text className="text-[15px] text-gray-500 text-center mb-6">
// // //               Please login to access Crop Care features.
// // //             </Text>
// // //             <View className="flex-row w-full justify-between gap-3">
// // //               <TouchableOpacity
// // //                 className="flex-1 py-3 rounded-[10px] items-center justify-center bg-gray-100"
// // //                 onPress={() => {
// // //                   setShowLoginModal(false);
// // //                   router.back();
// // //                 }}
// // //               >
// // //                 <Text className="text-gray-500 text-sm font-medium">Cancel</Text>
// // //               </TouchableOpacity>
// // //               <TouchableOpacity
// // //                 className="flex-1 py-3 rounded-[10px] items-center justify-center bg-[#2c5f2d]"
// // //                 onPress={() => {
// // //                   setShowLoginModal(false);
// // //                   router.push("/(auth)/Login?role=farmer");
// // //                 }}
// // //               >
// // //                 <Text className="text-white text-sm font-medium">Login</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     </SafeAreaView>

// // //     <CustomAlert
// // //   visible={showAlert}
// // //   title={alertTitle}
// // //   message={alertMessage}
// // //   onClose={() => {
// // //     setShowAlert(false);
// // //     if (alertAction) alertAction();
// // //   }}
// // // />

// // //     </>
// // //   );
// // // }





// // //updated 


// // import CustomAlert from "@/components/CustomAlert";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";
// // import { router, useNavigation } from "expo-router";
// // import {
// //   ArrowLeft,
// //   Check,
// //   ChevronRight,
// //   Leaf,
// //   LogOut,
// //   ShoppingCart
// // } from "lucide-react-native";
// // import { useEffect, useState } from "react";
// // import {
// //   ActivityIndicator,
// //   Dimensions,
// //   FlatList,
// //   Image,
// //   LayoutAnimation,
// //   Modal,
// //   Platform,
// //   Text,
// //   TouchableOpacity,
// //   UIManager,
// //   View
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";

// // // Enable LayoutAnimation for Android
// // if (Platform.OS === 'android') {
// //   if (UIManager.setLayoutAnimationEnabledExperimental) {
// //     UIManager.setLayoutAnimationEnabledExperimental(true);
// //   }
// // }

// // /* ===================== INTERFACES ===================== */

// // interface Category {
// //   _id: string;
// //   name: string;
// //   image?: string;
// //   status: "active" | "inactive";
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // interface SubCategory {
// //   _id: string;
// //   name: string;
// //   image?: string;
// //   categoryId: string | { _id: string; name: string };
// //   status: "active" | "inactive";
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // interface TargetPestDisease {
// //   name: string;
// //   image?: string;
// // }

// // interface RecommendedSeed {
// //   _id?: string;
// //   name: string;
// //   image?: string;
// //   price: number;
// // }

// // interface Product {
// //   _id: string;
// //   name: string;
// //   subCategoryId:
// //   | string
// //   | { _id: string; name: string; categoryId: { _id: string; name: string } };
// //   targetPestsDiseases: TargetPestDisease[];
// //   recommendedSeeds: RecommendedSeed[];
// //   status: "active" | "inactive";
// //   createdAt: string;
// //   updatedAt: string;
// //   image?: string;
// // }

// // interface User {
// //   _id: string;
// //   personalInfo: { name: string; mobileNo: string };
// //   role: string;
// //   farmerId?: string;
// // }

// // interface CartItem {
// //   productId: string;
// //   productName: string;
// //   seedId?: string;
// //   seedName: string;
// //   seedPrice: number;
// //   quantity: number;
// //   image?: string;
// // }

// // /* ===================== CONSTANTS ===================== */

// // const { width } = Dimensions.get("window");

// // type ViewState = "categories" | "subCategories" | "products";

// // /* ===================== COMPONENT ===================== */

// // export default function Cropcare() {
// //   const navigation = useNavigation();

// //   // Navigation State
// //   const [viewState, setViewState] = useState<ViewState>("categories");
// //   const [history, setHistory] = useState<ViewState[]>([]);

// //   // Data State
// //   const [categories, setCategories] = useState<Category[]>([]);
// //   const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
// //   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

// //   // Selection State
// //   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
// //   const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
// //   const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

// //   // User & Cart State
// //   const [cartItems, setCartItems] = useState<CartItem[]>([]);
// //   const [user, setUser] = useState<User | null>(null);
// //   const [showLoginModal, setShowLoginModal] = useState(false);
// //   const [isLoadingUser, setIsLoadingUser] = useState(true);

// //   const [showAlert, setShowAlert] = useState(false);
// // const [alertTitle, setAlertTitle] = useState("");
// // const [alertMessage, setAlertMessage] = useState("");
// // const [alertAction, setAlertAction] = useState<null | (() => void)>(null);

// // const showAppAlert = (title: string, message: string, action?: () => void) => {
// //   setAlertTitle(title);
// //   setAlertMessage(message);
// //   setAlertAction(() => action || null);
// //   setShowAlert(true);
// // };


// //   // Loading states
// //   const [loading, setLoading] = useState({
// //     categories: false,
// //     subCategories: false,
// //     products: false,
// //     cart: false,
// //   });

// //   // API URLs
// //   const CROPCARE_API = "https://kisanadmin.etpl.ai/api/cropcare";
// //   const BASE_URL = "https://kisanadmin.etpl.ai"; // Base URL for images
// //   const CART_API = "https://kisan.etpl.ai/api";

// //   /* ===================== AUTH ===================== */

// //   useEffect(() => {
// //     checkUserAuth();
// //   }, []);

// //   const checkUserAuth = async () => {
// //     setIsLoadingUser(true);
// //     try {
// //       const [userData, role, userId, farmerId] = await Promise.all([
// //         AsyncStorage.getItem("userData"),
// //         AsyncStorage.getItem("userRole"),
// //         AsyncStorage.getItem("userId"),
// //         AsyncStorage.getItem("farmerId"),
// //       ]);

// //       if (userData && role && userId) {
// //         const parsed = JSON.parse(userData);
// //         const userObj: User = {
// //           _id: userId,
// //           role,
// //           personalInfo: {
// //             name: parsed.personalInfo?.name || parsed.name || "User",
// //             mobileNo: parsed.personalInfo?.mobileNo || parsed.mobileNo || "",
// //           },
// //         };
// //         if (farmerId) userObj.farmerId = farmerId;
// //         setUser(userObj);
// //       } else {
// //         setShowLoginModal(true);
// //         setUser(null);
// //       }
// //     } catch (err) {
// //       console.error("Auth check error:", err);
// //       setShowLoginModal(true);
// //       setUser(null);
// //     } finally {
// //       setIsLoadingUser(false);
// //     }
// //   };

// //   const handleLogout = async () => {
// //     try {
// //       await AsyncStorage.clear();
// //       setUser(null);
// //       setCartItems([]);
// //       setShowLoginModal(true);
// //     } catch (err) {
// //       console.error("Logout error:", err);
// //     }
// //   };

// //   /* ===================== DATA FETCHING ===================== */

// //   useEffect(() => {
// //     if (user) {
// //       fetchCategories();
// //       fetchUserCart();
// //     }
// //   }, [user]);

// //   const fetchCategories = async () => {
// //     if (!user) return;
// //     setLoading((prev) => ({ ...prev, categories: true }));
// //     try {
// //       const res = await axios.get(`${CROPCARE_API}/categories`);
// //       console.log('Categories API Response:', res.data);
      
// //       // Check for different response structures
// //       if (res.data.success) {
// //         // Handle both array and data.data structures
// //         const categoriesData = Array.isArray(res.data) ? res.data : 
// //                               res.data.data || res.data.categories || [];
        
// //         const activeCategories = categoriesData.filter(
// //           (c: Category) => c.status === "active"
// //         );
// //         setCategories(activeCategories);
// //       } else if (Array.isArray(res.data)) {
// //         // If the response is directly an array
// //         const activeCategories = res.data.filter(
// //           (c: Category) => c.status === "active"
// //         );
// //         setCategories(activeCategories);
// //       }
// //     } catch (err: any) {
// //       console.error("Error fetching categories:", err.message);
// //       showAppAlert("Error", "Failed to load categories");
// //     } finally {
// //       setLoading((prev) => ({ ...prev, categories: false }));
// //     }
// //   };

// //   const fetchSubCategories = async (categoryId: string) => {
// //     if (!user) return;
// //     setLoading((prev) => ({ ...prev, subCategories: true }));
// //     try {
// //       const res = await axios.get(`${CROPCARE_API}/subcategories`);
// //       console.log('SubCategories API Response:', res.data);
      
// //       let allSubs = [];
      
// //       // Handle different response structures
// //       if (res.data.success && res.data.data) {
// //         allSubs = res.data.data;
// //       } else if (Array.isArray(res.data)) {
// //         allSubs = res.data;
// //       } else if (res.data.success && res.data.subcategories) {
// //         allSubs = res.data.subcategories;
// //       }
      
// //       const activeSubs = allSubs.filter((s: SubCategory) => s.status === "active");
// //       const relevantSubs = activeSubs.filter((sub: SubCategory) => {
// //         const cId = typeof sub.categoryId === "string" ? sub.categoryId : 
// //                    (sub.categoryId?._id || sub.categoryId);
// //         return cId === categoryId;
// //       });
      
// //       console.log('Filtered subcategories:', relevantSubs);
// //       setFilteredSubCategories(relevantSubs);
// //     } catch (err: any) {
// //       console.error("Error fetching subcategories:", err.message);
// //       showAppAlert("Error", "Failed to load subcategories");
// //     } finally {
// //       setLoading((prev) => ({ ...prev, subCategories: false }));
// //     }
// //   };

// //   const fetchProducts = async (subId: string) => {
// //     if (!user) return;
// //     setLoading((prev) => ({ ...prev, products: true }));
// //     try {
// //       const res = await axios.get(`${CROPCARE_API}/products`);
// //       console.log('Products API Response:', res.data);
// //       console.log('Looking for products with subCategoryId:', subId);
      
// //       let allProducts = [];
      
// //       // Handle different response structures
// //       if (res.data.success && res.data.data) {
// //         allProducts = res.data.data;
// //       } else if (Array.isArray(res.data)) {
// //         allProducts = res.data;
// //       } else if (res.data.success && res.data.products) {
// //         allProducts = res.data.products;
// //       }
      
// //       console.log('Total products found:', allProducts.length);
      
// //       const relevantProducts = allProducts.filter((p: Product) => {
// //         // Extract subCategoryId from product
// //         let sId;
// //         if (typeof p.subCategoryId === "string") {
// //           sId = p.subCategoryId;
// //         } else if (p.subCategoryId && typeof p.subCategoryId === "object") {
// //           sId = p.subCategoryId._id;
// //         }
        
// //         console.log(`Product: ${p.name}, subCategoryId: ${sId}, matches: ${sId === subId}`);
// //         return sId === subId && p.status === "active";
// //       });
      
// //       console.log('Filtered products:', relevantProducts);
// //       setFilteredProducts(relevantProducts);
// //     } catch (err: any) {
// //       console.error("Error fetching products:", err.message);
// //       showAppAlert("Error", "Failed to load products");
// //     } finally {
// //       setLoading((prev) => ({ ...prev, products: false }));
// //     }
// //   };

// //   const fetchUserCart = async () => {
// //     if (!user) return;
// //     setLoading((prev) => ({ ...prev, cart: true }));
// //     try {
// //       const idToUse = user.farmerId || user._id;
// //       const res = await axios.get(`${CART_API}/cropcare/cart/${idToUse}`);
// //       if (res.data.success) {
// //         setCartItems(res.data.data.items || []);
// //       }
// //     } catch (err) {
// //       setCartItems([]);
// //     } finally {
// //       setLoading((prev) => ({ ...prev, cart: false }));
// //     }
// //   };

// //   /* ===================== CART OPERATIONS ===================== */

// //   const addToCart = async (product: Product, seed: RecommendedSeed) => {
// //     if (!user) {
// //       setShowLoginModal(true);
// //       return;
// //     }

// //     setLoading((prev) => ({ ...prev, cart: true }));
// //     try {
// //       const cartItem = {
// //         productId: product._id,
// //         productName: product.name,
// //         seedId: seed._id || seed.name,
// //         seedName: seed.name,
// //         seedPrice: seed.price,
// //         quantity: 1,
// //         image: seed.image,
// //       };

// //       const idToUse = user.farmerId || user._id;
// //       const res = await axios.post(`${CART_API}/cropcare/cart/add`, {
// //         userId: idToUse,
// //         item: cartItem,
// //       });

// //       if (res.data.success) {
// //         setCartItems(res.data.data.items);
// //         showAppAlert("Success", `${seed.name} added to cart!`);
// //       }
// //     } catch (err: any) {
// //       showAppAlert("Error", err.response?.data?.message || "Failed to add to cart");
// //     } finally {
// //       setLoading((prev) => ({ ...prev, cart: false }));
// //     }
// //   };

// //   const isSeedInCart = (seedName: string): boolean => {
// //     return cartItems.some((item) => item.seedName === seedName);
// //   };

// //   /* ===================== IMAGE HELPER ===================== */

// //   // Helper function to get complete image URL
// //   const getImageUrl = (imagePath?: string): string | null => {
// //     if (!imagePath) return null;
    
// //     // If it's already a full URL, return as is
// //     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
// //       return imagePath;
// //     }
    
// //     // If it's a relative path starting with /, prepend base URL
// //     if (imagePath.startsWith('/')) {
// //       return `${BASE_URL}${imagePath}`;
// //     }
    
// //     // If it doesn't start with /, prepend base URL with /uploads/
// //     if (imagePath.includes('uploads/')) {
// //       return `${BASE_URL}/${imagePath}`;
// //     }
    
// //     // Default: assume it's in uploads folder
// //     return `${BASE_URL}/uploads/${imagePath}`;
// //   };

// //   // Helper function to check if image URL is valid
// //   const isValidImageUrl = (url?: string): boolean => {
// //     if (!url) return false;
    
// //     const fullUrl = getImageUrl(url);
// //     if (!fullUrl) return false;
    
// //     // Check if URL is valid and not just a domain
// //     const validPatterns = [
// //       /\.(jpg|jpeg|png|gif|webp|bmp)$/i,
// //       /\/uploads\//i,
// //       /\/images\//i,
// //       /storage\.googleapis\.com/i,
// //       /cloudinary\.com/i,
// //       /amazonaws\.com/i
// //     ];
    
// //     // Check if it matches any valid pattern
// //     for (const pattern of validPatterns) {
// //       if (pattern.test(fullUrl)) return true;
// //     }
    
// //     // If it's a longer URL but doesn't match patterns, still accept it
// //     return fullUrl.includes('/') && fullUrl.length > 20;
// //   };

// //   /* ===================== NAVIGATION HANDLERS ===================== */

// //   const navigateTo = (view: ViewState) => {
// //     setHistory((prev) => [...prev, viewState]);
// //     setViewState(view);
// //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// //   };

// //   const handleBack = () => {
// //     if (history.length > 0) {
// //       const prevView = history[history.length - 1];
// //       setHistory((prev) => prev.slice(0, -1));
// //       setViewState(prevView);
// //       if (viewState === "subCategories") setSelectedCategory(null);
// //       if (viewState === "products") setSelectedSubCategory(null);
// //       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// //     } else {
// //       router.back();
// //     }
// //   };

// //   const onSelectCategory = (category: Category) => {
// //     setSelectedCategory(category);
// //     fetchSubCategories(category._id);
// //     navigateTo("subCategories");
// //   };

// //   const onSelectSubCategory = (subCategory: SubCategory) => {
// //     setSelectedSubCategory(subCategory);
// //     fetchProducts(subCategory._id);
// //     navigateTo("products");
// //   };

// //   /* ===================== RENDER HELPERS ===================== */

// //   const renderHeader = () => (
// //     <View className="bg-white px-5 py-4 shadow-sm elevation-4">
// //       <View className="flex-row justify-between items-center">
// //         <View className="flex-row items-center">
// //           {viewState !== "categories" && (
// //             <TouchableOpacity onPress={handleBack} className="mr-3 p-1">
// //               <ArrowLeft size={24} color="#000000ff" />
// //             </TouchableOpacity>
// //           )}
// //           <View>
// //             <Text className="text-xl font-medium text-black">
// //               {viewState === "categories"
// //                 ? "Crop Care"
// //                 : viewState === "subCategories"
// //                   ? selectedCategory?.name
// //                   : selectedSubCategory?.name}
// //             </Text>
// //             {user && (
// //               <Text className="text-xs text-black/80">
// //                 Hello, {user.personalInfo.name.split(" ")[0]}
// //               </Text>
// //             )}
// //           </View>
// //         </View>

// //         <View className="flex-row items-center">
// //           {user && (
// //             <TouchableOpacity
// //               className="mr-4 relative"
// //               onPress={() => router.push("/(farmerscreen)/cropcarecart")}
// //             >
// //               <ShoppingCart size={24} color="#016c17ff" />
// //               {cartItems.length > 0 && (
// //                 <View className="absolute -top-2 -right-2 bg-[#FF5252] rounded-full w-[18px] h-[18px] items-center justify-center border-[1.5px] border-[#2c5f2d]">
// //                   <Text className="text-white text-[9px] font-medium">{cartItems.length}</Text>
// //                 </View>
// //               )}
// //             </TouchableOpacity>
// //           )}
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   const renderCategoryCard = ({ item }: { item: Category }) => {
// //     const imageUrl = getImageUrl(item.image);
// //     console.log("imageUrl", imageUrl);
// //     const shouldShowImage = imageUrl && isValidImageUrl(item.image);
    
// //     return (
// //       <TouchableOpacity
// //         className="bg-white rounded-lg p-3 mb-4 elevation-[2] border border-black/5 flex-1 m-2"
// //         onPress={() => onSelectCategory(item)}
// //         activeOpacity={0.8}
// //       >
// //         <View className="w-full h-[100px] rounded-xl overflow-hidden mb-3 bg-gray-100 justify-center items-center">
// //           {shouldShowImage ? (
// //             <Image 
// //               source={{ uri: imageUrl! }} 
// //               className="w-full h-full" 
// //               resizeMode="cover"
// //               onError={(e) => console.log('Category image error:', item.name, e.nativeEvent.error)}
// //               onLoad={() => console.log('Category image loaded:', item.name, imageUrl)}
// //             />
// //           ) : (
// //             <View className="w-full h-full bg-[#e8f5e9] justify-center items-center">
// //               <Leaf size={32} color="#2c5f2d" />
// //             </View>
// //           )}
// //         </View>
// //         <View className="flex-1">
// //           <Text className="text-[15px] font-medium text-[#333] mb-1 leading-5" numberOfLines={2}>
// //             {item.name}
// //           </Text>
// //           <View className="flex-row items-center mt-1">
// //             <Text className="text-xs text-[#2c5f2d] font-medium mr-1">View Items</Text>
// //             <ChevronRight size={16} color="#2c5f2d" />
// //           </View>
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   const renderSubCategoryCard = ({ item }: { item: SubCategory }) => {
// //     const imageUrl = getImageUrl(item.image);
// //     const shouldShowImage = imageUrl && isValidImageUrl(item.image);
    
// //     return (
// //       <TouchableOpacity
// //         className="bg-white rounded-lg p-3 mb-4 elevation-[2] border border-black/5 flex-1 m-2"
// //         onPress={() => onSelectSubCategory(item)}
// //         activeOpacity={0.8}
// //       >
// //         <View className="w-full h-[100px] rounded-xl overflow-hidden mb-3 bg-gray-100 justify-center items-center">
// //           {shouldShowImage ? (
// //             <Image 
// //               source={{ uri: imageUrl! }} 
// //               className="w-full h-full" 
// //               resizeMode="cover"
// //               onError={(e) => console.log('Subcategory image error:', item.name, e.nativeEvent.error)}
// //               onLoad={() => console.log('Subcategory image loaded:', item.name, imageUrl)}
// //             />
// //           ) : (
// //             <View className="w-full h-full bg-[#e3f2fd] justify-center items-center">
// //               <Leaf size={32} color="#1565c0" />
// //             </View>
// //           )}
// //         </View>
// //         <View className="flex-1">
// //           <Text className="text-[15px] font-medium text-[#333] mb-1 leading-5" numberOfLines={2}>
// //             {item.name}
// //           </Text>
// //           <Text className="text-xs text-gray-500">Tap to explore</Text>
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   const renderProductCard = ({ item }: { item: Product }) => {
// //     const productImageUrl = getImageUrl(item.image);
// //     const shouldShowProductImage = productImageUrl && isValidImageUrl(item.image);
    
// //     return (
// //       <View className="bg-white rounded-2xl mb-4 shadow-sm elevation-[2] border border-black/5 overflow-hidden">
// //         <View className="flex-row justify-between items-center p-4">
// //           <View className="flex-row items-center flex-1">
// //             <View className="w-12 h-12 rounded-xl bg-[#e8f5e9] justify-center items-center mr-3 overflow-hidden">
// //               {shouldShowProductImage ? (
// //                 <Image 
// //                   source={{ uri: productImageUrl! }} 
// //                   className="w-full h-full" 
// //                   resizeMode="cover"
// //                   onError={(e) => console.log('Product image error:', item.name, e.nativeEvent.error)}
// //                   onLoad={() => console.log('Product image loaded:', item.name, productImageUrl)}
// //                 />
// //               ) : (
// //                 <Leaf size={24} color="#2c5f2d" />
// //               )}
// //             </View>
// //             <View className="flex-1">
// //               <Text className="text-base font-medium text-[#333] mb-0.5">{item.name}</Text>
// //               <Text className="text-xs text-gray-500">
// //                 {item.targetPestsDiseases?.length || 0} Pests/Diseases Covered
// //               </Text>
// //             </View>
// //           </View>
// //         </View>

// //         <View className="px-4 pb-4 border-t border-gray-100">
// //           {/* Pests/Diseases */}
// //           {item.targetPestsDiseases && item.targetPestsDiseases.length > 0 && (
// //             <View className="mt-4">
// //               <Text className="text-[13px] font-medium text-gray-400 mb-2 uppercase">Target Pests & Diseases</Text>
// //               <View className="flex-row flex-wrap gap-2">
// //                 {item.targetPestsDiseases.map((pest, idx) => (
// //                   <View key={idx} className="bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
// //                     <Text className="text-xs text-gray-600">{pest.name}</Text>
// //                   </View>
// //                 ))}
// //               </View>
// //             </View>
// //           )}

// //           {/* Recommended Seeds */}
// //           <View className="mt-4">
// //             <Text className="text-[13px] font-medium text-gray-400 mb-2 uppercase">Recommended Seeds / Solutions</Text>
// //             {item.recommendedSeeds && item.recommendedSeeds.length > 0 ? (
// //               item.recommendedSeeds.map((seed, idx) => {
// //                 const seedImageUrl = getImageUrl(seed.image);
// //                 const shouldShowSeedImage = seedImageUrl && isValidImageUrl(seed.image);
// //                 const added = isSeedInCart(seed.name);
                
// //                 return (
// //                   <View key={idx} className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl mb-2 border border-gray-100">
// //                     <View className="flex-row items-center flex-1">
// //                       {shouldShowSeedImage ? (
// //                         <Image 
// //                           source={{ uri: seedImageUrl! }} 
// //                           className="w-10 h-10 rounded-lg mr-3" 
// //                           resizeMode="cover"
// //                           onError={(e) => console.log('Seed image error:', seed.name, e.nativeEvent.error)}
// //                           onLoad={() => console.log('Seed image loaded:', seed.name, seedImageUrl)}
// //                         />
// //                       ) : (
// //                         <View className="w-10 h-10 rounded-lg bg-[#f0f7f0] justify-center items-center mr-3">
// //                           <Leaf size={20} color="#2c5f2d" />
// //                         </View>
// //                       )}
// //                       <View className="flex-1">
// //                         <Text className="text-sm font-medium text-[#333]">{seed.name}</Text>
// //                         <Text className="text-sm font-medium text-[#2c5f2d] mt-0.5">₹{seed.price?.toFixed(2) || '0.00'}</Text>
// //                       </View>
// //                     </View>
// //                     <TouchableOpacity
// //                       className={`flex-row items-center px-3 py-2 rounded-lg ${added ? "bg-[#4CAF50]" : "bg-[#2c5f2d]"
// //                         }`}
// //                       onPress={() => addToCart(item, seed)}
// //                       disabled={loading.cart}
// //                     >
// //                       {added ? (
// //                         <>
// //                           <Check size={16} color="#fff" />
// //                           <Text className="text-white text-xs font-medium ml-1.5">Added</Text>
// //                         </>
// //                       ) : (
// //                         <>
// //                           <ShoppingCart size={16} color="#fff" />
// //                           <Text className="text-white text-xs font-medium ml-1.5">Add</Text>
// //                         </>
// //                       )}
// //                     </TouchableOpacity>
// //                   </View>
// //                 );
// //               })
// //             ) : (
// //               <Text className="text-center text-gray-400 text-sm italic">No recommendations available.</Text>
// //             )}
// //           </View>
// //         </View>
// //       </View>
// //     );
// //   };

// //   /* ===================== MAIN RENDER ===================== */

// //   if (isLoadingUser) {
// //     return (
// //       <View className="flex-1 justify-center items-center bg-[#F4F6F8]">
// //         <ActivityIndicator size="large" color="#2c5f2d" />
// //       </View>
// //     );
// //   }

// //   return (
// //     <>
// //     <SafeAreaView className="flex-1 bg-white">
// //       {renderHeader()}

// //       <View className="flex-1">
// //         {/* Categories View */}
// //         {viewState === "categories" && (
// //           loading.categories ? (
// //             <ActivityIndicator size="large" color="#2c5f2d" className="mt-12" />
// //           ) : (
// //             <FlatList
// //               data={categories}
// //               renderItem={renderCategoryCard}
// //               keyExtractor={(item) => item._id}
// //               numColumns={2}
// //               contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
// //               columnWrapperStyle={{ justifyContent: 'space-between' }}
// //               showsVerticalScrollIndicator={false}
// //               ListHeaderComponent={
// //                 <View className="mb-5 mt-2">
// //                   <Text className="text-[22px] font-medium text-[#1a1a1a]">Select Category</Text>
// //                   <Text className="text-sm text-gray-500 mt-1">Browse by crop type</Text>
// //                 </View>
// //               }
// //               ListEmptyComponent={
// //                 <View className="items-center mt-12">
// //                   <Text className="text-center text-gray-400 mt-8 text-base">No categories found.</Text>
// //                   <TouchableOpacity 
// //                     className="mt-4 bg-[#2c5f2d] px-6 py-3 rounded-lg"
// //                     onPress={fetchCategories}
// //                   >
// //                     <Text className="text-white">Retry</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               }
// //             />
// //           )
// //         )}

// //         {/* SubCategories View */}
// //         {viewState === "subCategories" && (
// //           loading.subCategories ? (
// //             <ActivityIndicator size="large" color="#2c5f2d" className="mt-12" />
// //           ) : (
// //             <FlatList
// //               data={filteredSubCategories}
// //               renderItem={renderSubCategoryCard}
// //               keyExtractor={(item) => item._id}
// //               numColumns={2}
// //               contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
// //               columnWrapperStyle={{ justifyContent: 'space-between' }}
// //               showsVerticalScrollIndicator={false}
// //               ListHeaderComponent={
// //                 <View className="mb-5 mt-2">
// //                   <Text className="text-[22px] font-medium text-[#1a1a1a]">{selectedCategory?.name}</Text>
// //                   <Text className="text-sm text-gray-500 mt-1">Select a crop to view diseases</Text>
// //                 </View>
// //               }
// //               ListEmptyComponent={
// //                 <View className="items-center mt-12">
// //                   <Text className="text-center text-gray-400 mt-8 text-base">No subcategories found.</Text>
// //                   <TouchableOpacity 
// //                     className="mt-4 bg-[#2c5f2d] px-6 py-3 rounded-lg"
// //                     onPress={() => selectedCategory && fetchSubCategories(selectedCategory._id)}
// //                   >
// //                     <Text className="text-white">Retry</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               }
// //             />
// //           )
// //         )}

// //         {/* Products View */}
// //         {viewState === "products" && (
// //           loading.products ? (
// //             <ActivityIndicator size="large" color="#2c5f2d" className="mt-12" />
// //           ) : (
// //             <FlatList
// //               data={filteredProducts}
// //               renderItem={renderProductCard}
// //               keyExtractor={(item) => item._id}
// //               contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
// //               showsVerticalScrollIndicator={false}
// //               ListHeaderComponent={
// //                 <View className="mb-5 mt-2">
// //                   <Text className="text-[22px] font-medium text-[#1a1a1a]">Diseases & Solutions</Text>
// //                   <Text className="text-sm text-gray-500 mt-1 mb-4">{selectedSubCategory?.name}</Text>

// //                   {/* Video Demo Section */}
// //                   <View className="w-full h-48 bg-black/90 rounded-xl overflow-hidden justify-center items-center mb-6 relative shadow-sm elevation-4">
// //                     <Image
// //                       source={{ uri: "https://img.freepik.com/free-photo/smart-farming-with-iot-futuristic-agriculture-concept_53876-124627.jpg" }}
// //                       className="absolute w-full h-full opacity-60"
// //                       resizeMode="cover"
// //                       onError={() => console.log('Demo image failed to load')}
// //                     />
// //                     <View className="w-16 h-16 bg-white/20 rounded-full justify-center items-center backdrop-blur-sm border border-white/30">
// //                       <View className="w-12 h-12 bg-[#2c5f2d] rounded-full justify-center items-center pl-1">
// //                         <Leaf size={24} color="#fff" fill="#fff" />
// //                       </View>
// //                     </View>
// //                     <Text className="text-white font-medium mt-3 bg-black/40 px-3 py-1 rounded-full text-xs">
// //                       Watch Demo: How to treat {selectedSubCategory?.name}
// //                     </Text>
// //                   </View>

// //                   <Text className="text-lg font-medium text-[#333] mb-2">Recommended Products</Text>
// //                   <Text className="text-sm text-gray-500 mb-4">
// //                     Found {filteredProducts.length} product(s)
// //                   </Text>
// //                 </View>
// //               }
// //               ListEmptyComponent={
// //                 <View className="items-center mt-12">
// //                   <Text className="text-center text-gray-400 mt-8 text-base">No products found for this subcategory.</Text>
// //                   <TouchableOpacity 
// //                     className="mt-4 bg-[#2c5f2d] px-6 py-3 rounded-lg"
// //                     onPress={() => selectedSubCategory && fetchProducts(selectedSubCategory._id)}
// //                   >
// //                     <Text className="text-white">Retry</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               }
// //             />
// //           )
// //         )}
// //       </View>

// //       {/* Login Modal */}
// //       <Modal
// //         visible={showLoginModal}
// //         transparent={true}
// //         animationType="fade"
// //         onRequestClose={() => setShowLoginModal(false)}
// //       >
// //         <View className="flex-1 bg-black/50 justify-center items-center">
// //           <View className="bg-white rounded-[20px] p-6 w-4/5 items-center elevation-[5]">
// //             <View className="w-[60px] h-[60px] rounded-full bg-[#FF5252] justify-center items-center mb-4">
// //               <LogOut size={32} color="#fff" />
// //             </View>
// //             <Text className="text-xl font-medium mb-2 text-[#333]">Login Required</Text>
// //             <Text className="text-[15px] text-gray-500 text-center mb-6">
// //               Please login to access Crop Care features.
// //             </Text>
// //             <View className="flex-row w-full justify-between gap-3">
// //               <TouchableOpacity
// //                 className="flex-1 py-3 rounded-[10px] items-center justify-center bg-gray-100"
// //                 onPress={() => {
// //                   setShowLoginModal(false);
// //                   router.back();
// //                 }}
// //               >
// //                 <Text className="text-gray-500 text-sm font-medium">Cancel</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 className="flex-1 py-3 rounded-[10px] items-center justify-center bg-[#2c5f2d]"
// //                 onPress={() => {
// //                   setShowLoginModal(false);
// //                   router.push("/(auth)/Login?role=farmer");
// //                 }}
// //               >
// //                 <Text className="text-white text-sm font-medium">Login</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>

// //     <CustomAlert
// //   visible={showAlert}
// //   title={alertTitle}
// //   message={alertMessage}
// //   onClose={() => {
// //     setShowAlert(false);
// //     if (alertAction) alertAction();
// //   }}
// // />

// //     </>
// //   );
// // }






// import CustomAlert from "@/components/CustomAlert";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { router, useNavigation } from "expo-router";
// import {
//   ArrowLeft,
//   Check,
//   ChevronRight,
//   Leaf,
//   LogOut, ShoppingBag, ShoppingCart
// } from "lucide-react-native";

// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   Image,
//   LayoutAnimation,
//   Modal,
//   Platform,
//   Text,
//   TouchableOpacity,
//   UIManager,
//   View
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // Enable LayoutAnimation for Android
// if (Platform.OS === 'android') {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

// /* ===================== INTERFACES ===================== */

// interface Category {
//   _id: string;
//   name: string;
//   image?: string;
//   status: "active" | "inactive";
//   createdAt: string;
//   updatedAt: string;
// }

// interface SubCategory {
//   _id: string;
//   name: string;
//   image?: string;
//   categoryId: string | { _id: string; name: string };
//   status: "active" | "inactive";
//   createdAt: string;
//   updatedAt: string;
// }

// interface TargetPestDisease {
//   name: string;
//   image?: string;
// }

// interface RecommendedSeed {
//   _id?: string;
//   name: string;
//   image?: string;
//   price: number;
// }

// interface Product {
//   _id: string;
//   name: string;
//   subCategoryId:
//   | string
//   | { _id: string; name: string; categoryId: { _id: string; name: string } };
//   targetPestsDiseases: TargetPestDisease[];
//   recommendedSeeds: RecommendedSeed[];
//   status: "active" | "inactive";
//   createdAt: string;
//   updatedAt: string;
//   image?: string;
// }

// interface User {
//   _id: string;
//   personalInfo: { name: string; mobileNo: string };
//   role: string;
//   farmerId?: string;
// }

// interface CartItem {
//   productId: string;
//   productName: string;
//   seedId?: string;
//   seedName: string;
//   seedPrice: number;
//   quantity: number;
//   image?: string;
// }

// /* ===================== CONSTANTS ===================== */

// const { width } = Dimensions.get("window");

// type ViewState = "categories" | "subCategories" | "products";

// /* ===================== COMPONENT ===================== */

// export default function Cropcare() {
//   const navigation = useNavigation();

//   // Navigation State
//   const [viewState, setViewState] = useState<ViewState>("categories");
//   const [history, setHistory] = useState<ViewState[]>([]);

//   // Data State
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

//   // Selection State
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
//   const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

//   // User & Cart State
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [user, setUser] = useState<User | null>(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [isLoadingUser, setIsLoadingUser] = useState(true);

//   const [showAlert, setShowAlert] = useState(false);
// const [alertTitle, setAlertTitle] = useState("");
// const [alertMessage, setAlertMessage] = useState("");
// const [alertAction, setAlertAction] = useState<null | (() => void)>(null);

// const showAppAlert = (title: string, message: string, action?: () => void) => {
//   setAlertTitle(title);
//   setAlertMessage(message);
//   setAlertAction(() => action || null);
//   setShowAlert(true);
// };


//   // Loading states
//   const [loading, setLoading] = useState({
//     categories: false,
//     subCategories: false,
//     products: false,
//     cart: false,
//   });

//   // API URLs - Updated to use the correct base URL
//   const CROPCARE_API = "https://kisanadmin.etpl.ai/api/cropcare";
//   const BASE_URL = "https://kisanadmin.etpl.ai"; // Base URL for images
//   const CART_API = "https://kisan.etpl.ai/api";

//   /* ===================== AUTH ===================== */

//   useEffect(() => {
//     checkUserAuth();
//   }, []);

//   const checkUserAuth = async () => {
//     setIsLoadingUser(true);
//     try {
//       const [userData, role, userId, farmerId] = await Promise.all([
//         AsyncStorage.getItem("userData"),
//         AsyncStorage.getItem("userRole"),
//         AsyncStorage.getItem("userId"),
//         AsyncStorage.getItem("farmerId"),
//       ]);

//       if (userData && role && userId) {
//         const parsed = JSON.parse(userData);
//         const userObj: User = {
//           _id: userId,
//           role,
//           personalInfo: {
//             name: parsed.personalInfo?.name || parsed.name || "User",
//             mobileNo: parsed.personalInfo?.mobileNo || parsed.mobileNo || "",
//           },
//         };
//         if (farmerId) userObj.farmerId = farmerId;
//         setUser(userObj);
//       } else {
//         setShowLoginModal(true);
//         setUser(null);
//       }
//     } catch (err) {
//       console.error("Auth check error:", err);
//       setShowLoginModal(true);
//       setUser(null);
//     } finally {
//       setIsLoadingUser(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.clear();
//       setUser(null);
//       setCartItems([]);
//       setShowLoginModal(true);
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   /* ===================== DATA FETCHING ===================== */

//   useEffect(() => {
//     if (user) {
//       fetchCategories();
//       fetchUserCart();
//     }
//   }, [user]);

//   const fetchCategories = async () => {
//     if (!user) return;
//     setLoading((prev) => ({ ...prev, categories: true }));
//     try {
//       const res = await axios.get(`${CROPCARE_API}/categories`);
//       console.log('Categories API Response:', res.data);
      
//       // Check for different response structures
//       if (res.data.success) {
//         // Handle both array and data.data structures
//         const categoriesData = Array.isArray(res.data) ? res.data : 
//                               res.data.data || res.data.categories || [];
        
//         const activeCategories = categoriesData.filter(
//           (c: Category) => c.status === "active"
//         );
//         setCategories(activeCategories);
//       } else if (Array.isArray(res.data)) {
//         // If the response is directly an array
//         const activeCategories = res.data.filter(
//           (c: Category) => c.status === "active"
//         );
//         setCategories(activeCategories);
//       }
//     } catch (err: any) {
//       console.error("Error fetching categories:", err.message);
//       showAppAlert("Error", "Failed to load categories");
//     } finally {
//       setLoading((prev) => ({ ...prev, categories: false }));
//     }
//   };

//   const fetchSubCategories = async (categoryId: string) => {
//     if (!user) return;
//     setLoading((prev) => ({ ...prev, subCategories: true }));
//     try {
//       const res = await axios.get(`${CROPCARE_API}/subcategories`);
//       console.log('SubCategories API Response:', res.data);
      
//       let allSubs = [];
      
//       // Handle different response structures
//       if (res.data.success && res.data.data) {
//         allSubs = res.data.data;
//       } else if (Array.isArray(res.data)) {
//         allSubs = res.data;
//       } else if (res.data.success && res.data.subcategories) {
//         allSubs = res.data.subcategories;
//       }
      
//       const activeSubs = allSubs.filter((s: SubCategory) => s.status === "active");
//       const relevantSubs = activeSubs.filter((sub: SubCategory) => {
//         const cId = typeof sub.categoryId === "string" ? sub.categoryId : 
//                    (sub.categoryId?._id || sub.categoryId);
//         return cId === categoryId;
//       });
      
//       console.log('Filtered subcategories:', relevantSubs);
//       setFilteredSubCategories(relevantSubs);
//     } catch (err: any) {
//       console.error("Error fetching subcategories:", err.message);
//       showAppAlert("Error", "Failed to load subcategories");
//     } finally {
//       setLoading((prev) => ({ ...prev, subCategories: false }));
//     }
//   };

//   const fetchProducts = async (subId: string) => {
//     if (!user) return;
//     setLoading((prev) => ({ ...prev, products: true }));
//     try {
//       const res = await axios.get(`${CROPCARE_API}/products`);
//       console.log('Products API Response:', res.data);
//       console.log('Looking for products with subCategoryId:', subId);
      
//       let allProducts = [];
      
//       // Handle different response structures
//       if (res.data.success && res.data.data) {
//         allProducts = res.data.data;
//       } else if (Array.isArray(res.data)) {
//         allProducts = res.data;
//       } else if (res.data.success && res.data.products) {
//         allProducts = res.data.products;
//       }
      
//       console.log('Total products found:', allProducts.length);
      
//       const relevantProducts = allProducts.filter((p: Product) => {
//         // Extract subCategoryId from product
//         let sId;
//         if (typeof p.subCategoryId === "string") {
//           sId = p.subCategoryId;
//         } else if (p.subCategoryId && typeof p.subCategoryId === "object") {
//           sId = p.subCategoryId._id;
//         }
        
//         console.log(`Product: ${p.name}, subCategoryId: ${sId}, matches: ${sId === subId}`);
//         return sId === subId && p.status === "active";
//       });
      
//       console.log('Filtered products:', relevantProducts);
//       setFilteredProducts(relevantProducts);
//     } catch (err: any) {
//       console.error("Error fetching products:", err.message);
//       showAppAlert("Error", "Failed to load products");
//     } finally {
//       setLoading((prev) => ({ ...prev, products: false }));
//     }
//   };

//   const fetchUserCart = async () => {
//     if (!user) return;
//     setLoading((prev) => ({ ...prev, cart: true }));
//     try {
//       const idToUse = user.farmerId || user._id;
//       const res = await axios.get(`${CART_API}/cropcare/cart/${idToUse}`);
//       if (res.data.success) {
//         setCartItems(res.data.data.items || []);
//       }
//     } catch (err) {
//       setCartItems([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, cart: false }));
//     }
//   };

//   /* ===================== CART OPERATIONS ===================== */

//   const addToCart = async (product: Product, seed: RecommendedSeed) => {
//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }

//     setLoading((prev) => ({ ...prev, cart: true }));
//     try {
//       const cartItem = {
//         productId: product._id,
//         productName: product.name,
//         seedId: seed._id || seed.name,
//         seedName: seed.name,
//         seedPrice: seed.price,
//         quantity: 1,
//         image: seed.image,
//       };

//       const idToUse = user.farmerId || user._id;
//       const res = await axios.post(`${CART_API}/cropcare/cart/add`, {
//         userId: idToUse,
//         item: cartItem,
//       });

//       if (res.data.success) {
//         setCartItems(res.data.data.items);
//         showAppAlert("Success", `${seed.name} added to cart!`);
//       }
//     } catch (err: any) {
//       showAppAlert("Error", err.response?.data?.message || "Failed to add to cart");
//     } finally {
//       setLoading((prev) => ({ ...prev, cart: false }));
//     }
//   };

//   const isSeedInCart = (seedName: string): boolean => {
//     return cartItems.some((item) => item.seedName === seedName);
//   };

//   /* ===================== IMAGE HELPER ===================== */

//   // Helper function to get complete image URL
//   const getImageUrl = (imagePath?: string): string | null => {
//     if (!imagePath) return null;
    
//     // Remove any leading dots or extra slashes
//     const cleanPath = imagePath.replace(/^\.+/, '').replace(/\/\//g, '/');
    
//     // If it's already a full URL, return as is
//     if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
//       return cleanPath;
//     }
    
//     // If it starts with /uploads, prepend base URL
//     if (cleanPath.startsWith('/uploads/')) {
//       return `${BASE_URL}${cleanPath}`;
//     }
    
//     // If it starts with uploads (without slash), add slash
//     if (cleanPath.startsWith('uploads/')) {
//       return `${BASE_URL}/${cleanPath}`;
//     }
    
//     // If it's just a filename, assume it's in uploads folder
//     if (cleanPath.includes('.jpg') || cleanPath.includes('.jpeg') || 
//         cleanPath.includes('.png') || cleanPath.includes('.gif')) {
//       return `${BASE_URL}/uploads/${cleanPath}`;
//     }
    
//     // Default: prepend with /uploads/
//     return `${BASE_URL}/uploads/${cleanPath}`;
//   };

//   // Helper function to check if image URL is valid
//   const isValidImageUrl = (url?: string): boolean => {
//     if (!url) return false;
    
//     const fullUrl = getImageUrl(url);
//     if (!fullUrl) return false;
    
//     // Check if it's a valid URL pattern
//     const urlPattern = /^(https?:\/\/)/i;
//     if (!urlPattern.test(fullUrl)) return false;
    
//     // Check for image file extensions
//     const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
//     if (imageExtensions.test(fullUrl)) return true;
    
//     // Check for uploads directory in path
//     if (fullUrl.includes('/uploads/')) return true;
    
//     return false;
//   };

//   /* ===================== NAVIGATION HANDLERS ===================== */

//   const navigateTo = (view: ViewState) => {
//     setHistory((prev) => [...prev, viewState]);
//     setViewState(view);
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//   };

//   const handleBack = () => {
//     if (history.length > 0) {
//       const prevView = history[history.length - 1];
//       setHistory((prev) => prev.slice(0, -1));
//       setViewState(prevView);
//       if (viewState === "subCategories") setSelectedCategory(null);
//       if (viewState === "products") setSelectedSubCategory(null);
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     } else {
//       router.back();
//     }
//   };

//   const onSelectCategory = (category: Category) => {
//     setSelectedCategory(category);
//     fetchSubCategories(category._id);
//     navigateTo("subCategories");
//   };

//   const onSelectSubCategory = (subCategory: SubCategory) => {
//     setSelectedSubCategory(subCategory);
//     fetchProducts(subCategory._id);
//     navigateTo("products");
//   };

//   /* ===================== RENDER HELPERS ===================== */

//   const renderHeader = () => (
//     <View className="bg-white px-5 py-4 shadow-sm elevation-4">
//       <View className="flex-row justify-between items-center">
//         <View className="flex-row items-center">
//           {viewState !== "categories" && (
//             <TouchableOpacity onPress={handleBack} className="mr-3 p-1">
//               <ArrowLeft size={24} color="#000000ff" />
//             </TouchableOpacity>
//           )}
//           <View>
//             <Text className="text-xl font-medium text-black">
//               {viewState === "categories"
//                 ? "Crop Care"
//                 : viewState === "subCategories"
//                   ? selectedCategory?.name
//                   : selectedSubCategory?.name}
//             </Text>
//             {user && (
//               <Text className="text-xs text-black/80">
//                 Hello, {user.personalInfo.name.split(" ")[0]}
//               </Text>
//             )}
//           </View>
//         </View>
        
//         <View className="flex-row items-center">
//         <View className="flex-row items-center">
//           {user && (
//             <TouchableOpacity
//               className="mr-4 relative"
//               onPress={() => router.push("/(farmerscreen)/cropcarecart")}
//             >
//               <ShoppingCart size={24} color="#016c17ff" />
//               {cartItems.length > 0 && (
//                 <View className="absolute -top-2 -right-2 bg-[#FF5252] rounded-full w-[18px] h-[18px] items-center justify-center border-[1.5px] border-[#2c5f2d]">
//                   <Text className="text-white text-[9px] font-medium">{cartItems.length}</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           )}
//         </View>

//        <View className="flex-row items-center">
//   <TouchableOpacity
//     className="mr-4 relative"
//     onPress={() => router.push("/(farmerscreen)/cropcareorders")}
//   >
//     <ShoppingBag size={24} color="#016c17ff" />
//   </TouchableOpacity>
//       </View>
//       </View>
        
//       </View>
//     </View>
//   );

//   const renderCategoryCard = ({ item }: { item: Category }) => {
//     const imageUrl = getImageUrl(item.image);
//     console.log("Category Image Debug:", {
//       name: item.name,
//       originalImage: item.image,
//       finalUrl: imageUrl,
//       isValid: isValidImageUrl(item.image)
//     });
    
//     const shouldShowImage = imageUrl && isValidImageUrl(item.image);
    
//     return (
//       <TouchableOpacity
//         className="bg-white rounded-lg p-3 mb-4 elevation-[2] border border-black/5 flex-1 m-2"
//         onPress={() => onSelectCategory(item)}
//         activeOpacity={0.8}
//       >
//         <View className="w-full h-[100px] rounded-xl overflow-hidden mb-3 bg-gray-100 justify-center items-center">
//           {shouldShowImage ? (
//             <Image 
//               source={{ uri: imageUrl! }} 
//               className="w-full h-full" 
//               resizeMode="cover"
//               onError={(e) => console.log('Category image error:', item.name, imageUrl, e.nativeEvent.error)}
//               onLoad={() => console.log('Category image loaded successfully:', item.name, imageUrl)}
//             />
//           ) : (
//             <View className="w-full h-full bg-[#e8f5e9] justify-center items-center">
//               <Leaf size={32} color="#2c5f2d" />
//               <Text className="text-xs text-gray-500 mt-2">No image</Text>
//             </View>
//           )}
//         </View>
//         <View className="flex-1">
//           <Text className="text-[15px] font-medium text-[#333] mb-1 leading-5" numberOfLines={2}>
//             {item.name}
//           </Text>
//           <View className="flex-row items-center mt-1">
//             <Text className="text-xs text-[#2c5f2d] font-medium mr-1">View Items</Text>
//             <ChevronRight size={16} color="#2c5f2d" />
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderSubCategoryCard = ({ item }: { item: SubCategory }) => {
//     const imageUrl = getImageUrl(item.image);
//     const shouldShowImage = imageUrl && isValidImageUrl(item.image);
    
//     return (
//       <TouchableOpacity
//         className="bg-white rounded-lg p-3 mb-4 elevation-[2] border border-black/5 flex-1 m-2"
//         onPress={() => onSelectSubCategory(item)}
//         activeOpacity={0.8}
//       >
//         <View className="w-full h-[100px] rounded-xl overflow-hidden mb-3 bg-gray-100 justify-center items-center">
//           {shouldShowImage ? (
//             <Image 
//               source={{ uri: imageUrl! }} 
//               className="w-full h-full" 
//               resizeMode="cover"
//               onError={(e) => console.log('Subcategory image error:', item.name, imageUrl, e.nativeEvent.error)}
//               onLoad={() => console.log('Subcategory image loaded:', item.name, imageUrl)}
//             />
//           ) : (
//             <View className="w-full h-full bg-[#e3f2fd] justify-center items-center">
//               <Leaf size={32} color="#1565c0" />
//               <Text className="text-xs text-gray-500 mt-2">No image</Text>
//             </View>
//           )}
//         </View>
//         <View className="flex-1">
//           <Text className="text-[15px] font-medium text-[#333] mb-1 leading-5" numberOfLines={2}>
//             {item.name}
//           </Text>
//           <Text className="text-xs text-gray-500">Tap to explore</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderProductCard = ({ item }: { item: Product }) => {
//     const productImageUrl = getImageUrl(item.image);
//     const shouldShowProductImage = productImageUrl && isValidImageUrl(item.image);
    
//     return (
//       <>
//       <View className="bg-white rounded-2xl mb-4 shadow-sm elevation-[2] border border-black/5 overflow-hidden">
//         <View className="flex-row justify-between items-center p-4">
//           <View className="flex-row items-center flex-1">
//             <View className="w-12 h-12 rounded-xl bg-[#e8f5e9] justify-center items-center mr-3 overflow-hidden">
//               {shouldShowProductImage ? (
//                 <Image 
//                   source={{ uri: productImageUrl! }} 
//                   className="w-full h-full" 
//                   resizeMode="cover"
//                   onError={(e) => console.log('Product image error:', item.name, productImageUrl, e.nativeEvent.error)}
//                   onLoad={() => console.log('Product image loaded:', item.name, productImageUrl)}
//                 />
//               ) : (
//                 <Leaf size={24} color="#2c5f2d" />
//               )}
//             </View>
//             <View className="flex-1">
//               <Text className="text-base font-medium text-[#333] mb-0.5">{item.name}</Text>
//               <Text className="text-xs text-gray-500">
//                 {item.targetPestsDiseases?.length || 0} Pests/Diseases Covered
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View className="px-4 pb-4 border-t border-gray-100">
//           {/* Pests/Diseases */}
//           {item.targetPestsDiseases && item.targetPestsDiseases.length > 0 && (
//             <View className="mt-4">
//               <Text className="text-[13px] font-medium text-gray-400 mb-2 uppercase">Target Pests & Diseases</Text>
//               <View className="flex-row flex-wrap gap-2">
//                 {item.targetPestsDiseases.map((pest, idx) => (
//                   <View key={idx} className="bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
//                     <Text className="text-xs text-gray-600">{pest.name}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

          
//         </View>
        
//       </View>
       

//        {/* Recommended Seeds */}
//           <View className="px-4 pb-4 border-gray-100">
//             <Text className="text-[13px] font-medium text-gray-900 mb-2 uppercase">Recommended Seeds / Solutions</Text>
//             {item.recommendedSeeds && item.recommendedSeeds.length > 0 ? (
//               item.recommendedSeeds.map((seed, idx) => {
//                 const seedImageUrl = getImageUrl(seed.image);
//                 const shouldShowSeedImage = seedImageUrl && isValidImageUrl(seed.image);
//                 const added = isSeedInCart(seed.name);
                
//                 return (
//                   <View key={idx} className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl mb-2 border border-gray-100">
//                     <View className="flex-row items-center flex-1">
//                       {shouldShowSeedImage ? (
//                         <Image 
//                           source={{ uri: seedImageUrl! }} 
//                           className="w-10 h-10 rounded-lg mr-3" 
//                           resizeMode="cover"
//                           onError={(e) => console.log('Seed image error:', seed.name, seedImageUrl, e.nativeEvent.error)}
//                           onLoad={() => console.log('Seed image loaded:', seed.name, seedImageUrl)}
//                         />
//                       ) : (
//                         <View className="w-10 h-10 rounded-lg bg-[#f0f7f0] justify-center items-center mr-3">
//                           <Leaf size={20} color="#2c5f2d" />
//                         </View>
//                       )}
//                       <View className="flex-1">
//                         <Text className="text-sm font-medium text-[#333]">{seed.name}</Text>
//                         <Text className="text-sm font-medium text-[#2c5f2d] mt-0.5">₹{seed.price?.toFixed(2) || '0.00'}</Text>
//                       </View>
//                     </View>
//                     <TouchableOpacity
//                       className={`flex-row items-center px-3 py-2 rounded-lg ${added ? "bg-[#4CAF50]" : "bg-[#2c5f2d]"
//                         }`}
//                       onPress={() => addToCart(item, seed)}
//                       disabled={loading.cart}
//                     >
//                       {added ? (
//                         <>
//                           <Check size={16} color="#fff" />
//                           <Text className="text-white text-xs font-medium ml-1.5">Added</Text>
//                         </>
//                       ) : (
//                         <>
//                           <ShoppingCart size={16} color="#fff" />
//                           <Text className="text-white text-xs font-medium ml-1.5">Add</Text>
//                         </>
//                       )}
//                     </TouchableOpacity>
//                   </View>
//                 );
//               })
//             ) : (
//               <Text className="text-center text-gray-400 text-sm italic">No recommendations available.</Text>
//             )}
//           </View>
//       </>
//     );
//   };

//   /* ===================== MAIN RENDER ===================== */

//   if (isLoadingUser) {
//     return (
//       <View className="flex-1 justify-center items-center bg-[#F4F6F8]">
//         <ActivityIndicator size="large" color="#2c5f2d" />
//       </View>
//     );
//   }

//   return (
//     <>
//     <SafeAreaView className="flex-1 bg-white">
//       {renderHeader()}

//       <View className="flex-1">
//         {/* Categories View */}
//         {viewState === "categories" && (
//           loading.categories ? (
//             <ActivityIndicator size="large" color="#2c5f2d" className="mt-12" />
//           ) : (
//             <FlatList
//               data={categories}
//               renderItem={renderCategoryCard}
//               keyExtractor={(item) => item._id}
//               numColumns={2}
//               contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//               columnWrapperStyle={{ justifyContent: 'space-between' }}
//               showsVerticalScrollIndicator={false}
//               ListHeaderComponent={
//                 <View className="mb-5 mt-2">
//                   <Text className="text-[22px] font-medium text-[#1a1a1a]">Select Category</Text>
//                   <Text className="text-sm text-gray-500 mt-1">Browse by crop type</Text>
//                 </View>
//               }
//               ListEmptyComponent={
//                 <View className="items-center mt-12">
//                   <Text className="text-center text-gray-400 mt-8 text-base">No categories found.</Text>
//                   <TouchableOpacity 
//                     className="mt-4 bg-[#2c5f2d] px-6 py-3 rounded-lg"
//                     onPress={fetchCategories}
//                   >
//                     <Text className="text-white">Retry</Text>
//                   </TouchableOpacity>
//                 </View>
//               }
//             />
//           )
//         )}

//         {/* SubCategories View */}
//         {viewState === "subCategories" && (
//           loading.subCategories ? (
//             <ActivityIndicator size="large" color="#2c5f2d" className="mt-12" />
//           ) : (
//             <FlatList
//               data={filteredSubCategories}
//               renderItem={renderSubCategoryCard}
//               keyExtractor={(item) => item._id}
//               numColumns={2}
//               contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//               columnWrapperStyle={{ justifyContent: 'space-between' }}
//               showsVerticalScrollIndicator={false}
//               ListHeaderComponent={
//                 <View className="mb-5 mt-2">
//                   <Text className="text-[22px] font-medium text-[#1a1a1a]">{selectedCategory?.name}</Text>
//                   <Text className="text-sm text-gray-500 mt-1">Select a crop to view diseases</Text>
//                 </View>
//               }
//               ListEmptyComponent={
//                 <View className="items-center mt-12">
//                   <Text className="text-center text-gray-400 mt-8 text-base">No subcategories found.</Text>
//                   <TouchableOpacity 
//                     className="mt-4 bg-[#2c5f2d] px-6 py-3 rounded-lg"
//                     onPress={() => selectedCategory && fetchSubCategories(selectedCategory._id)}
//                   >
//                     <Text className="text-white">Retry</Text>
//                   </TouchableOpacity>
//                 </View>
//               }
//             />
//           )
//         )}

//         {/* Products View */}
//         {viewState === "products" && (
//           loading.products ? (
//             <ActivityIndicator size="large" color="#2c5f2d" className="mt-12" />
//           ) : (
//             <FlatList
//               data={filteredProducts}
//               renderItem={renderProductCard}
//               keyExtractor={(item) => item._id}
//               contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//               showsVerticalScrollIndicator={false}
//               ListHeaderComponent={

                 

//                 <View className="mb-5 mt-2">
//                   <Text className="text-[22px] font-medium text-red-600">Diseases <Text className="text-[22px] font-medium text-black">& </Text><Text className="text-[22px] font-medium text-green-800">Solutions</Text></Text>
//                   <Text className="text-sm text-green-800 mt-1 mb-4">{selectedSubCategory?.name}</Text>
                   
//                    <View className="w-full h-48 bg-black/90 rounded-xl overflow-hidden justify-center items-center mb-6 relative shadow-sm elevation-4">
//                     <Image
//                       source={{ uri: "https://img.freepik.com/free-photo/smart-farming-with-iot-futuristic-agriculture-concept_53876-124627.jpg" }}
//                       className="absolute w-full h-full opacity-60"
//                       resizeMode="cover"
//                       onError={() => console.log('Demo image failed to load')}
//                     />
//                     <View className="w-16 h-16 bg-white/20 rounded-full justify-center items-center backdrop-blur-sm border border-white/30">
//                       <View className="w-12 h-12 bg-[#2c5f2d] rounded-full justify-center items-center pl-1">
//                         <Leaf size={24} color="#fff" fill="#fff" />
//                       </View>
//                     </View>
//                     <Text className="text-white font-medium mt-3 bg-black/40 px-3 py-1 rounded-full text-xs">
//                       Watch Demo: How to treat {selectedSubCategory?.name}
//                     </Text>
//                   </View>

//                   <Text className="text-lg font-medium text-gray-700 mb-2 uppercase mb-2 text-base">Recommended Products</Text>
//                   <Text className="text-sm text-gray-500 mb-4">
//                     Found {filteredProducts.length} product(s)
//                   </Text>
//                 </View>
//               }
//               ListEmptyComponent={
//                 <View className="items-center mt-12">
//                   <Text className="text-center text-gray-400 mt-8 text-base">No products found for this subcategory.</Text>
//                   <TouchableOpacity 
//                     className="mt-4 bg-[#2c5f2d] px-6 py-3 rounded-lg"
//                     onPress={() => selectedSubCategory && fetchProducts(selectedSubCategory._id)}
//                   >
//                     <Text className="text-white">Retry</Text>
//                   </TouchableOpacity>
//                 </View>
//               }
//             />
//           )
//         )}
//       </View>

//       {/* Login Modal */}
//       <Modal
//         visible={showLoginModal}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowLoginModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center">
//           <View className="bg-white rounded-[20px] p-6 w-4/5 items-center elevation-[5]">
//             <View className="w-[60px] h-[60px] rounded-full bg-[#FF5252] justify-center items-center mb-4">
//               <LogOut size={32} color="#fff" />
//             </View>
//             <Text className="text-xl font-medium mb-2 text-[#333]">Login Required</Text>
//             <Text className="text-[15px] text-gray-500 text-center mb-6">
//               Please login to access Crop Care features.
//             </Text>
//             <View className="flex-row w-full justify-between gap-3">
//               <TouchableOpacity
//                 className="flex-1 py-3 rounded-[10px] items-center justify-center bg-gray-100"
//                 onPress={() => {
//                   setShowLoginModal(false);
//                   router.back();
//                 }}
//               >
//                 <Text className="text-gray-500 text-sm font-medium">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="flex-1 py-3 rounded-[10px] items-center justify-center bg-[#2c5f2d]"
//                 onPress={() => {
//                   setShowLoginModal(false);
//                   router.push("/(auth)/Login?role=farmer");
//                 }}
//               >
//                 <Text className="text-white text-sm font-medium">Login</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>

//     <CustomAlert
//   visible={showAlert}
//   title={alertTitle}
//   message={alertMessage}
//   onClose={() => {
//     setShowAlert(false);
//     if (alertAction) alertAction();
//   }}
// />

//     </>
//   );
// }




//updated 12/01


import CustomAlert from "@/components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useNavigation } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Leaf,
  LogOut,
  ShoppingBag,
  ShoppingCart
} from "lucide-react-native";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  LayoutAnimation,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/* ===================== INTERFACES ===================== */

interface Category {
  _id: string;
  name: string;
  image?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface SubCategory {
  _id: string;
  name: string;
  image?: string;
  categoryId: string | { _id: string; name: string };
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface TargetPestDisease {
  _id?: string;
  name: string;
  image?: string;
}

interface RecommendedSeed {
  _id?: string;
  name: string;
  image?: string;
  price: number;
  stock?: number;
  unit?: string;
  weight?: number;
  weightUnit?: string;
  listPrice?: number;
  discount?: number;
  finalPrice?: number;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  subCategoryId:
  | string
  | { _id: string; name: string; categoryId: { _id: string; name: string } };
  targetPestsDiseases: TargetPestDisease[];
  recommendedSeeds: RecommendedSeed[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  image?: string;
}

interface User {
  _id: string;
  personalInfo: { name: string; mobileNo: string };
  role: string;
  farmerId?: string;
}

interface CartItem {
  productId: string;
  productName: string;
  seedId?: string;
  seedName: string;
  seedPrice: number;
  quantity: number;
  image?: string;
  seedData?: RecommendedSeed;
}

/* ===================== CONSTANTS ===================== */

const { width } = Dimensions.get("window");

type ViewState = "categories" | "subCategories" | "products";

/* ===================== COMPONENT ===================== */

export default function Cropcare() {
  const navigation = useNavigation();

  // Navigation State
  const [viewState, setViewState] = useState<ViewState>("categories");
  const [history, setHistory] = useState<ViewState[]>([]);

  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Selection State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  // User & Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState<null | (() => void)>(null);

  const showAppAlert = (title: string, message: string, action?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertAction(() => action || null);
    setShowAlert(true);
  };

  // Loading states
  const [loading, setLoading] = useState({
    categories: false,
    subCategories: false,
    products: false,
    cart: false,
  });

  // API URLs
  const CROPCARE_API = "https://kisanadmin.etpl.ai/api/cropcare";
  const BASE_URL = "https://kisanadmin.etpl.ai";
  const CART_API = "https://kisan.etpl.ai/api";

  /* ===================== AUTH ===================== */

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    setIsLoadingUser(true);
    try {
      const [userData, role, userId, farmerId] = await Promise.all([
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("userRole"),
        AsyncStorage.getItem("userId"),
        AsyncStorage.getItem("farmerId"),
      ]);

      if (userData && role && userId) {
        const parsed = JSON.parse(userData);
        const userObj: User = {
          _id: userId,
          role,
          personalInfo: {
            name: parsed.personalInfo?.name || parsed.name || "User",
            mobileNo: parsed.personalInfo?.mobileNo || parsed.mobileNo || "",
          },
        };
        if (farmerId) userObj.farmerId = farmerId;
        setUser(userObj);
      } else {
        setShowLoginModal(true);
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setShowLoginModal(true);
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
      setCartItems([]);
      setShowLoginModal(true);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* ===================== DATA FETCHING ===================== */

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchUserCart();
    }
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const res = await axios.get(`${CROPCARE_API}/categories`);
      console.log('Categories API Response:', res.data);
      
      // Handle MongoDB response with $oid
      if (res.data && Array.isArray(res.data)) {
        const activeCategories = res.data.filter(
          (c: Category) => c.status === "active"
        );
        
        // Normalize _id format
        const normalizedCategories = activeCategories.map((cat: any) => ({
          ...cat,
          _id: cat._id?.$oid || cat._id
        }));
        
        setCategories(normalizedCategories);
      } else if (res.data.success && Array.isArray(res.data.data)) {
        const activeCategories = res.data.data.filter(
          (c: Category) => c.status === "active"
        );
        
        // Normalize _id format
        const normalizedCategories = activeCategories.map((cat: any) => ({
          ...cat,
          _id: cat._id?.$oid || cat._id
        }));
        
        setCategories(normalizedCategories);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err.message);
      showAppAlert("Error", "Failed to load categories");
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    if (!user) return;
    setLoading((prev) => ({ ...prev, subCategories: true }));
    try {
      const res = await axios.get(`${CROPCARE_API}/subcategories`);
      console.log('SubCategories API Response:', res.data);
      
      let allSubs: any[] = [];
      
      // Handle response
      if (res.data && Array.isArray(res.data)) {
        allSubs = res.data;
      } else if (res.data.success && Array.isArray(res.data.data)) {
        allSubs = res.data.data;
      } else if (res.data.success && Array.isArray(res.data.subcategories)) {
        allSubs = res.data.subcategories;
      }
      
      // Normalize IDs
      const normalizedSubs = allSubs.map((sub: any) => ({
        ...sub,
        _id: sub._id?.$oid || sub._id,
        categoryId: sub.categoryId?.$oid || sub.categoryId?._id?.$oid || sub.categoryId?._id || sub.categoryId
      }));
      
      console.log('Normalized subcategories:', normalizedSubs);
      
      // Filter active subs for this category
      const relevantSubs = normalizedSubs.filter((sub: SubCategory) => {
        return sub.status === "active" && 
               sub.categoryId === categoryId;
      });
      
      console.log('Filtered subcategories:', relevantSubs);
      setFilteredSubCategories(relevantSubs);
    } catch (err: any) {
      console.error("Error fetching subcategories:", err.message);
      showAppAlert("Error", "Failed to load subcategories");
    } finally {
      setLoading((prev) => ({ ...prev, subCategories: false }));
    }
  };

  const fetchProducts = async (subId: string) => {
    if (!user) return;
    setLoading((prev) => ({ ...prev, products: true }));
    try {
      const res = await axios.get(`${CROPCARE_API}/products`);
      console.log('Products API Response:', res.data);
      
      let allProducts: any[] = [];
      
      // Handle response
      if (res.data && Array.isArray(res.data)) {
        allProducts = res.data;
      } else if (res.data.success && Array.isArray(res.data.data)) {
        allProducts = res.data.data;
      } else if (res.data.success && Array.isArray(res.data.products)) {
        allProducts = res.data.products;
      }
      
      // Normalize IDs
      const normalizedProducts = allProducts.map((prod: any) => ({
        ...prod,
        _id: prod._id?.$oid || prod._id,
        subCategoryId: prod.subCategoryId?.$oid || prod.subCategoryId?._id?.$oid || prod.subCategoryId?._id || prod.subCategoryId,
        targetPestsDiseases: prod.targetPestsDiseases?.map((pest: any) => ({
          ...pest,
          _id: pest._id?.$oid || pest._id
        })) || [],
        recommendedSeeds: prod.recommendedSeeds?.map((seed: any) => ({
          ...seed,
          _id: seed._id?.$oid || seed._id,
          // Calculate price based on available fields
          price: seed.finalPrice || seed.listPrice || seed.price || 0
        })) || []
      }));
      
      console.log('Normalized products:', normalizedProducts);
      
      // Filter active products for this subcategory
      const relevantProducts = normalizedProducts.filter((p: Product) => {
        return p.status === "active" && p.subCategoryId === subId;
      });
      
      console.log('Filtered products:', relevantProducts);
      setFilteredProducts(relevantProducts);
    } catch (err: any) {
      console.error("Error fetching products:", err.message);
      showAppAlert("Error", "Failed to load products");
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const fetchUserCart = async () => {
    if (!user) return;
    setLoading((prev) => ({ ...prev, cart: true }));
    try {
      const idToUse = user.farmerId || user._id;
      console.log('Fetching cart for user:', idToUse);
      
      const res = await axios.get(`${CART_API}/cropcare/cart/${idToUse}`);
      console.log('Cart API Response:', res.data);
      
      if (res.data.success) {
        setCartItems(res.data.data?.items || []);
      } else {
        setCartItems([]);
      }
    } catch (err: any) {
      console.error('Error fetching cart:', err.message);
      console.error('Error details:', err.response?.data);
      setCartItems([]);
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  };

  /* ===================== CART OPERATIONS ===================== */

  const addToCart = async (product: Product, seed: RecommendedSeed) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setLoading((prev) => ({ ...prev, cart: true }));
    try {
      const cartItem = {
        productId: product._id,
        productName: product.name,
        seedId: seed._id || `seed-${seed.name}`,
        seedName: seed.name,
        seedPrice: seed.price,
        quantity: 1,
        image: seed.image,
        seedData: seed
      };

      const idToUse = user.farmerId || user._id;
      console.log('Adding to cart for user:', idToUse);
      console.log('Cart item:', cartItem);
      
      const res = await axios.post(`${CART_API}/cropcare/cart/add`, {
        userId: idToUse,
        item: cartItem,
      });

      console.log('Add to cart response:', res.data);
      
      if (res.data.success) {
        setCartItems(res.data.data?.items || []);
        showAppAlert("Success", `${seed.name} added to cart!`, fetchUserCart);
      } else {
        showAppAlert("Error", res.data.message || "Failed to add to cart");
      }
    } catch (err: any) {
      console.error('Add to cart error:', err.response?.data || err.message);
      showAppAlert("Error", err.response?.data?.message || "Failed to add to cart. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  };

  const isSeedInCart = (seedId: string): boolean => {
    return cartItems.some((item) => item.seedId === seedId);
  };

  /* ===================== IMAGE HELPER ===================== */

  const getImageUrl = (imagePath?: string): string | null => {
    if (!imagePath) return null;
    
    // Remove any leading dots or extra slashes
    const cleanPath = imagePath.replace(/^\.+/, '').replace(/\/\//g, '/');
    
    // If it's already a full URL, return as is
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return cleanPath;
    }
    
    // If it starts with /uploads, prepend base URL
    if (cleanPath.startsWith('/uploads/')) {
      return `${BASE_URL}${cleanPath}`;
    }
    
    // If it starts with uploads (without slash), add slash
    if (cleanPath.startsWith('uploads/')) {
      return `${BASE_URL}/${cleanPath}`;
    }
    
    // If it's just a filename, assume it's in uploads folder
    if (cleanPath.includes('.jpg') || cleanPath.includes('.jpeg') || 
        cleanPath.includes('.png') || cleanPath.includes('.gif') ||
        cleanPath.includes('.webp') || cleanPath.includes('.jfif')) {
      return `${BASE_URL}/uploads/${cleanPath}`;
    }
    
    // Default: prepend with /uploads/
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    
    const fullUrl = getImageUrl(url);
    if (!fullUrl) return false;
    
    // Check if it's a valid URL pattern
    const urlPattern = /^(https?:\/\/)/i;
    if (!urlPattern.test(fullUrl)) return false;
    
    // Check for image file extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg|jfif)$/i;
    if (imageExtensions.test(fullUrl)) return true;
    
    // Check for uploads directory in path
    if (fullUrl.includes('/uploads/')) return true;
    
    return false;
  };

  /* ===================== NAVIGATION HANDLERS ===================== */

  const navigateTo = (view: ViewState) => {
    setHistory((prev) => [...prev, viewState]);
    setViewState(view);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevView = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setViewState(prevView);
      if (viewState === "subCategories") setSelectedCategory(null);
      if (viewState === "products") setSelectedSubCategory(null);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } else {
      router.back();
    }
  };

  const onSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    fetchSubCategories(category._id);
    navigateTo("subCategories");
  };

  const onSelectSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    fetchProducts(subCategory._id);
    navigateTo("products");
  };

  /* ===================== RENDER HELPERS ===================== */

  const renderHeader = () => (
    <View className="bg-white px-5 py-4 shadow-sm elevation-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          {viewState !== "categories" && (
            <TouchableOpacity onPress={handleBack} className="mr-3 p-1">
              <ArrowLeft size={24} color="#000000ff" />
            </TouchableOpacity>
          )}
          <View>
            <Text className="text-xl font-medium text-black">
              {viewState === "categories"
                ? "Crop Care"
                : viewState === "subCategories"
                  ? selectedCategory?.name
                  : selectedSubCategory?.name}
            </Text>
            {user && (
              <Text className="text-xs text-black/80">
                Hello, {user.personalInfo.name.split(" ")[0]}
              </Text>
            )}
          </View>
        </View>
        
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            {user && (
              <TouchableOpacity
                className="mr-4 relative"
                onPress={() => router.push("/(farmerscreen)/cropcarecart")}
              >
                <ShoppingCart size={24} color="#016c17ff" />
                {cartItems.length > 0 && (
                  <View className="absolute -top-2 -right-2 bg-[#FF5252] rounded-full w-[18px] h-[18px] items-center justify-center border-[1.5px] border-[#2c5f2d]">
                    <Text className="text-white text-[9px] font-medium">{cartItems.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              className="relative"
              onPress={() => router.push("/(farmerscreen)/cropcareorders")}
            >
              <ShoppingBag size={24} color="#016c17ff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCategoryCard = ({ item }: { item: Category }) => {
    const imageUrl = getImageUrl(item.image);
    
    return (
      <TouchableOpacity
        className="bg-white rounded-lg p-3 mb-4 elevation-[2] border border-black/5 flex-1 m-1"
        onPress={() => onSelectCategory(item)}
        activeOpacity={0.8}
        style={{ width: (width - 48) / 2 }}
      >
        <View className="w-full h-[100px] rounded-xl overflow-hidden mb-3 bg-gray-100 justify-center items-center">
          {imageUrl && isValidImageUrl(item.image) ? (
            <Image 
              source={{ uri: imageUrl }} 
              className="w-full h-full" 
              resizeMode="cover"
              defaultSource={require('../../assets/images/green-bg.jpg')}
            />
          ) : (
            <View className="w-full h-full bg-[#e8f5e9] justify-center items-center">
              <Leaf size={32} color="#2c5f2d" />
              <Text className="text-xs text-gray-500 mt-2">No image</Text>
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-medium text-[#333] mb-1 leading-5 text-center" numberOfLines={2}>
            {item.name}
          </Text>
          <View className="flex-row items-center justify-center mt-1">
            <Text className="text-xs text-[#2c5f2d] font-medium mr-1">View Items</Text>
            <ChevronRight size={16} color="#2c5f2d" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSubCategoryCard = ({ item }: { item: SubCategory }) => {
    const imageUrl = getImageUrl(item.image);
    
    return (
      <TouchableOpacity
        className="bg-white rounded-lg p-3 mb-4 elevation-[2] border border-black/5 flex-1 m-1"
        onPress={() => onSelectSubCategory(item)}
        activeOpacity={0.8}
        style={{ width: (width - 48) / 2 }}
      >
        <View className="w-full h-[100px] rounded-xl overflow-hidden mb-3 bg-gray-100 justify-center items-center">
          {imageUrl && isValidImageUrl(item.image) ? (
            <Image 
              source={{ uri: imageUrl }} 
              className="w-full h-full" 
              resizeMode="cover"
              defaultSource={require('../../assets/images/green-bg.jpg')}
            />
          ) : (
            <View className="w-full h-full bg-[#e3f2fd] justify-center items-center">
              <Leaf size={32} color="#1565c0" />
              <Text className="text-xs text-gray-500 mt-2">No image</Text>
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-medium text-[#333] mb-1 leading-5 text-center" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="text-xs text-gray-500 text-center">Tap to explore</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const productImageUrl = getImageUrl(item.image);
    
    return (
      <View className="bg-white rounded-2xl mb-4 shadow-sm elevation-[2] border border-black/5 overflow-hidden">
        <View className="flex-row justify-between items-center p-4">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-xl bg-[#e8f5e9] justify-center items-center mr-3 overflow-hidden">
              {productImageUrl && isValidImageUrl(item.image) ? (
                <Image 
                  source={{ uri: productImageUrl }} 
                  className="w-full h-full" 
                  resizeMode="cover"
                  defaultSource={require('../../assets/images/green-bg.jpg')}
                />
              ) : (
                <Leaf size={24} color="#2c5f2d" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-[#333] mb-0.5">{item.name}</Text>
              {item.description && (
                <Text className="text-xs text-gray-500" numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Pests/Diseases Section */}
        {item.targetPestsDiseases && item.targetPestsDiseases.length > 0 && (
          <View className="px-4 pb-4">
            <Text className="text-[13px] font-medium text-gray-600 mb-2">Target Pests & Diseases</Text>
            <View className="flex-row flex-wrap gap-2">
              {item.targetPestsDiseases.map((pest, idx) => {
                const pestImageUrl = getImageUrl(pest.image);
                return (
                  <View key={pest._id || idx} className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex-row items-center min-w-[120px]">
                    {pestImageUrl && isValidImageUrl(pest.image) ? (
                      <Image 
                        source={{ uri: pestImageUrl }} 
                        className="w-8 h-8 rounded-md mr-2"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-8 h-8 rounded-md bg-gray-200 mr-2 justify-center items-center">
                        <Leaf size={14} color="#666" />
                      </View>
                    )}
                    <Text className="text-xs text-gray-700 flex-1" numberOfLines={1}>{pest.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Recommended Seeds Section */}
        <View className="px-4 pb-4">
          <Text className="text-[13px] font-medium text-gray-600 mb-2">Recommended Seeds / Solutions</Text>
          {item.recommendedSeeds && item.recommendedSeeds.length > 0 ? (
            item.recommendedSeeds.map((seed, idx) => {
              const seedImageUrl = getImageUrl(seed.image);
              const seedId = seed._id || `seed-${seed.name}-${idx}`;
              const added = isSeedInCart(seedId);
              
              return (
                <View key={seedId} className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl mb-2 border border-gray-100">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-lg bg-gray-100 justify-center items-center mr-3 overflow-hidden">
                      {seedImageUrl && isValidImageUrl(seed.image) ? (
                        <Image 
                          source={{ uri: seedImageUrl }} 
                          className="w-full h-full" 
                          resizeMode="cover"
                        />
                      ) : (
                        <Leaf size={20} color="#2c5f2d" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-[#333]">{seed.name}</Text>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-sm font-medium text-[#2c5f2d]">₹{seed.price?.toFixed(2)}</Text>
                        {seed.listPrice && seed.listPrice > seed.price && (
                          <Text className="text-xs text-gray-400 line-through ml-2">₹{seed.listPrice.toFixed(2)}</Text>
                        )}
                        {seed.discount && seed.discount > 0 && (
                          <Text className="text-xs text-green-600 font-medium ml-2">{seed.discount}% off</Text>
                        )}
                      </View>
                      {seed.stock !== undefined && (
                        <Text className="text-xs text-gray-500 mt-1">Stock: {seed.stock} {seed.unit || 'units'}</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    className={`flex-row items-center px-4 py-2 rounded-lg ${added ? "bg-[#4CAF50]" : "bg-[#2c5f2d]"
                      }`}
                    onPress={() => addToCart(item, seed)}
                    disabled={loading.cart}
                  >
                    {added ? (
                      <>
                        <Check size={16} color="#fff" />
                        <Text className="text-white text-xs font-medium ml-1.5">Added</Text>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} color="#fff" />
                        <Text className="text-white text-xs font-medium ml-1.5">Add</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text className="text-center text-gray-400 text-sm italic py-4">No recommendations available.</Text>
          )}
        </View>
      </View>
    );
  };

  /* ===================== MAIN RENDER ===================== */

  if (isLoadingUser) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F4F6F8]">
        <ActivityIndicator size="large" color="#2c5f2d" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        {renderHeader()}

        <View className="flex-1">
          {/* Categories View */}
          {viewState === "categories" && (
            loading.categories ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2c5f2d" />
              </View>
            ) : (
              <FlatList
                data={categories}
                renderItem={renderCategoryCard}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={{ padding: 16 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View className="mb-5">
                    <Text className="text-[22px] font-medium text-[#1a1a1a]">Select Category</Text>
                    <Text className="text-sm text-gray-500 mt-1">Browse by crop type</Text>
                  </View>
                }
                ListEmptyComponent={
                  <View className="items-center justify-center py-20">
                    <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4">
                      <Leaf size={32} color="#666" />
                    </View>
                    <Text className="text-gray-500 text-base mb-2">No categories found</Text>
                    <TouchableOpacity 
                      className="mt-4 bg-[#2c5f2d] px-6 py-3 rounded-lg"
                      onPress={fetchCategories}
                    >
                      <Text className="text-white font-medium">Retry</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            )
          )}

          {/* SubCategories View */}
          {viewState === "subCategories" && (
            loading.subCategories ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2c5f2d" />
              </View>
            ) : (
              <FlatList
                data={filteredSubCategories}
                renderItem={renderSubCategoryCard}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={{ padding: 16 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View className="mb-5">
                    <Text className="text-[22px] font-medium text-[#1a1a1a]">{selectedCategory?.name}</Text>
                    <Text className="text-sm text-gray-500 mt-1">Select a crop to view diseases</Text>
                  </View>
                }
                ListEmptyComponent={
                  <View className="items-center justify-center py-20">
                    <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4">
                      <Leaf size={32} color="#666" />
                    </View>
                    <Text className="text-gray-500 text-base mb-2">No subcategories found</Text>
                    <TouchableOpacity 
                      className="mt-4 bg-[#2c5f2d] px-6 py-3 rounded-lg"
                      onPress={() => selectedCategory && fetchSubCategories(selectedCategory._id)}
                    >
                      <Text className="text-white font-medium">Retry</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            )
          )}

          {/* Products View */}
          {viewState === "products" && (
            loading.products ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2c5f2d" />
              </View>
            ) : (
              <FlatList
                data={filteredProducts}
                renderItem={renderProductCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View className="mb-5">
                    <Text className="text-[22px] font-medium text-[#1a1a1a] mb-2">{selectedSubCategory?.name}</Text>
                    <Text className="text-sm text-gray-500 mb-4">
                      Found {filteredProducts.length} product(s)
                    </Text>
                    
                    {/* Demo Section */}
                    <View className="w-full h-48 bg-black/90 rounded-xl overflow-hidden justify-center items-center mb-6 relative">
                      <Image
                        source={{ uri: "https://img.freepik.com/free-photo/smart-farming-with-iot-futuristic-agriculture-concept_53876-124627.jpg" }}
                        className="absolute w-full h-full opacity-60"
                        resizeMode="cover"
                      />
                      <View className="w-16 h-16 bg-white/20 rounded-full justify-center items-center backdrop-blur-sm border border-white/30">
                        <View className="w-12 h-12 bg-[#2c5f2d] rounded-full justify-center items-center">
                          <Leaf size={24} color="#fff" />
                        </View>
                      </View>
                      <Text className="text-white font-medium mt-3 bg-black/40 px-3 py-1 rounded-full text-xs">
                        Watch Demo: How to treat {selectedSubCategory?.name}
                      </Text>
                    </View>

                    <Text className="text-lg font-medium text-gray-700 mb-2">Recommended Products</Text>
                  </View>
                }
                ListEmptyComponent={
                  <View className="items-center justify-center py-20">
                    <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4">
                      <Leaf size={32} color="#666" />
                    </View>
                    <Text className="text-gray-500 text-base mb-2">No products found</Text>
                    <TouchableOpacity 
                      className="mt-4 bg-[#2c5f2d] px-6 py-3 rounded-lg"
                      onPress={() => selectedSubCategory && fetchProducts(selectedSubCategory._id)}
                    >
                      <Text className="text-white font-medium">Retry</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            )
          )}
        </View>

        {/* Login Modal */}
        <Modal
          visible={showLoginModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLoginModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-[20px] p-6 w-full max-w-sm items-center elevation-[5]">
              <View className="w-[60px] h-[60px] rounded-full bg-[#FF5252] justify-center items-center mb-4">
                <LogOut size={32} color="#fff" />
              </View>
              <Text className="text-xl font-medium mb-2 text-[#333]">Login Required</Text>
              <Text className="text-[15px] text-gray-500 text-center mb-6">
                Please login to access Crop Care features.
              </Text>
              <View className="flex-row w-full gap-3">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-[10px] items-center justify-center bg-gray-100"
                  onPress={() => {
                    setShowLoginModal(false);
                    router.back();
                  }}
                >
                  <Text className="text-gray-500 text-sm font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-[10px] items-center justify-center bg-[#2c5f2d]"
                  onPress={() => {
                    setShowLoginModal(false);
                    router.push("/(auth)/Login?role=farmer");
                  }}
                >
                  <Text className="text-white text-sm font-medium">Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      <CustomAlert
        visible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
          setShowAlert(false);
          if (alertAction) alertAction();
        }}
      />
    </>
  );
}