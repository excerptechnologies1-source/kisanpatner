// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
//   Alert,
// } from "react-native";
// import axios from "axios";
// import { Plus, Check, ShoppingCart } from "lucide-react-native";
// import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import CropcareOrders from "./cropcareorders";

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
//     | string
//     | { _id: string; name: string; categoryId: { _id: string; name: string } };
//   targetPestsDiseases: TargetPestDisease[];
//   recommendedSeeds: RecommendedSeed[];
//   status: "active" | "inactive";
//   createdAt: string;
//   updatedAt: string;
// }

// interface User {
//   _id: string;
//   personalInfo: { name: string; mobileNo: string };
//   role: string;
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

// /* ===================== COMPONENT ===================== */

// export default function Cropcare() {
//   // State
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
//     null
//   );
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [user, setUser] = useState<User | null>(null);

//   // Loading states
//   const [loading, setLoading] = useState({
//     categories: false,
//     subCategories: false,
//     products: false,
//     cart: false,
//   });

//   // API URLs
//   const CROPCARE_API = "https://kisanadmin.etpl.ai/api/cropcare";
//   const CART_API = "https://kisan.etpl.ai/api";

//   /* ===================== AUTH ===================== */

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const loadUser = async () => {
//     try {
//       const userData = await AsyncStorage.getItem("userData");
//       const role = await AsyncStorage.getItem("role");
//       const userId = await AsyncStorage.getItem("userId");

//       if (userData && role && userId) {
//         const parsed = JSON.parse(userData);
//         setUser({
//           _id: userId,
//           role,
//           personalInfo: {
//             name: parsed.personalInfo?.name || parsed.name || "User",
//             mobileNo: parsed.personalInfo?.mobileNo || parsed.mobileNo || "",
//           },
//         });
//       }
//     } catch (err) {
//       console.error("User load error:", err);
//     }
//   };

//   /* ===================== FETCH DATA ===================== */

//   useEffect(() => {
//     fetchCategories();
//     fetchSubCategories();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       fetchUserCart();
//     }
//   }, [user]);

//   const fetchCategories = async () => {
//     setLoading((prev) => ({ ...prev, categories: true }));
//     try {
//       const res = await axios.get(`${CROPCARE_API}/categories`);
//       if (res.data.success) {
//         const activeCategories = res.data.data.filter(
//           (c: Category) => c.status === "active"
//         );
//         setCategories(activeCategories);

//         // Auto-select first category
//         if (activeCategories.length > 0 && !selectedCategory) {
//           setSelectedCategory(activeCategories[0]._id);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       Alert.alert("Error", "Failed to load categories");
//     } finally {
//       setLoading((prev) => ({ ...prev, categories: false }));
//     }
//   };

//   const fetchSubCategories = async () => {
//     setLoading((prev) => ({ ...prev, subCategories: true }));
//     try {
//       const res = await axios.get(`${CROPCARE_API}/subcategories`);
//       if (res.data.success) {
//         setSubCategories(
//           res.data.data.filter((s: SubCategory) => s.status === "active")
//         );
//       }
//     } catch (err) {
//       console.error("Error fetching subcategories:", err);
//     } finally {
//       setLoading((prev) => ({ ...prev, subCategories: false }));
//     }
//   };

//   const fetchProducts = async (subId: string) => {
//     setLoading((prev) => ({ ...prev, products: true }));
//     try {
//       const res = await axios.get(`${CROPCARE_API}/products`);
//       if (res.data.success) {
//         // FIXED: Handle both string and object subCategoryId
//         const filteredProducts = res.data.data.filter((p: Product) => {
//           const productSubCatId =
//             typeof p.subCategoryId === "string"
//               ? p.subCategoryId
//               : p.subCategoryId._id;
//           return productSubCatId === subId && p.status === "active";
//         });

//         console.log("Filtered products:", filteredProducts.length);
//         setProducts(filteredProducts);
//       }
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       Alert.alert("Error", "Failed to load products");
//     } finally {
//       setLoading((prev) => ({ ...prev, products: false }));
//     }
//   };

//   /* ===================== CART ===================== */

//   const fetchUserCart = async () => {
//     if (!user) return;

//     setLoading((prev) => ({ ...prev, cart: true }));
//     try {
//       const res = await axios.get(`${CART_API}/cropcare/cart/${user._id}`);
//       if (res.data.success) {
//         setCartItems(res.data.data.items || []);
//       }
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//       setCartItems([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, cart: false }));
//     }
//   };

//   const addToCart = async (product: Product, seed: RecommendedSeed) => {
//     if (!user) {
//       Alert.alert("Login Required", "Please login to add items to cart");
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

//       const res = await axios.post(`${CART_API}/cropcare/cart/add`, {
//         userId: user._id,
//         item: cartItem,
//       });

//       if (res.data.success) {
//         setCartItems(res.data.data.items);
//         Alert.alert("Success", `${seed.name} added to cart!`);
//       }
//     } catch (err: any) {
//       console.error("Error adding to cart:", err);
//       Alert.alert(
//         "Error",
//         err.response?.data?.message || "Failed to add to cart"
//       );
//     } finally {
//       setLoading((prev) => ({ ...prev, cart: false }));
//     }
//   };

//   const isSeedInCart = (seedName: string): boolean => {
//     return cartItems.some((item) => item.seedName === seedName);
//   };

//   const getSeedCartQuantity = (seedName: string): number => {
//     const item = cartItems.find((item) => item.seedName === seedName);
//     return item ? item.quantity : 0;
//   };

//   /* ===================== FILTERING ===================== */

//   const getFilteredSubCategories = () => {
//     if (!selectedCategory) return [];
//     return subCategories.filter((sub) => {
//       const catId =
//         typeof sub.categoryId === "string"
//           ? sub.categoryId
//           : sub.categoryId._id;
//       return catId === selectedCategory;
//     });
//   };

//   /* ===================== HANDLERS ===================== */

//   const handleCategorySelect = (catId: string) => {
//     setSelectedCategory(catId);
//     setSelectedSubCategory(null);
//     setSelectedProduct(null);
//     setProducts([]);
//   };

//   const handleSubCategorySelect = (subId: string) => {
//     setSelectedSubCategory(subId);
//     setSelectedProduct(null);
//     fetchProducts(subId);
//   };

//   /* ===================== UI ===================== */

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* HEADER WITH CART */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.headerTitle}>🌾 Crop Care</Text>
//           {user && (
//             <Text style={styles.headerSubtitle}>
//               Welcome, {user.personalInfo.name}
//             </Text>
//           )}
//         </View>
//         <TouchableOpacity
//           style={styles.cartBtn}
//           onPress={() => router.push("/farmerscreen/cropcarecart")}
//         >
//           <ShoppingCart size={24} color="#fff" />
//           {cartItems.length > 0 && (
//             <View style={styles.cartBadge}>
//               <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.container}>
//         {/* CATEGORIES */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Categories</Text>
//           {loading.categories ? (
//             <ActivityIndicator size="large" color="#2c5f2d" />
//           ) : categories.length === 0 ? (
//             <Text style={styles.emptyText}>No categories available</Text>
//           ) : (
//             categories.map((cat) => (
//               <TouchableOpacity
//                 key={cat._id}
//                 style={[
//                   styles.card,
//                   selectedCategory === cat._id && styles.activeCard,
//                 ]}
//                 onPress={() => handleCategorySelect(cat._id)}
//               >
//                 <View style={styles.cardContent}>
//                   <Text style={styles.cardIcon}>📁</Text>
//                   <Text style={styles.cardTitle}>{cat.name}</Text>
//                 </View>
//                 {selectedCategory === cat._id && (
//                   <Check size={20} color="#2c5f2d" />
//                 )}
//               </TouchableOpacity>
//             ))
//           )}
//         </View>

