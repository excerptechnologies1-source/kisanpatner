
// import { Feather } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { ChevronLeft, Filter, Search, X } from 'lucide-react-native';
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Modal,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const Allcrops: React.FC = () => {
//   const navigation = useNavigation();
//   const [products, setProducts] = useState<any[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [gradeOffers, setGradeOffers] = useState<{[gradeId: string]: { price: string; quantity: string }}>({});
//   const [showOfferModal, setShowOfferModal] = useState(false);
//   const [quantityInput, setQuantityInput] = useState("");
//   const [showQuantityModal, setShowQuantityModal] = useState(false);
//   const [selectedGrade, setSelectedGrade] = useState<any>(null);

//   // Filter and Search States
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [selectedFarmingType, setSelectedFarmingType] = useState<string>("all");
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
//   const [farmingTypes, setFarmingTypes] = useState<string[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [products, searchQuery, selectedFarmingType, selectedCategory]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const traderId = await AsyncStorage.getItem("traderId");
//       const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${traderId}`);
//       const data = await res.json();
//       const productsData = data.data || [];
//       setProducts(productsData);
      
//       // Extract unique farming types and categories
//       const uniqueFarmingTypes = [...new Set(productsData.map((p: any) => p.farmingType).filter(Boolean))];
//       const uniqueCategories = [...new Set(productsData.map((p: any) => p.categoryId?.categoryName).filter(Boolean))];
      
//       setFarmingTypes(uniqueFarmingTypes);
//       setCategories(uniqueCategories);
//       setError(null);
//     } catch (err) {
//       setError("Failed to load products");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...products];

//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter((product) => {
//         const cropName = product.cropBriefDetails?.toLowerCase() || "";
//         const productId = product.productId?.toLowerCase() || "";
//         const categoryName = product.categoryId?.categoryName?.toLowerCase() || "";
//         const subCategoryName = product.subCategoryId?.subCategoryName?.toLowerCase() || "";
        
//         return (
//           cropName.includes(query) ||
//           productId.includes(query) ||
//           categoryName.includes(query) ||
//           subCategoryName.includes(query)
//         );
//       });
//     }

//     // Apply farming type filter
//     if (selectedFarmingType !== "all") {
//       filtered = filtered.filter((product) => product.farmingType === selectedFarmingType);
//     }

//     // Apply category filter
//     if (selectedCategory !== "all") {
//       filtered = filtered.filter((product) => product.categoryId?.categoryName === selectedCategory);
//     }

//     setFilteredProducts(filtered);
//   };

//   const clearFilters = () => {
//     setSearchQuery("");
//     setSelectedFarmingType("all");
//     setSelectedCategory("all");
//   };

//   const getActiveFilterCount = () => {
//     let count = 0;
//     if (selectedFarmingType !== "all") count++;
//     if (selectedCategory !== "all") count++;
//     return count;
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchProducts();
//   };

//   const getImageUrl = (path: string) => {
//     if (!path) return "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400";
//     if (path.startsWith("http")) return path;
//     return `https://kisan.etpl.ai/${path}`;
//   };

//   const handleAcceptOffer = async (product: any, grade: any) => {
//     const traderId = await AsyncStorage.getItem("traderId");
//     const traderName = (await AsyncStorage.getItem("traderName")) || "Unknown Trader";

//     if (!traderId) {
//       Alert.alert("Error", "Please login as a trader first");
//       return;
//     }

//     const maxQty = grade.totalQty;

//     if (grade.quantityType === "bulk") {
//       const totalAmount = grade.pricePerUnit * maxQty;
//       Alert.alert(
//         "Confirm Purchase",
//         `Product: ${product.cropBriefDetails}\nGrade: ${grade.grade}\nPrice: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nQuantity: ${maxQty} ${product.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(
//           2
//         )}\n\nThis is a bulk purchase. You must buy the full quantity.`,
//         [
//           { text: "Cancel", style: "cancel" },
//           {
//             text: "Confirm",
//             onPress: () => processPurchase(product, grade, traderId, traderName, maxQty),
//           },
//         ]
//       );
//     } else {
//       setSelectedProduct(product);
//       setSelectedGrade(grade);
//       setQuantityInput("");
//       setShowQuantityModal(true);
//     }
//   };

//   const handleQuantitySubmit = async () => {
//     const traderId = await AsyncStorage.getItem("traderId");
//     const traderName = (await AsyncStorage.getItem("traderName")) || "Unknown Trader";

//     const numQuantity = Number(quantityInput);
//     const maxQty = selectedGrade.totalQty;

//     if (!quantityInput || isNaN(numQuantity) || numQuantity <= 0) {
//       Alert.alert("Error", "Please enter a valid quantity");
//       return;
//     }

//     if (numQuantity > maxQty) {
//       Alert.alert("Error", `Maximum available quantity is ${maxQty}`);
//       return;
//     }

//     const totalAmount = selectedGrade.pricePerUnit * numQuantity;

//     setShowQuantityModal(false);

//     Alert.alert(
//       "Confirm Purchase",
//       `Product: ${selectedProduct.cropBriefDetails}\nGrade: ${selectedGrade.grade}\nPrice: ₹${selectedGrade.pricePerUnit}/${selectedProduct.unitMeasurement}\nQuantity: ${numQuantity} ${selectedProduct.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(
//         2
//       )}`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Confirm",
//           onPress: () => processPurchase(selectedProduct, selectedGrade, traderId, traderName, numQuantity),
//         },
//       ]
//     );
//   };

//   const processPurchase = async (product: any, grade: any, traderId: string, traderName: string, quantity: number) => {
//     try {
//       const response = await fetch("https://kisan.etpl.ai/product/accept-listed-price", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: product._id,
//           gradeId: grade._id,
//           traderId,
//           traderName,
//           quantity,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         Alert.alert(
//           "✅ Purchase Successful!",
//           `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${
//             data.data.remainingQty
//           } ${product.unitMeasurement}\n\nProceeding to payment...`
//         );
//         fetchProducts();
//       } else {
//         Alert.alert("Error", data.message);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to process purchase. Please try again.");
//     }
//   };

//   const handleMakeOffer = (product: any) => {
//     AsyncStorage.getItem("traderId").then((traderId) => {
//       if (!traderId) {
//         Alert.alert("Error", "Please login as a trader first");
//         return;
//       }

//       const initialOffers: { [key: string]: { price: string; quantity: string } } = {};
//       product.gradePrices
//         .filter((g: any) => g.status !== "sold" && g.priceType === "negotiable")
//         .forEach((grade: any) => {
//           initialOffers[grade._id] = {
//             price: grade.pricePerUnit.toString(),
//             quantity: grade.quantityType === "bulk" ? grade.totalQty.toString() : "",
//           };
//         });

//       setSelectedProduct(product);
//       setGradeOffers(initialOffers);
//       setShowOfferModal(true);
//     });
//   };

//   const submitOffer = async () => {
//     const traderId = await AsyncStorage.getItem("traderId");
//     const traderName = (await AsyncStorage.getItem("traderName")) || "Unknown Trader";

//     const hasValidOffer = Object.values(gradeOffers).some((offer) => offer.price && offer.quantity);

//     if (!hasValidOffer) {
//       Alert.alert("Error", "Please enter price and quantity for at least one grade");
//       return;
//     }

//     const offers: any[] = [];
//     for (const [gradeId, offer] of Object.entries(gradeOffers)) {
//       if (offer.price && offer.quantity) {
//         const grade = selectedProduct.gradePrices.find((g: any) => g._id === gradeId);

//         const numPrice = Number(offer.price);
//         const numQuantity = Number(offer.quantity);

//         if (numQuantity > grade.totalQty) {
//           Alert.alert("Error", `${grade.grade}: Maximum available is ${grade.totalQty}`);
//           return;
//         }

//         if (grade.quantityType === "bulk" && numQuantity !== grade.totalQty) {
//           Alert.alert("Error", `${grade.grade}: Bulk purchase requires full quantity`);
//           return;
//         }

//         offers.push({
//           gradeId,
//           gradeName: grade.grade,
//           offeredPrice: numPrice,
//           quantity: numQuantity,
//           listedPrice: grade.pricePerUnit,
//         });
//       }
//     }

//     const totalAmount = offers.reduce((sum, o) => sum + o.offeredPrice * o.quantity, 0);
//     const offerSummary = offers
//       .map((o) => `${o.gradeName}: ₹${o.offeredPrice} × ${o.quantity} = ₹${(o.offeredPrice * o.quantity).toFixed(2)}`)
//       .join("\n");

//     Alert.alert("Confirm Your Bid", `${offerSummary}\n\nTotal Bid Amount: ₹${totalAmount.toFixed(2)}`, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Submit",
//         onPress: () => processOfferSubmission(offers, traderId!, traderName),
//       },
//     ]);
//   };

//   const processOfferSubmission = async (offers: any[], traderId: string, traderName: string) => {
//     try {
//       if (offers.length === 1) {
//         const offer = offers[0];
//         const response = await fetch("https://kisan.etpl.ai/product/make-offer", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             productId: selectedProduct._id,
//             gradeId: offer.gradeId,
//             traderId,
//             traderName,
//             offeredPrice: offer.offeredPrice,
//             quantity: offer.quantity,
//           }),
//         });

//         const data = await response.json();

//         if (data.success) {
//           Alert.alert("Success", "✅ Offer submitted successfully!\n\nThe farmer will review your bid.");
//           setShowOfferModal(false);
//           fetchProducts();
//         } else {
//           Alert.alert("Error", data.message);
//         }
//       } else {
//         const response = await fetch("https://kisan.etpl.ai/product/make-offer-batch", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             productId: selectedProduct._id,
//             traderId,
//             traderName,
//             offers: offers.map((o) => ({
//               gradeId: o.gradeId,
//               offeredPrice: o.offeredPrice,
//               quantity: o.quantity,
//             })),
//           }),
//         });

//         const data = await response.json();

//         if (data.success) {
//           Alert.alert("Success", "✅ All offers submitted successfully!\n\nThe farmer will review your bid.");
//           setShowOfferModal(false);
//           fetchProducts();
//         } else {
//           Alert.alert("Error", "Some offers failed. Please try again.");
//         }
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to submit offers. Please try again.");
//     }
//   };

//   const updateGradeOffer = (gradeId: string, field: "price" | "quantity", value: string) => {
//     setGradeOffers((prev) => ({
//       ...prev,
//       [gradeId]: {
//         ...prev[gradeId],
//         [field]: value,
//       },
//     }));
//   };

//   const calculateTotalBid = () => {
//     return Object.entries(gradeOffers).reduce((sum, [_, offer]) => {
//       if (offer.price && offer.quantity) return sum + Number(offer.price) * Number(offer.quantity);
//       return sum;
//     }, 0);
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#16a34a" />
//         <Text className="mt-2 text-gray-500 text-base">Loading products...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="bg-white shadow-sm">
//         <View className="flex-row items-center px-4 py-4">
//           <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
//             <ChevronLeft size={24} color="#374151" />
//           </TouchableOpacity>
//           <Text className="text-2xl font-medium text-gray-900">Available Crops</Text>
//         </View>

//         {/* Search and Filter Bar */}
//         <View className="px-4 pb-4">
//           <View className="flex-row items-center">
//             {/* Search Input */}
//             <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mr-2">
//               <Search size={20} color="#6B7280" />
//               <TextInput
//                 className="flex-1 ml-2 text-gray-900 text-base"
//                 placeholder="Search crops, categories..."
//                 placeholderTextColor="#9CA3AF"
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity onPress={() => setSearchQuery("")}>
//                   <X size={20} color="#6B7280" />
//                 </TouchableOpacity>
//               )}
//             </View>

//             {/* Filter Button */}
//             <TouchableOpacity
//               className="bg-green-600 rounded-xl p-3 relative"
//               onPress={() => setShowFilterModal(true)}
//             >
//               <Filter size={24} color="#FFFFFF" />
//               {getActiveFilterCount() > 0 && (
//                 <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
//                   <Text className="text-white text-xs font-medium">{getActiveFilterCount()}</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* Active Filters Display */}
//           {(selectedFarmingType !== "all" || selectedCategory !== "all" || searchQuery) && (
//             <View className="flex-row flex-wrap mt-3">
//               {searchQuery && (
//                 <View className="bg-blue-100 px-3 py-1.5 rounded-full mr-2 mb-2 flex-row items-center">
//                   <Text className="text-blue-800 text-xs font-medium mr-1">Search: {searchQuery}</Text>
//                   <TouchableOpacity onPress={() => setSearchQuery("")}>
//                     <X size={14} color="#1E40AF" />
//                   </TouchableOpacity>
//                 </View>
//               )}
              
//               {selectedFarmingType !== "all" && (
//                 <View className="bg-green-100 px-3 py-1.5 rounded-full mr-2 mb-2 flex-row items-center">
//                   <Text className="text-green-800 text-xs font-medium mr-1">{selectedFarmingType}</Text>
//                   <TouchableOpacity onPress={() => setSelectedFarmingType("all")}>
//                     <X size={14} color="#166534" />
//                   </TouchableOpacity>
//                 </View>
//               )}
              
//               {selectedCategory !== "all" && (
//                 <View className="bg-purple-100 px-3 py-1.5 rounded-full mr-2 mb-2 flex-row items-center">
//                   <Text className="text-purple-800 text-xs font-medium mr-1">{selectedCategory}</Text>
//                   <TouchableOpacity onPress={() => setSelectedCategory("all")}>
//                     <X size={14} color="#6B21A8" />
//                   </TouchableOpacity>
//                 </View>
//               )}

//               <TouchableOpacity
//                 className="bg-red-100 px-3 py-1.5 rounded-full mb-2"
//                 onPress={clearFilters}
//               >
//                 <Text className="text-red-800 text-xs font-medium">Clear All</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Results Count */}
//           <Text className="text-gray-500 text-sm mt-2">
//             Showing {filteredProducts.length} of {products.length} products
//           </Text>
//         </View>
//       </View>

//       <View className="flex-1 bg-gray-50">
//         <ScrollView
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#16a34a"]} />}
//         >
//           {error && (
//             <View className="m-4 p-4 bg-red-50 border border-red-200 rounded-xl">
//               <Text className="text-red-700 text-sm font-medium">{error}</Text>
//             </View>
//           )}

//           {filteredProducts.length === 0 ? (
//             <View className="items-center justify-center p-10 mt-10">
//               <Text className="text-6xl mb-4">🌾</Text>
//               <Text className="text-lg font-medium text-gray-700 mb-2">
//                 {searchQuery || selectedFarmingType !== "all" || selectedCategory !== "all"
//                   ? "No products match your filters"
//                   : "No products available"}
//               </Text>
//               <Text className="text-gray-400 text-sm text-center">
//                 {searchQuery || selectedFarmingType !== "all" || selectedCategory !== "all"
//                   ? "Try adjusting your search or filters"
//                   : "Check back later for new listings"}
//               </Text>
//             </View>
//           ) : (
//             <View className="p-4">
//               {filteredProducts.map((product) => (
//                 <View
//                   key={product._id}
//                   className="bg-white border border-gray-200 rounded-lg mb-5 p-3"
//                 >
//                   {/* Product Image with Badge */}
//                   <View className="relative">
//                     <Image
//                       source={{ uri: getImageUrl(product.cropPhotos?.[0]) }}
//                       className="w-full h-56 rounded-lg"
//                       resizeMode="cover"
//                     />
                    
//                     <View className="absolute top-3 left-3 bg-green-600 px-4 py-1.5 rounded-full">
//                       <Text className="text-white text-xs font-medium">{product.farmingType}</Text>
//                     </View>
//                   </View>

//                   {/* Product Details */}
//                   <View className="p-4">
//                     {/* Product Title */}
//                     <Text className="text-xl font-medium text-gray-900 mb-3">
//                       {product.cropBriefDetails}
//                     </Text>

//                     {/* Product ID Badge */}
//                     <View className="bg-green-600 px-3 py-1.5 rounded-full self-start mb-3">
//                       <Text className="text-white text-xs font-medium">{product.productId}</Text>
//                     </View>

//                     {/* Category Tags */}
//                     <View className="flex-row flex-wrap mb-4">
//                       <View className="bg-gray-100 px-4 py-1.5 rounded-full mr-2 mb-2">
//                         <Text className="text-gray-700 text-sm font-medium">
//                           {product.categoryId?.categoryName}
//                         </Text>
//                       </View>
//                       <View className="bg-gray-100 px-4 py-1.5 rounded-full mb-2">
//                         <Text className="text-gray-700 text-sm font-medium">
//                           {product.subCategoryId?.subCategoryName}
//                         </Text>
//                       </View>
//                     </View>

//                     {/* Grades Section */}
//                     {product.gradePrices
//                       .filter((g: any) => g.status !== "sold")
//                       .map((grade: any, index: number) => (
//                         <View
//                           key={grade._id}
//                           className={`py-4 ${
//                             index !== product.gradePrices.filter((g: any) => g.status !== "sold").length - 1
//                               ? "border-b border-gray-100"
//                               : "border border-gray-200 p-3 rounded-lg"
//                           }`}
//                         >
//                           {/* Grade Header */}
//                           <View className="flex-row justify-between items-center mb-2">
//                             <Text className="text-lg font-medium text-gray-900">{grade.grade}</Text>
//                             <Text className="text-xl font-medium text-green-600">
//                               ₹{grade.pricePerUnit}/{product.unitMeasurement}
//                             </Text>
//                           </View>

//                           {/* Quantity */}
//                           <Text className="text-gray-600 text-sm mb-3">
//                             Quantity: {grade.totalQty} {product.unitMeasurement}
//                           </Text>

//                           {/* Badges */}
//                           <View className="flex-row flex-wrap mb-3">
//                             {grade.priceType === "negotiable" ? (
//                               <View className="bg-yellow-100 px-3 py-1 rounded-full mr-2 mb-1">
//                                 <Text className="text-yellow-800 text-xs font-medium">Negotiable</Text>
//                               </View>
//                             ) : (
//                               <View className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-1">
//                                 <Text className="text-green-800 text-xs font-medium">Fixed Price</Text>
//                               </View>
//                             )}

//                             {grade.quantityType === "bulk" && (
//                               <View className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-1">
//                                 <Text className="text-blue-800 text-xs font-medium">Bulk Only</Text>
//                               </View>
//                             )}

//                             {grade.status === "partially_sold" && (
//                               <View className="bg-orange-100 px-3 py-1 rounded-full mb-1">
//                                 <Text className="text-orange-800 text-xs font-medium">Partially Sold</Text>
//                               </View>
//                             )}
//                           </View>

//                           {/* Action Buttons */}
//                           <View className="flex-row">
//                             <TouchableOpacity
//                               className={`flex-1 bg-green-600 rounded-xl py-3 mr-2 items-center ${
//                                 grade.totalQty === 0 ? "opacity-50" : ""
//                               }`}
//                               disabled={grade.totalQty === 0}
//                               onPress={() => handleAcceptOffer(product, grade)}
//                             >
//                               <Text className="text-white font-medium text-sm">Accept Price</Text>
//                             </TouchableOpacity>

//                             {grade.priceType === "negotiable" && (
//                               <TouchableOpacity
//                                 className={`flex-1 border-2 border-green-600 rounded-xl py-3 items-center ${
//                                   grade.totalQty === 0 ? "opacity-50" : ""
//                                 }`}
//                                 disabled={grade.totalQty === 0}
//                                 onPress={() => handleMakeOffer(product)}
//                               >
//                                 <Text className="text-green-600 font-medium text-sm">Make Offer</Text>
//                               </TouchableOpacity>
//                             )}
//                           </View>
//                         </View>
//                       ))}

//                     {/* Product Info Footer */}
//                     <View className="mt-4 pt-4 border-t border-gray-100 flex-row justify-between">
//                       <View className="flex-row items-center">
//                         <Feather name="package" size={16} color="#6B7280" />
//                         <Text className="text-gray-600 text-sm ml-1.5">
//                           {product.packageMeasurement} {product.packagingType}
//                         </Text>
//                       </View>

//                       <View className="flex-row items-center">
//                         <Feather name="calendar" size={16} color="#6B7280" />
//                         <Text className="text-gray-600 text-sm ml-1.5">
//                           {new Date(product.deliveryDate).toLocaleDateString()}
//                         </Text>
//                       </View>

//                       <View className="flex-row items-center">
//                         <Feather name="clock" size={16} color="#6B7280" />
//                         <Text className="text-gray-600 text-sm ml-1.5">
//                           {product.deliveryTime}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           )}
//         </ScrollView>

//         {/* Filter Modal */}
//         <Modal visible={showFilterModal} transparent animationType="slide">
//           <View className="flex-1 bg-black/50 justify-end">
//             <View className="bg-white rounded-t-3xl">
//               <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
//                 <Text className="text-xl font-medium text-gray-900">Filter Products</Text>
//                 <TouchableOpacity onPress={() => setShowFilterModal(false)}>
//                   <X size={24} color="#6B7280" />
//                 </TouchableOpacity>
//               </View>

//               <ScrollView className="p-5" style={{ maxHeight: 500 }}>
//                 {/* Farming Type Filter */}
//                 <View className="mb-6">
//                   <Text className="text-base font-medium text-gray-900 mb-3">Farming Type</Text>
//                   <View className="flex-row flex-wrap">
//                     <TouchableOpacity
//                       className={`px-4 py-2.5 rounded-xl mr-2 mb-2 ${
//                         selectedFarmingType === "all" ? "bg-green-600" : "bg-gray-100"
//                       }`}
//                       onPress={() => setSelectedFarmingType("all")}
//                     >
//                       <Text
//                         className={`text-sm font-medium ${
//                           selectedFarmingType === "all" ? "text-white" : "text-gray-700"
//                         }`}
//                       >
//                         All Types
//                       </Text>
//                     </TouchableOpacity>

//                     {farmingTypes.map((type) => (
//                       <TouchableOpacity
//                         key={type}
//                         className={`px-4 py-2.5 rounded-xl mr-2 mb-2 ${
//                           selectedFarmingType === type ? "bg-green-600" : "bg-gray-100"
//                         }`}
//                         onPress={() => setSelectedFarmingType(type)}
//                       >
//                         <Text
//                           className={`text-sm font-medium ${
//                             selectedFarmingType === type ? "text-white" : "text-gray-700"
//                           }`}
//                         >
//                           {type}
//                         </Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 </View>

//                 {/* Category Filter */}
//                 <View className="mb-6">
//                   <Text className="text-base font-medium text-gray-900 mb-3">Category</Text>
//                   <View className="flex-row flex-wrap">
//                     <TouchableOpacity
//                       className={`px-4 py-2.5 rounded-xl mr-2 mb-2 ${
//                         selectedCategory === "all" ? "bg-green-600" : "bg-gray-100"
//                       }`}
//                       onPress={() => setSelectedCategory("all")}
//                     >
//                       <Text
//                         className={`text-sm font-medium ${
//                           selectedCategory === "all" ? "text-white" : "text-gray-700"
//                         }`}
//                       >
//                         All Categories
//                       </Text>
//                     </TouchableOpacity>

//                     {categories.map((category) => (
//                       <TouchableOpacity
//                         key={category}
//                         className={`px-4 py-2.5 rounded-xl mr-2 mb-2 ${
//                           selectedCategory === category ? "bg-green-600" : "bg-gray-100"
//                         }`}
//                         onPress={() => setSelectedCategory(category)}
//                       >
//                         <Text
//                           className={`text-sm font-medium ${
//                             selectedCategory === category ? "text-white" : "text-gray-700"
//                           }`}
//                         >
//                           {category}
//                         </Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 </View>
//               </ScrollView>

//               <View className="flex-row p-5 border-t border-gray-200">
//                 <TouchableOpacity
//                   className="flex-1 bg-gray-200 rounded-xl py-3.5 mr-3"
//                   onPress={clearFilters}
//                 >
//                   <Text className="text-gray-700 font-medium text-center">Clear All</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   className="flex-1 bg-green-600 rounded-xl py-3.5"
//                   onPress={() => setShowFilterModal(false)}
//                 >
//                   <Text className="text-white font-medium text-center">Apply Filters</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//         {/* Quantity Modal */}
//         <Modal visible={showQuantityModal} transparent animationType="fade">
//           <View className="flex-1 bg-black/50 justify-center items-center px-5">
//             <View className="bg-white rounded-2xl p-6 w-full">
//               <Text className="text-xl font-medium text-gray-900 mb-2">Enter Quantity</Text>

//               {selectedGrade && selectedProduct && (
//                 <Text className="text-gray-500 mb-4 text-sm">
//                   Maximum: {selectedGrade.totalQty} {selectedProduct.unitMeasurement}
//                 </Text>
//               )}

//               <TextInput
//                 className="border border-gray-300 rounded-xl p-4 text-base mb-5 bg-gray-50"
//                 value={quantityInput}
//                 onChangeText={setQuantityInput}
//                 keyboardType="numeric"
//                 placeholder="Enter quantity"
//                 placeholderTextColor="#9ca3af"
//               />

//               <View className="flex-row justify-end">
//                 <TouchableOpacity
//                   className="bg-gray-200 px-5 py-3 rounded-xl mr-3"
//                   onPress={() => setShowQuantityModal(false)}
//                 >
//                   <Text className="text-gray-700 font-medium">Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                   className="bg-green-600 px-5 py-3 rounded-xl" 
//                   onPress={handleQuantitySubmit}
//                 >
//                   <Text className="text-white font-medium">Confirm</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//         {/* Offer Modal */}
//         <Modal visible={showOfferModal} transparent animationType="slide">
//           <View className="flex-1 bg-black/50 justify-center items-center px-3">
//             <View className="bg-white rounded-2xl w-full max-h-[85%]">
//               <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
//                 <Text className="text-xl font-medium text-gray-900">Make Your Bid</Text>
//                 <TouchableOpacity onPress={() => setShowOfferModal(false)}>
//                   <Text className="text-2xl text-gray-400 font-medium">✕</Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView className="p-5">
//                 <View className="bg-cyan-50 p-4 rounded-xl mb-4 border border-cyan-200">
//                   <Text className="text-xs text-cyan-900">
//                     💡 Enter your bid price and quantity for each grade. Leave blank to skip.
//                   </Text>
//                 </View>

//                 {selectedProduct &&
//                   selectedProduct.gradePrices
//                     .filter((g: any) => g.status !== "sold" && g.priceType === "negotiable")
//                     .map((grade: any) => {
//                       const offer = gradeOffers[grade._id] || { price: "", quantity: "" };
//                       const amount =
//                         offer.price && offer.quantity
//                           ? (Number(offer.price) * Number(offer.quantity)).toFixed(2)
//                           : "-";

//                       return (
//                         <View key={grade._id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
//                           <View className="flex-row items-center mb-3">
//                             <Text className="text-base font-medium text-gray-900">{grade.grade}</Text>
//                             {grade.quantityType === "bulk" && (
//                               <View className="bg-cyan-600 px-2 py-1 rounded-full ml-2">
//                                 <Text className="text-white text-[10px] font-medium">BULK</Text>
//                               </View>
//                             )}
//                           </View>

//                           <View className="flex-row mb-3">
//                             <View className="flex-1 mr-2">
//                               <Text className="text-xs text-gray-600 mb-2 font-medium">Price (₹)</Text>
//                               <TextInput
//                                 className="border border-gray-300 rounded-lg px-3 py-3 bg-white text-sm"
//                                 placeholder={`₹${grade.pricePerUnit}`}
//                                 placeholderTextColor="#9ca3af"
//                                 value={offer.price}
//                                 onChangeText={(v) => updateGradeOffer(grade._id, "price", v)}
//                                 keyboardType="numeric"
//                               />
//                             </View>

//                             <View className="flex-1">
//                               <Text className="text-xs text-gray-600 mb-2 font-medium">
//                                 Qty ({selectedProduct.unitMeasurement})
//                               </Text>
//                               <TextInput
//                                 className="border border-gray-300 rounded-lg px-3 py-3 bg-white text-sm"
//                                 placeholder={`Max: ${grade.totalQty}`}
//                                 placeholderTextColor="#9ca3af"
//                                 value={offer.quantity}
//                                 onChangeText={(v) => updateGradeOffer(grade._id, "quantity", v)}
//                                 editable={grade.quantityType !== "bulk"}
//                                 keyboardType="numeric"
//                               />
//                             </View>
//                           </View>

//                           <View className="bg-white p-2 rounded-lg">
//                             <Text className="text-gray-600 text-sm">
//                               Amount:{" "}
//                               <Text className="text-green-700 font-medium">
//                                 {amount !== "-" ? `₹${amount}` : "-"}
//                               </Text>
//                             </Text>
//                           </View>
//                         </View>
//                       );
//                     })}

//                 <View className="bg-green-50 p-4 rounded-xl border border-green-200 flex-row justify-between items-center mt-2">
//                   <Text className="text-base font-medium text-gray-900">Total Bid:</Text>
//                   <Text className="text-2xl font-medium text-green-700">
//                     ₹{calculateTotalBid().toFixed(2)}
//                   </Text>
//                 </View>
//               </ScrollView>

//               <View className="flex-row justify-end p-5 border-t border-gray-200">
//                 <TouchableOpacity
//                   className="bg-gray-200 px-5 py-3 rounded-xl mr-3"
//                   onPress={() => setShowOfferModal(false)}
//                 >
//                   <Text className="text-gray-700 font-medium">Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                   className="bg-green-600 px-6 py-3 rounded-xl" 
//                   onPress={submitOffer}
//                 >
//                   <Text className="text-white font-medium">Submit Bid</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Allcrops;  





// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Filter, Search, X } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   Modal,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const All: React.FC = () => {
//   const navigation = useNavigation();
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const [products, setProducts] = useState<any[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Search and Filter States
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');
//   const [selectedFarmingType, setSelectedFarmingType] = useState<string>('all');
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [categories, setCategories] = useState<string[]>([]);
//   const [farmingTypes, setFarmingTypes] = useState<string[]>([]);

//   // Get category from Home page navigation
//   useEffect(() => {
//     if (params.selectedCategory) {
//       const category = params.selectedCategory as string;
//       setSelectedCategory(category);

//       if (category !== 'all' && !categories.includes(category)) {
//         setCategories(prev => [...prev, category]);
//       }
//     }
//   }, [params.selectedCategory]);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     filterProducts();
//   }, [searchQuery, selectedCategory, selectedFarmingType, priceRange, products]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const traderId = await AsyncStorage.getItem('traderId');
//       const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${traderId}`);
//       const data = await res.json();
//       const productsData = data.data || [];
//       setProducts(productsData);
//       setError(null);

//       const uniqueCategories = Array.from(
//         new Set(productsData.map((p: any) => p.categoryId?.categoryName).filter(Boolean))
//       ) as string[];

//       const uniqueFarmingTypes = Array.from(
//         new Set(productsData.map((p: any) => p.farmingType).filter(Boolean))
//       ) as string[];

//       if (params.selectedCategory && !uniqueCategories.includes(params.selectedCategory as string)) {
//         uniqueCategories.push(params.selectedCategory as string);
//       }

//       setCategories(uniqueCategories);
//       setFarmingTypes(uniqueFarmingTypes);
//     } catch (err) {
//       setError('Failed to load products');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const filterProducts = () => {
//     let filtered = [...products];

//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase().trim();
//       filtered = filtered.filter(product =>
//         product.cropBriefDetails?.toLowerCase().includes(query) ||
//         product.productId?.toLowerCase().includes(query) ||
//         product.categoryId?.categoryName?.toLowerCase().includes(query) ||
//         product.subCategoryId?.subCategoryName?.toLowerCase().includes(query)
//       );
//     }

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(product =>
//         product.categoryId?.categoryName === selectedCategory
//       );
//     }

//     if (selectedFarmingType !== 'all') {
//       filtered = filtered.filter(product =>
//         product.farmingType === selectedFarmingType
//       );
//     }

//     if (priceRange.min || priceRange.max) {
//       filtered = filtered.filter(product =>
//         product.gradePrices.some((grade: any) => {
//           const price = grade.pricePerUnit;
//           const min = priceRange.min ? parseFloat(priceRange.min) : 0;
//           const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
//           return price >= min && price <= max;
//         })
//       );
//     }

//     setFilteredProducts(filtered);
//   };

//   const clearFilters = () => {
//     setSearchQuery('');
//     setSelectedCategory('all');
//     setSelectedFarmingType('all');
//     setPriceRange({ min: '', max: '' });
//   };

//   const getActiveFilterCount = () => {
//     let count = 0;
//     if (selectedCategory !== 'all') count++;
//     if (selectedFarmingType !== 'all') count++;
//     if (priceRange.min || priceRange.max) count++;
//     return count;
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchProducts();
//   };

//   // Navigate to product detail page
//   const navigateToProductDetail = (product: any) => {
//     router.push({
//       pathname: '/product-detail',
//       params: { 
//         productId: product._id,
//         productData: JSON.stringify(product)
//       }
//     });
//   };

//   // Get available grades count
//   const getAvailableGradesCount = (product: any) => {
//     return product.gradePrices.filter((g: any) => g.status !== 'sold').length;
//   };

//   // Get price range for product
//   const getPriceRange = (product: any) => {
//     const grades = product.gradePrices.filter((g: any) => g.status !== 'sold');
//     if (grades.length === 0) return 'No price';
    
//     const prices = grades.map((g: any) => g.pricePerUnit);
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);
    
//     if (minPrice === maxPrice) {
//       return `₹${minPrice}/${product.unitMeasurement}`;
//     }
//     return `₹${minPrice} - ₹${maxPrice}/${product.unitMeasurement}`;
//   };

//   // Get product image URL
//   const getProductImage = (product: any) => {
//     if (!product.cropPhotos || product.cropPhotos.length === 0) {
//       return 'https://kisan.etpl.ai/default-image.jpg';
//     }
//     const firstImage = product.cropPhotos[0];
//     return firstImage.startsWith('http') ? firstImage : `https://kisan.etpl.ai/${firstImage}`;
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color="#28a745" />
//         <Text className="mt-2 text-gray-500 text-base">Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-white">
//       {/* HEADER with Category Info */}
//       <View className="bg-white border-b border-gray-200 px-4 py-4">
//         <Text className="text-2xl font-medium text-gray-900">
//           Available Products
//           {selectedCategory !== 'all' && (
//             <Text className="text-green-600">: {selectedCategory}</Text>
//           )}
//         </Text>
//         <Text className="text-gray-500 mt-1">
//           {filteredProducts.length} of {products.length} products
//         </Text>

//         {selectedCategory !== 'all' && (
//           <TouchableOpacity
//             onPress={() => setSelectedCategory('all')}
//             className="mt-2 flex-row items-center"
//           >
//             <Text className="text-green-600 underline mr-1">
//               Showing only {selectedCategory} products
//             </Text>
//             <Text className="text-green-600">(Tap to show all)</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* SEARCH BAR */}
//       <View className="px-4 py-3 border-b border-gray-200">
//         <View className="flex-row items-center">
//           <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
//             <Search size={20} color="#6b7280" />
//             <TextInput
//               className="flex-1 ml-2 text-gray-800"
//               placeholder="Search products (e.g., tomato, potato, onion)..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               placeholderTextColor="#9ca3af"
//             />
//             {searchQuery ? (
//               <TouchableOpacity onPress={() => setSearchQuery('')}>
//                 <X size={20} color="#6b7280" />
//               </TouchableOpacity>
//             ) : null}
//           </View>

//           <TouchableOpacity
//             className="ml-3 p-2 bg-gray-100 rounded-lg"
//             onPress={() => setShowFilterModal(true)}
//           >
//             <View className="relative">
//               <Filter size={24} color="#4b5563" />
//               {getActiveFilterCount() > 0 && (
//                 <View className="absolute -top-2 -right-2 bg-green-600 rounded-full w-5 h-5 items-center justify-center">
//                   <Text className="text-white text-xs font-medium">
//                     {getActiveFilterCount()}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* QUICK FILTERS */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
//           <TouchableOpacity
//             className={`px-3 py-1 rounded-full mr-2 ${selectedCategory === 'all' ? 'bg-green-600' : 'bg-gray-100'}`}
//             onPress={() => setSelectedCategory('all')}
//           >
//             <Text className={`text-sm ${selectedCategory === 'all' ? 'text-white' : 'text-gray-700'}`}>
//               All
//             </Text>
//           </TouchableOpacity>

//           {categories.slice(0, 5).map(category => (
//             <TouchableOpacity
//               key={category}
//               className={`px-3 py-1 rounded-full mr-2 ${selectedCategory === category ? 'bg-green-600' : 'bg-gray-100'}`}
//               onPress={() => setSelectedCategory(category)}
//             >
//               <Text className={`text-sm ${selectedCategory === category ? 'text-white' : 'text-gray-700'}`}>
//                 {category}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* FILTER MODAL */}
//       <Modal
//         visible={showFilterModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowFilterModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-end">
//           <View className="bg-white rounded-t-3xl max-h-3/4">
//             <View className="p-6 border-b border-gray-200">
//               <View className="flex-row justify-between items-center">
//                 <Text className="text-xl font-medium text-gray-900">Filters</Text>
//                 <TouchableOpacity onPress={() => setShowFilterModal(false)}>
//                   <X size={24} color="#6b7280" />
//                 </TouchableOpacity>
//               </View>

//               {getActiveFilterCount() > 0 && (
//                 <TouchableOpacity
//                   className="mt-2 self-start"
//                   onPress={clearFilters}
//                 >
//                   <Text className="text-green-600 font-medium">Clear all filters</Text>
//                 </TouchableOpacity>
//               )}
//             </View>

//             <ScrollView className="p-6">
//               {/* Category Filter */}
//               <View className="mb-6">
//                 <Text className="text-lg font-medium text-gray-900 mb-3">Category</Text>
//                 <View className="flex-row flex-wrap">
//                   <TouchableOpacity
//                     className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedCategory === 'all' ? 'bg-green-600' : 'bg-gray-100'}`}
//                     onPress={() => setSelectedCategory('all')}
//                   >
//                     <Text className={`${selectedCategory === 'all' ? 'text-white' : 'text-gray-700'}`}>
//                       All Categories
//                     </Text>
//                   </TouchableOpacity>

//                   {categories.map(category => (
//                     <TouchableOpacity
//                       key={category}
//                       className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedCategory === category ? 'bg-green-600' : 'bg-gray-100'}`}
//                       onPress={() => setSelectedCategory(category)}
//                     >
//                       <Text className={`${selectedCategory === category ? 'text-white' : 'text-gray-700'}`}>
//                         {category}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* Farming Type Filter */}
//               <View className="mb-6">
//                 <Text className="text-lg font-medium text-gray-900 mb-3">Farming Type</Text>
//                 <View className="flex-row flex-wrap">
//                   <TouchableOpacity
//                     className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedFarmingType === 'all' ? 'bg-green-600' : 'bg-gray-100'}`}
//                     onPress={() => setSelectedFarmingType('all')}
//                   >
//                     <Text className={`${selectedFarmingType === 'all' ? 'text-white' : 'text-gray-700'}`}>
//                       All Types
//                     </Text>
//                   </TouchableOpacity>

//                   {farmingTypes.map(type => (
//                     <TouchableOpacity
//                       key={type}
//                       className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedFarmingType === type ? 'bg-green-600' : 'bg-gray-100'}`}
//                       onPress={() => setSelectedFarmingType(type)}
//                     >
//                       <Text className={`${selectedFarmingType === type ? 'text-white' : 'text-gray-700'}`}>
//                         {type}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* Price Range Filter */}
//               <View className="mb-6">
//                 <Text className="text-lg font-medium text-gray-900 mb-3">Price Range (per unit)</Text>
//                 <View className="flex-row items-center">
//                   <View className="flex-1">
//                     <Text className="text-gray-600 mb-1">Min Price</Text>
//                     <TextInput
//                       className="bg-gray-100 rounded-lg px-3 py-2"
//                       placeholder="0"
//                       value={priceRange.min}
//                       onChangeText={(text) => setPriceRange({ ...priceRange, min: text })}
//                       keyboardType="numeric"
//                     />
//                   </View>
//                   <Text className="mx-3 text-gray-500">-</Text>
//                   <View className="flex-1">
//                     <Text className="text-gray-600 mb-1">Max Price</Text>
//                     <TextInput
//                       className="bg-gray-100 rounded-lg px-3 py-2"
//                       placeholder="1000"
//                       value={priceRange.max}
//                       onChangeText={(text) => setPriceRange({ ...priceRange, max: text })}
//                       keyboardType="numeric"
//                     />
//                   </View>
//                 </View>
//               </View>
//             </ScrollView>

//             <View className="p-6 border-t border-gray-200">
//               <TouchableOpacity
//                 className="bg-green-600 rounded-lg py-3 items-center"
//                 onPress={() => setShowFilterModal(false)}
//               >
//                 <Text className="text-white font-medium text-lg">Apply Filters</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#28a745']}
//           />
//         }
//       >
//         {/* ERROR */}
//         {error && (
//           <View className="bg-red-50 border border-red-400 rounded-lg mx-4 mt-4 p-3">
//             <Text className="text-red-800 font-medium">
//               {error}
//             </Text>
//           </View>
//         )}

//         {/* NO PRODUCTS */}
//         {filteredProducts.length === 0 ? (
//           <View className="items-center justify-center py-20">
//             <Search size={64} color="#9ca3af" />
//             <Text className="text-lg font-medium text-gray-700 mt-4">
//               No Products Found
//             </Text>
//             <Text className="text-gray-400 mt-1">
//               {selectedCategory !== 'all'
//                 ? `No ${selectedCategory} products available`
//                 : 'Try adjusting your search or filters'}
//             </Text>
//             {(searchQuery || getActiveFilterCount() > 0) && (
//               <TouchableOpacity
//                 className="mt-4 px-6 py-2 bg-green-600 rounded-lg"
//                 onPress={clearFilters}
//               >
//                 <Text className="text-white font-medium">Clear All Filters</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         ) : (
//           <View className="px-4 pt-4 pb-10">
//             {filteredProducts.map(product => (
//               <TouchableOpacity
//                 key={product._id}
//                 className="bg-white border border-gray-200 rounded-lg mb-5 p-3"
//                 onPress={() => navigateToProductDetail(product)}
//                 activeOpacity={0.7}
//               >
//                 {/* PRODUCT CARD */}
//                 <View className="flex-row">
//                   {/* PRODUCT IMAGE */}
//                   <View className="w-24 h-24 rounded-lg overflow-hidden mr-4">
//                     <Image
//                       source={{ uri: getProductImage(product) }}
//                       className="w-full h-full"
//                       resizeMode="cover"
//                     />
//                   </View>

//                   {/* PRODUCT DETAILS */}
//                   <View className="flex-1">
//                     <Text className="text-lg font-medium text-gray-900" numberOfLines={2}>
//                       {product.cropBriefDetails}
//                     </Text>

//                     {/* PRODUCT ID */}
//                     <View className="bg-green-100 px-2 py-1 rounded mt-1 self-start">
//                       <Text className="text-green-800 text-xs font-medium">
//                         {product.productId}
//                       </Text>
//                     </View>

//                     {/* CATEGORY TAGS */}
//                     <View className="flex-row flex-wrap mt-2">
//                       <View className="bg-gray-100 px-2 py-1 rounded mr-2 mb-1">
//                         <Text className="text-gray-700 text-xs">
//                           {product.categoryId?.categoryName || 'N/A'}
//                         </Text>
//                       </View>
                      
//                       <View className="bg-green-50 px-2 py-1 rounded mr-2 mb-1">
//                         <Text className="text-green-700 text-xs">
//                           {product.farmingType || 'N/A'}
//                         </Text>
//                       </View>
//                     </View>

//                     {/* PRICE & GRADES INFO */}
//                     <View className="flex-row justify-between items-center mt-2">
//                       <View>
//                         <Text className="text-xl font-medium text-green-700">
//                           {getPriceRange(product)}
//                         </Text>
//                         <Text className="text-gray-500 text-sm mt-1">
//                           {getAvailableGradesCount(product)} grades available
//                         </Text>
//                       </View>
                      
//                       <View className="bg-blue-50 px-3 py-1 rounded-full">
//                         <Text className="text-blue-700 text-sm font-medium">
//                           View Details →
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 </View>

//                 {/* QUICK STATS BAR */}
//                 <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
//                   <View className="items-center">
//                     <Text className="text-gray-500 text-xs">Grades</Text>
//                     <Text className="text-gray-900 font-medium">
//                       {getAvailableGradesCount(product)}
//                     </Text>
//                   </View>
                  
//                   <View className="items-center">
//                     <Text className="text-gray-500 text-xs">Unit</Text>
//                     <Text className="text-gray-900 font-medium">
//                       {product.unitMeasurement || 'N/A'}
//                     </Text>
//                   </View>
                  
//                   <View className="items-center">
//                     <Text className="text-gray-500 text-xs">Min Qty</Text>
//                     <Text className="text-gray-900 font-medium">
//                       {product.gradePrices
//                         .filter((g: any) => g.status !== 'sold')
//                         .reduce((min: number, g: any) => Math.min(min, g.totalQty), Infinity) || '0'}
//                     </Text>
//                   </View>
                  
//                   <View className="items-center">
//                     <Text className="text-gray-500 text-xs">Status</Text>
//                     <View className="bg-green-100 px-2 py-1 rounded">
//                       <Text className="text-green-700 text-xs font-medium">
//                         Available
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default All;






// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Alert,
//   RefreshControl,
//   ActivityIndicator,
//   Dimensions,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width } = Dimensions.get('window');

// // Icon Components
// const Icon = ({ name, size = 20, color = '#000', style = {} }) => {
//   const icons = {
//     'shop-window': '🏪',
//     'box-seam': '📦',
//     'arrow-left': '←',
//     'bell': '🔔',
//     'arrow-clockwise': '🔄',
//     'shop': '🏬',
//     'calendar-event': '📅',
//     'clock': '🕐',
//     'geo-alt': '📍',
//     'search': '🔍',
//     'filter': '🎯',
//     'x': '✕',
//   };
  
//   return (
//     <Text style={[{ fontSize: size, color }, style]}>
//       {icons[name] || '•'}
//     </Text>
//   );
// };

// const AllProducts = ({ navigation }) => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Search & Filter States
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('all');
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
  
//   // Offer Modal States
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [gradeOffers, setGradeOffers] = useState({});
//   const [showOfferModal, setShowOfferModal] = useState(false);
  
//   // Quantity Modal States
//   const [showQuantityModal, setShowQuantityModal] = useState(false);
//   const [quantityInput, setQuantityInput] = useState('');
//   const [currentGrade, setCurrentGrade] = useState(null);
//   const [currentProduct, setCurrentProduct] = useState(null);
  
//   // New Counter Offer Modal States
//   const [showNewCounterModal, setShowNewCounterModal] = useState(false);
//   const [newCounterPrice, setNewCounterPrice] = useState('');
//   const [newCounterQuantity, setNewCounterQuantity] = useState('');
//   const [currentOffer, setCurrentOffer] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [products, searchQuery, selectedCategory, selectedSubCategory]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const traderId = await AsyncStorage.getItem('traderId');
//       const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${traderId}`);
//       const data = await res.json();
      
//       const productList = data.data || [];
//       setProducts(productList);
      
//       // Extract unique categories and subcategories
//       const cats = [...new Set(productList.map(p => p.categoryId?.categoryName).filter(Boolean))];
//       const subCats = [...new Set(productList.map(p => p.subCategoryId?.subCategoryName).filter(Boolean))];
//       setCategories(cats);
//       setSubCategories(subCats);
      
//       setError(null);
//     } catch (err) {
//       setError('Failed to load products');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...products];
    
//     // Search filter
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(p => 
//         p.cropBriefDetails?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.productId?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     // Category filter
//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(p => p.categoryId?.categoryName === selectedCategory);
//     }
    
//     // SubCategory filter
//     if (selectedSubCategory !== 'all') {
//       filtered = filtered.filter(p => p.subCategoryId?.subCategoryName === selectedSubCategory);
//     }
    
//     setFilteredProducts(filtered);
//   };

//   const getImageUrl = (path) => {
//     if (!path) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
//     if (path.startsWith('http')) return path;
//     return `https://kisan.etpl.ai/${path}`;
//   };

//   const handleAcceptOffer = async (product, grade) => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';
    
//     if (!traderId) {
//       Alert.alert('Error', 'Please login as a trader first');
//       return;
//     }

//     // Open quantity modal
//     setCurrentProduct(product);
//     setCurrentGrade(grade);
//     setQuantityInput(grade.quantityType === 'bulk' ? grade.totalQty.toString() : '');
//     setShowQuantityModal(true);
//   };

//   const confirmDirectPurchase = async () => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';
    
//     const numQuantity = Number(quantityInput);
//     const maxQty = currentGrade.totalQty;

//     if (isNaN(numQuantity) || numQuantity <= 0) {
//       Alert.alert('Error', 'Please enter a valid quantity');
//       return;
//     }

//     if (numQuantity > maxQty) {
//       Alert.alert('Error', `Maximum available quantity is ${maxQty}`);
//       return;
//     }

//     if (currentGrade.quantityType === 'bulk' && numQuantity !== maxQty) {
//       Alert.alert('Error', 'Bulk purchase requires buying the full quantity');
//       return;
//     }

//     const totalAmount = currentGrade.pricePerUnit * numQuantity;

//     Alert.alert(
//       'Confirm Direct Purchase',
//       `Product: ${currentProduct.cropBriefDetails}\nGrade: ${currentGrade.grade}\nPrice: ₹${currentGrade.pricePerUnit}/${currentProduct.unitMeasurement}\nQuantity: ${numQuantity} ${currentProduct.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\nProceed with payment?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Confirm',
//           onPress: async () => {
//             try {
//               const response = await fetch('https://kisan.etpl.ai/product/accept-listed-price', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   productId: currentProduct._id,
//                   gradeId: currentGrade._id,
//                   traderId,
//                   traderName,
//                   quantity: numQuantity
//                 })
//               });

//               const data = await response.json();

//               if (data.success) {
//                 Alert.alert(
//                   '✅ Purchase Successful!',
//                   `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${currentProduct.unitMeasurement}\n\nProceeding to payment...`
//                 );
//                 setShowQuantityModal(false);
//                 setQuantityInput('');
//                 fetchProducts();
//               } else {
//                 Alert.alert('Error', data.message);
//               }
//             } catch (error) {
//               Alert.alert('Error', 'Failed to process purchase. Please try again.');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleMakeOffer = (product) => {
//     const initialOffers = {};
//     product.gradePrices
//       .filter(g => g.status !== 'sold' && g.priceType === 'negotiable')
//       .forEach(grade => {
//         initialOffers[grade._id] = {
//           price: grade.pricePerUnit.toString(),
//           quantity: grade.quantityType === 'bulk' ? grade.totalQty.toString() : ''
//         };
//       });

//     setSelectedProduct(product);
//     setGradeOffers(initialOffers);
//     setShowOfferModal(true);
//   };

//   const submitOffer = async () => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';

//     const hasValidOffer = Object.values(gradeOffers).some(
//       offer => offer.price && offer.quantity
//     );

//     if (!hasValidOffer) {
//       Alert.alert('Error', 'Please enter price and quantity for at least one grade');
//       return;
//     }

//     const offers = [];
//     for (const [gradeId, offer] of Object.entries(gradeOffers)) {
//       if (offer.price && offer.quantity) {
//         const grade = selectedProduct.gradePrices.find(g => g._id === gradeId);
        
//         const numPrice = Number(offer.price);
//         const numQuantity = Number(offer.quantity);

//         if (numQuantity > grade.totalQty) {
//           Alert.alert('Error', `${grade.grade}: Maximum available is ${grade.totalQty}`);
//           return;
//         }

//         if (grade.quantityType === 'bulk' && numQuantity !== grade.totalQty) {
//           Alert.alert('Error', `${grade.grade}: Bulk purchase requires full quantity`);
//           return;
//         }

//         offers.push({
//           gradeId,
//           gradeName: grade.grade,
//           offeredPrice: numPrice,
//           quantity: numQuantity,
//           listedPrice: grade.pricePerUnit
//         });
//       }
//     }

//     const totalAmount = offers.reduce((sum, o) => sum + (o.offeredPrice * o.quantity), 0);
//     const confirmMsg = 
//       `Confirm Your Bid:\n\n` +
//       offers.map(o => 
//         `${o.gradeName}: ₹${o.offeredPrice} × ${o.quantity} = ₹${(o.offeredPrice * o.quantity).toFixed(2)}`
//       ).join('\n') +
//       `\n\nTotal Bid Amount: ₹${totalAmount.toFixed(2)}\n\nSubmit?`;

//     Alert.alert('Confirm Bid', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Submit',
//         onPress: async () => {
//           try {
//             if (offers.length === 1) {
//               const offer = offers[0];
//               const response = await fetch('https://kisan.etpl.ai/product/make-offer', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   productId: selectedProduct._id,
//                   gradeId: offer.gradeId,
//                   traderId,
//                   traderName,
//                   offeredPrice: offer.offeredPrice,
//                   quantity: offer.quantity
//                 })
//               });

//               const data = await response.json();
              
//               if (data.success) {
//                 Alert.alert('Success', '✅ Offer submitted successfully!\n\nThe farmer will review your bid.');
//                 setShowOfferModal(false);
//                 fetchProducts();
//               } else {
//                 Alert.alert('Error', data.message);
//               }
//             } else {
//               const response = await fetch('https://kisan.etpl.ai/product/make-offer-batch', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   productId: selectedProduct._id,
//                   traderId,
//                   traderName,
//                   offers: offers.map(o => ({
//                     gradeId: o.gradeId,
//                     offeredPrice: o.offeredPrice,
//                     quantity: o.quantity
//                   }))
//                 })
//               });

//               const data = await response.json();
              
//               if (data.success) {
//                 Alert.alert('Success', '✅ All offers submitted successfully!\n\nThe farmer will review your bid.');
//                 setShowOfferModal(false);
//                 fetchProducts();
//               } else {
//                 Alert.alert('Error', 'Some offers failed. Please try again.');
//               }
//             }
//           } catch (error) {
//             Alert.alert('Error', 'Failed to submit offers. Please try again.');
//           }
//         }
//       }
//     ]);
//   };

//   const handleAcceptCounterOffer = async (product, grade, offer) => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';
    
//     const confirmMsg = 
//       `Accept Farmer's Counter Offer?\n\n` +
//       `Your original offer: ₹${offer.offeredPrice} × ${offer.quantity}\n` +
//       `Farmer's counter: ₹${offer.counterPrice} × ${offer.counterQuantity}\n\n` +
//       `Total Amount: ₹${(offer.counterPrice * offer.counterQuantity).toFixed(2)}\n\nProceed?`;
    
//     Alert.alert('Accept Counter Offer', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Accept',
//         onPress: async () => {
//           try {
//             const response = await fetch('https://kisan.etpl.ai/product/accept-counter-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 productId: product._id,
//                 gradeId: grade._id,
//                 offerId: offer._id,
//                 traderId,
//                 traderName
//               })
//             });

//             const data = await response.json();
            
//             if (data.success) {
//               Alert.alert(
//                 '✅ Counter Offer Accepted!',
//                 `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${product.unitMeasurement}\n\nProceeding to payment...`
//               );
//               fetchProducts();
//             } else {
//               Alert.alert('Error', data.message);
//             }
//           } catch (error) {
//             Alert.alert('Error', 'Failed to accept counter offer. Please try again.');
//           }
//         }
//       }
//     ]);
//   };

//   const handleRejectCounterOffer = async (productId, gradeId, offerId) => {
//     Alert.alert(
//       'Reject Counter Offer',
//       'Reject this counter offer? You can make a new offer after rejecting.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Reject',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const response = await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ productId, gradeId, offerId })
//               });

//               const data = await response.json();
//               if (data.success) {
//                 Alert.alert('Success', 'Counter offer rejected. You can now make a new offer.');
//                 fetchProducts();
//               }
//             } catch (error) {
//               Alert.alert('Error', 'Error rejecting counter offer');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleMakeNewCounterOffer = async (product, grade, existingOffer) => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';
    
//     if (!traderId) {
//       Alert.alert('Error', 'Please login as a trader first');
//       return;
//     }

//     // Open new counter offer modal
//     setCurrentProduct(product);
//     setCurrentGrade(grade);
//     setCurrentOffer(existingOffer);
//     setNewCounterPrice(existingOffer.counterPrice.toString());
//     setNewCounterQuantity(existingOffer.counterQuantity.toString());
//     setShowNewCounterModal(true);
//   };

//   const submitNewCounterOffer = async () => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';

//     const numPrice = Number(newCounterPrice);
//     const numQuantity = Number(newCounterQuantity);

//     if (isNaN(numPrice) || numPrice <= 0 || isNaN(numQuantity) || numQuantity <= 0) {
//       Alert.alert('Error', 'Please enter valid price and quantity');
//       return;
//     }

//     if (numQuantity > currentGrade.totalQty) {
//       Alert.alert('Error', `Maximum available: ${currentGrade.totalQty} ${currentProduct.unitMeasurement}`);
//       return;
//     }

//     if (currentGrade.quantityType === 'bulk' && numQuantity !== currentGrade.totalQty) {
//       Alert.alert('Error', 'Bulk purchase requires full quantity');
//       return;
//     }

//     const totalAmount = numPrice * numQuantity;
//     const confirmMsg = 
//       `Submit New Counter Offer?\n\n` +
//       `Farmer's counter: ₹${currentOffer.counterPrice} × ${currentOffer.counterQuantity}\n` +
//       `Your new offer: ₹${numPrice} × ${numQuantity}\n\n` +
//       `Total: ₹${totalAmount.toFixed(2)}\n\nSubmit?`;

//     Alert.alert('Confirm New Offer', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Submit',
//         onPress: async () => {
//           try {
//             await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ 
//                 productId: currentProduct._id, 
//                 gradeId: currentGrade._id, 
//                 offerId: currentOffer._id 
//               })
//             });

//             const response = await fetch('https://kisan.etpl.ai/product/make-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 productId: currentProduct._id,
//                 gradeId: currentGrade._id,
//                 traderId,
//                 traderName,
//                 offeredPrice: numPrice,
//                 quantity: numQuantity
//               })
//             });

//             const data = await response.json();
            
//             if (data.success) {
//               Alert.alert('Success', '✅ New offer submitted successfully!\n\nThe farmer will review your new bid.');
//               setShowNewCounterModal(false);
//               setNewCounterPrice('');
//               setNewCounterQuantity('');
//               fetchProducts();
//             } else {
//               Alert.alert('Error', data.message);
//             }
//           } catch (error) {
//             Alert.alert('Error', 'Failed to submit new offer. Please try again.');
//           }
//         }
//       }
//     ]);
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#22c55e" />
//         <Text className="mt-4 text-gray-600">Loading products...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
//         <View className="flex-row justify-between items-center mb-4">
//           <View className="flex-row items-center">
//             <Icon name="shop-window" size={24} color="#22c55e" />
//             <Text className="text-2xl font-medium ml-2">Available Products</Text>
//           </View>
          
//           <View className="flex-row gap-2">
//             <TouchableOpacity
//               onPress={() => navigation.navigate('MyPurchases')}
//               className="bg-green-500 px-3 py-2 rounded-lg flex-row items-center"
//             >
//               <Icon name="box-seam" size={16} color="#fff" />
//               <Text className="text-white ml-1 font-medium">Purchases</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Search Bar */}
//         <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
//           <Icon name="search" size={20} color="#6b7280" />
//           <TextInput
//             className="flex-1 ml-2 text-base"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Icon name="x" size={20} color="#6b7280" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Filter Button & Stats */}
//         <View className="flex-row justify-between items-center">
//           <TouchableOpacity
//             onPress={() => setShowFilters(!showFilters)}
//             className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
//           >
//             <Icon name="filter" size={16} color="#fff" />
//             <Text className="text-white ml-2 font-medium">Filters</Text>
//           </TouchableOpacity>
          
//           <View className="flex-row items-center gap-2">
//             <View className="bg-blue-100 px-3 py-1 rounded-full">
//               <Text className="text-blue-700 font-medium">{filteredProducts.length} products</Text>
//             </View>
//             <TouchableOpacity onPress={fetchProducts} className="bg-green-100 p-2 rounded-full">
//               <Icon name="arrow-clockwise" size={18} color="#22c55e" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Filters Panel */}
//         {showFilters && (
//           <View className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//             <Text className="font-medium mb-2">Category</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
//               <TouchableOpacity
//                 onPress={() => setSelectedCategory('all')}
//                 className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === 'all' ? 'bg-green-500' : 'bg-gray-200'}`}
//               >
//                 <Text className={selectedCategory === 'all' ? 'text-white font-medium' : 'text-gray-700'}>
//                   All
//                 </Text>
//               </TouchableOpacity>
//               {categories.map(cat => (
//                 <TouchableOpacity
//                   key={cat}
//                   onPress={() => setSelectedCategory(cat)}
//                   className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === cat ? 'bg-green-500' : 'bg-gray-200'}`}
//                 >
//                   <Text className={selectedCategory === cat ? 'text-white font-medium' : 'text-gray-700'}>
//                     {cat}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>

//             <Text className="font-medium mb-2">Sub-Category</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               <TouchableOpacity
//                 onPress={() => setSelectedSubCategory('all')}
//                 className={`px-4 py-2 rounded-full mr-2 ${selectedSubCategory === 'all' ? 'bg-green-500' : 'bg-gray-200'}`}
//               >
//                 <Text className={selectedSubCategory === 'all' ? 'text-white font-medium' : 'text-gray-700'}>
//                   All
//                 </Text>
//               </TouchableOpacity>
//               {subCategories.map(subCat => (
//                 <TouchableOpacity
//                   key={subCat}
//                   onPress={() => setSelectedSubCategory(subCat)}
//                   className={`px-4 py-2 rounded-full mr-2 ${selectedSubCategory === subCat ? 'bg-green-500' : 'bg-gray-200'}`}
//                 >
//                   <Text className={selectedSubCategory === subCat ? 'text-white font-medium' : 'text-gray-700'}>
//                     {subCat}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}
//       </View>

//       {/* Products List */}
//       <ScrollView
//         className="flex-1"
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={() => {
//             setRefreshing(true);
//             fetchProducts();
//           }} />
//         }
//       >
//         {error && (
//           <View className="bg-red-100 p-4 m-4 rounded-lg">
//             <Text className="text-red-700">{error}</Text>
//           </View>
//         )}

//         {filteredProducts.length === 0 ? (
//           <View className="flex-1 justify-center items-center py-20">
//             <Icon name="shop" size={60} color="#d1d5db" />
//             <Text className="text-xl text-gray-500 mt-4 font-medium">No products found</Text>
//             <Text className="text-gray-400 mt-2">Try adjusting your filters</Text>
//           </View>
//         ) : (
//           <View className="p-4">
//             {filteredProducts.map((product) => (
//               <ProductCard
//                 key={product._id}
//                 product={product}
//                 getImageUrl={getImageUrl}
//                 handleAcceptOffer={handleAcceptOffer}
//                 handleMakeOffer={handleMakeOffer}
//                 handleAcceptCounterOffer={handleAcceptCounterOffer}
//                 handleRejectCounterOffer={handleRejectCounterOffer}
//                 handleMakeNewCounterOffer={handleMakeNewCounterOffer}
//               />
//             ))}
//           </View>
//         )}
//       </ScrollView>

//       {/* Offer Modal */}
//       <Modal
//         visible={showOfferModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowOfferModal(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="bg-white rounded-t-3xl" style={{ maxHeight: '90%' }}>
//             {/* Modal Header */}
//             <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
//               <Text className="text-xl font-medium">Bid by Trader - All Grades</Text>
//               <TouchableOpacity onPress={() => setShowOfferModal(false)}>
//                 <Icon name="x" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView className="p-4">
//               <View className="bg-blue-50 p-3 rounded-lg mb-4">
//                 <Text className="text-blue-700 font-medium">💡 Tip: Enter your offer for each grade. Leave blank if you don't want to bid on that grade.</Text>
//               </View>

//               {selectedProduct && (
//                 <>
//                   <Text className="text-lg font-medium mb-4">{selectedProduct.cropBriefDetails}</Text>

//                   {selectedProduct.gradePrices
//                     .filter(g => g.status !== 'sold' && g.priceType === 'negotiable')
//                     .map((grade) => {
//                       const offer = gradeOffers[grade._id] || { price: '', quantity: '' };
//                       const amount = offer.price && offer.quantity 
//                         ? (Number(offer.price) * Number(offer.quantity)).toFixed(2)
//                         : '0.00';

//                       return (
//                         <View key={grade._id} className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
//                           <View className="flex-row justify-between items-center mb-2">
//                             <Text className="font-medium text-base">{grade.grade}</Text>
//                             {grade.quantityType === 'bulk' && (
//                               <View className="bg-blue-500 px-2 py-1 rounded">
//                                 <Text className="text-white text-xs font-medium">Bulk</Text>
//                               </View>
//                             )}
//                           </View>

//                           <Text className="text-gray-600 mb-2">Listed: ₹{grade.pricePerUnit}/{selectedProduct.unitMeasurement}</Text>
//                           <Text className="text-gray-600 mb-3">Available: {grade.totalQty} {selectedProduct.unitMeasurement}</Text>

//                           <Text className="font-medium mb-1">Your Offer Price (₹/{selectedProduct.unitMeasurement})</Text>
//                           <TextInput
//                             className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
//                             placeholder={`₹${grade.pricePerUnit}`}
//                             keyboardType="numeric"
//                             value={offer.price}
//                             onChangeText={(text) => setGradeOffers({
//                               ...gradeOffers,
//                               [grade._id]: { ...offer, price: text }
//                             })}
//                           />

//                           <Text className="font-medium mb-1">Quantity ({selectedProduct.unitMeasurement})</Text>
//                           <TextInput
//                             className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
//                             placeholder={`Max: ${grade.totalQty}`}
//                             keyboardType="numeric"
//                             value={offer.quantity}
//                             onChangeText={(text) => setGradeOffers({
//                               ...gradeOffers,
//                               [grade._id]: { ...offer, quantity: text }
//                             })}
//                             editable={grade.quantityType !== 'bulk'}
//                           />

//                           <View className="bg-green-100 p-2 rounded-lg">
//                             <Text className="text-green-700 font-medium text-right">
//                               Amount: ₹{amount}
//                             </Text>
//                           </View>
//                         </View>
//                       );
//                     })}

//                   {/* Total Amount */}
//                   <View className="bg-green-500 p-4 rounded-lg mt-4">
//                     <Text className="text-white text-lg font-medium text-center">
//                       Total Bid Amount: ₹{Object.entries(gradeOffers).reduce((sum, [gradeId, offer]) => {
//                         if (offer.price && offer.quantity) {
//                           return sum + (Number(offer.price) * Number(offer.quantity));
//                         }
//                         return sum;
//                       }, 0).toFixed(2)}
//                     </Text>
//                   </View>

//                   {/* Buttons */}
//                   <View className="flex-row gap-3 mt-6 mb-4">
//                     <TouchableOpacity
//                       onPress={() => setShowOfferModal(false)}
//                       className="flex-1 bg-gray-300 py-3 rounded-lg"
//                     >
//                       <Text className="text-gray-700 font-medium text-center">Cancel</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       onPress={submitOffer}
//                       className="flex-1 bg-green-500 py-3 rounded-lg"
//                     >
//                       <Text className="text-white font-medium text-center">Submit Bid</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </>
//               )}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Quantity Input Modal */}
//       <Modal
//         visible={showQuantityModal}
//         animationType="fade"
//         transparent={true}
//         onRequestClose={() => setShowQuantityModal(false)}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50 px-6">
//           <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <Text className="text-xl font-medium mb-4">
//               {currentGrade?.quantityType === 'bulk' ? 'Bulk Purchase' : 'Enter Quantity'}
//             </Text>
            
//             {currentGrade?.quantityType === 'bulk' ? (
//               <View className="bg-yellow-50 p-3 rounded-lg mb-4">
//                 <Text className="text-yellow-800">
//                   This is a bulk purchase. You must buy the full quantity: {currentGrade.totalQty} {currentProduct?.unitMeasurement}
//                 </Text>
//               </View>
//             ) : (
//               <Text className="text-gray-600 mb-4">
//                 Maximum available: {currentGrade?.totalQty} {currentProduct?.unitMeasurement}
//               </Text>
//             )}

//             <TextInput
//               className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
//               placeholder={`Enter quantity (Max: ${currentGrade?.totalQty})`}
//               keyboardType="numeric"
//               value={quantityInput}
//               onChangeText={setQuantityInput}
//               editable={currentGrade?.quantityType !== 'bulk'}
//             />

//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowQuantityModal(false);
//                   setQuantityInput('');
//                 }}
//                 className="flex-1 bg-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-gray-700 font-medium text-center">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={confirmDirectPurchase}
//                 className="flex-1 bg-green-500 py-3 rounded-lg"
//               >
//                 <Text className="text-white font-medium text-center">Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* New Counter Offer Modal */}
//       <Modal
//         visible={showNewCounterModal}
//         animationType="fade"
//         transparent={true}
//         onRequestClose={() => setShowNewCounterModal(false)}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50 px-6">
//           <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <Text className="text-xl font-medium mb-4">Make New Counter Offer</Text>
            
//             <View className="bg-yellow-50 p-3 rounded-lg mb-4">
//               <Text className="text-sm text-gray-700 mb-1">
//                 Farmer's counter: <Text className="font-medium">₹{currentOffer?.counterPrice} × {currentOffer?.counterQuantity}</Text>
//               </Text>
//             </View>

//             <Text className="font-medium mb-2">Your New Price (₹/{currentProduct?.unitMeasurement})</Text>
//             <TextInput
//               className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
//               placeholder="Enter price"
//               keyboardType="numeric"
//               value={newCounterPrice}
//               onChangeText={setNewCounterPrice}
//             />

//             <Text className="font-medium mb-2">Quantity ({currentProduct?.unitMeasurement})</Text>
//             <TextInput
//               className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
//               placeholder={`Max: ${currentGrade?.totalQty}`}
//               keyboardType="numeric"
//               value={newCounterQuantity}
//               onChangeText={setNewCounterQuantity}
//               editable={currentGrade?.quantityType !== 'bulk'}
//             />

//             {newCounterPrice && newCounterQuantity && (
//               <View className="bg-green-100 p-3 rounded-lg mb-4">
//                 <Text className="text-green-700 font-medium text-center">
//                   Total: ₹{(Number(newCounterPrice) * Number(newCounterQuantity)).toFixed(2)}
//                 </Text>
//               </View>
//             )}

//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowNewCounterModal(false);
//                   setNewCounterPrice('');
//                   setNewCounterQuantity('');
//                 }}
//                 className="flex-1 bg-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-gray-700 font-medium text-center">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={submitNewCounterOffer}
//                 className="flex-1 bg-green-500 py-3 rounded-lg"
//               >
//                 <Text className="text-white font-medium text-center">Submit</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// // Product Card Component
// const ProductCard = ({ 
//   product, 
//   getImageUrl, 
//   handleAcceptOffer, 
//   handleMakeOffer,
//   handleAcceptCounterOffer,
//   handleRejectCounterOffer,
//   handleMakeNewCounterOffer 
// }) => {
//   const [traderId, setTraderId] = React.useState(null);

//   React.useEffect(() => {
//     AsyncStorage.getItem('traderId').then(setTraderId);
//   }, []);
// const GradePhotoSlider = ({ photos, getImageUrl, height = 200 }) => {
//   const [activeIndex, setActiveIndex] = React.useState(0);
//   const scrollViewRef = React.useRef(null);

//   if (!photos || photos.length === 0) {
//     return (
//       <Image
//         source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400' }}
//         style={{ width: '100%', height }}
//         resizeMode="cover"
//       />
//     );
//   }

//   const handleScroll = (event) => {
//     const scrollPosition = event.nativeEvent.contentOffset.x;
//     const index = Math.round(scrollPosition / width);
//     setActiveIndex(index);
//   };

//   return (
//     <View className="relative">
//       <ScrollView
//         ref={scrollViewRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//       >
//         {photos.map((photo, index) => (
//           <Image
//             key={index}
//             source={{ uri: getImageUrl(photo) }}
//             style={{ width, height }}
//             resizeMode="cover"
//           />
//         ))}
//       </ScrollView>

//       {/* Pagination Dots */}
//       {photos.length > 1 && (
//         <View className="absolute bottom-2 left-0 right-0 flex-row justify-center gap-2">
//           {photos.map((_, index) => (
//             <View
//               key={index}
//               className={`h-2 rounded-full ${
//                 index === activeIndex 
//                   ? 'bg-white w-6' 
//                   : 'bg-white/50 w-2'
//               }`}
//             />
//           ))}
//         </View>
//       )}

//       {/* Image Counter */}
//       {photos.length > 1 && (
//         <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-full">
//           <Text className="text-white text-xs font-medium">
//             {activeIndex + 1}/{photos.length}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };
//   return (
//     <View className="bg-white rounded-2xl mb-4 overflow-hidden shadow-md">
//       {/* Product Image */}
//       <View className="relative">
      
// <GradePhotoSlider 
//     photos={product.gradePrices.flatMap(grade => grade.gradePhotos || [])}
//     getImageUrl={getImageUrl} 
//     height={200}
//   />
//         <View className="absolute top-2 left-2 bg-green-500 px-3 py-1 rounded-full">
//           <Text className="text-white font-medium">{product.farmingType}</Text>
//         </View>
//       </View>

//       {/* Product Details */}
//       <View className="p-4">
//         <Text className="text-xl font-medium mb-2">{product.cropBriefDetails}</Text>
        
//         <View className="flex-row flex-wrap gap-2 mb-3">
//           <View className="bg-blue-100 px-3 py-1 rounded-full">
//             <Text className="text-blue-700 font-medium text-xs">{product.productId}</Text>
//           </View>
//           {product.categoryId?.categoryName && (
//             <View className="bg-gray-100 px-3 py-1 rounded-full">
//               <Text className="text-gray-700 text-xs">{product.categoryId.categoryName}</Text>
//             </View>
//           )}
//           {product.subCategoryId?.subCategoryName && (
//             <View className="bg-gray-100 px-3 py-1 rounded-full">
//               <Text className="text-gray-700 text-xs">{product.subCategoryId.subCategoryName}</Text>
//             </View>
//           )}
//         </View>

//         {/* Grade Prices */}
//         {product.gradePrices.map((grade) => (
          
//           <View key={grade._id} className="border border-gray-200 rounded-xl p-3 mb-3">
//              {grade.gradePhotos && grade.gradePhotos.length > 0 && (
//       <View className="mb-3 -mx-3 -mt-3">
//         {/* <GradePhotoSlider 
//           photos={grade.gradePhotos} 
//           getImageUrl={getImageUrl} 
//           height={150}
//         /> */}
//       </View>
//     )}
//             <View className="flex-row justify-between items-start mb-2">
//               <View className="flex-1">
//                 <View className="flex-row items-center mb-1">
//                   <Text className="text-lg font-medium">{grade.grade}</Text>
//                   {grade.status === 'partially_sold' && (
//                     <View className="bg-yellow-500 px-2 py-1 rounded ml-2">
//                       <Text className="text-white text-xs font-medium">Partially Sold</Text>
//                     </View>
//                   )}
//                   {grade.status === 'sold' && (
//                     <View className="bg-red-500 px-2 py-1 rounded ml-2">
//                       <Text className="text-white text-xs font-medium">Sold Out</Text>
//                     </View>
//                   )}
//                 </View>
                
//                 <Text className="text-green-600 font-medium text-lg">
//                   ₹{grade.pricePerUnit}/{product.unitMeasurement || 'unit'}
//                 </Text>
                
//                 <View className="flex-row items-center mt-1">
//                   <Text className="text-gray-600">
//                     Qty: {grade.totalQty} {product.unitMeasurement || 'units'}
//                   </Text>
//                   {grade.quantityType === 'bulk' && (
//                     <View className="bg-blue-500 px-2 py-1 rounded ml-2">
//                       <Text className="text-white text-xs font-medium">Bulk Only</Text>
//                     </View>
//                   )}
//                 </View>
                
//                 <Text className="text-gray-500 text-sm mt-1">
//                   {grade.priceType === 'fixed' ? '🔒 Fixed Price' : '💬 Negotiable'}
//                 </Text>
//               </View>

//               <View className="gap-2">
//                 <TouchableOpacity
//                   onPress={() => handleAcceptOffer(product, grade)}
//                   disabled={grade.totalQty === 0}
//                   className={`px-4 py-2 rounded-lg ${grade.totalQty === 0 ? 'bg-gray-300' : 'bg-green-500'}`}
//                 >
//                   <Text className="text-white font-medium text-center">Add to Cart</Text>
//                 </TouchableOpacity>
                
//                 {grade.priceType === 'negotiable' && (
//                   <TouchableOpacity
//                     onPress={() => handleMakeOffer(product)}
//                     disabled={grade.totalQty === 0}
//                     className={`px-4 py-2 rounded-lg border-2 ${grade.totalQty === 0 ? 'border-gray-300' : 'border-green-500'}`}
//                   >
//                     <Text className={`font-medium text-center ${grade.totalQty === 0 ? 'text-gray-400' : 'text-green-600'}`}>
//                       Make Offer
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>

//             {/* Counter Offers */}
//             {grade.offers?.filter(o => o.traderId === traderId && o.status === 'countered').length > 0 && (
//               <View className="mt-3 pt-3 border-t border-gray-200">
//                 <Text className="font-medium text-yellow-600 mb-2">💬 Farmer's Counter Offer:</Text>
//                 {grade.offers
//                   .filter(o => o.traderId === traderId && o.status === 'countered')
//                   .map((offer) => (
//                     <View key={offer._id} className="bg-yellow-50 p-3 rounded-lg mb-2 border border-yellow-200">
//                       <Text className="text-sm text-gray-600 mb-1">
//                         Your offer: <Text className="font-medium">₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}</Text>
//                       </Text>
//                       <Text className="text-sm text-green-600 mb-1">
//                         Farmer's counter: <Text className="font-medium text-green-700">₹{offer.counterPrice} × {offer.counterQuantity} {product.unitMeasurement}</Text>
//                       </Text>
//                       <Text className="text-sm text-gray-500 mb-2">
//                         Total: ₹{(offer.counterPrice * offer.counterQuantity).toFixed(2)}
//                       </Text>
//                       <Text className="text-xs text-gray-400 mb-3">
//                         Counter sent: {new Date(offer.counterDate).toLocaleString('en-IN')}
//                       </Text>
                      
//                       <View className="flex-row gap-2">
//                         <TouchableOpacity
//                           onPress={() => handleAcceptCounterOffer(product, grade, offer)}
//                           className="flex-1 bg-green-500 py-2 rounded-lg"
//                         >
//                           <Text className="text-white font-medium text-center">✓ Accept</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                           onPress={() => handleMakeNewCounterOffer(product, grade, offer)}
//                           className="flex-1 bg-yellow-500 py-2 rounded-lg"
//                         >
//                           <Text className="text-white font-medium text-center">💬 New Offer</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                           onPress={() => handleRejectCounterOffer(product._id, grade._id, offer._id)}
//                           className="flex-1 bg-red-500 py-2 rounded-lg"
//                         >
//                           <Text className="text-white font-medium text-center">✗ Reject</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   ))}
//               </View>
//             )}

//             {/* Accepted Offers */}
//             {grade.offers?.filter(o => o.traderId === traderId && o.status === 'accepted').length > 0 && (
//               <View className="mt-3 pt-3 border-t border-gray-200">
//                 <Text className="font-medium text-green-600 mb-2">✓ Accepted & Purchased:</Text>
//                 {grade.offers
//                   .filter(o => o.traderId === traderId && o.status === 'accepted')
//                   .map((offer) => (
//                     <View key={offer._id} className="bg-green-50 p-3 rounded-lg mb-2 border border-green-200">
//                       <View className="bg-green-500 px-2 py-1 rounded self-start mb-2">
//                         <Text className="text-white text-xs font-medium">Purchased</Text>
//                       </View>
//                       <Text className="text-sm">
//                         ₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}
//                       </Text>
//                       <Text className="text-sm text-gray-600">
//                         Total: ₹{(offer.offeredPrice * offer.quantity).toFixed(2)}
//                       </Text>
//                     </View>
//                   ))}
//               </View>
//             )}

//             {/* Rejected Offers */}
//             {grade.offers?.filter(o => o.traderId === traderId && o.status === 'rejected').length > 0 && (
//               <View className="mt-3 pt-3 border-t border-gray-200">
//                 <Text className="font-medium text-red-600 mb-2">✗ Rejected by Farmer:</Text>
//                 {grade.offers
//                   .filter(o => o.traderId === traderId && o.status === 'rejected')
//                   .map((offer) => (
//                     <View key={offer._id} className="bg-red-50 p-3 rounded-lg mb-2 border border-red-200 flex-row justify-between items-center">
//                       <View>
//                         <Text className="text-sm">
//                           ₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}
//                         </Text>
//                         <View className="bg-red-500 px-2 py-1 rounded self-start mt-1">
//                           <Text className="text-white text-xs font-medium">Rejected</Text>
//                         </View>
//                         <Text className="text-xs text-gray-500 mt-1">You can make a new offer</Text>
//                       </View>
//                       <TouchableOpacity
//                         onPress={() => handleMakeOffer(product)}
//                         disabled={grade.totalQty === 0}
//                         className="bg-green-500 px-3 py-2 rounded-lg"
//                       >
//                         <Text className="text-white font-medium text-xs">New Offer</Text>
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//               </View>
//             )}

//             {/* Purchase History */}
//             {grade.purchaseHistory?.length > 0 && (
//               <View className="mt-3 pt-3 border-t border-gray-200">
//                 <Text className="font-medium text-blue-600 mb-2">📦 Purchase History:</Text>
//                 {grade.purchaseHistory.map((purchase, idx) => (
//                   <View key={idx} className="bg-blue-50 p-3 rounded-lg mb-2 border border-blue-200">
//                     <View className="flex-row items-center mb-1">
//                       <View className="bg-blue-500 px-2 py-1 rounded mr-2">
//                         <Text className="text-white text-xs font-medium">
//                           {purchase.purchaseType === 'direct' ? 'Direct Buy' : 'Offer Accepted'}
//                         </Text>
//                       </View>
//                       <Text className="font-medium">{purchase.traderName || 'Unknown'}</Text>
//                     </View>
//                     <Text className="text-sm">
//                       ₹{purchase.pricePerUnit} × {purchase.quantity} {product.unitMeasurement} = 
//                       <Text className="font-medium"> ₹{purchase.totalAmount.toFixed(2)}</Text>
//                     </Text>
//                     <Text className="text-xs text-gray-500 mt-1">
//                       Purchased: {new Date(purchase.purchaseDate).toLocaleString('en-IN')}
//                     </Text>
//                     <View className={`px-2 py-1 rounded self-start mt-1 ${purchase.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}>
//                       <Text className="text-white text-xs font-medium">
//                         Payment: {purchase.paymentStatus}
//                       </Text>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>
//         ))}

//         {/* Make Offer for All Grades Button */}
//         {product.gradePrices.some(g => g.priceType === 'negotiable' && g.status !== 'sold') && (
//           <TouchableOpacity
//             onPress={() => handleMakeOffer(product)}
//             className="bg-green-500 py-3 rounded-lg mt-2"
//           >
//             <Text className="text-white font-medium text-center">Make Offer for All Grades</Text>
//           </TouchableOpacity>
//         )}

//         {/* Additional Product Info */}
//         <View className="border-t border-gray-200 mt-4 pt-4">
//           <View className="flex-row items-center mb-2">
//             <Icon name="box-seam" size={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">{product.packageMeasurement} {product.packagingType}</Text>
//           </View>
//           <View className="flex-row items-center mb-2">
//             <Icon name="calendar-event" size={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">{new Date(product.deliveryDate).toLocaleDateString()}</Text>
//           </View>
//           <View className="flex-row items-center mb-2">
//             <Icon name="clock" size={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">{product.deliveryTime}</Text>
//           </View>
//           <View className="flex-row items-center">
//             <Icon name="geo-alt" size={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">{product.nearestMarket}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default AllProducts;









// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   Modal,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const { width } = Dimensions.get('window');

// // Memoized Icon Component
// const Icon = memo(({ name, size = 20, color = '#000', style = {} }) => {
//   const icons = {
//     'shop-window': '🏪',
//     'box-seam': '📦',
//     'arrow-left': '←',
//     'bell': '🔔',
//     'arrow-clockwise': '🔄',
//     'shop': '🏬',
//     'calendar-event': '📅',
//     'clock': '🕐',
//     'geo-alt': '📍',
//     'search': '🔍',
//     'filter': '🎯',
//     'x': '✕',
//   };
  
//   return (
//     <Text style={[{ fontSize: size, color }, style]}>
//       {icons[name] || '•'}
//     </Text>
//   );
// });

// // Memoized Grade Photo Slider
// const GradePhotoSlider = memo(({ photos, getImageUrl, height = 200 }) => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   if (!photos || photos.length === 0) {
//     return (
//       <Image
//         source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400' }}
//         style={{ width: '100%', height }}
//         resizeMode="cover"
//       />
//     );
//   }

//   const handleScroll = useCallback((event) => {
//     const scrollPosition = event.nativeEvent.contentOffset.x;
//     const index = Math.round(scrollPosition / width);
//     setActiveIndex(index);
//   }, []);

//   return (
//     <View className="relative">
//       <FlatList
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         data={photos}
//         keyExtractor={(item, index) => `photo-${index}`}
//         renderItem={({ item }) => (
//           <Image
//             source={{ uri: getImageUrl(item) }}
//             style={{ width, height }}
//             resizeMode="cover"
//           />
//         )}
//         initialNumToRender={1}
//         maxToRenderPerBatch={2}
//         windowSize={3}
//       />

//       {photos.length > 1 && (
//         <>
//           <View className="absolute bottom-2 left-0 right-0 flex-row justify-center gap-2">
//             {photos.map((_, index) => (
//               <View
//                 key={index}
//                 className={`h-2 rounded-full ${
//                   index === activeIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
//                 }`}
//               />
//             ))}
//           </View>
//           <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-full">
//             <Text className="text-white text-xs font-medium">
//               {activeIndex + 1}/{photos.length}
//             </Text>
//           </View>
//         </>
//       )}
//     </View>
//   );
// });

// // Memoized Product Card Component
// const ProductCard = memo(({ 
//   product, 
//   getImageUrl, 
//   handleAcceptOffer, 
//   handleMakeOffer,
//   handleAcceptCounterOffer,
//   handleRejectCounterOffer,
//   handleMakeNewCounterOffer,
//   traderId 
// }) => {
//   const allPhotos = useMemo(() => 
//     product.gradePrices.flatMap(grade => grade.gradePhotos || []),
//     [product.gradePrices]
//   );

//   return (
//     <View className="bg-white rounded-2xl mb-4 overflow-hidden shadow-md">
//       <View className="relative">
//         <GradePhotoSlider 
//           photos={allPhotos}
//           getImageUrl={getImageUrl} 
//           height={200}
//         />
//         <View className="absolute top-2 left-2 bg-green-500 px-3 py-1 rounded-full">
//           <Text className="text-white font-medium">{product.farmingType}</Text>
//         </View>
//       </View>

//       <View className="p-4">
//         <Text className="text-xl font-medium mb-2">{product.cropBriefDetails}</Text>
        
//         <View className="flex-row flex-wrap gap-2 mb-3">
//           <View className="bg-blue-100 px-3 py-1 rounded-full">
//             <Text className="text-blue-700 font-medium text-xs">{product.productId}</Text>
//           </View>
//           {product.categoryId?.categoryName && (
//             <View className="bg-gray-100 px-3 py-1 rounded-full">
//               <Text className="text-gray-700 text-xs">{product.categoryId.categoryName}</Text>
//             </View>
//           )}
//           {product.subCategoryId?.subCategoryName && (
//             <View className="bg-gray-100 px-3 py-1 rounded-full">
//               <Text className="text-gray-700 text-xs">{product.subCategoryId.subCategoryName}</Text>
//             </View>
//           )}
//         </View>

//         {/* Grade Prices */}
//         {product.gradePrices.map((grade) => (
//           <View key={grade._id} className="border border-gray-200 rounded-xl p-3 mb-3">
//             <View className="flex-row justify-between items-start mb-2">
//               <View className="flex-1">
//                 <View className="flex-row items-center mb-1">
//                   <Text className="text-lg font-medium">{grade.grade}</Text>
//                   {grade.status === 'partially_sold' && (
//                     <View className="bg-yellow-500 px-2 py-1 rounded ml-2">
//                       <Text className="text-white text-xs font-medium">Partially Sold</Text>
//                     </View>
//                   )}
//                   {grade.status === 'sold' && (
//                     <View className="bg-red-500 px-2 py-1 rounded ml-2">
//                       <Text className="text-white text-xs font-medium">Sold Out</Text>
//                     </View>
//                   )}
//                 </View>
                
//                 <Text className="text-green-600 font-medium text-lg">
//                   ₹{grade.pricePerUnit}/{product.unitMeasurement || 'unit'}
//                 </Text>
                
//                 <View className="flex-row items-center mt-1">
//                   <Text className="text-gray-600">
//                     Qty: {grade.totalQty} {product.unitMeasurement || 'units'}
//                   </Text>
//                   {grade.quantityType === 'bulk' && (
//                     <View className="bg-blue-500 px-2 py-1 rounded ml-2">
//                       <Text className="text-white text-xs font-medium">Bulk Only</Text>
//                     </View>
//                   )}
//                 </View>
                
//                 <Text className="text-gray-500 text-sm mt-1">
//                   {grade.priceType === 'fixed' ? '🔒 Fixed Price' : '💬 Negotiable'}
//                 </Text>
//               </View>

//               <View className="gap-2">
//                 <TouchableOpacity
//                   onPress={() => handleAcceptOffer(product, grade)}
//                   disabled={grade.totalQty === 0}
//                   className={`px-4 py-2 rounded-lg ${grade.totalQty === 0 ? 'bg-gray-300' : 'bg-green-500'}`}
//                 >
//                   <Text className="text-white font-medium text-center">Add to Cart</Text>
//                 </TouchableOpacity>
                
//                 {grade.priceType === 'negotiable' && (
//                   <TouchableOpacity
//                     onPress={() => handleMakeOffer(product)}
//                     disabled={grade.totalQty === 0}
//                     className={`px-4 py-2 rounded-lg border-2 ${grade.totalQty === 0 ? 'border-gray-300' : 'border-green-500'}`}
//                   >
//                     <Text className={`font-medium text-center ${grade.totalQty === 0 ? 'text-gray-400' : 'text-green-600'}`}>
//                       Make Offer
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>

//             {/* Counter Offers */}
//             {grade.offers?.filter(o => o.traderId === traderId && o.status === 'countered').length > 0 && (
//               <View className="mt-3 pt-3 border-t border-gray-200">
//                 <Text className="font-medium text-yellow-600 mb-2">💬 Farmer's Counter Offer:</Text>
//                 {grade.offers
//                   .filter(o => o.traderId === traderId && o.status === 'countered')
//                   .map((offer) => (
//                     <View key={offer._id} className="bg-yellow-50 p-3 rounded-lg mb-2 border border-yellow-200">
//                       <Text className="text-sm text-gray-600 mb-1">
//                         Your offer: <Text className="font-medium">₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}</Text>
//                       </Text>
//                       <Text className="text-sm text-green-600 mb-1">
//                         Farmer's counter: <Text className="font-medium text-green-700">₹{offer.counterPrice} × {offer.counterQuantity} {product.unitMeasurement}</Text>
//                       </Text>
//                       <Text className="text-sm text-gray-500 mb-2">
//                         Total: ₹{(offer.counterPrice * offer.counterQuantity).toFixed(2)}
//                       </Text>
//                       <Text className="text-xs text-gray-400 mb-3">
//                         Counter sent: {new Date(offer.counterDate).toLocaleString('en-IN')}
//                       </Text>
                      
//                       <View className="flex-row gap-2">
//                         <TouchableOpacity
//                           onPress={() => handleAcceptCounterOffer(product, grade, offer)}
//                           className="flex-1 bg-green-500 py-2 rounded-lg"
//                         >
//                           <Text className="text-white font-medium text-center">✓ Accept</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                           onPress={() => handleMakeNewCounterOffer(product, grade, offer)}
//                           className="flex-1 bg-yellow-500 py-2 rounded-lg"
//                         >
//                           <Text className="text-white font-medium text-center">💬 New Offer</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                           onPress={() => handleRejectCounterOffer(product._id, grade._id, offer._id)}
//                           className="flex-1 bg-red-500 py-2 rounded-lg"
//                         >
//                           <Text className="text-white font-medium text-center">✗ Reject</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   ))}
//               </View>
//             )}

//             {/* Accepted Offers */}
//             {grade.offers?.filter(o => o.traderId === traderId && o.status === 'accepted').length > 0 && (
//               <View className="mt-3 pt-3 border-t border-gray-200">
//                 <Text className="font-medium text-green-600 mb-2">✓ Accepted & Purchased:</Text>
//                 {grade.offers
//                   .filter(o => o.traderId === traderId && o.status === 'accepted')
//                   .map((offer) => (
//                     <View key={offer._id} className="bg-green-50 p-3 rounded-lg mb-2 border border-green-200">
//                       <View className="bg-green-500 px-2 py-1 rounded self-start mb-2">
//                         <Text className="text-white text-xs font-medium">Purchased</Text>
//                       </View>
//                       <Text className="text-sm">
//                         ₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}
//                       </Text>
//                       <Text className="text-sm text-gray-600">
//                         Total: ₹{(offer.offeredPrice * offer.quantity).toFixed(2)}
//                       </Text>
//                     </View>
//                   ))}
//               </View>
//             )}

//             {/* Rejected Offers */}
//             {grade.offers?.filter(o => o.traderId === traderId && o.status === 'rejected').length > 0 && (
//               <View className="mt-3 pt-3 border-t border-gray-200">
//                 <Text className="font-medium text-red-600 mb-2">✗ Rejected by Farmer:</Text>
//                 {grade.offers
//                   .filter(o => o.traderId === traderId && o.status === 'rejected')
//                   .map((offer) => (
//                     <View key={offer._id} className="bg-red-50 p-3 rounded-lg mb-2 border border-red-200 flex-row justify-between items-center">
//                       <View>
//                         <Text className="text-sm">
//                           ₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}
//                         </Text>
//                         <View className="bg-red-500 px-2 py-1 rounded self-start mt-1">
//                           <Text className="text-white text-xs font-medium">Rejected</Text>
//                         </View>
//                         <Text className="text-xs text-gray-500 mt-1">You can make a new offer</Text>
//                       </View>
//                       <TouchableOpacity
//                         onPress={() => handleMakeOffer(product)}
//                         disabled={grade.totalQty === 0}
//                         className="bg-green-500 px-3 py-2 rounded-lg"
//                       >
//                         <Text className="text-white font-medium text-xs">New Offer</Text>
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//               </View>
//             )}

//             {/* Purchase History */}
//             {grade.purchaseHistory?.length > 0 && (
//               <View className="mt-3 pt-3 border-t border-gray-200">
//                 <Text className="font-medium text-blue-600 mb-2">📦 Purchase History:</Text>
//                 {grade.purchaseHistory.map((purchase, idx) => (
//                   <View key={idx} className="bg-blue-50 p-3 rounded-lg mb-2 border border-blue-200">
//                     <View className="flex-row items-center mb-1">
//                       <View className="bg-blue-500 px-2 py-1 rounded mr-2">
//                         <Text className="text-white text-xs font-medium">
//                           {purchase.purchaseType === 'direct' ? 'Direct Buy' : 'Offer Accepted'}
//                         </Text>
//                       </View>
//                       <Text className="font-medium">{purchase.traderName || 'Unknown'}</Text>
//                     </View>
//                     <Text className="text-sm">
//                       ₹{purchase.pricePerUnit} × {purchase.quantity} {product.unitMeasurement} = 
//                       <Text className="font-medium"> ₹{purchase.totalAmount.toFixed(2)}</Text>
//                     </Text>
//                     <Text className="text-xs text-gray-500 mt-1">
//                       Purchased: {new Date(purchase.purchaseDate).toLocaleString('en-IN')}
//                     </Text>
//                     <View className={`px-2 py-1 rounded self-start mt-1 ${purchase.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}>
//                       <Text className="text-white text-xs font-medium">
//                         Payment: {purchase.paymentStatus}
//                       </Text>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>
//         ))}

//         {/* Make Offer for All Grades Button */}
//         {product.gradePrices.some(g => g.priceType === 'negotiable' && g.status !== 'sold') && (
//           <TouchableOpacity
//             onPress={() => handleMakeOffer(product)}
//             className="bg-green-500 py-3 rounded-lg mt-2"
//           >
//             <Text className="text-white font-medium text-center">Make Offer for All Grades</Text>
//           </TouchableOpacity>
//         )}

//         {/* Additional Product Info */}
//         <View className="border-t border-gray-200 mt-4 pt-4">
//           <View className="flex-row items-center mb-2">
//             <Icon name="box-seam" size={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">{product.packageMeasurement} {product.packagingType}</Text>
//           </View>
//           <View className="flex-row items-center mb-2">
//             <Icon name="calendar-event" size={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">{new Date(product.deliveryDate).toLocaleDateString()}</Text>
//           </View>
//           <View className="flex-row items-center mb-2">
//             <Icon name="clock" size={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">{product.deliveryTime}</Text>
//           </View>
//           <View className="flex-row items-center">
//             <Icon name="geo-alt" size={16} color="#6b7280" />
//             <Text className="text-gray-600 ml-2">{product.nearestMarket}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// });

// const AllProducts = ({ navigation }) => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [traderId, setTraderId] = useState(null);
//   const [traderName, setTraderName] = useState('');
  
//   // Search & Filter States
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  
//   // Offer Modal States
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [gradeOffers, setGradeOffers] = useState({});
//   const [showOfferModal, setShowOfferModal] = useState(false);
  
//   // Quantity Modal States
//   const [showQuantityModal, setShowQuantityModal] = useState(false);
//   const [quantityInput, setQuantityInput] = useState('');
//   const [currentGrade, setCurrentGrade] = useState(null);
//   const [currentProduct, setCurrentProduct] = useState(null);
  
//   // New Counter Offer Modal States
//   const [showNewCounterModal, setShowNewCounterModal] = useState(false);
//   const [newCounterPrice, setNewCounterPrice] = useState('');
//   const [newCounterQuantity, setNewCounterQuantity] = useState('');
//   const [currentOffer, setCurrentOffer] = useState(null);

//   // Memoized categories and subcategories
//   const categories = useMemo(() => 
//     [...new Set(products.map(p => p.categoryId?.categoryName).filter(Boolean))],
//     [products]
//   );

//   const subCategories = useMemo(() => 
//     [...new Set(products.map(p => p.subCategoryId?.subCategoryName).filter(Boolean))],
//     [products]
//   );

//   // Load trader info once on mount
//   useEffect(() => {
//     const loadTraderInfo = async () => {
//       try {
//         const [id, name] = await Promise.all([
//           AsyncStorage.getItem('traderId'),
//           AsyncStorage.getItem('traderName')
//         ]);
//         setTraderId(id);
//         setTraderName(name || 'Unknown Trader');
//       } catch (err) {
//         console.error('Error loading trader info:', err);
//       }
//     };
//     loadTraderInfo();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Optimized filter with useMemo
//   useEffect(() => {
//     const filtered = products.filter(p => {
//       const matchesSearch = !searchQuery.trim() || 
//         p.cropBriefDetails?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.productId?.toLowerCase().includes(searchQuery.toLowerCase());
      
//       const matchesCategory = selectedCategory === 'all' || 
//         p.categoryId?.categoryName === selectedCategory;
      
//       const matchesSubCategory = selectedSubCategory === 'all' || 
//         p.subCategoryId?.subCategoryName === selectedSubCategory;
      
//       return matchesSearch && matchesCategory && matchesSubCategory;
//     });
    
//     setFilteredProducts(filtered);
//   }, [products, searchQuery, selectedCategory, selectedSubCategory]);

//   const fetchProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const id = traderId || await AsyncStorage.getItem('traderId');
//       const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${id}`);
//       const data = await res.json();
      
//       setProducts(data.data || []);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load products');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [traderId]);

//   const getImageUrl = useCallback((path) => {
//     if (!path) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
//     if (path.startsWith('http')) return path;
//     return `https://kisan.etpl.ai/${path}`;
//   }, []);

//   const handleAcceptOffer = useCallback(async (product, grade) => {
//     if (!traderId) {
//       Alert.alert('Error', 'Please login as a trader first');
//       return;
//     }

//     setCurrentProduct(product);
//     setCurrentGrade(grade);
//     setQuantityInput(grade.quantityType === 'bulk' ? grade.totalQty.toString() : '');
//     setShowQuantityModal(true);
//   }, [traderId]);

//   const confirmDirectPurchase = useCallback(async () => {
//     const numQuantity = Number(quantityInput);
//     const maxQty = currentGrade.totalQty;

//     if (isNaN(numQuantity) || numQuantity <= 0) {
//       Alert.alert('Error', 'Please enter a valid quantity');
//       return;
//     }

//     if (numQuantity > maxQty) {
//       Alert.alert('Error', `Maximum available quantity is ${maxQty}`);
//       return;
//     }

//     if (currentGrade.quantityType === 'bulk' && numQuantity !== maxQty) {
//       Alert.alert('Error', 'Bulk purchase requires buying the full quantity');
//       return;
//     }

//     const totalAmount = currentGrade.pricePerUnit * numQuantity;

//     Alert.alert(
//       'Confirm Direct Purchase',
//       `Product: ${currentProduct.cropBriefDetails}\nGrade: ${currentGrade.grade}\nPrice: ₹${currentGrade.pricePerUnit}/${currentProduct.unitMeasurement}\nQuantity: ${numQuantity} ${currentProduct.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\nProceed with payment?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Confirm',
//           onPress: async () => {
//             try {
//               const response = await fetch('https://kisan.etpl.ai/product/accept-listed-price', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   productId: currentProduct._id,
//                   gradeId: currentGrade._id,
//                   traderId,
//                   traderName,
//                   quantity: numQuantity
//                 })
//               });

//               const data = await response.json();

//               if (data.success) {
//                 Alert.alert(
//                   '✅ Purchase Successful!',
//                   `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${currentProduct.unitMeasurement}\n\nProceeding to payment...`
//                 );
//                 setShowQuantityModal(false);
//                 setQuantityInput('');
//                 fetchProducts();
//               } else {
//                 Alert.alert('Error', data.message);
//               }
//             } catch (error) {
//               Alert.alert('Error', 'Failed to process purchase. Please try again.');
//             }
//           }
//         }
//       ]
//     );
//   }, [quantityInput, currentGrade, currentProduct, traderId, traderName, fetchProducts]);

//   const handleMakeOffer = useCallback((product) => {
//     const initialOffers = {};
//     product.gradePrices
//       .filter(g => g.status !== 'sold' && g.priceType === 'negotiable')
//       .forEach(grade => {
//         initialOffers[grade._id] = {
//           price: grade.pricePerUnit.toString(),
//           quantity: grade.quantityType === 'bulk' ? grade.totalQty.toString() : ''
//         };
//       });

//     setSelectedProduct(product);
//     setGradeOffers(initialOffers);
//     setShowOfferModal(true);
//   }, []);

//   const submitOffer = useCallback(async () => {
//     const hasValidOffer = Object.values(gradeOffers).some(
//       offer => offer.price && offer.quantity
//     );

//     if (!hasValidOffer) {
//       Alert.alert('Error', 'Please enter price and quantity for at least one grade');
//       return;
//     }

//     const offers = [];
//     for (const [gradeId, offer] of Object.entries(gradeOffers)) {
//       if (offer.price && offer.quantity) {
//         const grade = selectedProduct.gradePrices.find(g => g._id === gradeId);
        
//         const numPrice = Number(offer.price);
//         const numQuantity = Number(offer.quantity);

//         if (numQuantity > grade.totalQty) {
//           Alert.alert('Error', `${grade.grade}: Maximum available is ${grade.totalQty}`);
//           return;
//         }

//         if (grade.quantityType === 'bulk' && numQuantity !== grade.totalQty) {
//           Alert.alert('Error', `${grade.grade}: Bulk purchase requires full quantity`);
//           return;
//         }

//         offers.push({
//           gradeId,
//           gradeName: grade.grade,
//           offeredPrice: numPrice,
//           quantity: numQuantity,
//           listedPrice: grade.pricePerUnit
//         });
//       }
//     }

//     const totalAmount = offers.reduce((sum, o) => sum + (o.offeredPrice * o.quantity), 0);
//     const confirmMsg = 
//       `Confirm Your Bid:\n\n` +
//       offers.map(o => 
//         `${o.gradeName}: ₹${o.offeredPrice} × ${o.quantity} = ₹${(o.offeredPrice * o.quantity).toFixed(2)}`
//       ).join('\n') +
//       `\n\nTotal Bid Amount: ₹${totalAmount.toFixed(2)}\n\nSubmit?`;

//     Alert.alert('Confirm Bid', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Submit',
//         onPress: async () => {
//           try {
//             if (offers.length === 1) {
//               const offer = offers[0];
//               const response = await fetch('https://kisan.etpl.ai/product/make-offer', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   productId: selectedProduct._id,
//                   gradeId: offer.gradeId,
//                   traderId,
//                   traderName,
//                   offeredPrice: offer.offeredPrice,
//                   quantity: offer.quantity
//                 })
//               });

//               const data = await response.json();
              
//               if (data.success) {
//                 Alert.alert('Success', '✅ Offer submitted successfully!\n\nThe farmer will review your bid.');
//                 setShowOfferModal(false);
//                 fetchProducts();
//               } else {
//                 Alert.alert('Error', data.message);
//               }
//             } else {
//               const response = await fetch('https://kisan.etpl.ai/product/make-offer-batch', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   productId: selectedProduct._id,
//                   traderId,
//                   traderName,
//                   offers: offers.map(o => ({
//                     gradeId: o.gradeId,
//                     offeredPrice: o.offeredPrice,
//                     quantity: o.quantity
//                   }))
//                 })
//               });

//               const data = await response.json();
              
//               if (data.success) {
//                 Alert.alert('Success', '✅ All offers submitted successfully!\n\nThe farmer will review your bid.');
//                 setShowOfferModal(false);
//                 fetchProducts();
//               } else {
//                 Alert.alert('Error', 'Some offers failed. Please try again.');
//               }
//             }
//           } catch (error) {
//             Alert.alert('Error', 'Failed to submit offers. Please try again.');
//           }
//         }
//       }
//     ]);
//   }, [gradeOffers, selectedProduct, traderId, traderName, fetchProducts]);

//   const handleAcceptCounterOffer = useCallback(async (product, grade, offer) => {
//     const confirmMsg = 
//       `Accept Farmer's Counter Offer?\n\n` +
//       `Your original offer: ₹${offer.offeredPrice} × ${offer.quantity}\n` +
//       `Farmer's counter: ₹${offer.counterPrice} × ${offer.counterQuantity}\n\n` +
//       `Total Amount: ₹${(offer.counterPrice * offer.counterQuantity).toFixed(2)}\n\nProceed?`;
    
//     Alert.alert('Accept Counter Offer', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Accept',
//         onPress: async () => {
//           try {
//             const response = await fetch('https://kisan.etpl.ai/product/accept-counter-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 productId: product._id,
//                 gradeId: grade._id,
//                 offerId: offer._id,
//                 traderId,
//                 traderName
//               })
//             });

//             const data = await response.json();
            
//             if (data.success) {
//               Alert.alert(
//                 '✅ Counter Offer Accepted!',
//                 `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${product.unitMeasurement}\n\nProceeding to payment...`
//               );
//               fetchProducts();
//             } else {
//               Alert.alert('Error', data.message);
//             }
//           } catch (error) {
//             Alert.alert('Error', 'Failed to accept counter offer. Please try again.');
//           }
//         }
//       }
//     ]);
//   }, [traderId, traderName, fetchProducts]);

//   const handleRejectCounterOffer = useCallback(async (productId, gradeId, offerId) => {
//     Alert.alert(
//       'Reject Counter Offer',
//       'Reject this counter offer? You can make a new offer after rejecting.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Reject',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const response = await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ productId, gradeId, offerId })
//               });

//               const data = await response.json();
//               if (data.success) {
//                 Alert.alert('Success', 'Counter offer rejected. You can now make a new offer.');
//                 fetchProducts();
//               }
//             } catch (error) {
//               Alert.alert('Error', 'Error rejecting counter offer');
//             }
//           }
//         }
//       ]
//     );
//   }, [fetchProducts]);

//   const handleMakeNewCounterOffer = useCallback(async (product, grade, existingOffer) => {
//     if (!traderId) {
//       Alert.alert('Error', 'Please login as a trader first');
//       return;
//     }

//     setCurrentProduct(product);
//     setCurrentGrade(grade);
//     setCurrentOffer(existingOffer);
//     setNewCounterPrice(existingOffer.counterPrice.toString());
//     setNewCounterQuantity(existingOffer.counterQuantity.toString());
//     setShowNewCounterModal(true);
//   }, [traderId]);

//   const submitNewCounterOffer = useCallback(async () => {
//     const numPrice = Number(newCounterPrice);
//     const numQuantity = Number(newCounterQuantity);

//     if (isNaN(numPrice) || numPrice <= 0 || isNaN(numQuantity) || numQuantity <= 0) {
//       Alert.alert('Error', 'Please enter valid price and quantity');
//       return;
//     }

//     if (numQuantity > currentGrade.totalQty) {
//       Alert.alert('Error', `Maximum available: ${currentGrade.totalQty} ${currentProduct.unitMeasurement}`);
//       return;
//     }

//     if (currentGrade.quantityType === 'bulk' && numQuantity !== currentGrade.totalQty) {
//       Alert.alert('Error', 'Bulk purchase requires full quantity');
//       return;
//     }

//     const totalAmount = numPrice * numQuantity;
//     const confirmMsg = 
//       `Submit New Counter Offer?\n\n` +
//       `Farmer's counter: ₹${currentOffer.counterPrice} × ${currentOffer.counterQuantity}\n` +
//       `Your new offer: ₹${numPrice} × ${numQuantity}\n\n` +
//       `Total: ₹${totalAmount.toFixed(2)}\n\nSubmit?`;

//     Alert.alert('Confirm New Offer', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Submit',
//         onPress: async () => {
//           try {
//             await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ 
//                 productId: currentProduct._id, 
//                 gradeId: currentGrade._id, 
//                 offerId: currentOffer._id 
//               })
//             });

//             const response = await fetch('https://kisan.etpl.ai/product/make-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 productId: currentProduct._id,
//                 gradeId: currentGrade._id,
//                 traderId,
//                 traderName,
//                 offeredPrice: numPrice,
//                 quantity: numQuantity
//               })
//             });

//             const data = await response.json();
            
//             if (data.success) {
//               Alert.alert('Success', '✅ New offer submitted successfully!\n\nThe farmer will review your new bid.');
//               setShowNewCounterModal(false);
//               setNewCounterPrice('');
//               setNewCounterQuantity('');
//               fetchProducts();
//             } else {
//               Alert.alert('Error', data.message);
//             }
//           } catch (error) {
//             Alert.alert('Error', 'Failed to submit new offer. Please try again.');
//           }
//         }
//       }
//     ]);
//   }, [newCounterPrice, newCounterQuantity, currentGrade, currentProduct, currentOffer, traderId, traderName, fetchProducts]);

//   const renderProductItem = useCallback(({ item }) => (
//     <ProductCard
//       product={item}
//       getImageUrl={getImageUrl}
//       handleAcceptOffer={handleAcceptOffer}
//       handleMakeOffer={handleMakeOffer}
//       handleAcceptCounterOffer={handleAcceptCounterOffer}
//       handleRejectCounterOffer={handleRejectCounterOffer}
//       handleMakeNewCounterOffer={handleMakeNewCounterOffer}
//       traderId={traderId}
//     />
//   ), [getImageUrl, handleAcceptOffer, handleMakeOffer, handleAcceptCounterOffer, handleRejectCounterOffer, handleMakeNewCounterOffer, traderId]);

//   const keyExtractor = useCallback((item) => item._id, []);

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#22c55e" />
//         <Text className="mt-4 text-gray-600">Loading products...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
//         <View className="flex-row justify-between items-center mb-4">
//           <View className="flex-row items-center">
//             <Icon name="shop-window" size={24} color="#22c55e" />
//             <Text className="text-2xl font-medium ml-2">Available Products</Text>
//           </View>
          
//           <TouchableOpacity
//             onPress={() => navigation.navigate('MyPurchases')}
//             className="bg-green-500 px-3 py-2 rounded-lg flex-row items-center"
//           >
//             <Icon name="box-seam" size={16} color="#fff" />
//             <Text className="text-white ml-1 font-medium">Purchases</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search Bar */}
//         <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
//           <Icon name="search" size={20} color="#6b7280" />
//           <TextInput
//             className="flex-1 ml-2 text-base"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Icon name="x" size={20} color="#6b7280" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Filter Button & Stats */}
//         <View className="flex-row justify-between items-center">
//           <TouchableOpacity
//             onPress={() => setShowFilters(!showFilters)}
//             className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
//           >
//             <Icon name="filter" size={16} color="#fff" />
//             <Text className="text-white ml-2 font-medium">Filters</Text>
//           </TouchableOpacity>
          
//           <View className="flex-row items-center gap-2">
//             <View className="bg-blue-100 px-3 py-1 rounded-full">
//               <Text className="text-blue-700 font-medium">{filteredProducts.length} products</Text>
//             </View>
//             <TouchableOpacity onPress={fetchProducts} className="bg-green-100 p-2 rounded-full">
//               <Icon name="arrow-clockwise" size={18} color="#22c55e" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Filters Panel */}
//         {showFilters && (
//           <View className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//             <Text className="font-medium mb-2">Category</Text>
//             <FlatList
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               data={['all', ...categories]}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => setSelectedCategory(item)}
//                   className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === item ? 'bg-green-500' : 'bg-gray-200'}`}
//                 >
//                   <Text className={selectedCategory === item ? 'text-white font-medium' : 'text-gray-700'}>
//                     {item === 'all' ? 'All' : item}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               className="mb-3"
//             />

//             <Text className="font-medium mb-2">Sub-Category</Text>
//             <FlatList
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               data={['all', ...subCategories]}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => setSelectedSubCategory(item)}
//                   className={`px-4 py-2 rounded-full mr-2 ${selectedSubCategory === item ? 'bg-green-500' : 'bg-gray-200'}`}
//                 >
//                   <Text className={selectedSubCategory === item ? 'text-white font-medium' : 'text-gray-700'}>
//                     {item === 'all' ? 'All' : item}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         )}
//       </View>

//       {/* Products List with FlatList for better performance */}
//       {error && (
//         <View className="bg-red-100 p-4 m-4 rounded-lg">
//           <Text className="text-red-700">{error}</Text>
//         </View>
//       )}

//       <FlatList
//         data={filteredProducts}
//         renderItem={renderProductItem}
//         keyExtractor={keyExtractor}
//         contentContainerStyle={{ padding: 16 }}
//         refreshing={refreshing}
//         onRefresh={() => {
//           setRefreshing(true);
//           fetchProducts();
//         }}
//         ListEmptyComponent={
//           <View className="flex-1 justify-center items-center py-20">
//             <Icon name="shop" size={60} color="#d1d5db" />
//             <Text className="text-xl text-gray-500 mt-4 font-medium">No products found</Text>
//             <Text className="text-gray-400 mt-2">Try adjusting your filters</Text>
//           </View>
//         }
//         initialNumToRender={5}
//         maxToRenderPerBatch={10}
//         windowSize={10}
//         removeClippedSubviews={true}
//         updateCellsBatchingPeriod={50}
//       />

//       {/* Offer Modal */}
//       <Modal
//         visible={showOfferModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowOfferModal(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="bg-white rounded-t-3xl" style={{ maxHeight: '90%' }}>
//             <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
//               <Text className="text-xl font-medium">Bid by Trader - All Grades</Text>
//               <TouchableOpacity onPress={() => setShowOfferModal(false)}>
//                 <Icon name="x" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={selectedProduct?.gradePrices.filter(g => g.status !== 'sold' && g.priceType === 'negotiable') || []}
//               keyExtractor={(item) => item._id}
//               ListHeaderComponent={
//                 <View className="p-4">
//                   <View className="bg-blue-50 p-3 rounded-lg mb-4">
//                     <Text className="text-blue-700 font-medium">💡 Tip: Enter your offer for each grade. Leave blank if you don't want to bid on that grade.</Text>
//                   </View>
//                   {selectedProduct && (
//                     <Text className="text-lg font-medium mb-4">{selectedProduct.cropBriefDetails}</Text>
//                   )}
//                 </View>
//               }
//               renderItem={({ item: grade }) => {
//                 const offer = gradeOffers[grade._id] || { price: '', quantity: '' };
//                 const amount = offer.price && offer.quantity 
//                   ? (Number(offer.price) * Number(offer.quantity)).toFixed(2)
//                   : '0.00';

//                 return (
//                   <View className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 mx-4">
//                     <View className="flex-row justify-between items-center mb-2">
//                       <Text className="font-medium text-base">{grade.grade}</Text>
//                       {grade.quantityType === 'bulk' && (
//                         <View className="bg-blue-500 px-2 py-1 rounded">
//                           <Text className="text-white text-xs font-medium">Bulk</Text>
//                         </View>
//                       )}
//                     </View>

//                     <Text className="text-gray-600 mb-2">Listed: ₹{grade.pricePerUnit}/{selectedProduct?.unitMeasurement}</Text>
//                     <Text className="text-gray-600 mb-3">Available: {grade.totalQty} {selectedProduct?.unitMeasurement}</Text>

//                     <Text className="font-medium mb-1">Your Offer Price (₹/{selectedProduct?.unitMeasurement})</Text>
//                     <TextInput
//                       className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
//                       placeholder={`₹${grade.pricePerUnit}`}
//                       keyboardType="numeric"
//                       value={offer.price}
//                       onChangeText={(text) => setGradeOffers({
//                         ...gradeOffers,
//                         [grade._id]: { ...offer, price: text }
//                       })}
//                     />

//                     <Text className="font-medium mb-1">Quantity ({selectedProduct?.unitMeasurement})</Text>
//                     <TextInput
//                       className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
//                       placeholder={`Max: ${grade.totalQty}`}
//                       keyboardType="numeric"
//                       value={offer.quantity}
//                       onChangeText={(text) => setGradeOffers({
//                         ...gradeOffers,
//                         [grade._id]: { ...offer, quantity: text }
//                       })}
//                       editable={grade.quantityType !== 'bulk'}
//                     />

//                     <View className="bg-green-100 p-2 rounded-lg">
//                       <Text className="text-green-700 font-medium text-right">
//                         Amount: ₹{amount}
//                       </Text>
//                     </View>
//                   </View>
//                 );
//               }}
//               ListFooterComponent={
//                 selectedProduct && (
//                   <View className="px-4 pb-4">
//                     <View className="bg-green-500 p-4 rounded-lg mt-4">
//                       <Text className="text-white text-lg font-medium text-center">
//                         Total Bid Amount: ₹{Object.entries(gradeOffers).reduce((sum, [gradeId, offer]) => {
//                           if (offer.price && offer.quantity) {
//                             return sum + (Number(offer.price) * Number(offer.quantity));
//                           }
//                           return sum;
//                         }, 0).toFixed(2)}
//                       </Text>
//                     </View>

//                     <View className="flex-row gap-3 mt-6 mb-4">
//                       <TouchableOpacity
//                         onPress={() => setShowOfferModal(false)}
//                         className="flex-1 bg-gray-300 py-3 rounded-lg"
//                       >
//                         <Text className="text-gray-700 font-medium text-center">Cancel</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         onPress={submitOffer}
//                         className="flex-1 bg-green-500 py-3 rounded-lg"
//                       >
//                         <Text className="text-white font-medium text-center">Submit Bid</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )
//               }
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Quantity Input Modal */}
//       <Modal
//         visible={showQuantityModal}
//         animationType="fade"
//         transparent={true}
//         onRequestClose={() => setShowQuantityModal(false)}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50 px-6">
//           <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <Text className="text-xl font-medium mb-4">
//               {currentGrade?.quantityType === 'bulk' ? 'Bulk Purchase' : 'Enter Quantity'}
//             </Text>
            
//             {currentGrade?.quantityType === 'bulk' ? (
//               <View className="bg-yellow-50 p-3 rounded-lg mb-4">
//                 <Text className="text-yellow-800">
//                   This is a bulk purchase. You must buy the full quantity: {currentGrade.totalQty} {currentProduct?.unitMeasurement}
//                 </Text>
//               </View>
//             ) : (
//               <Text className="text-gray-600 mb-4">
//                 Maximum available: {currentGrade?.totalQty} {currentProduct?.unitMeasurement}
//               </Text>
//             )}

//             <TextInput
//               className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
//               placeholder={`Enter quantity (Max: ${currentGrade?.totalQty})`}
//               keyboardType="numeric"
//               value={quantityInput}
//               onChangeText={setQuantityInput}
//               editable={currentGrade?.quantityType !== 'bulk'}
//             />

//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowQuantityModal(false);
//                   setQuantityInput('');
//                 }}
//                 className="flex-1 bg-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-gray-700 font-medium text-center">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={confirmDirectPurchase}
//                 className="flex-1 bg-green-500 py-3 rounded-lg"
//               >
//                 <Text className="text-white font-medium text-center">Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* New Counter Offer Modal */}
//       <Modal
//         visible={showNewCounterModal}
//         animationType="fade"
//         transparent={true}
//         onRequestClose={() => setShowNewCounterModal(false)}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50 px-6">
//           <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <Text className="text-xl font-medium mb-4">Make New Counter Offer</Text>
            
//             <View className="bg-yellow-50 p-3 rounded-lg mb-4">
//               <Text className="text-sm text-gray-700 mb-1">
//                 Farmer's counter: <Text className="font-medium">₹{currentOffer?.counterPrice} × {currentOffer?.counterQuantity}</Text>
//               </Text>
//             </View>

//             <Text className="font-medium mb-2">Your New Price (₹/{currentProduct?.unitMeasurement})</Text>
//             <TextInput
//               className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
//               placeholder="Enter price"
//               keyboardType="numeric"
//               value={newCounterPrice}
//               onChangeText={setNewCounterPrice}
//             />

//             <Text className="font-medium mb-2">Quantity ({currentProduct?.unitMeasurement})</Text>
//             <TextInput
//               className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
//               placeholder={`Max: ${currentGrade?.totalQty}`}
//               keyboardType="numeric"
//               value={newCounterQuantity}
//               onChangeText={setNewCounterQuantity}
//               editable={currentGrade?.quantityType !== 'bulk'}
//             />

//             {newCounterPrice && newCounterQuantity && (
//               <View className="bg-green-100 p-3 rounded-lg mb-4">
//                 <Text className="text-green-700 font-medium text-center">
//                   Total: ₹{(Number(newCounterPrice) * Number(newCounterQuantity)).toFixed(2)}
//                 </Text>
//               </View>
//             )}

//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowNewCounterModal(false);
//                   setNewCounterPrice('');
//                   setNewCounterQuantity('');
//                 }}
//                 className="flex-1 bg-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-gray-700 font-medium text-center">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={submitNewCounterOffer}
//                 className="flex-1 bg-green-500 py-3 rounded-lg"
//               >
//                 <Text className="text-white font-medium text-center">Submit</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default memo(AllProducts);









// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   Modal,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');

// // Memoized Icon Component
// const Icon = memo(({ name, size = 20, color = '#000', style = {} }) => {
//   const icons = {
//     'shop-window': '🏪',
//     'box-seam': '📦',
//     'arrow-left': '←',
//     'bell': '🔔',
//     'arrow-clockwise': '🔄',
//     'shop': '🏬',
//     'calendar-event': '📅',
//     'clock': '🕐',
//     'geo-alt': '📍',
//     'search': '🔍',
//     'filter': '🎯',
//     'x': '✕',
//     'chevron-down': '▼',
//   };
  
//   return (
//     <Text style={[{ fontSize: size, color }, style]}>
//       {icons[name] || '•'}
//     </Text>
//   );
// });

// // Memoized Grade Photo Slider
// const GradePhotoSlider = memo(({ photos, getImageUrl, height = 200 }) => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   if (!photos || photos.length === 0) {
//     return (
//       <Image
//         source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400' }}
//         style={{ width: '100%', height }}
//         className='rounded-lg'
//         resizeMode="cover"
//       />
//     );
//   }

//   const handleScroll = useCallback((event) => {
//     const scrollPosition = event.nativeEvent.contentOffset.x;
//     const index = Math.round(scrollPosition / width);
//     setActiveIndex(index);
//   }, []);

//   return (
//     <View className="relative">
//       <FlatList
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         data={photos}
//         keyExtractor={(item, index) => `photo-${index}`}
//         renderItem={({ item }) => (
//           <Image
//             source={{ uri: getImageUrl(item) }}
//             style={{ width, height }}
//             resizeMode="cover"
//           />
//         )}
//         initialNumToRender={1}
//         maxToRenderPerBatch={2}
//         windowSize={3}
//       />

//       {photos.length > 1 && (
//         <>
//           <View className="absolute bottom-2 left-0 right-0 flex-row justify-center gap-2">
//             {photos.map((_, index) => (
//               <View
//                 key={index}
//                 className={`h-2 rounded-full ${
//                   index === activeIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
//                 }`}
//               />
//             ))}
//           </View>
//           <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-full">
//             <Text className="text-white text-xs font-medium">
//               {activeIndex + 1}/{photos.length}
//             </Text>
//           </View>
//         </>
//       )}
//     </View>
//   );
// });

// // Memoized Product Card Component
// const ProductCard = memo(({ 
//   product, 
//   getImageUrl, 
//   onViewAllGrades,
//   traderId 
// }) => {
//   const allPhotos = useMemo(() => 
//     product.gradePrices.flatMap(grade => grade.gradePhotos || []),
//     [product.gradePrices]
//   );

//   return (
//     <View className="bg-white rounded-lg mb-4 overflow-hidden border border-gray-200 p-4">
//       <View className="relative">
//         <GradePhotoSlider 
//           photos={allPhotos}
//           getImageUrl={getImageUrl} 
//           height={200}
//         />
//         <View className="absolute top-2 left-2 bg-green-500 px-3 py-1 rounded-full">
//           <Text className="text-white font-medium text-xs">{product.farmingType}</Text>
//         </View>
//       </View>

//       <View className="p-4">
//         {/* Product Header */}
//         <Text className="text-lg font-medium text-gray-900 mb-2">{product.cropBriefDetails}</Text>
        
//         {/* Product Info Tags */}
//         <View className="flex-row flex-wrap gap-2 mb-3">
//           <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
//             <Text className="text-blue-700 font-medium text-xs">{product.productId}</Text>
//           </View>
//           {product.categoryId?.categoryName && (
//             <View className="bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
//               <Text className="text-gray-700 text-xs">{product.categoryId.categoryName}</Text>
//             </View>
//           )}
//           {product.subCategoryId?.subCategoryName && (
//             <View className="bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
//               <Text className="text-gray-700 text-xs">{product.subCategoryId.subCategoryName}</Text>
//             </View>
//           )}
//         </View>

//         {/* Additional Product Info */}
//         <View className="flex-row items-center font-medium justify-between flex-wrap border-t border-gray-200 pt-3 mb-3">
//   <View className="flex-row items-center mb-3">
//     <Ionicons name="cube-outline" size={14} color="#6b7280" />
//     <Text className="text-gray-600 text-sm ml-2 font-medium">{product.packageMeasurement} {product.packagingType}</Text>
//   </View>
//   <View className="flex-row items-center mb-3">
//     <Ionicons name="calendar-outline" size={14} color="#6b7280" />
//     <Text className="text-gray-600 text-sm ml-2 font-medium">{new Date(product.deliveryDate).toLocaleDateString()}</Text>
//   </View>
//   <View className="flex-row items-center mb-3">
//     <Ionicons name="time-outline" size={14} color="#6b7280" />
//     <Text className="text-gray-600 text-sm ml-2 font-medium">{product.deliveryTime}</Text>
//   </View>
//   <View className="flex-row items-center mb-3">
//     <Ionicons name="location-outline" size={14} color="#6b7280" />
//     <Text className="text-gray-600 text-sm ml-2 font-medium">{product.nearestMarket}</Text>
//   </View>
// </View>

//         {/* View All Button */}
//         <TouchableOpacity
//           onPress={() => onViewAllGrades(product)}
//           className="bg-green-500 py-3 rounded-lg"
//         >
//           <Text className="text-white font-medium text-center">View All Grades & Offers</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// });

// // Grade Details Modal Component
// const GradeDetailsModal = memo(({ 
//   visible, 
//   product, 
//   onClose, 
//   getImageUrl,
//   handleAcceptOffer,
//   handleMakeOffer,
//   handleAcceptCounterOffer,
//   handleRejectCounterOffer,
//   handleMakeNewCounterOffer,
//   traderId 
// }) => {
//   if (!product) return null;

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View className="flex-1 bg-black/50">
//         <View className="flex-1 mt-20 bg-white rounded-t-3xl">
//           {/* Modal Header */}
//           <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
//             <Text className="text-xl font-medium flex-1">{product.cropBriefDetails}</Text>
//             <TouchableOpacity onPress={onClose} className="ml-2">
//               <Icon name="x" size={24} color="#000" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView className="flex-1">
//             <View className="p-4">
//               {/* Product Info */}
//               <View className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
//                 <Text className="font-medium text-gray-700 mb-2">Product Details</Text>
//                 <Text className="text-sm text-gray-600 mb-1">Product ID: {product.productId}</Text>
//                 <Text className="text-sm text-gray-600 mb-1">Farming Type: {product.farmingType}</Text>
//                 {product.categoryId?.categoryName && (
//                   <Text className="text-sm text-gray-600 mb-1">Category: {product.categoryId.categoryName}</Text>
//                 )}
//                 {product.subCategoryId?.subCategoryName && (
//                   <Text className="text-sm text-gray-600">Sub-Category: {product.subCategoryId.subCategoryName}</Text>
//                 )}
//               </View>

//               {/* All Grades */}
//               {product.gradePrices.map((grade) => (
//                 <View key={grade._id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-white">
//                   {/* Grade Photos */}
//                   {grade.gradePhotos && grade.gradePhotos.length > 0 && (
//                     <View className="mb-3">
//                       <GradePhotoSlider 
//                         photos={grade.gradePhotos}
//                         getImageUrl={getImageUrl}
//                         height={150}
//                       />
//                     </View>
//                   )}

//                   {/* Grade Header */}
//                   <View className="flex-row justify-between items-start mb-3">
//                     <View className="flex-1">
//                       <View className="flex-row items-center mb-2">
//                         <Text className="text-lg font-medium text-gray-900">{grade.grade}</Text>
//                         {grade.status === 'partially_sold' && (
//                           <View className="bg-yellow-500 px-2 py-1 rounded ml-2">
//                             <Text className="text-white text-xs font-medium">Partially Sold</Text>
//                           </View>
//                         )}
//                         {grade.status === 'sold' && (
//                           <View className="bg-red-500 px-2 py-1 rounded ml-2">
//                             <Text className="text-white text-xs font-medium">Sold Out</Text>
//                           </View>
//                         )}
//                       </View>
                      
//                       <Text className="text-green-600 font-medium text-xl mb-1">
//                         ₹{grade.pricePerUnit}/{product.unitMeasurement || 'unit'}
//                       </Text>
                      
//                       <View className="flex-row items-center mb-1">
//                         <Text className="text-gray-600 text-sm">
//                           Qty: {grade.totalQty} {product.unitMeasurement || 'units'}
//                         </Text>
//                         {grade.quantityType === 'bulk' && (
//                           <View className="bg-blue-500 px-2 py-1 rounded ml-2">
//                             <Text className="text-white text-xs font-medium">Bulk Only</Text>
//                           </View>
//                         )}
//                       </View>
                      
//                       <Text className="text-gray-500 text-sm">
//                         {grade.priceType === 'fixed' ? '🔒 Fixed Price' : '💬 Negotiable'}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Action Buttons */}
//                   <View className="flex-row gap-2 mb-3">
//                     <TouchableOpacity
//                       onPress={() => handleAcceptOffer(product, grade)}
//                       disabled={grade.totalQty === 0}
//                       className={`flex-1 py-3 rounded-lg ${grade.totalQty === 0 ? 'bg-gray-300' : 'bg-green-500'}`}
//                     >
//                       <Text className="text-white font-medium text-center">Add to Cart</Text>
//                     </TouchableOpacity>
                    
//                     {grade.priceType === 'negotiable' && (
//                       <TouchableOpacity
//                         onPress={() => handleMakeOffer(product)}
//                         disabled={grade.totalQty === 0}
//                         className={`flex-1 py-3 rounded-lg border-2 ${grade.totalQty === 0 ? 'border-gray-300' : 'border-green-500'}`}
//                       >
//                         <Text className={`font-medium text-center ${grade.totalQty === 0 ? 'text-gray-400' : 'text-green-600'}`}>
//                           Make Offer
//                         </Text>
//                       </TouchableOpacity>
//                     )}
//                   </View>

//                   {/* Counter Offers */}
//                   {grade.offers?.filter(o => o.traderId === traderId && o.status === 'countered').length > 0 && (
//                     <View className="mt-3 pt-3 border-t border-gray-200">
//                       <Text className="font-medium text-yellow-600 mb-2">💬 Farmer's Counter Offer:</Text>
//                       {grade.offers
//                         .filter(o => o.traderId === traderId && o.status === 'countered')
//                         .map((offer) => (
//                           <View key={offer._id} className="bg-yellow-50 p-3 rounded-lg mb-2 border border-yellow-200">
//                             <Text className="text-sm text-gray-600 mb-1">
//                               Your offer: <Text className="font-medium">₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}</Text>
//                             </Text>
//                             <Text className="text-sm text-green-600 mb-1">
//                               Farmer's counter: <Text className="font-medium text-green-700">₹{offer.counterPrice} × {offer.counterQuantity} {product.unitMeasurement}</Text>
//                             </Text>
//                             <Text className="text-sm text-gray-500 mb-2">
//                               Total: ₹{(offer.counterPrice * offer.counterQuantity).toFixed(2)}
//                             </Text>
//                             <Text className="text-xs text-gray-400 mb-3">
//                               Counter sent: {new Date(offer.counterDate).toLocaleString('en-IN')}
//                             </Text>
                            
//                             <View className="flex-row gap-2">
//                               <TouchableOpacity
//                                 onPress={() => handleAcceptCounterOffer(product, grade, offer)}
//                                 className="flex-1 bg-green-500 py-2 rounded-lg"
//                               >
//                                 <Text className="text-white font-medium text-center">✓ Accept</Text>
//                               </TouchableOpacity>
//                               <TouchableOpacity
//                                 onPress={() => handleMakeNewCounterOffer(product, grade, offer)}
//                                 className="flex-1 bg-yellow-500 py-2 rounded-lg"
//                               >
//                                 <Text className="text-white font-medium text-center">💬 New Offer</Text>
//                               </TouchableOpacity>
//                               <TouchableOpacity
//                                 onPress={() => handleRejectCounterOffer(product._id, grade._id, offer._id)}
//                                 className="flex-1 bg-red-500 py-2 rounded-lg"
//                               >
//                                 <Text className="text-white font-medium text-center">✗ Reject</Text>
//                               </TouchableOpacity>
//                             </View>
//                           </View>
//                         ))}
//                     </View>
//                   )}

//                   {/* Accepted Offers */}
//                   {grade.offers?.filter(o => o.traderId === traderId && o.status === 'accepted').length > 0 && (
//                     <View className="mt-3 pt-3 border-t border-gray-200">
//                       <Text className="font-medium text-green-600 mb-2">✓ Accepted & Purchased:</Text>
//                       {grade.offers
//                         .filter(o => o.traderId === traderId && o.status === 'accepted')
//                         .map((offer) => (
//                           <View key={offer._id} className="bg-green-50 p-3 rounded-lg mb-2 border border-green-200">
//                             <View className="bg-green-500 px-2 py-1 rounded self-start mb-2">
//                               <Text className="text-white text-xs font-medium">Purchased</Text>
//                             </View>
//                             <Text className="text-sm">
//                               ₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}
//                             </Text>
//                             <Text className="text-sm text-gray-600">
//                               Total: ₹{(offer.offeredPrice * offer.quantity).toFixed(2)}
//                             </Text>
//                           </View>
//                         ))}
//                     </View>
//                   )}

//                   {/* Rejected Offers */}
//                   {grade.offers?.filter(o => o.traderId === traderId && o.status === 'rejected').length > 0 && (
//                     <View className="mt-3 pt-3 border-t border-gray-200">
//                       <Text className="font-medium text-red-600 mb-2">✗ Rejected by Farmer:</Text>
//                       {grade.offers
//                         .filter(o => o.traderId === traderId && o.status === 'rejected')
//                         .map((offer) => (
//                           <View key={offer._id} className="bg-red-50 p-3 rounded-lg mb-2 border border-red-200 flex-row justify-between items-center">
//                             <View>
//                               <Text className="text-sm">
//                                 ₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}
//                               </Text>
//                               <View className="bg-red-500 px-2 py-1 rounded self-start mt-1">
//                                 <Text className="text-white text-xs font-medium">Rejected</Text>
//                               </View>
//                               <Text className="text-xs text-gray-500 mt-1">You can make a new offer</Text>
//                             </View>
//                             <TouchableOpacity
//                               onPress={() => handleMakeOffer(product)}
//                               disabled={grade.totalQty === 0}
//                               className="bg-green-500 px-3 py-2 rounded-lg"
//                             >
//                               <Text className="text-white font-medium text-xs">New Offer</Text>
//                             </TouchableOpacity>
//                           </View>
//                         ))}
//                     </View>
//                   )}

//                   {/* Purchase History */}
//                   {grade.purchaseHistory?.length > 0 && (
//                     <View className="mt-3 pt-3 border-t border-gray-200">
//                       <Text className="font-medium text-blue-600 mb-2">📦 Purchase History:</Text>
//                       {grade.purchaseHistory.map((purchase, idx) => (
//                         <View key={idx} className="bg-blue-50 p-3 rounded-lg mb-2 border border-blue-200">
//                           <View className="flex-row items-center mb-1">
//                             <View className="bg-blue-500 px-2 py-1 rounded mr-2">
//                               <Text className="text-white text-xs font-medium">
//                                 {purchase.purchaseType === 'direct' ? 'Direct Buy' : 'Offer Accepted'}
//                               </Text>
//                             </View>
//                             <Text className="font-medium text-sm">{purchase.traderName || 'Unknown'}</Text>
//                           </View>
//                           <Text className="text-sm">
//                             ₹{purchase.pricePerUnit} × {purchase.quantity} {product.unitMeasurement} = 
//                             <Text className="font-medium"> ₹{purchase.totalAmount.toFixed(2)}</Text>
//                           </Text>
//                           <Text className="text-xs text-gray-500 mt-1">
//                             Purchased: {new Date(purchase.purchaseDate).toLocaleString('en-IN')}
//                           </Text>
//                           <View className={`px-2 py-1 rounded self-start mt-1 ${purchase.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}>
//                             <Text className="text-white text-xs font-medium">
//                               Payment: {purchase.paymentStatus}
//                             </Text>
//                           </View>
//                         </View>
//                       ))}
//                     </View>
//                   )}
//                 </View>
//               ))}
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// });

// const AllProducts = ({ navigation }) => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [traderId, setTraderId] = useState(null);
//   const [traderName, setTraderName] = useState('');
  
//   // Search & Filter States
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  
//   // Offer Modal States
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [gradeOffers, setGradeOffers] = useState({});
//   const [showOfferModal, setShowOfferModal] = useState(false);
  
//   // Quantity Modal States
//   const [showQuantityModal, setShowQuantityModal] = useState(false);
//   const [quantityInput, setQuantityInput] = useState('');
//   const [currentGrade, setCurrentGrade] = useState(null);
//   const [currentProduct, setCurrentProduct] = useState(null);
  
//   // New Counter Offer Modal States
//   const [showNewCounterModal, setShowNewCounterModal] = useState(false);
//   const [newCounterPrice, setNewCounterPrice] = useState('');
//   const [newCounterQuantity, setNewCounterQuantity] = useState('');
//   const [currentOffer, setCurrentOffer] = useState(null);

//   // Grade Details Modal State
//   const [showGradeDetailsModal, setShowGradeDetailsModal] = useState(false);
//   const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);

//   // Memoized categories and subcategories
//   const categories = useMemo(() => 
//     [...new Set(products.map(p => p.categoryId?.categoryName).filter(Boolean))],
//     [products]
//   );

//   const subCategories = useMemo(() => 
//     [...new Set(products.map(p => p.subCategoryId?.subCategoryName).filter(Boolean))],
//     [products]
//   );

//   // Load trader info once on mount
//   useEffect(() => {
//     const loadTraderInfo = async () => {
//       try {
//         const [id, name] = await Promise.all([
//           AsyncStorage.getItem('traderId'),
//           AsyncStorage.getItem('traderName')
//         ]);
//         setTraderId(id);
//         setTraderName(name || 'Unknown Trader');
//       } catch (err) {
//         console.error('Error loading trader info:', err);
//       }
//     };
//     loadTraderInfo();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Optimized filter with useMemo
//   useEffect(() => {
//     const filtered = products.filter(p => {
//       const matchesSearch = !searchQuery.trim() || 
//         p.cropBriefDetails?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.productId?.toLowerCase().includes(searchQuery.toLowerCase());
      
//       const matchesCategory = selectedCategory === 'all' || 
//         p.categoryId?.categoryName === selectedCategory;
      
//       const matchesSubCategory = selectedSubCategory === 'all' || 
//         p.subCategoryId?.subCategoryName === selectedSubCategory;
      
//       return matchesSearch && matchesCategory && matchesSubCategory;
//     });
    
//     setFilteredProducts(filtered);
//   }, [products, searchQuery, selectedCategory, selectedSubCategory]);

//   const fetchProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const id = traderId || await AsyncStorage.getItem('traderId');
//       const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${id}`);
//       const data = await res.json();
      
//       setProducts(data.data || []);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load products');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [traderId]);

//   const getImageUrl = useCallback((path) => {
//     if (!path) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
//     if (path.startsWith('http')) return path;
//     return `https://kisan.etpl.ai/${path}`;
//   }, []);

//   const handleViewAllGrades = useCallback((product) => {
//     setSelectedProductForDetails(product);
//     setShowGradeDetailsModal(true);
//   }, []);

//   const handleAcceptOffer = useCallback(async (product, grade) => {
//     if (!traderId) {
//       Alert.alert('Error', 'Please login as a trader first');
//       return;
//     }

//     setCurrentProduct(product);
//     setCurrentGrade(grade);
//     setQuantityInput(grade.quantityType === 'bulk' ? grade.totalQty.toString() : '');
//     setShowQuantityModal(true);
//   }, [traderId]);

//   const confirmDirectPurchase = useCallback(async () => {
//     const numQuantity = Number(quantityInput);
//     const maxQty = currentGrade.totalQty;

//     if (isNaN(numQuantity) || numQuantity <= 0) {
//       Alert.alert('Error', 'Please enter a valid quantity');
//       return;
//     }

//     if (numQuantity > maxQty) {
//       Alert.alert('Error', `Maximum available quantity is ${maxQty}`);
//       return;
//     }

//     if (currentGrade.quantityType === 'bulk' && numQuantity !== maxQty) {
//       Alert.alert('Error', 'Bulk purchase requires buying the full quantity');
//       return;
//     }

//     const totalAmount = currentGrade.pricePerUnit * numQuantity;

//     Alert.alert(
//       'Confirm Direct Purchase',
//       `Product: ${currentProduct.cropBriefDetails}\nGrade: ${currentGrade.grade}\nPrice: ₹${currentGrade.pricePerUnit}/${currentProduct.unitMeasurement}\nQuantity: ${numQuantity} ${currentProduct.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\nProceed with payment?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Confirm',
//           onPress: async () => {
//             try {
//               const response = await fetch('https://kisan.etpl.ai/product/accept-listed-price', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   productId: currentProduct._id,
//                   gradeId: currentGrade._id,
//                   traderId,
//                   traderName,
//                   quantity: numQuantity
//                 })
//               });

//               const data = await response.json();

//               if (data.success) {
//                 Alert.alert(
//                   '✅ Purchase Successful!',
//                   `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${currentProduct.unitMeasurement}\n\nProceeding to payment...`
//                 );
//                 setShowQuantityModal(false);
//                 setQuantityInput('');
//                 fetchProducts();
//               } else {
//                 Alert.alert('Error', data.message);
//               }
//             } catch (error) {
//               Alert.alert('Error', 'Failed to process purchase. Please try again.');
//             }
//           }
//         }
//       ]
//     );
//   }, [quantityInput, currentGrade, currentProduct, traderId, traderName, fetchProducts]);

//   const handleMakeOffer = useCallback((product) => {
//     const initialOffers = {};
//     product.gradePrices
//       .filter(g => g.status !== 'sold' && g.priceType === 'negotiable')
//       .forEach(grade => {
//         initialOffers[grade._id] = {
//           price: grade.pricePerUnit.toString(),
//           quantity: grade.quantityType === 'bulk' ? grade.totalQty.toString() : ''
//         };
//       });

//     setSelectedProduct(product);
//     setGradeOffers(initialOffers);
//     setShowOfferModal(true);
//   }, []);

//   const submitOffer = useCallback(async () => {
//     const hasValidOffer = Object.values(gradeOffers).some(
//       offer => offer.price && offer.quantity
//     );

//     if (!hasValidOffer) {
//       Alert.alert('Error', 'Please enter price and quantity for at least one grade');
//       return;
//     }

//     const offers = [];
//     for (const [gradeId, offer] of Object.entries(gradeOffers)) {
//       if (offer.price && offer.quantity) {
//         const grade = selectedProduct.gradePrices.find(g => g._id === gradeId);
        
//         const numPrice = Number(offer.price);
//         const numQuantity = Number(offer.quantity);

//         if (numQuantity > grade.totalQty) {
//           Alert.alert('Error', `${grade.grade}: Maximum available is ${grade.totalQty}`);
//           return;
//         }

//         if (grade.quantityType === 'bulk' && numQuantity !== grade.totalQty) {
//           Alert.alert('Error', `${grade.grade}: Bulk purchase requires full quantity`);
//           return;
//         }

//         offers.push({
//           gradeId,
//           gradeName: grade.grade,
//           offeredPrice: numPrice,
//           quantity: numQuantity,
//           listedPrice: grade.pricePerUnit
//         });
//       }
//     }

//     const totalAmount = offers.reduce((sum, o) => sum + (o.offeredPrice * o.quantity), 0);
//     const confirmMsg = 
//       `Confirm Your Bid:\n\n` +
//       offers.map(o => 
//         `${o.gradeName}: ₹${o.offeredPrice} × ${o.quantity} = ₹${(o.offeredPrice * o.quantity).toFixed(2)}`
//       ).join('\n') +
//       `\n\nTotal Bid Amount: ₹${totalAmount.toFixed(2)}\n\nSubmit?`;

//     Alert.alert('Confirm Bid', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Submit',
//         onPress: async () => {
//           try {
//             if (offers.length === 1) {
//               const offer = offers[0];
//               const response = await fetch('https://kisan.etpl.ai/product/make-offer', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   productId: selectedProduct._id,
//                   gradeId: offer.gradeId,
//                   traderId,
//                   traderName,
//                   offeredPrice: offer.offeredPrice,
//                   quantity: offer.quantity
//                 })
//               });

//               const data = await response.json();
              
//               if (data.success) {
//                 Alert.alert('Success', '✅ Offer submitted successfully!\n\nThe farmer will review your bid.');
//                 setShowOfferModal(false);
//                 fetchProducts();
//               } else {
//                 Alert.alert('Error', data.message);
//               }
//             } else {
//               const response = await fetch('https://kisan.etpl.ai/product/make-offer-batch', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   productId: selectedProduct._id,
//                   traderId,
//                   traderName,
//                   offers: offers.map(o => ({
//                     gradeId: o.gradeId,
//                     offeredPrice: o.offeredPrice,
//                     quantity: o.quantity
//                   }))
//                 })
//               });

//               const data = await response.json();
              
//               if (data.success) {
//                 Alert.alert('Success', '✅ All offers submitted successfully!\n\nThe farmer will review your bid.');
//                 setShowOfferModal(false);
//                 fetchProducts();
//               } else {
//                 Alert.alert('Error', 'Some offers failed. Please try again.');
//               }
//             }
//           } catch (error) {
//             Alert.alert('Error', 'Failed to submit offers. Please try again.');
//           }
//         }
//       }
//     ]);
//   }, [gradeOffers, selectedProduct, traderId, traderName, fetchProducts]);

//   const handleAcceptCounterOffer = useCallback(async (product, grade, offer) => {
//     const confirmMsg = 
//       `Accept Farmer's Counter Offer?\n\n` +
//       `Your original offer: ₹${offer.offeredPrice} × ${offer.quantity}\n` +
//       `Farmer's counter: ₹${offer.counterPrice} × ${offer.counterQuantity}\n\n` +
//       `Total Amount: ₹${(offer.counterPrice * offer.counterQuantity).toFixed(2)}\n\nProceed?`;
    
//     Alert.alert('Accept Counter Offer', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Accept',
//         onPress: async () => {
//           try {
//             const response = await fetch('https://kisan.etpl.ai/product/accept-counter-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 productId: product._id,
//                 gradeId: grade._id,
//                 offerId: offer._id,
//                 traderId,
//                 traderName
//               })
//             });

//             const data = await response.json();
            
//             if (data.success) {
//               Alert.alert(
//                 '✅ Counter Offer Accepted!',
//                 `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${product.unitMeasurement}\n\nProceeding to payment...`
//               );
//               fetchProducts();
//             } else {
//               Alert.alert('Error', data.message);
//             }
//           } catch (error) {
//             Alert.alert('Error', 'Failed to accept counter offer. Please try again.');
//           }
//         }
//       }
//     ]);
//   }, [traderId, traderName, fetchProducts]);

//   const handleRejectCounterOffer = useCallback(async (productId, gradeId, offerId) => {
//     Alert.alert(
//       'Reject Counter Offer',
//       'Reject this counter offer? You can make a new offer after rejecting.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Reject',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const response = await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ productId, gradeId, offerId })
//               });

//               const data = await response.json();
//               if (data.success) {
//                 Alert.alert('Success', 'Counter offer rejected. You can now make a new offer.');
//                 fetchProducts();
//               }
//             } catch (error) {
//               Alert.alert('Error', 'Error rejecting counter offer');
//             }
//           }
//         }
//       ]
//     );
//   }, [fetchProducts]);

//   const handleMakeNewCounterOffer = useCallback(async (product, grade, existingOffer) => {
//     if (!traderId) {
//       Alert.alert('Error', 'Please login as a trader first');
//       return;
//     }

//     setCurrentProduct(product);
//     setCurrentGrade(grade);
//     setCurrentOffer(existingOffer);
//     setNewCounterPrice(existingOffer.counterPrice.toString());
//     setNewCounterQuantity(existingOffer.counterQuantity.toString());
//     setShowNewCounterModal(true);
//   }, [traderId]);

//   const submitNewCounterOffer = useCallback(async () => {
//     const numPrice = Number(newCounterPrice);
//     const numQuantity = Number(newCounterQuantity);

//     if (isNaN(numPrice) || numPrice <= 0 || isNaN(numQuantity) || numQuantity <= 0) {
//       Alert.alert('Error', 'Please enter valid price and quantity');
//       return;
//     }

//     if (numQuantity > currentGrade.totalQty) {
//       Alert.alert('Error', `Maximum available: ${currentGrade.totalQty} ${currentProduct.unitMeasurement}`);
//       return;
//     }

//     if (currentGrade.quantityType === 'bulk' && numQuantity !== currentGrade.totalQty) {
//       Alert.alert('Error', 'Bulk purchase requires full quantity');
//       return;
//     }

//     const totalAmount = numPrice * numQuantity;
//     const confirmMsg = 
//       `Submit New Counter Offer?\n\n` +
//       `Farmer's counter: ₹${currentOffer.counterPrice} × ${currentOffer.counterQuantity}\n` +
//       `Your new offer: ₹${numPrice} × ${numQuantity}\n\n` +
//       `Total: ₹${totalAmount.toFixed(2)}\n\nSubmit?`;

//     Alert.alert('Confirm New Offer', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Submit',
//         onPress: async () => {
//           try {
//             await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ 
//                 productId: currentProduct._id, 
//                 gradeId: currentGrade._id, 
//                 offerId: currentOffer._id 
//               })
//             });

//             const response = await fetch('https://kisan.etpl.ai/product/make-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 productId: currentProduct._id,
//                 gradeId: currentGrade._id,
//                 traderId,
//                 traderName,
//                 offeredPrice: numPrice,
//                 quantity: numQuantity
//               })
//             });

//             const data = await response.json();
            
//             if (data.success) {
//               Alert.alert('Success', '✅ New offer submitted successfully!\n\nThe farmer will review your new bid.');
//               setShowNewCounterModal(false);
//               setNewCounterPrice('');
//               setNewCounterQuantity('');
//               fetchProducts();
//             } else {
//               Alert.alert('Error', data.message);
//             }
//           } catch (error) {
//             Alert.alert('Error', 'Failed to submit new offer. Please try again.');
//           }
//         }
//       }
//     ]);
//   }, [newCounterPrice, newCounterQuantity, currentGrade, currentProduct, currentOffer, traderId, traderName, fetchProducts]);

//   const renderProductItem = useCallback(({ item }) => (
//     <ProductCard
//       product={item}
//       getImageUrl={getImageUrl}
//       onViewAllGrades={handleViewAllGrades}
//       traderId={traderId}
//     />
//   ), [getImageUrl, handleViewAllGrades, traderId]);

//   const keyExtractor = useCallback((item) => item._id, []);

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#22c55e" />
//         <Text className="mt-4 text-gray-600">Loading products...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
//         <View className="flex-row justify-between items-center mb-4">
//           <View className="flex-row items-center">
//             <Ionicons name="arrow-back" size={24} color="#000000ff" />
//             <Text className="text-2xl font-medium ml-2">Available Products</Text>
//           </View>
          
//           <TouchableOpacity
//             onPress={() => navigation.navigate('MyPurchases')}
//             className="bg-green-500 px-3 py-2 rounded-lg flex-row items-center"
//           >
//             <Ionicons name="bag-handle-outline" size={16} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Search Bar and Filter */}
//         <View className="flex-row items-center gap-2 mb-2">
//   <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 border border-gray-200">
//     <Ionicons name="search-outline" size={20} color="#6b7280" />
//     <TextInput
//       className="flex-1 ml-2 text-base"
//       placeholder="Search products..."
//       value={searchQuery}
//       onChangeText={setSearchQuery}
//     />
//     {searchQuery.length > 0 && (
//       <TouchableOpacity onPress={() => setSearchQuery('')}>
//         <Ionicons name="close-circle" size={20} color="#6b7280" />
//       </TouchableOpacity>
//     )}
//   </View>
  
//   <TouchableOpacity
//     onPress={() => setShowFilters(true)}
//     className="px-4 py-3 rounded-lg flex-row items-center border border-gray-200"
//   >
//     <Ionicons name="filter-outline" size={18} color="#838383ff" />
//   </TouchableOpacity>
// </View>

//       </View>

//       {/* Products List */}
//       {error && (
//         <View className="bg-red-100 p-4 m-4 rounded-lg">
//           <Text className="text-red-700">{error}</Text>
//         </View>
//       )}

//       <FlatList
//         data={filteredProducts}
//         renderItem={renderProductItem}
//         keyExtractor={keyExtractor}
//         contentContainerStyle={{ padding: 16 }}
//         refreshing={refreshing}
//         onRefresh={() => {
//           setRefreshing(true);
//           fetchProducts();
//         }}
//         ListEmptyComponent={
//           <View className="flex-1 justify-center items-center py-20">
//             <Icon name="shop" size={60} color="#d1d5db" />
//             <Text className="text-xl text-gray-500 mt-4 font-medium">No products found</Text>
//             <Text className="text-gray-400 mt-2">Try adjusting your filters</Text>
//           </View>
//         }
//         initialNumToRender={5}
//         maxToRenderPerBatch={10}
//         windowSize={10}
//         removeClippedSubviews={true}
//         updateCellsBatchingPeriod={50}
//       />

//       {/* Filter Bottom Sheet Modal */}
//       <Modal
//         visible={showFilters}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowFilters(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="bg-white rounded-t-3xl" style={{ maxHeight: '70%' }}>
//             <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
//               <Text className="text-xl font-medium">Filters</Text>
//               <TouchableOpacity onPress={() => setShowFilters(false)}>
//                 <Icon name="x" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView className="p-4">
//               <Text className="font-medium text-gray-700 mb-3 text-base">Category</Text>
//               <View className="flex-row flex-wrap gap-2 mb-6">
//                 <TouchableOpacity
//                   onPress={() => setSelectedCategory('all')}
//                   className={`px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-green-500' : 'bg-gray-200'}`}
//                 >
//                   <Text className={selectedCategory === 'all' ? 'text-white font-medium' : 'text-gray-700'}>
//                     All
//                   </Text>
//                 </TouchableOpacity>
//                 {categories.map((item) => (
//                   <TouchableOpacity
//                     key={item}
//                     onPress={() => setSelectedCategory(item)}
//                     className={`px-4 py-2 rounded-full ${selectedCategory === item ? 'bg-green-500' : 'bg-gray-200'}`}
//                   >
//                     <Text className={selectedCategory === item ? 'text-white font-medium' : 'text-gray-700'}>
//                       {item}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <Text className="font-medium text-gray-700 mb-3 text-base">Sub-Category</Text>
//               <View className="flex-row flex-wrap gap-2 mb-6">
//                 <TouchableOpacity
//                   onPress={() => setSelectedSubCategory('all')}
//                   className={`px-4 py-2 rounded-full ${selectedSubCategory === 'all' ? 'bg-green-500' : 'bg-gray-200'}`}
//                 >
//                   <Text className={selectedSubCategory === 'all' ? 'text-white font-medium' : 'text-gray-700'}>
//                     All
//                   </Text>
//                 </TouchableOpacity>
//                 {subCategories.map((item) => (
//                   <TouchableOpacity
//                     key={item}
//                     onPress={() => setSelectedSubCategory(item)}
//                     className={`px-4 py-2 rounded-full ${selectedSubCategory === item ? 'bg-green-500' : 'bg-gray-200'}`}
//                   >
//                     <Text className={selectedSubCategory === item ? 'text-white font-medium' : 'text-gray-700'}>
//                       {item}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <View className="flex-row gap-3 mb-4">
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedCategory('all');
//                     setSelectedSubCategory('all');
//                   }}
//                   className="flex-1 bg-gray-300 py-3 rounded-lg"
//                 >
//                   <Text className="text-gray-700 font-medium text-center">Clear All</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => setShowFilters(false)}
//                   className="flex-1 bg-green-500 py-3 rounded-lg"
//                 >
//                   <Text className="text-white font-medium text-center">Apply Filters</Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Grade Details Modal */}
//       <GradeDetailsModal
//         visible={showGradeDetailsModal}
//         product={selectedProductForDetails}
//         onClose={() => {
//           setShowGradeDetailsModal(false);
//           setSelectedProductForDetails(null);
//         }}
//         getImageUrl={getImageUrl}
//         handleAcceptOffer={handleAcceptOffer}
//         handleMakeOffer={handleMakeOffer}
//         handleAcceptCounterOffer={handleAcceptCounterOffer}
//         handleRejectCounterOffer={handleRejectCounterOffer}
//         handleMakeNewCounterOffer={handleMakeNewCounterOffer}
//         traderId={traderId}
//       />

//       {/* Offer Modal */}
//       <Modal
//         visible={showOfferModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowOfferModal(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="bg-white rounded-t-3xl" style={{ maxHeight: '90%' }}>
//             <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
//               <Text className="text-xl font-medium">Bid by Trader - All Grades</Text>
//               <TouchableOpacity onPress={() => setShowOfferModal(false)}>
//                 <Icon name="x" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={selectedProduct?.gradePrices.filter(g => g.status !== 'sold' && g.priceType === 'negotiable') || []}
//               keyExtractor={(item) => item._id}
//               ListHeaderComponent={
//                 <View className="p-4">
//                   <View className="bg-blue-50 p-3 rounded-lg mb-4">
//                     <Text className="text-blue-700 font-medium">💡 Tip: Enter your offer for each grade. Leave blank if you don't want to bid on that grade.</Text>
//                   </View>
//                   {selectedProduct && (
//                     <Text className="text-lg font-medium mb-4">{selectedProduct.cropBriefDetails}</Text>
//                   )}
//                 </View>
//               }
//               renderItem={({ item: grade }) => {
//                 const offer = gradeOffers[grade._id] || { price: '', quantity: '' };
//                 const amount = offer.price && offer.quantity 
//                   ? (Number(offer.price) * Number(offer.quantity)).toFixed(2)
//                   : '0.00';

//                 return (
//                   <View className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 mx-4">
//                     <View className="flex-row justify-between items-center mb-2">
//                       <Text className="font-medium text-base">{grade.grade}</Text>
//                       {grade.quantityType === 'bulk' && (
//                         <View className="bg-blue-500 px-2 py-1 rounded">
//                           <Text className="text-white text-xs font-medium">Bulk</Text>
//                         </View>
//                       )}
//                     </View>

//                     <Text className="text-gray-600 mb-2">Listed: ₹{grade.pricePerUnit}/{selectedProduct?.unitMeasurement}</Text>
//                     <Text className="text-gray-600 mb-3">Available: {grade.totalQty} {selectedProduct?.unitMeasurement}</Text>

//                     <Text className="font-medium mb-1">Your Offer Price (₹/{selectedProduct?.unitMeasurement})</Text>
//                     <TextInput
//                       className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
//                       placeholder={`₹${grade.pricePerUnit}`}
//                       keyboardType="numeric"
//                       value={offer.price}
//                       onChangeText={(text) => setGradeOffers({
//                         ...gradeOffers,
//                         [grade._id]: { ...offer, price: text }
//                       })}
//                     />

//                     <Text className="font-medium mb-1">Quantity ({selectedProduct?.unitMeasurement})</Text>
//                     <TextInput
//                       className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
//                       placeholder={`Max: ${grade.totalQty}`}
//                       keyboardType="numeric"
//                       value={offer.quantity}
//                       onChangeText={(text) => setGradeOffers({
//                         ...gradeOffers,
//                         [grade._id]: { ...offer, quantity: text }
//                       })}
//                       editable={grade.quantityType !== 'bulk'}
//                     />

//                     <View className="bg-green-100 p-2 rounded-lg">
//                       <Text className="text-green-700 font-medium text-right">
//                         Amount: ₹{amount}
//                       </Text>
//                     </View>
//                   </View>
//                 );
//               }}
//               ListFooterComponent={
//                 selectedProduct && (
//                   <View className="px-4 pb-4">
//                     <View className="bg-green-500 p-4 rounded-lg mt-4">
//                       <Text className="text-white text-lg font-medium text-center">
//                         Total Bid Amount: ₹{Object.entries(gradeOffers).reduce((sum, [gradeId, offer]) => {
//                           if (offer.price && offer.quantity) {
//                             return sum + (Number(offer.price) * Number(offer.quantity));
//                           }
//                           return sum;
//                         }, 0).toFixed(2)}
//                       </Text>
//                     </View>

//                     <View className="flex-row gap-3 mt-6 mb-4">
//                       <TouchableOpacity
//                         onPress={() => setShowOfferModal(false)}
//                         className="flex-1 bg-gray-300 py-3 rounded-lg"
//                       >
//                         <Text className="text-gray-700 font-medium text-center">Cancel</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         onPress={submitOffer}
//                         className="flex-1 bg-green-500 py-3 rounded-lg"
//                       >
//                         <Text className="text-white font-medium text-center">Submit Bid</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )
//               }
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Quantity Input Modal */}
//       <Modal
//         visible={showQuantityModal}
//         animationType="fade"
//         transparent={true}
//         onRequestClose={() => setShowQuantityModal(false)}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50 px-6">
//           <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <Text className="text-xl font-medium mb-4">
//               {currentGrade?.quantityType === 'bulk' ? 'Bulk Purchase' : 'Enter Quantity'}
//             </Text>
            
//             {currentGrade?.quantityType === 'bulk' ? (
//               <View className="bg-yellow-50 p-3 rounded-lg mb-4">
//                 <Text className="text-yellow-800">
//                   This is a bulk purchase. You must buy the full quantity: {currentGrade.totalQty} {currentProduct?.unitMeasurement}
//                 </Text>
//               </View>
//             ) : (
//               <Text className="text-gray-600 mb-4">
//                 Maximum available: {currentGrade?.totalQty} {currentProduct?.unitMeasurement}
//               </Text>
//             )}

//             <TextInput
//               className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
//               placeholder={`Enter quantity (Max: ${currentGrade?.totalQty})`}
//               keyboardType="numeric"
//               value={quantityInput}
//               onChangeText={setQuantityInput}
//               editable={currentGrade?.quantityType !== 'bulk'}
//             />

//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowQuantityModal(false);
//                   setQuantityInput('');
//                 }}
//                 className="flex-1 bg-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-gray-700 font-medium text-center">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={confirmDirectPurchase}
//                 className="flex-1 bg-green-500 py-3 rounded-lg"
//               >
//                 <Text className="text-white font-medium text-center">Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* New Counter Offer Modal */}
//       <Modal
//         visible={showNewCounterModal}
//         animationType="fade"
//         transparent={true}
//         onRequestClose={() => setShowNewCounterModal(false)}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50 px-6">
//           <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <Text className="text-xl font-medium mb-4">Make New Counter Offer</Text>
            
//             <View className="bg-yellow-50 p-3 rounded-lg mb-4">
//               <Text className="text-sm text-gray-700 mb-1">
//                 Farmer's counter: <Text className="font-medium">₹{currentOffer?.counterPrice} × {currentOffer?.counterQuantity}</Text>
//               </Text>
//             </View>

//             <Text className="font-medium mb-2">Your New Price (₹/{currentProduct?.unitMeasurement})</Text>
//             <TextInput
//               className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
//               placeholder="Enter price"
//               keyboardType="numeric"
//               value={newCounterPrice}
//               onChangeText={setNewCounterPrice}
//             />

//             <Text className="font-medium mb-2">Quantity ({currentProduct?.unitMeasurement})</Text>
//             <TextInput
//               className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
//               placeholder={`Max: ${currentGrade?.totalQty}`}
//               keyboardType="numeric"
//               value={newCounterQuantity}
//               onChangeText={setNewCounterQuantity}
//               editable={currentGrade?.quantityType !== 'bulk'}
//             />

//             {newCounterPrice && newCounterQuantity && (
//               <View className="bg-green-100 p-3 rounded-lg mb-4">
//                 <Text className="text-green-700 font-medium text-center">
//                   Total: ₹{(Number(newCounterPrice) * Number(newCounterQuantity)).toFixed(2)}
//                 </Text>
//               </View>
//             )}

//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowNewCounterModal(false);
//                   setNewCounterPrice('');
//                   setNewCounterQuantity('');
//                 }}
//                 className="flex-1 bg-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-gray-700 font-medium text-center">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={submitNewCounterOffer}
//                 className="flex-1 bg-green-500 py-3 rounded-lg"
//               >
//                 <Text className="text-white font-medium text-center">Submit</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default memo(AllProducts);






import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
const { width } = Dimensions.get('window');

// Memoized Icon Component
const Icon = memo(({ name, size = 20, color = '#000', style = {} }) => {
  const icons = {
    'shop-window': '🏪',
    'box-seam': '📦',
    'arrow-left': '←',
    'bell': '🔔',
    'arrow-clockwise': '🔄',
    'shop': '🏬',
    'calendar-event': '📅',
    'clock': '🕐',
    'geo-alt': '📍',
    'search': '🔍',
    'filter': '🎯',
    'x': '✕',
    'chevron-down': '▼',
  };
  
  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {icons[name] || '•'}
    </Text>
  );
});

