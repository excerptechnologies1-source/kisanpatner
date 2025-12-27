import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import axios from "axios";
import { CropIcon, Check, ShoppingCart, LogOut,ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

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
  name: string;
  image?: string;
}

interface RecommendedSeed {
  _id?: string;
  name: string;
  image?: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  subCategoryId:
    | string
    | { _id: string; name: string; categoryId: { _id: string; name: string } };
  targetPestsDiseases: TargetPestDisease[];
  recommendedSeeds: RecommendedSeed[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
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
}

/* ===================== COMPONENT ===================== */

export default function Cropcare() {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Loading states
  const [loading, setLoading] = useState({
    categories: false,
    subCategories: false,
    products: false,
    cart: false,
  });

  // API URLs
  const CROPCARE_API = "https://kisanadmin.etpl.ai/api/cropcare";
  const CART_API = "https://kisan.etpl.ai/api";

  /* ===================== AUTH ===================== */

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    setIsLoadingUser(true);
    try {
      // Check all required authentication items
      const [userData, role, userId, farmerId] = await Promise.all([
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("userRole"),
        AsyncStorage.getItem("userId"),
        AsyncStorage.getItem("farmerId"),
      ]);

      console.log("Auth check:", { userData, role, userId, farmerId });

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

        // Add farmerId if available
        if (farmerId) {
          userObj.farmerId = farmerId;
        }

        setUser(userObj);
        console.log("User authenticated:", userObj);
      } else {
        console.log("User not authenticated, showing login modal");
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

  const handleLogin = () => {
    setShowLoginModal(false);
    router.push("/(auth)/Login?role=farmer");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
      setCartItems([]);
      setShowLoginModal(true);
      Alert.alert("Logged out", "You have been logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchSubCategories();
      fetchUserCart();
    }
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;
    
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const res = await axios.get(`${CROPCARE_API}/categories`);
      if (res.data.success) {
        const activeCategories = res.data.data.filter(
          (c: Category) => c.status === "active"
        );
        setCategories(activeCategories);

        // Auto-select first category
        if (activeCategories.length > 0 && !selectedCategory) {
          setSelectedCategory(activeCategories[0]._id);
        }
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const fetchSubCategories = async () => {
    if (!user) return;
    
    setLoading((prev) => ({ ...prev, subCategories: true }));
    try {
      const res = await axios.get(`${CROPCARE_API}/subcategories`);
      if (res.data.success) {
        setSubCategories(
          res.data.data.filter((s: SubCategory) => s.status === "active")
        );
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    } finally {
      setLoading((prev) => ({ ...prev, subCategories: false }));
    }
  };

  const fetchProducts = async (subId: string) => {
    if (!user) return;
    
    setLoading((prev) => ({ ...prev, products: true }));
    try {
      const res = await axios.get(`${CROPCARE_API}/products`);
      if (res.data.success) {
        // Handle both string and object subCategoryId
        const filteredProducts = res.data.data.filter((p: Product) => {
          const productSubCatId =
            typeof p.subCategoryId === "string"
              ? p.subCategoryId
              : p.subCategoryId._id;
          return productSubCatId === subId && p.status === "active";
        });

        console.log("Filtered products:", filteredProducts.length);
        setProducts(filteredProducts);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      Alert.alert("Error", "Failed to load products");
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  /* ===================== CART ===================== */

  const fetchUserCart = async () => {
    if (!user) return;

    setLoading((prev) => ({ ...prev, cart: true }));
    try {
      // Use farmerId if available, otherwise use userId
      const idToUse = user.farmerId || user._id;
      const res = await axios.get(`${CART_API}/cropcare/cart/${idToUse}`);
      if (res.data.success) {
        setCartItems(res.data.data.items || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  };

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
        seedId: seed._id || seed.name,
        seedName: seed.name,
        seedPrice: seed.price,
        quantity: 1,
        image: seed.image,
      };

      // Use farmerId if available, otherwise use userId
      const idToUse = user.farmerId || user._id;
      
      const res = await axios.post(`${CART_API}/cropcare/cart/add`, {
        userId: idToUse,
        item: cartItem,
      });

      if (res.data.success) {
        setCartItems(res.data.data.items);
        Alert.alert("Success", `${seed.name} added to cart!`);
      }
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to add to cart"
      );
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  };

  const isSeedInCart = (seedName: string): boolean => {
    return cartItems.some((item) => item.seedName === seedName);
  };

  const getSeedCartQuantity = (seedName: string): number => {
    const item = cartItems.find((item) => item.seedName === seedName);
    return item ? item.quantity : 0;
  };

  /* ===================== FILTERING ===================== */

  const getFilteredSubCategories = () => {
    if (!selectedCategory) return [];
    return subCategories.filter((sub) => {
      const catId =
        typeof sub.categoryId === "string"
          ? sub.categoryId
          : sub.categoryId._id;
      return catId === selectedCategory;
    });
  };

  /* ===================== HANDLERS ===================== */

  const handleCategorySelect = (catId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setSelectedCategory(catId);
    setSelectedSubCategory(null);
    setSelectedProduct(null);
    setProducts([]);
  };

  const handleSubCategorySelect = (subId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setSelectedSubCategory(subId);
    setSelectedProduct(null);
    fetchProducts(subId);
  };

  /* ===================== RENDER ===================== */

  if (isLoadingUser) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2c5f2d" />
          <Text className="mt-4 text-base text-gray-600">Checking authentication...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* HEADER */}
<View className="rounded-b-3xl px-4 py-2 border-b border-gray-200">
  <View className="flex-row items-center justify-start">
    <TouchableOpacity
      onPress={() => router.push('/(farmer)/home')}
      className="p-2"
    >
      <ChevronLeft size={24} color="#374151" />
    </TouchableOpacity>
    
    {/* Add icon before the text */}
    <View className="ml-2 flex-row items-center">
      <Text className="text-2xl font-medium text-black ml-2">Crop Care</Text>
    </View>
  </View>

  {user ? (
    <View className="flex-row items-center justify-between mt-2">
      <Text className="font-medium text-black">
        Welcome, {user.personalInfo.name}
      </Text>

      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full mr-3"
        >
          <LogOut size={14} color="#920505ff" />
          <Text className="text-black font-medium ml-1 font-medium">Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(farmerscreen)/cropcarecart")}
          className="bg-emerald-50 p-3 rounded-full relative"
        >
          <ShoppingCart size={22} color="#015e2fff" />
          {cartItems.length > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center">
              <Text className="text-black text-xs font-medium">
                {cartItems.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <Text className="font-medium text-green-100 mt-1">
      Please login to continue
    </Text>
  )}
</View>

<ScrollView
  className="flex-1 px-4"
  contentContainerStyle={{ paddingBottom: 40 }}
  showsVerticalScrollIndicator={false}
>
  <View className="mt-6">
  <Text className="text-lg font-medium text-gray-800 mb-3">
    Categories
  </Text>

  {loading.categories ? (
    <ActivityIndicator color="#2c5f2d" />
  ) : categories.length === 0 ? (
    <Text className="font-medium text-gray-500">No categories available</Text>
  ) : (
    categories.map((cat) => {
      const isSelected = selectedCategory === cat._id;

      return (
        <TouchableOpacity
          key={cat._id}
          onPress={() => handleCategorySelect(cat._id)}
          className={`
            bg-white rounded-2xl px-4 py-4 mb-2
            flex-row items-center justify-between
            shadow-sm
            ${isSelected
              ? "border-2 border-green-700 bg-green-50"
              : "border border-gray-100"}
          `}
        >
          <Text className="text-base font-medium text-gray-800">
            {cat.name}
          </Text>

          {isSelected && <Check size={18} color="#2c5f2d" />}
        </TouchableOpacity>
      );
    })
  )}
</View>

{selectedCategory && (
  <View className="mt-6">
    <Text className="text-lg font-medium text-gray-800 mb-3">
      Subcategories
    </Text>

    {loading.subCategories ? (
      <ActivityIndicator color="#2c5f2d" />
    ) : getFilteredSubCategories().length === 0 ? (
      <Text className="font-medium text-gray-500">
        No subcategories available
      </Text>
    ) : (
      getFilteredSubCategories().map((sub) => {
        const isSelected = selectedSubCategory === sub._id;

        return (
          <TouchableOpacity
            key={sub._id}
            onPress={() => handleSubCategorySelect(sub._id)}
            className={`
              bg-white rounded-2xl px-4 py-4 mb-2
              flex-row items-center justify-between
              shadow-sm
              ${isSelected
                ? "border-2 border-green-700 bg-green-50"
                : "border border-gray-100"}
            `}
          >
            <Text className="text-base font-medium text-gray-800">
              {sub.name}
            </Text>

            {isSelected && <Check size={18} color="#2c5f2d" />}
          </TouchableOpacity>
        );
      })
    )}
  </View>
)}

{selectedSubCategory && (
  <View className="mt-6">
    <Text className="text-lg font-medium text-gray-800 mb-3">
      Products
    </Text>

    {loading.products ? (
      <ActivityIndicator color="#2c5f2d" />
    ) : products.length === 0 ? (
      <Text className="font-medium text-gray-500">
        No products available
      </Text>
    ) : (
      products.map((product) => (
        <View
          key={product._id}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-semibold text-gray-800 flex-1">
              {product.name}
            </Text>

            <TouchableOpacity
              onPress={() =>
                setSelectedProduct(
                  selectedProduct?._id === product._id
                    ? null
                    : product
                )
              }
            >
              <Text className="font-medium text-green-700 font-medium">
                {selectedProduct?._id === product._id ? "Hide" : "Details"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Expanded details */}
          {selectedProduct?._id === product._id && (
            <View className="mt-3 bg-gray-50 rounded-xl p-3">
              <Text className="text-xs font-semibold text-gray-500 mb-2">
                Target Pests / Diseases
              </Text>

              {product.targetPestsDiseases.map((pest, i) => (
                <Text key={i} className="font-medium text-gray-600 ml-1">
                  • {pest.name}
                </Text>
              ))}
            </View>
          )}

          {/* Seeds */}
          <View className="mt-4">
            <Text className="text-xs font-semibold text-gray-500 mb-2">
              Available Seeds
            </Text>

            {product.recommendedSeeds.map((seed, i) => (
              <View
                key={i}
                className="flex-row justify-between items-center bg-green-50 p-3 rounded-xl mb-2"
              >
                <View>
                  <Text className="font-medium font-semibold text-gray-800">
                    {seed.name}
                  </Text>
                  <Text className="font-medium text-green-700 font-medium">
                    ₹{seed.price.toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg ${
                    isSeedInCart(seed.name)
                      ? "bg-green-600"
                      : "bg-green-800"
                  }`}
                  onPress={() => addToCart(product, seed)}
                >
                  <Text className="text-black text-xs font-semibold">
                    {isSeedInCart(seed.name)
                      ? `Added (${getSeedCartQuantity(seed.name)})`
                      : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ))
    )}
  </View>
)}


</ScrollView>

    </SafeAreaView>
  );
}