//         {/* SUBCATEGORIES */}
//         {selectedCategory && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Subcategories</Text>
//             {loading.subCategories ? (
//               <ActivityIndicator size="large" color="#2c5f2d" />
//             ) : getFilteredSubCategories().length === 0 ? (
//               <Text style={styles.emptyText}>No subcategories available</Text>
//             ) : (
//               getFilteredSubCategories().map((sub) => (
//                 <TouchableOpacity
//                   key={sub._id}
//                   style={[
//                     styles.card,
//                     selectedSubCategory === sub._id && styles.activeCard,
//                   ]}
//                   onPress={() => handleSubCategorySelect(sub._id)}
//                 >
//                   <View style={styles.cardContent}>
//                     <Text style={styles.cardIcon}>🌱</Text>
//                     <Text style={styles.cardTitle}>{sub.name}</Text>
//                   </View>
//                   {selectedSubCategory === sub._id && (
//                     <Check size={20} color="#2c5f2d" />
//                   )}
//                 </TouchableOpacity>
//               ))
//             )}
//           </View>
//         )}

//         {/* PRODUCTS */}
//         {selectedSubCategory && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Products</Text>
//             {loading.products ? (
//               <ActivityIndicator size="large" color="#2c5f2d" />
//             ) : products.length === 0 ? (
//               <Text style={styles.emptyText}>
//                 No products available in this subcategory
//               </Text>
//             ) : (
//               products.map((product) => (
//                 <View key={product._id} style={styles.productCard}>
//                   {/* Product Header */}
//                   <View style={styles.productHeader}>
//                     <Text style={styles.productTitle}>{product.name}</Text>
//                     <TouchableOpacity
//                       onPress={() =>
//                         setSelectedProduct(
//                           selectedProduct?._id === product._id ? null : product
//                         )
//                       }
//                     >
//                       <Text style={styles.detailsBtn}>
//                         {selectedProduct?._id === product._id
//                           ? "▼ Hide"
//                           : "▶ Details"}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Product Details (Expandable) */}
//                   {selectedProduct?._id === product._id && (
//                     <View style={styles.productDetails}>
//                       {/* Target Pests */}
//                       {product.targetPestsDiseases.length > 0 && (
//                         <View style={styles.detailSection}>
//                           <Text style={styles.detailTitle}>
//                             🎯 Target Pests/Diseases:
//                           </Text>
//                           {product.targetPestsDiseases.map((pest, idx) => (
//                             <Text key={idx} style={styles.detailItem}>
//                               • {pest.name}
//                             </Text>
//                           ))}
//                         </View>
//                       )}
//                     </View>
//                   )}