// Memoized Grade Photo Slider
const GradePhotoSlider = memo(({ photos, getImageUrl, height = 200 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400' }}
        style={{ width: '100%', height }}
        className='rounded-lg'
        resizeMode="cover"
      />
    );
  }

  const handleScroll = useCallback((event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  }, []);

  return (
    <View className="relative">
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={photos}
        keyExtractor={(item, index) => `photo-${index}`}
        renderItem={({ item }) => (
          <Image
            source={{ uri: getImageUrl(item) }}
            style={{ width, height }}
            resizeMode="cover"
          />
        )}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />

      {photos.length > 1 && (
        <>
          <View className="absolute bottom-2 left-0 right-0 flex-row justify-center gap-2">
            {photos.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === activeIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </View>
          <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">
              {activeIndex + 1}/{photos.length}
            </Text>
          </View>
        </>
      )}
    </View>
  );
});

// Memoized Product Card Component
const ProductCard = memo(({ 
  product, 
  getImageUrl, 
  onViewAllGrades,
  traderId 
}) => {
  const allPhotos = useMemo(() => 
    product.gradePrices.flatMap(grade => grade.gradePhotos || []),
    [product.gradePrices]
  );

  return (
    <View className="bg-white rounded-lg mb-4 overflow-hidden border border-gray-200 p-4">
      <View className="relative">
        <GradePhotoSlider 
          photos={allPhotos}
          getImageUrl={getImageUrl} 
          height={200}
        />
        <View className="absolute top-2 left-2 bg-green-500 px-3 py-1 rounded-full">
          <Text className="text-white font-medium text-xs">{product.farmingType}</Text>
        </View>
      </View>

      <View className="p-4">
        {/* Product Header */}
        <Text className="text-lg font-medium text-gray-900 mb-2">{product.cropBriefDetails}</Text>
        
        {/* Product Info Tags */}
        <View className="flex-row flex-wrap gap-2 mb-3">
          <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Text className="text-blue-700 font-medium text-xs">{product.productId}</Text>
          </View>
          {product.categoryId?.categoryName && (
            <View className="bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              <Text className="text-gray-700 text-xs">{product.categoryId.categoryName}</Text>
            </View>
          )}
          {product.subCategoryId?.subCategoryName && (
            <View className="bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              <Text className="text-gray-700 text-xs">{product.subCategoryId.subCategoryName}</Text>
            </View>
          )}
        </View>

        {/* Additional Product Info */}
        <View className="flex-row items-center font-medium justify-between flex-wrap border-t border-gray-200 pt-3 mb-3">
  <View className="flex-row items-center mb-3">
    <Ionicons name="cube-outline" size={14} color="#6b7280" />
    <Text className="text-gray-600 text-sm ml-2 font-medium">{product.packageMeasurement} {product.packagingType}</Text>
  </View>
  <View className="flex-row items-center mb-3">
    <Ionicons name="calendar-outline" size={14} color="#6b7280" />
    <Text className="text-gray-600 text-sm ml-2 font-medium">{new Date(product.deliveryDate).toLocaleDateString()}</Text>
  </View>
  <View className="flex-row items-center mb-3">
    <Ionicons name="time-outline" size={14} color="#6b7280" />
    <Text className="text-gray-600 text-sm ml-2 font-medium">{product.deliveryTime}</Text>
  </View>
  <View className="flex-row items-center mb-3">
    <Ionicons name="location-outline" size={14} color="#6b7280" />
    <Text className="text-gray-600 text-sm ml-2 font-medium">{product.nearestMarket}</Text>
  </View>
</View>

        {/* View All Button */}
        <TouchableOpacity
          onPress={() => onViewAllGrades(product)}
          className="bg-green-500 py-3 rounded-lg"
        >
          <Text className="text-white font-medium text-center">View All Grades & Offers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// Grade Details Modal Component
const GradeDetailsModal = memo(({ 
  visible, 
  product, 
  onClose, 
  getImageUrl,
  handleAcceptOffer,
  handleMakeOffer,
  handleAcceptCounterOffer,
  handleRejectCounterOffer,
  handleMakeNewCounterOffer,
  traderId 
}) => {
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white rounded-t-3xl">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-medium flex-1">{product.cropBriefDetails}</Text>
            <TouchableOpacity onPress={onClose} className="ml-2">
              <Icon name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            <View className="p-4">
              {/* Product Info */}
              <View className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
                <Text className="font-medium text-gray-700 mb-2">Product Details</Text>
                <Text className="text-sm text-gray-600 mb-1">Product ID: {product.productId}</Text>
                <Text className="text-sm text-gray-600 mb-1">Farming Type: {product.farmingType}</Text>
                {product.categoryId?.categoryName && (
                  <Text className="text-sm text-gray-600 mb-1">Category: {product.categoryId.categoryName}</Text>
                )}
                {product.subCategoryId?.subCategoryName && (
                  <Text className="text-sm text-gray-600">Sub-Category: {product.subCategoryId.subCategoryName}</Text>
                )}
              </View>

              {/* All Grades */}
              {product.gradePrices.map((grade) => (
                <View key={grade._id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-white">
                  {/* Grade Photos */}
                  {grade.gradePhotos && grade.gradePhotos.length > 0 && (
                    <View className="mb-3">
                      <GradePhotoSlider 
                        photos={grade.gradePhotos}
                        getImageUrl={getImageUrl}
                        height={150}
                      />
                    </View>
                  )}

                  {/* Grade Header */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <Text className="text-lg font-medium text-gray-900">{grade.grade}</Text>
                        {grade.status === 'partially_sold' && (
                          <View className="bg-yellow-500 px-2 py-1 rounded ml-2">
                            <Text className="text-white text-xs font-medium">Partially Sold</Text>
                          </View>
                        )}
                        {grade.status === 'sold' && (
                          <View className="bg-red-500 px-2 py-1 rounded ml-2">
                            <Text className="text-white text-xs font-medium">Sold Out</Text>
                          </View>
                        )}
                      </View>
                      
                      <Text className="text-green-600 font-medium text-xl mb-1">
                        ₹{grade.pricePerUnit}/{product.unitMeasurement || 'unit'}
                      </Text>
                      
                      <View className="flex-row items-center mb-1">
                        <Text className="text-gray-600 text-sm">
                          Qty: {grade.totalQty} {product.unitMeasurement || 'units'}
                        </Text>
                        {grade.quantityType === 'bulk' && (
                          <View className="bg-blue-500 px-2 py-1 rounded ml-2">
                            <Text className="text-white text-xs font-medium">Bulk Only</Text>
                          </View>
                        )}
                      </View>
                      
                      <Text className="text-gray-500 text-sm">
                        {grade.priceType === 'fixed' ? '🔒 Fixed Price' : '💬 Negotiable'}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-2 mb-3">
                    <TouchableOpacity
                      onPress={() => handleAcceptOffer(product, grade)}
                      disabled={grade.totalQty === 0}
                      className={`flex-1 py-3 rounded-lg ${grade.totalQty === 0 ? 'bg-gray-300' : 'bg-green-500'}`}
                    >
                      <Text className="text-white font-medium text-center">Add to Cart</Text>
                    </TouchableOpacity>
                    
                    {grade.priceType === 'negotiable' && (
                      <TouchableOpacity
                        onPress={() => handleMakeOffer(product)}
                        disabled={grade.totalQty === 0}
                        className={`flex-1 py-3 rounded-lg border-2 ${grade.totalQty === 0 ? 'border-gray-300' : 'border-green-500'}`}
                      >
                        <Text className={`font-medium text-center ${grade.totalQty === 0 ? 'text-gray-400' : 'text-green-600'}`}>
                          Make Offer
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Counter Offers */}
                  {grade.offers?.filter(o => o.traderId === traderId && o.status === 'countered').length > 0 && (
                    <View className="mt-3 pt-3 border-t border-gray-200">
                      <Text className="font-medium text-yellow-600 mb-2">💬 Farmer's Counter Offer:</Text>
                      {grade.offers
                        .filter(o => o.traderId === traderId && o.status === 'countered')
                        .map((offer) => (
                          <View key={offer._id} className="bg-yellow-50 p-3 rounded-lg mb-2 border border-yellow-200">
                            <Text className="text-sm text-gray-600 mb-1">
                              Your offer: <Text className="font-medium">₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}</Text>
                            </Text>
                            <Text className="text-sm text-green-600 mb-1">
                              Farmer's counter: <Text className="font-medium text-green-700">₹{offer.counterPrice} × {offer.counterQuantity} {product.unitMeasurement}</Text>
                            </Text>
                            <Text className="text-sm text-gray-500 mb-2">
                              Total: ₹{(offer.counterPrice * offer.counterQuantity).toFixed(2)}
                            </Text>
                            <Text className="text-xs text-gray-400 mb-3">
                              Counter sent: {new Date(offer.counterDate).toLocaleString('en-IN')}
                            </Text>
                            
                            <View className="flex-row gap-2">
                              <TouchableOpacity
                                onPress={() => handleAcceptCounterOffer(product, grade, offer)}
                                className="flex-1 bg-green-500 py-2 rounded-lg"
                              >
                                <Text className="text-white font-medium text-center">✓ Accept</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleMakeNewCounterOffer(product, grade, offer)}
                                className="flex-1 bg-yellow-500 py-2 rounded-lg"
                              >
                                <Text className="text-white font-medium text-center">💬 New Offer</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleRejectCounterOffer(product._id, grade._id, offer._id)}
                                className="flex-1 bg-red-500 py-2 rounded-lg"
                              >
                                <Text className="text-white font-medium text-center">✗ Reject</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                    </View>
                  )}

                  {/* Accepted Offers */}
                  {grade.offers?.filter(o => o.traderId === traderId && o.status === 'accepted').length > 0 && (
                    <View className="mt-3 pt-3 border-t border-gray-200">
                      <Text className="font-medium text-green-600 mb-2">✓ Accepted & Purchased:</Text>
                      {grade.offers
                        .filter(o => o.traderId === traderId && o.status === 'accepted')
                        .map((offer) => (
                          <View key={offer._id} className="bg-green-50 p-3 rounded-lg mb-2 border border-green-200">
                            <View className="bg-green-500 px-2 py-1 rounded self-start mb-2">
                              <Text className="text-white text-xs font-medium">Purchased</Text>
                            </View>
                            <Text className="text-sm">
                              ₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}
                            </Text>
                            <Text className="text-sm text-gray-600">
                              Total: ₹{(offer.offeredPrice * offer.quantity).toFixed(2)}
                            </Text>
                          </View>
                        ))}
                    </View>
                  )}

                  {/* Rejected Offers */}
                  {grade.offers?.filter(o => o.traderId === traderId && o.status === 'rejected').length > 0 && (
                    <View className="mt-3 pt-3 border-t border-gray-200">
                      <Text className="font-medium text-red-600 mb-2">✗ Rejected by Farmer:</Text>
                      {grade.offers
                        .filter(o => o.traderId === traderId && o.status === 'rejected')
                        .map((offer) => (
                          <View key={offer._id} className="bg-red-50 p-3 rounded-lg mb-2 border border-red-200 flex-row justify-between items-center">
                            <View>
                              <Text className="text-sm">
                                ₹{offer.offeredPrice} × {offer.quantity} {product.unitMeasurement}
                              </Text>
                              <View className="bg-red-500 px-2 py-1 rounded self-start mt-1">
                                <Text className="text-white text-xs font-medium">Rejected</Text>
                              </View>
                              <Text className="text-xs text-gray-500 mt-1">You can make a new offer</Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => handleMakeOffer(product)}
                              disabled={grade.totalQty === 0}
                              className="bg-green-500 px-3 py-2 rounded-lg"
                            >
                              <Text className="text-white font-medium text-xs">New Offer</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                    </View>
                  )}

                  {/* Purchase History */}
                  {grade.purchaseHistory?.length > 0 && (
                    <View className="mt-3 pt-3 border-t border-gray-200">
                      <Text className="font-medium text-blue-600 mb-2">📦 Purchase History:</Text>
                      {grade.purchaseHistory.map((purchase, idx) => (
                        <View key={idx} className="bg-blue-50 p-3 rounded-lg mb-2 border border-blue-200">
                          <View className="flex-row items-center mb-1">
                            <View className="bg-blue-500 px-2 py-1 rounded mr-2">
                              <Text className="text-white text-xs font-medium">
                                {purchase.purchaseType === 'direct' ? 'Direct Buy' : 'Offer Accepted'}
                              </Text>
                            </View>
                            <Text className="font-medium text-sm">{purchase.traderName || 'Unknown'}</Text>
                          </View>
                          <Text className="text-sm">
                            ₹{purchase.pricePerUnit} × {purchase.quantity} {product.unitMeasurement} = 
                            <Text className="font-medium"> ₹{purchase.totalAmount.toFixed(2)}</Text>
                          </Text>
                          <Text className="text-xs text-gray-500 mt-1">
                            Purchased: {new Date(purchase.purchaseDate).toLocaleString('en-IN')}
                          </Text>
                          <View className={`px-2 py-1 rounded self-start mt-1 ${purchase.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                            <Text className="text-white text-xs font-medium">
                              Payment: {purchase.paymentStatus}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

const AllProducts = ({ navigation }) => {
  const params = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [traderId, setTraderId] = useState(null);
  const [traderName, setTraderName] = useState('');
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  
  // Offer Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [gradeOffers, setGradeOffers] = useState({});
  const [showOfferModal, setShowOfferModal] = useState(false);
  
  // Quantity Modal States
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantityInput, setQuantityInput] = useState('');
  const [currentGrade, setCurrentGrade] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // New Counter Offer Modal States
  const [showNewCounterModal, setShowNewCounterModal] = useState(false);
  const [newCounterPrice, setNewCounterPrice] = useState('');
  const [newCounterQuantity, setNewCounterQuantity] = useState('');
  const [currentOffer, setCurrentOffer] = useState(null);

  // Grade Details Modal State
  const [showGradeDetailsModal, setShowGradeDetailsModal] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);

  // Memoized categories and subcategories
  const categories = useMemo(() => 
    [...new Set(products.map(p => p.categoryId?.categoryName).filter(Boolean))],
    [products]
  );

  const subCategories = useMemo(() => 
    [...new Set(products.map(p => p.subCategoryId?.subCategoryName).filter(Boolean))],
    [products]
  );

  // Load trader info once on mount
  useEffect(() => {
    const loadTraderInfo = async () => {
      try {
        const [id, name] = await Promise.all([
          AsyncStorage.getItem('traderId'),
          AsyncStorage.getItem('traderName')
        ]);
        setTraderId(id);
        setTraderName(name || 'Unknown Trader');
      } catch (err) {
        console.error('Error loading trader info:', err);
      }
    };
    loadTraderInfo();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Optimized filter with useMemo
  useEffect(() => {
    const filtered = products.filter(p => {
      const matchesSearch = !searchQuery.trim() || 
        p.cropBriefDetails?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.productId?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        p.categoryId?.categoryName === selectedCategory;
      
      const matchesSubCategory = selectedSubCategory === 'all' || 
        p.subCategoryId?.subCategoryName === selectedSubCategory;
      
      return matchesSearch && matchesCategory && matchesSubCategory;
    });
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedSubCategory]);
useEffect(() => {
  if (params.selectedCategory) {
    const category = params.selectedCategory as string;
    setSelectedCategory(category);
    // Remove the setCategories part - categories is computed from products
  }
}, [params.selectedCategory]);
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const id = traderId || await AsyncStorage.getItem('traderId');
      const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${id}`);
      const data = await res.json();
      
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [traderId]);

  const getImageUrl = useCallback((path) => {
    if (!path) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
    if (path.startsWith('http')) return path;
    return `https://kisan.etpl.ai/${path}`;
  }, []);

  const handleViewAllGrades = useCallback((product) => {
    setSelectedProductForDetails(product);
    setShowGradeDetailsModal(true);
  }, []);

  const handleAcceptOffer = useCallback(async (product, grade) => {
    if (!traderId) {
      Alert.alert('Error', 'Please login as a trader first');
      return;
    }

    setCurrentProduct(product);
    setCurrentGrade(grade);
    setQuantityInput(grade.quantityType === 'bulk' ? grade.totalQty.toString() : '');
    setShowQuantityModal(true);
  }, [traderId]);

  const confirmDirectPurchase = useCallback(async () => {
    const numQuantity = Number(quantityInput);
    const maxQty = currentGrade.totalQty;

    if (isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (numQuantity > maxQty) {
      Alert.alert('Error', `Maximum available quantity is ${maxQty}`);
      return;
    }

    if (currentGrade.quantityType === 'bulk' && numQuantity !== maxQty) {
      Alert.alert('Error', 'Bulk purchase requires buying the full quantity');
      return;
    }

    const totalAmount = currentGrade.pricePerUnit * numQuantity;

    Alert.alert(
      'Confirm Direct Purchase',
      `Product: ${currentProduct.cropBriefDetails}\nGrade: ${currentGrade.grade}\nPrice: ₹${currentGrade.pricePerUnit}/${currentProduct.unitMeasurement}\nQuantity: ${numQuantity} ${currentProduct.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\nProceed with payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const response = await fetch('https://kisan.etpl.ai/product/accept-listed-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: currentProduct._id,
                  gradeId: currentGrade._id,
                  traderId,
                  traderName,
                  quantity: numQuantity
                })
              });

              const data = await response.json();

              if (data.success) {
                Alert.alert(
                  '✅ Purchase Successful!',
                  `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${currentProduct.unitMeasurement}\n\nProceeding to payment...`
                );
                setShowQuantityModal(false);
                setQuantityInput('');
                fetchProducts();
              } else {
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to process purchase. Please try again.');
            }
          }
        }
      ]
    );
  }, [quantityInput, currentGrade, currentProduct, traderId, traderName, fetchProducts]);

  const handleMakeOffer = useCallback((product) => {
    const initialOffers = {};
    product.gradePrices
      .filter(g => g.status !== 'sold' && g.priceType === 'negotiable')
      .forEach(grade => {
        initialOffers[grade._id] = {
          price: grade.pricePerUnit.toString(),
          quantity: grade.quantityType === 'bulk' ? grade.totalQty.toString() : ''
        };
      });

    setSelectedProduct(product);
    setGradeOffers(initialOffers);
    setShowOfferModal(true);
  }, []);

  const submitOffer = useCallback(async () => {
    const hasValidOffer = Object.values(gradeOffers).some(
      offer => offer.price && offer.quantity
    );

    if (!hasValidOffer) {
      Alert.alert('Error', 'Please enter price and quantity for at least one grade');
      return;
    }

    const offers = [];
    for (const [gradeId, offer] of Object.entries(gradeOffers)) {
      if (offer.price && offer.quantity) {
        const grade = selectedProduct.gradePrices.find(g => g._id === gradeId);
        
        const numPrice = Number(offer.price);
        const numQuantity = Number(offer.quantity);

        if (numQuantity > grade.totalQty) {
          Alert.alert('Error', `${grade.grade}: Maximum available is ${grade.totalQty}`);
          return;
        }

        if (grade.quantityType === 'bulk' && numQuantity !== grade.totalQty) {
          Alert.alert('Error', `${grade.grade}: Bulk purchase requires full quantity`);
          return;
        }

        offers.push({
          gradeId,
          gradeName: grade.grade,
          offeredPrice: numPrice,
          quantity: numQuantity,
          listedPrice: grade.pricePerUnit
        });
      }
    }

    const totalAmount = offers.reduce((sum, o) => sum + (o.offeredPrice * o.quantity), 0);
    const confirmMsg = 
      `Confirm Your Bid:\n\n` +
      offers.map(o => 
        `${o.gradeName}: ₹${o.offeredPrice} × ${o.quantity} = ₹${(o.offeredPrice * o.quantity).toFixed(2)}`
      ).join('\n') +
      `\n\nTotal Bid Amount: ₹${totalAmount.toFixed(2)}\n\nSubmit?`;

    Alert.alert('Confirm Bid', confirmMsg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: async () => {
          try {
            if (offers.length === 1) {
              const offer = offers[0];
              const response = await fetch('https://kisan.etpl.ai/product/make-offer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: selectedProduct._id,
                  gradeId: offer.gradeId,
                  traderId,
                  traderName,
                  offeredPrice: offer.offeredPrice,
                  quantity: offer.quantity
                })
              });

              const data = await response.json();
              
              if (data.success) {
                Alert.alert('Success', '✅ Offer submitted successfully!\n\nThe farmer will review your bid.');
                setShowOfferModal(false);
                fetchProducts();
              } else {
                Alert.alert('Error', data.message);
              }
            } else {
              const response = await fetch('https://kisan.etpl.ai/product/make-offer-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: selectedProduct._id,
                  traderId,
                  traderName,
                  offers: offers.map(o => ({
                    gradeId: o.gradeId,
                    offeredPrice: o.offeredPrice,
                    quantity: o.quantity
                  }))
                })
              });

              const data = await response.json();
              
              if (data.success) {
                Alert.alert('Success', '✅ All offers submitted successfully!\n\nThe farmer will review your bid.');
                setShowOfferModal(false);
                fetchProducts();
              } else {
                Alert.alert('Error', 'Some offers failed. Please try again.');
              }
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to submit offers. Please try again.');
          }
        }
      }
    ]);
  }, [gradeOffers, selectedProduct, traderId, traderName, fetchProducts]);

  const handleAcceptCounterOffer = useCallback(async (product, grade, offer) => {
    const confirmMsg = 
      `Accept Farmer's Counter Offer?\n\n` +
      `Your original offer: ₹${offer.offeredPrice} × ${offer.quantity}\n` +
      `Farmer's counter: ₹${offer.counterPrice} × ${offer.counterQuantity}\n\n` +
      `Total Amount: ₹${(offer.counterPrice * offer.counterQuantity).toFixed(2)}\n\nProceed?`;
    
    Alert.alert('Accept Counter Offer', confirmMsg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept',
        onPress: async () => {
          try {
            const response = await fetch('https://kisan.etpl.ai/product/accept-counter-offer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: product._id,
                gradeId: grade._id,
                offerId: offer._id,
                traderId,
                traderName
              })
            });

            const data = await response.json();
            
            if (data.success) {
              Alert.alert(
                '✅ Counter Offer Accepted!',
                `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${product.unitMeasurement}\n\nProceeding to payment...`
              );
              fetchProducts();
            } else {
              Alert.alert('Error', data.message);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to accept counter offer. Please try again.');
          }
        }
      }
    ]);
  }, [traderId, traderName, fetchProducts]);

  const handleRejectCounterOffer = useCallback(async (productId, gradeId, offerId) => {
    Alert.alert(
      'Reject Counter Offer',
      'Reject this counter offer? You can make a new offer after rejecting.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, gradeId, offerId })
              });

              const data = await response.json();
              if (data.success) {
                Alert.alert('Success', 'Counter offer rejected. You can now make a new offer.');
                fetchProducts();
              }
            } catch (error) {
              Alert.alert('Error', 'Error rejecting counter offer');
            }
          }
        }
      ]
    );
  }, [fetchProducts]);

  const handleMakeNewCounterOffer = useCallback(async (product, grade, existingOffer) => {
    if (!traderId) {
      Alert.alert('Error', 'Please login as a trader first');
      return;
    }

    setCurrentProduct(product);
    setCurrentGrade(grade);
    setCurrentOffer(existingOffer);
    setNewCounterPrice(existingOffer.counterPrice.toString());
    setNewCounterQuantity(existingOffer.counterQuantity.toString());
    setShowNewCounterModal(true);
  }, [traderId]);

  const submitNewCounterOffer = useCallback(async () => {
    const numPrice = Number(newCounterPrice);
    const numQuantity = Number(newCounterQuantity);

    if (isNaN(numPrice) || numPrice <= 0 || isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert('Error', 'Please enter valid price and quantity');
      return;
    }

    if (numQuantity > currentGrade.totalQty) {
      Alert.alert('Error', `Maximum available: ${currentGrade.totalQty} ${currentProduct.unitMeasurement}`);
      return;
    }

    if (currentGrade.quantityType === 'bulk' && numQuantity !== currentGrade.totalQty) {
      Alert.alert('Error', 'Bulk purchase requires full quantity');
      return;
    }

    const totalAmount = numPrice * numQuantity;
    const confirmMsg = 
      `Submit New Counter Offer?\n\n` +
      `Farmer's counter: ₹${currentOffer.counterPrice} × ${currentOffer.counterQuantity}\n` +
      `Your new offer: ₹${numPrice} × ${numQuantity}\n\n` +
      `Total: ₹${totalAmount.toFixed(2)}\n\nSubmit?`;

    Alert.alert('Confirm New Offer', confirmMsg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: async () => {
          try {
            await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                productId: currentProduct._id, 
                gradeId: currentGrade._id, 
                offerId: currentOffer._id 
              })
            });

            const response = await fetch('https://kisan.etpl.ai/product/make-offer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: currentProduct._id,
                gradeId: currentGrade._id,
                traderId,
                traderName,
                offeredPrice: numPrice,
                quantity: numQuantity
              })
            });

            const data = await response.json();
            
            if (data.success) {
              Alert.alert('Success', '✅ New offer submitted successfully!\n\nThe farmer will review your new bid.');
              setShowNewCounterModal(false);
              setNewCounterPrice('');
              setNewCounterQuantity('');
              fetchProducts();
            } else {
              Alert.alert('Error', data.message);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to submit new offer. Please try again.');
          }
        }
      }
    ]);
  }, [newCounterPrice, newCounterQuantity, currentGrade, currentProduct, currentOffer, traderId, traderName, fetchProducts]);

  const renderProductItem = useCallback(({ item }) => (
    <ProductCard
      product={item}
      getImageUrl={getImageUrl}
      onViewAllGrades={handleViewAllGrades}
      traderId={traderId}
    />
  ), [getImageUrl, handleViewAllGrades, traderId]);

  const keyExtractor = useCallback((item) => item._id, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-4 text-gray-600">Loading products...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#000000ff" />
            <Text className="text-2xl font-medium ml-2">Available Products</Text>
          </View>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('MyPurchases')}
            className="bg-green-500 px-3 py-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="bag-handle-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar and Filter */}
        <View className="flex-row items-center gap-2 mb-2">
  <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 border border-gray-200">
    <Ionicons name="search-outline" size={20} color="#6b7280" />
    <TextInput
      className="flex-1 ml-2 text-base"
      placeholder="Search products..."
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
    {searchQuery.length > 0 && (
      <TouchableOpacity onPress={() => setSearchQuery('')}>
        <Ionicons name="close-circle" size={20} color="#6b7280" />
      </TouchableOpacity>
    )}
  </View>
  
  <TouchableOpacity
    onPress={() => setShowFilters(true)}
    className="px-4 py-3 rounded-lg flex-row items-center border border-gray-200"
  >
    <Ionicons name="filter-outline" size={18} color="#838383ff" />
  </TouchableOpacity>