//                   {/* Recommended Seeds */}
//                   <View style={styles.seedsSection}>
//                     <Text style={styles.seedsSectionTitle}>
//                       🌱 Available Seeds ({product.recommendedSeeds.length})
//                     </Text>
//                     {product.recommendedSeeds.map((seed, idx) => (
//                       <View key={idx} style={styles.seedCard}>
//                         <View style={styles.seedInfo}>
//                           <Text style={styles.seedName}>{seed.name}</Text>
//                           <Text style={styles.seedPrice}>
//                             ₹{seed.price.toFixed(2)}
//                           </Text>
//                         </View>

//                         <TouchableOpacity
//                           style={[
//                             styles.addBtn,
//                             isSeedInCart(seed.name) && styles.addedBtn,
//                           ]}
//                           onPress={() => addToCart(product, seed)}
//                           disabled={loading.cart}
//                         >
//                           {isSeedInCart(seed.name) ? (
//                             <>
//                               <Check size={16} color="#fff" />
//                               <Text style={styles.addBtnText}>
//                                 Added ({getSeedCartQuantity(seed.name)})
//                               </Text>
//                             </>
//                           ) : (
//                             <>
//                               <Plus size={16} color="#fff" />
//                               <Text style={styles.addBtnText}>Add to Cart</Text>
//                             </>
//                           )}
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                   </View>
//                 </View>
//               ))
//             )}
//           </View>
//         )}

//         {/* Empty State */}
//         {!selectedCategory && (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyIcon}>👈</Text>
//             <Text style={styles.emptyTitle}>Select a Category</Text>
//             <Text style={styles.emptyText}>
//               Choose a category above to view subcategories and products
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* ===================== STYLES ===================== */

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#2c5f2d",
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: "#e0e0e0",
//     marginTop: 4,
//   },
//   cartBtn: {
//     backgroundColor: "rgba(255,255,255,0.2)",
//     padding: 12,
//     borderRadius: 30,
//     position: "relative",
//   },
//   cartBadge: {
//     position: "absolute",
//     top: -5,
//     right: -5,
//     backgroundColor: "#ff4d4f",
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cartBadgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 12,
//   },
//   card: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 10,
//     borderWidth: 2,
//     borderColor: "transparent",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   activeCard: {
//     borderColor: "#2c5f2d",
//     backgroundColor: "#f0f7ff",
//   },
//   cardContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   cardIcon: {
//     fontSize: 24,
//     marginRight: 12,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   productCard: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   productHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   productTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     flex: 1,
//   },
//   detailsBtn: {
//     color: "#2c5f2d",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   productDetails: {
//     backgroundColor: "#f8f9fa",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   detailSection: {
//     marginBottom: 12,
//   },
//   detailTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#666",
//     marginBottom: 6,
//   },
//   detailItem: {
//     fontSize: 14,
//     color: "#666",
//     marginLeft: 8,
//     marginTop: 4,
//   },
//   seedsSection: {
//     marginTop: 8,
//   },
//   seedsSectionTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#666",
//     marginBottom: 8,
//   },
//   seedCard: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 12,
//     backgroundColor: "#f0fff4",
//     borderRadius: 8,
//     marginBottom: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: "#28a745",
//   },
//   seedInfo: {
//     flex: 1,
//   },
//   seedName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   seedPrice: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#28a745",
//     marginTop: 4,
//   },
//   addBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2c5f2d",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     gap: 6,
//   },
//   addedBtn: {
//     backgroundColor: "#28a745",
//   },
//   addBtnText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   loginPrompt: {
//     fontSize: 12,
//     color: "#999",
//     fontStyle: "italic",
//   },
//   emptyState: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 40,
//   },
//   emptyIcon: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#666",
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: "#999",
//     textAlign: "center",
//   },
// });



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
} from "react-native";
import axios from "axios";
import { Plus, Check, ShoppingCart, LogOut } from "lucide-react-native";
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c5f2d" />
          <Text style={styles.loadingText}>Checking authentication...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER WITH CART */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🌾 Crop Care</Text>
          {user ? (
            <View style={styles.userInfo}>
              <Text style={styles.headerSubtitle}>
                Welcome, {user.personalInfo.name}
              </Text>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <LogOut size={14} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.headerSubtitle}>Please login to continue</Text>
          )}
        </View>
        {user && (
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => router.push("/farmerscreen/cropcarecart")}
          >
            <ShoppingCart size={24} color="#fff" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.container}>
        {!user ? (
          // Show login prompt when not authenticated
          <View style={styles.loginPromptContainer}>
            <Text style={styles.loginPromptIcon}>🔒</Text>
            <Text style={styles.loginPromptTitle}>Login Required</Text>
            <Text style={styles.loginPromptText}>
              Please login to access Crop Care features
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/(auth)/Login?role=farmer")}
            >
              <Text style={styles.loginButtonText}>Login Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Show content when authenticated
          <>
            {/* CATEGORIES */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              {loading.categories ? (
                <ActivityIndicator size="large" color="#2c5f2d" />
              ) : categories.length === 0 ? (
                <Text style={styles.emptyText}>No categories available</Text>
              ) : (
                categories.map((cat) => (
                  <TouchableOpacity
                    key={cat._id}
                    style={[
                      styles.card,
                      selectedCategory === cat._id && styles.activeCard,
                    ]}
                    onPress={() => handleCategorySelect(cat._id)}
                  >
                    <View style={styles.cardContent}>
                      <Text style={styles.cardIcon}>📁</Text>
                      <Text style={styles.cardTitle}>{cat.name}</Text>
                    </View>
                    {selectedCategory === cat._id && (
                      <Check size={20} color="#2c5f2d" />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* SUBCATEGORIES */}
            {selectedCategory && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subcategories</Text>
                {loading.subCategories ? (
                  <ActivityIndicator size="large" color="#2c5f2d" />
                ) : getFilteredSubCategories().length === 0 ? (
                  <Text style={styles.emptyText}>
                    No subcategories available
                  </Text>
                ) : (
                  getFilteredSubCategories().map((sub) => (
                    <TouchableOpacity
                      key={sub._id}
                      style={[
                        styles.card,
                        selectedSubCategory === sub._id && styles.activeCard,
                      ]}
                      onPress={() => handleSubCategorySelect(sub._id)}
                    >
                      <View style={styles.cardContent}>
                        <Text style={styles.cardIcon}>🌱</Text>
                        <Text style={styles.cardTitle}>{sub.name}</Text>
                      </View>
                      {selectedSubCategory === sub._id && (
                        <Check size={20} color="#2c5f2d" />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

            {/* PRODUCTS */}
            {selectedSubCategory && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Products</Text>
                {loading.products ? (
                  <ActivityIndicator size="large" color="#2c5f2d" />
                ) : products.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No products available in this subcategory
                  </Text>
                ) : (
                  products.map((product) => (
                    <View key={product._id} style={styles.productCard}>
                      {/* Product Header */}
                      <View style={styles.productHeader}>
                        <Text style={styles.productTitle}>{product.name}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            setSelectedProduct(
                              selectedProduct?._id === product._id
                                ? null
                                : product
                            )
                          }
                        >
                          <Text style={styles.detailsBtn}>
                            {selectedProduct?._id === product._id
                              ? "▼ Hide"
                              : "▶ Details"}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Product Details (Expandable) */}
                      {selectedProduct?._id === product._id && (
                        <View style={styles.productDetails}>
                          {/* Target Pests */}
                          {product.targetPestsDiseases.length > 0 && (
                            <View style={styles.detailSection}>
                              <Text style={styles.detailTitle}>
                                🎯 Target Pests/Diseases:
                              </Text>
                              {product.targetPestsDiseases.map((pest, idx) => (
                                <Text key={idx} style={styles.detailItem}>
                                  • {pest.name}
                                </Text>
                              ))}
                            </View>
                          )}
                        </View>
                      )}

                      {/* Recommended Seeds */}
                      <View style={styles.seedsSection}>
                        <Text style={styles.seedsSectionTitle}>
                          🌱 Available Seeds ({product.recommendedSeeds.length})
                        </Text>
                        {product.recommendedSeeds.map((seed, idx) => (
                          <View key={idx} style={styles.seedCard}>
                            <View style={styles.seedInfo}>
                              <Text style={styles.seedName}>{seed.name}</Text>
                              <Text style={styles.seedPrice}>
                                ₹{seed.price.toFixed(2)}
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={[
                                styles.addBtn,
                                isSeedInCart(seed.name) && styles.addedBtn,
                              ]}
                              onPress={() => addToCart(product, seed)}
                              disabled={loading.cart}
                            >
                              {isSeedInCart(seed.name) ? (
                                <>
                                  <Check size={16} color="#fff" />
                                  <Text style={styles.addBtnText}>
                                    Added ({getSeedCartQuantity(seed.name)})
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <Plus size={16} color="#fff" />
                                  <Text style={styles.addBtnText}>
                                    Add to Cart
                                  </Text>
                                </>
                              )}
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {/* Empty State */}
            {!selectedCategory && categories.length > 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>👈</Text>
                <Text style={styles.emptyTitle}>Select a Category</Text>
                <Text style={styles.emptyText}>
                  Choose a category above to view subcategories and products
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>🔒</Text>
            <Text style={styles.modalTitle}>Login Required</Text>
            <Text style={styles.modalText}>
              You need to login to access Crop Care features
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowLoginModal(false);
                  router.back();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.loginButton]}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2c5f2d",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  cartBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 30,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4d4f",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 300,
  },
  loginPromptIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  loginPromptText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#2c5f2d",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeCard: {
    borderColor: "#2c5f2d",
    backgroundColor: "#f0f7ff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  detailsBtn: {
    color: "#2c5f2d",
    fontSize: 14,
    fontWeight: "600",
  },
  productDetails: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 6,
  },
  detailItem: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginTop: 4,
  },
  seedsSection: {
    marginTop: 8,
  },
  seedsSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  seedCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0fff4",
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
  },
  seedInfo: {
    flex: 1,
  },
  seedName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  seedPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#28a745",
    marginTop: 4,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2c5f2d",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  addedBtn: {
    backgroundColor: "#28a745",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
 
});