</View>

      </View>

      {/* Products List */}
      {error && (
        <View className="bg-red-100 p-4 m-4 rounded-lg">
          <Text className="text-red-700">{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ padding: 16 }}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchProducts();
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Icon name="shop" size={60} color="#d1d5db" />
            <Text className="text-xl text-gray-500 mt-4 font-medium">No products found</Text>
            <Text className="text-gray-400 mt-2">Try adjusting your filters</Text>
          </View>
        }
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
      />

      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '70%' }}>
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-medium">Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4">
              <Text className="font-medium text-gray-700 mb-3 text-base">Category</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                <TouchableOpacity
                  onPress={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <Text className={selectedCategory === 'all' ? 'text-white font-medium' : 'text-gray-700'}>
                    All
                  </Text>
                </TouchableOpacity>
                {categories.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setSelectedCategory(item)}
                    className={`px-4 py-2 rounded-full ${selectedCategory === item ? 'bg-green-500' : 'bg-gray-200'}`}
                  >
                    <Text className={selectedCategory === item ? 'text-white font-medium' : 'text-gray-700'}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="font-medium text-gray-700 mb-3 text-base">Sub-Category</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                <TouchableOpacity
                  onPress={() => setSelectedSubCategory('all')}
                  className={`px-4 py-2 rounded-full ${selectedSubCategory === 'all' ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <Text className={selectedSubCategory === 'all' ? 'text-white font-medium' : 'text-gray-700'}>
                    All
                  </Text>
                </TouchableOpacity>
                {subCategories.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setSelectedSubCategory(item)}
                    className={`px-4 py-2 rounded-full ${selectedSubCategory === item ? 'bg-green-500' : 'bg-gray-200'}`}
                  >
                    <Text className={selectedSubCategory === item ? 'text-white font-medium' : 'text-gray-700'}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row gap-3 mb-4">
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory('all');
                    setSelectedSubCategory('all');
                  }}
                  className="flex-1 bg-gray-300 py-3 rounded-lg"
                >
                  <Text className="text-gray-700 font-medium text-center">Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowFilters(false)}
                  className="flex-1 bg-green-500 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium text-center">Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Grade Details Modal */}
      <GradeDetailsModal
        visible={showGradeDetailsModal}
        product={selectedProductForDetails}
        onClose={() => {
          setShowGradeDetailsModal(false);
          setSelectedProductForDetails(null);
        }}
        getImageUrl={getImageUrl}
        handleAcceptOffer={handleAcceptOffer}
        handleMakeOffer={handleMakeOffer}
        handleAcceptCounterOffer={handleAcceptCounterOffer}
        handleRejectCounterOffer={handleRejectCounterOffer}
        handleMakeNewCounterOffer={handleMakeNewCounterOffer}
        traderId={traderId}
      />

      {/* Offer Modal */}
      <Modal
        visible={showOfferModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOfferModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '90%' }}>
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-medium">Bid by Trader - All Grades</Text>
              <TouchableOpacity onPress={() => setShowOfferModal(false)}>
                <Icon name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedProduct?.gradePrices.filter(g => g.status !== 'sold' && g.priceType === 'negotiable') || []}
              keyExtractor={(item) => item._id}
              ListHeaderComponent={
                <View className="p-4">
                  <View className="bg-blue-50 p-3 rounded-lg mb-4">
                    <Text className="text-blue-700 font-medium">💡 Tip: Enter your offer for each grade. Leave blank if you don't want to bid on that grade.</Text>
                  </View>
                  {selectedProduct && (
                    <Text className="text-lg font-medium mb-4">{selectedProduct.cropBriefDetails}</Text>
                  )}
                </View>
              }
              renderItem={({ item: grade }) => {
                const offer = gradeOffers[grade._id] || { price: '', quantity: '' };
                const amount = offer.price && offer.quantity 
                  ? (Number(offer.price) * Number(offer.quantity)).toFixed(2)
                  : '0.00';

                return (
                  <View className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 mx-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-medium text-base">{grade.grade}</Text>
                      {grade.quantityType === 'bulk' && (
                        <View className="bg-blue-500 px-2 py-1 rounded">
                          <Text className="text-white text-xs font-medium">Bulk</Text>
                        </View>
                      )}
                    </View>

                    <Text className="text-gray-600 mb-2">Listed: ₹{grade.pricePerUnit}/{selectedProduct?.unitMeasurement}</Text>
                    <Text className="text-gray-600 mb-3">Available: {grade.totalQty} {selectedProduct?.unitMeasurement}</Text>

                    <Text className="font-medium mb-1">Your Offer Price (₹/{selectedProduct?.unitMeasurement})</Text>
                    <TextInput
                      className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
                      placeholder={`₹${grade.pricePerUnit}`}
                      keyboardType="numeric"
                      value={offer.price}
                      onChangeText={(text) => setGradeOffers({
                        ...gradeOffers,
                        [grade._id]: { ...offer, price: text }
                      })}
                    />

                    <Text className="font-medium mb-1">Quantity ({selectedProduct?.unitMeasurement})</Text>
                    <TextInput
                      className="bg-white border border-gray-300 rounded-lg px-3 py-2 mb-3"
                      placeholder={`Max: ${grade.totalQty}`}
                      keyboardType="numeric"
                      value={offer.quantity}
                      onChangeText={(text) => setGradeOffers({
                        ...gradeOffers,
                        [grade._id]: { ...offer, quantity: text }
                      })}
                      editable={grade.quantityType !== 'bulk'}
                    />

                    <View className="bg-green-100 p-2 rounded-lg">
                      <Text className="text-green-700 font-medium text-right">
                        Amount: ₹{amount}
                      </Text>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={
                selectedProduct && (
                  <View className="px-4 pb-4">
                    <View className="bg-green-500 p-4 rounded-lg mt-4">
                      <Text className="text-white text-lg font-medium text-center">
                        Total Bid Amount: ₹{Object.entries(gradeOffers).reduce((sum, [gradeId, offer]) => {
                          if (offer.price && offer.quantity) {
                            return sum + (Number(offer.price) * Number(offer.quantity));
                          }
                          return sum;
                        }, 0).toFixed(2)}
                      </Text>
                    </View>

                    <View className="flex-row gap-3 mt-6 mb-4">
                      <TouchableOpacity
                        onPress={() => setShowOfferModal(false)}
                        className="flex-1 bg-gray-300 py-3 rounded-lg"
                      >
                        <Text className="text-gray-700 font-medium text-center">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={submitOffer}
                        className="flex-1 bg-green-500 py-3 rounded-lg"
                      >
                        <Text className="text-white font-medium text-center">Submit Bid</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }
            />
          </View>
        </View>
      </Modal>

      {/* Quantity Input Modal */}
      <Modal
        visible={showQuantityModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowQuantityModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-xl font-medium mb-4">
              {currentGrade?.quantityType === 'bulk' ? 'Bulk Purchase' : 'Enter Quantity'}
            </Text>
            
            {currentGrade?.quantityType === 'bulk' ? (
              <View className="bg-yellow-50 p-3 rounded-lg mb-4">
                <Text className="text-yellow-800">
                  This is a bulk purchase. You must buy the full quantity: {currentGrade.totalQty} {currentProduct?.unitMeasurement}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-600 mb-4">
                Maximum available: {currentGrade?.totalQty} {currentProduct?.unitMeasurement}
              </Text>
            )}

            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
              placeholder={`Enter quantity (Max: ${currentGrade?.totalQty})`}
              keyboardType="numeric"
              value={quantityInput}
              onChangeText={setQuantityInput}
              editable={currentGrade?.quantityType !== 'bulk'}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowQuantityModal(false);
                  setQuantityInput('');
                }}
                className="flex-1 bg-gray-300 py-3 rounded-lg"
              >
                <Text className="text-gray-700 font-medium text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDirectPurchase}
                className="flex-1 bg-green-500 py-3 rounded-lg"
              >
                <Text className="text-white font-medium text-center">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Counter Offer Modal */}
      <Modal
        visible={showNewCounterModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowNewCounterModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-xl font-medium mb-4">Make New Counter Offer</Text>
            
            <View className="bg-yellow-50 p-3 rounded-lg mb-4">
              <Text className="text-sm text-gray-700 mb-1">
                Farmer's counter: <Text className="font-medium">₹{currentOffer?.counterPrice} × {currentOffer?.counterQuantity}</Text>
              </Text>
            </View>

            <Text className="font-medium mb-2">Your New Price (₹/{currentProduct?.unitMeasurement})</Text>
            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
              placeholder="Enter price"
              keyboardType="numeric"
              value={newCounterPrice}
              onChangeText={setNewCounterPrice}
            />

            <Text className="font-medium mb-2">Quantity ({currentProduct?.unitMeasurement})</Text>
            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
              placeholder={`Max: ${currentGrade?.totalQty}`}
              keyboardType="numeric"
              value={newCounterQuantity}
              onChangeText={setNewCounterQuantity}
              editable={currentGrade?.quantityType !== 'bulk'}
            />

            {newCounterPrice && newCounterQuantity && (
              <View className="bg-green-100 p-3 rounded-lg mb-4">
                <Text className="text-green-700 font-medium text-center">
                  Total: ₹{(Number(newCounterPrice) * Number(newCounterQuantity)).toFixed(2)}
                </Text>
              </View>
            )}

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowNewCounterModal(false);
                  setNewCounterPrice('');
                  setNewCounterQuantity('');
                }}
                className="flex-1 bg-gray-300 py-3 rounded-lg"
              >
                <Text className="text-gray-700 font-medium text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitNewCounterOffer}
                className="flex-1 bg-green-500 py-3 rounded-lg"
              >
                <Text className="text-white font-medium text-center">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(AllProducts);