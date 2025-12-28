// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   Dimensions,
//   RefreshControl,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   Check,
//   X,
//   MessageCircle,
//   Package,
//   Calendar,
//   Clock,
//   MapPin,
//   Heart,
//   TrendingUp,
//   ShoppingBag,
//   ChevronLeft,
// } from "lucide-react-native";
// import { router } from "expo-router";
// interface Offer {
//   _id: string;
//   offerId: string;
//   traderId: string;
//   traderName?: string;
//   offeredPrice: number;
//   quantity: number;
//   status: "pending" | "accepted" | "rejected" | "countered";
//   counterPrice?: number;
//   counterQuantity?: number;
//   counterDate?: string;
//   createdAt: string;
// }

// interface PurchaseHistory {
//   traderId: string;
//   traderName: string;
//   quantity: number;
//   pricePerUnit: number;
//   totalAmount: number;
//   purchaseDate: string;
//   purchaseType: "direct" | "offer_accepted";
// }

// interface GradePrice {
//   grade: string;
//   pricePerUnit: number;
//   totalQty: number;
//   _id: string;
//   status?: string;
//   offers?: Offer[];
//   quantityType?: string;
//   purchaseHistory?: PurchaseHistory[];
// }

// interface Product {
//   _id: string;
//   productId: string;
//   categoryId: {
//     _id: string;
//     categoryName: string;
//   };
//   subCategoryId: {
//     _id: string;
//     subCategoryName: string;
//   };
//   cropBriefDetails: string;
//   farmingType: string;
//   typeOfSeeds: string;
//   packagingType: string;
//   packageMeasurement: string;
//   unitMeasurement?: string;
//   gradePrices: GradePrice[];
//   deliveryDate: string;
//   deliveryTime: string;
//   nearestMarket: string;
//   cropPhotos: string[];
//   farmLocation: {
//     lat: string;
//     lng: string;
//   };
//   sellerId: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const { width } = Dimensions.get("window");
// const cardWidth =
//   width > 768 ? (width - 64) / 3 : width > 480 ? (width - 48) / 2 : width - 32;

// const FarmerOrder: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [selectedGrade, setSelectedGrade] = useState<GradePrice | null>(null);
//   const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
//   const [counterPrice, setCounterPrice] = useState("");
//   const [counterQuantity, setCounterQuantity] = useState("");
//   const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
//   const [showDirectOfferModal, setShowDirectOfferModal] = useState(false);
//   const [directOfferPrice, setDirectOfferPrice] = useState("");
//   const [directOfferQuantity, setDirectOfferQuantity] = useState("");

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const farmerId = await AsyncStorage.getItem("farmerId");
//       if (!farmerId) {
//         throw new Error("Farmer not logged in");
//       }

//       const response = await fetch(
//         `https://kisan.etpl.ai/product/by-farmer/${farmerId}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch products");

//       const data = await response.json();
//       setProducts(data.data || []);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || "An error occurred");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchProducts();
//   };

//   const handleAcceptOffer = async (product: Product, grade: GradePrice) => {
//     Alert.prompt(
//       "Accept Offer",
//       `Enter quantity to sell (Max: ${grade.totalQty} ${
//         product.unitMeasurement || "units"
//       })`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "OK",
//           onPress: async (quantity: any) => {
//             if (!quantity) return;
//             Alert.alert(
//               "Offer Accepted",
//               `✅ Accepting to sell ${quantity} ${product.unitMeasurement} of ${
//                 grade.grade
//               } at ₹${grade.pricePerUnit}/${
//                 product.unitMeasurement
//               }\n\nTotal: ₹${(grade.pricePerUnit * Number(quantity)).toFixed(
//                 2
//               )}\n\nThis will be available for traders to purchase.`
//             );
//           },
//         },
//       ],
//       "plain-text"
//     );
//   };

//   const handleMakeOffer = (product: Product, grade: GradePrice) => {
//     setSelectedProduct(product);
//     setSelectedGrade(grade);
//     setDirectOfferPrice(grade.pricePerUnit.toString());
//     setDirectOfferQuantity("");
//     setShowDirectOfferModal(true);
//   };

//   const submitDirectOffer = () => {
//     if (!directOfferPrice || !directOfferQuantity) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     Alert.alert(
//       "Offer Created",
//       `✅ Offer Created!\n\nProduct: ${selectedProduct?.cropBriefDetails}\nGrade: ${selectedGrade?.grade}\nPrice: ₹${directOfferPrice}/${selectedProduct?.unitMeasurement}\nQuantity: ${directOfferQuantity} ${selectedProduct?.unitMeasurement}\n\nThis offer will be visible to all traders.`
//     );

//     setShowDirectOfferModal(false);
//   };

//   const acceptTraderOffer = async (
//     productId: string,
//     gradeId: string,
//     offerId: string,
//     offer: Offer,
//     product: Product,
//     grade: GradePrice
//   ) => {
//     if (grade.quantityType === "bulk" && offer.quantity !== grade.totalQty) {
//       Alert.alert(
//         "Warning",
//         "⚠️ This is a bulk purchase. The trader must buy the full quantity."
//       );
//       return;
//     }

//     const confirmMsg =
//       `Accept Trader's Offer?\n\n` +
//       `Product: ${product.cropBriefDetails}\n` +
//       `Grade: ${grade.grade}\n\n` +
//       `Trader's Offer: ₹${offer.offeredPrice}/${product.unitMeasurement}\n` +
//       `Your Listed Price: ₹${grade.pricePerUnit}/${product.unitMeasurement}\n` +
//       `Quantity: ${offer.quantity} ${product.unitMeasurement}\n\n` +
//       `Total Amount: ₹${(offer.offeredPrice * offer.quantity).toFixed(2)}\n\n` +
//       `Remaining after sale: ${grade.totalQty - offer.quantity} ${
//         product.unitMeasurement
//       }\n\n` +
//       `Proceed?`;

//     Alert.alert("Confirm", confirmMsg, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Accept",
//         onPress: async () => {
//           try {
//             const response = await fetch(
//               "https://kisan.etpl.ai/product/accept-trader-offer",
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ productId, gradeId, offerId }),
//               }
//             );

//             const data = await response.json();
//             if (data.success) {
//               const statusMsg =
//                 data.data.remainingQty === 0
//                   ? "🎉 Grade SOLD OUT!"
//                   : `✅ Sale Confirmed! ${data.data.remainingQty} ${product.unitMeasurement} remaining.`;

//               Alert.alert(
//                 "Success",
//                 `${statusMsg}\n\nTotal Amount: ₹${data.data.totalAmount.toFixed(
//                   2
//                 )}\n\nTrader has been notified and can proceed to payment.`
//               );
//               fetchProducts();
//             } else {
//               Alert.alert("Failed", data.message);
//             }
//           } catch (err) {
//             Alert.alert("Error", "Error accepting offer");
//             console.error(err);
//           }
//         },
//       },
//     ]);
//   };

//   const rejectTraderOffer = async (
//     productId: string,
//     gradeId: string,
//     offerId: string
//   ) => {
//     Alert.alert("Confirm", "Reject this offer?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Reject",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             const response = await fetch(
//               "https://kisan.etpl.ai/product/reject-trader-offer",
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ productId, gradeId, offerId }),
//               }
//             );

//             const data = await response.json();
//             if (data.success) {
//               Alert.alert("Success", "Offer rejected");
//               fetchProducts();
//             }
//           } catch (err) {
//             Alert.alert("Error", "Error rejecting offer");
//           }
//         },
//       },
//     ]);
//   };

//   const openCounterOfferModal = (
//     product: Product,
//     grade: GradePrice,
//     offer: Offer
//   ) => {
//     setSelectedProduct(product);
//     setSelectedGrade(grade);
//     setSelectedOffer(offer);
//     setCounterPrice(offer.offeredPrice.toString());
//     setCounterQuantity(offer.quantity.toString());
//     setShowCounterOfferModal(true);
//   };

//   const submitCounterOffer = async () => {
//     if (!counterPrice || !counterQuantity) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     if (!selectedProduct || !selectedGrade || !selectedOffer) return;

//     const numPrice = Number(counterPrice);
//     const numQuantity = Number(counterQuantity);

//     if (numQuantity > selectedGrade.totalQty) {
//       Alert.alert(
//         "Error",
//         `Maximum available: ${selectedGrade.totalQty} ${selectedProduct.unitMeasurement}`
//       );
//       return;
//     }

//     if (
//       selectedGrade.quantityType === "bulk" &&
//       numQuantity !== selectedGrade.totalQty
//     ) {
//       Alert.alert("Error", "Bulk purchase requires full quantity");
//       return;
//     }

//     const confirmMsg =
//       `Send Counter Offer?\n\n` +
//       `Trader offered: ₹${selectedOffer.offeredPrice} × ${selectedOffer.quantity}\n` +
//       `Your counter: ₹${numPrice} × ${numQuantity}\n\n` +
//       `Total: ₹${(numPrice * numQuantity).toFixed(2)}\n\n` +
//       `Send?`;

//     Alert.alert("Confirm", confirmMsg, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Send",
//         onPress: async () => {
//           try {
//             const response = await fetch(
//               "https://kisan.etpl.ai/product/make-counter-offer",
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   productId: selectedProduct._id,
//                   gradeId: selectedGrade._id,
//                   offerId: selectedOffer._id,
//                   counterPrice: numPrice,
//                   counterQuantity: numQuantity,
//                 }),
//               }
//             );

//             const data = await response.json();
//             if (data.success) {
//               Alert.alert("Success", "✅ Counter-offer sent to trader!");
//               setShowCounterOfferModal(false);
//               fetchProducts();
//             } else {
//               Alert.alert("Failed", data.message);
//             }
//           } catch (err) {
//             Alert.alert("Error", "Error submitting counter-offer");
//             console.error(err);
//           }
//         },
//       },
//     ]);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath)
//       return "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400";
//     if (imagePath.startsWith("http")) return imagePath;
//     return `https://kisan.etpl.ai/${imagePath}`;
//   };

//   if (loading && !refreshing) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#22c55e" />
//         <Text className="mt-4 text-base text-gray-500">
//           Loading your products...
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-white">
//       <View className="flex-row items-center px-4 py-4 bg-white">
//         <TouchableOpacity
//           onPress={() => router.push("/(farmer)/home")}
//           className="p-2"
//         >
//           <ChevronLeft size={24} color="#374151" />
//         </TouchableOpacity>
//         <Text className="ml-3 text-xl font-medium text-gray-900">
//           {" "}
//           My Order
//         </Text>
//       </View>
//       <ScrollView
//         className="flex-1"
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={["#22c55e"]}
//           />
//         }
//       >
//         {error && (
//           <View className="m-4 p-4 bg-red-50 rounded-lg border-l-4 border-l-red-600">
//             <Text className="font-subheadingtext-red-800 mb-1">Error:</Text>
//             <Text className="text-red-900 text-sm">{error}</Text>
//           </View>
//         )}

//         <View className="p-4 flex-row flex-wrap justify-between">
//           {products.map((product) => (
//             <View
//               key={product._id}
//               className="bg-white rounded-lg mb-4 border border-gray-200"
//             >
//               {/* Product Image */}
//               <View className="h-48 relative p-4 rounded-t-xl overflow-hidden contain">
//                 <Image
//                   source={{ uri: getImageUrl(product.cropPhotos[0]) }}
//                   className="w-full h-full rounded-t-xl"
//                 />

//                 {/* Product ID Badge */}
//                 <View className="absolute bottom-3 left-3 bg-black/70 px-2.5 py-1 rounded">
//                   <Text className="text-xs font-medium text-white">
//                     ID: {product.productId}
//                   </Text>
//                 </View>
//               </View>

//               {/* Product Details */}
//               <View className="p-4">
//                 <View className="flex-row justify-between items-start mb-2">
//                   <Text
//                     className="text-lg font-medium text-gray-900 flex-1"
//                     numberOfLines={1}
//                   >
//                     {product.cropBriefDetails}
//                   </Text>

//                   <View className="absolute bottom-2 right-2 bg-green-400 px-3 py-1.5 rounded-full">
//                     <Text className="text-white text-xs font-medium">
//                       {product.farmingType}
//                     </Text>
//                   </View>
//                 </View>

//                 <View className="flex-row flex-wrap gap-2 mb-3">
//                   <View className="bg-gray-50 px-2.5 py-1 rounded">
//                     <Text className="text-gray-700 text-xs">
//                       {product.categoryId.categoryName}
//                     </Text>
//                   </View>
//                   <View className="bg-gray-50 px-2.5 py-1 rounded">
//                     <Text className="text-gray-700 text-xs">
//                       {product.subCategoryId.subCategoryName}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Grade Prices with Offers */}
//                 {product.gradePrices.length > 0 && (
//                   <View className="mb-4">
//                     <ScrollView
//                       horizontal
//                       showsHorizontalScrollIndicator={false}
//                       className="flex-row"
//                     >
//                       {product.gradePrices.map((grade) => (
//                         <View
//                           key={grade._id}
//                           className="border border-gray-200 rounded-lg p-3 mr-3 w-80 flex-shrink-0"
//                         >
//                           <View className="flex-row justify-between items-start mb-3">
//                             <Text className="text-sm font-medium text-gray-900">
//                               {grade.grade}
//                             </Text>
//                             <View className="items-end">
//                               <Text className="text-lg font-subheadingtext-green-500">
//                                 ₹{grade.pricePerUnit}
//                               </Text>
//                               <Text className="text-sm text-gray-500">
//                                 /{product.unitMeasurement || "unit"}
//                               </Text>
//                               <Text className="text-xs text-gray-500 mt-0.5">
//                                 {grade.totalQty} available
//                               </Text>
//                             </View>
//                           </View>

//                           {/* Purchase History */}
//                           {grade.purchaseHistory &&
//                             grade.purchaseHistory.length > 0 && (
//                               <View className="mb-3">
//                                 <Text className="text-sm font-medium text-green-500 mb-2">
//                                   📦 Purchase History
//                                 </Text>
//                                 {grade.purchaseHistory.slice(0, 2).map(
//                                   (
//                                     purchase,
//                                     idx // Limit to 2 items for mobile
//                                   ) => (
//                                     <View
//                                       key={idx}
//                                       className="bg-green-100 p-2 rounded-md mb-2"
//                                     >
//                                       <View className="flex-row justify-between items-start mb-1">
//                                         <View>
//                                           <Text className="text-sm font-subheadingtext-emerald-900">
//                                             Trader: {purchase.traderName}
//                                           </Text>
//                                           <Text className="text-xs text-emerald-800 mt-0.5">
//                                             ID: {purchase.traderId}
//                                           </Text>
//                                         </View>
//                                         <View className="items-end">
//                                           <Text className="text-sm font-subheadingtext-emerald-900">
//                                             ₹{purchase.totalAmount.toFixed(2)}
//                                           </Text>
//                                           <Text className="text-xs text-emerald-800 mt-0.5">
//                                             {purchase.quantity} × ₹
//                                             {purchase.pricePerUnit}
//                                           </Text>
//                                         </View>
//                                       </View>
//                                       <View className="flex-row justify-between items-center mt-1">
//                                         <Text className="text-xs text-emerald-800">
//                                           {new Date(
//                                             purchase.purchaseDate
//                                           ).toLocaleString("en-IN")}
//                                         </Text>
//                                         <View className="bg-green-500 px-1.5 py-1 rounded">
//                                           <Text className="text-white text-xs font-medium">
//                                             {purchase.purchaseType === "direct"
//                                               ? "Direct Purchase"
//                                               : "Offer Accepted"}
//                                           </Text>
//                                         </View>
//                                       </View>
//                                     </View>
//                                   )
//                                 )}
//                                 {grade.purchaseHistory.length > 2 && (
//                                   <Text className="text-xs text-green-600 text-center mt-1">
//                                     +{grade.purchaseHistory.length - 2} more
//                                     purchases
//                                   </Text>
//                                 )}
//                               </View>
//                             )}

//                           {/* Action Buttons */}
//                           <View className="flex-row gap-2 mb-2">
//                             <TouchableOpacity
//                               className={`flex-1 py-2.5 px-4 rounded-md ${
//                                 grade.totalQty === 0 ? "opacity-50" : ""
//                               }`}
//                               style={{
//                                 backgroundColor:
//                                   grade.totalQty === 0 ? "#d1d5db" : "#22c55e",
//                               }}
//                               onPress={() => handleAcceptOffer(product, grade)}
//                               disabled={grade.totalQty === 0}
//                             >
//                               <Text className="text-white font-medium text-sm text-center">
//                                 Accept Offer
//                               </Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                               className={`flex-1 py-2.5 px-4 rounded-md border ${
//                                 grade.totalQty === 0 ? "opacity-50" : ""
//                               }`}
//                               style={{
//                                 borderColor: "#22c55e",
//                                 backgroundColor:
//                                   grade.totalQty === 0
//                                     ? "#f3f4f6"
//                                     : "transparent",
//                               }}
//                               onPress={() => handleMakeOffer(product, grade)}
//                               disabled={grade.totalQty === 0}
//                             >
//                               <Text className="text-green-500 font-medium text-sm text-center">
//                                 Make Offer
//                               </Text>
//                             </TouchableOpacity>
//                           </View>

//                           {/* Offers Container with Vertical Scroll if needed */}
//                           <ScrollView
//                             showsVerticalScrollIndicator={false}
//                             className="max-h-64" // Limit height for offers section
//                           >
//                             {/* Pending Offers */}
//                             {grade.offers
//                               ?.filter((o) => o.status === "pending")
//                               .map((offer) => (
//                                 <View
//                                   key={offer._id}
//                                   className="bg-yellow-50 p-3 rounded-md mb-2"
//                                 >
//                                   <View className="mb-3">
//                                     <Text className="text-sm font-subheadingtext-amber-900 mb-2">
//                                       📩 Trader's Offer
//                                     </Text>
//                                     <View className="flex-row flex-wrap gap-2 mb-2">
//                                       <View className="bg-cyan-500 px-2 py-1 rounded">
//                                         <Text className="text-white text-xs font-medium">
//                                           Trader ID: {offer.traderId}
//                                         </Text>
//                                       </View>
//                                       {offer.traderName && (
//                                         <View className="bg-gray-500 px-2 py-1 rounded">
//                                           <Text className="text-white text-xs font-medium">
//                                             {offer.traderName}
//                                           </Text>
//                                         </View>
//                                       )}
//                                     </View>
//                                     <Text className="mb-1">
//                                       <Text className="font-bold">
//                                         ₹{offer.offeredPrice}
//                                       </Text>
//                                       <Text className="text-gray-500">
//                                         {" "}
//                                         × {offer.quantity}{" "}
//                                         {product.unitMeasurement}
//                                       </Text>
//                                     </Text>
//                                     <Text className="text-xs text-gray-500 mb-1">
//                                       Total: ₹
//                                       {(
//                                         offer.offeredPrice * offer.quantity
//                                       ).toFixed(2)}
//                                     </Text>
//                                     <Text className="text-xs text-gray-500 mb-2">
//                                       Your price: ₹{grade.pricePerUnit} |
//                                       Difference:{" "}
//                                       {offer.offeredPrice >= grade.pricePerUnit
//                                         ? "+"
//                                         : ""}
//                                       ₹
//                                       {(
//                                         (offer.offeredPrice -
//                                           grade.pricePerUnit) *
//                                         offer.quantity
//                                       ).toFixed(2)}
//                                     </Text>
//                                     {grade.quantityType === "bulk" && (
//                                       <Text className="text-xs text-amber-900 font-bold">
//                                         🔒 Bulk purchase - must sell all{" "}
//                                         {grade.totalQty}{" "}
//                                         {product.unitMeasurement}
//                                       </Text>
//                                     )}
//                                   </View>
//                                   <View className="flex-row gap-2">
//                                     <TouchableOpacity
//                                       className={`flex-1 py-2 px-4 rounded-md ${
//                                         grade.quantityType === "bulk" &&
//                                         offer.quantity !== grade.totalQty
//                                           ? "opacity-50"
//                                           : ""
//                                       }`}
//                                       style={{ backgroundColor: "#22c55e" }}
//                                       onPress={() =>
//                                         acceptTraderOffer(
//                                           product._id,
//                                           grade._id,
//                                           offer._id,
//                                           offer,
//                                           product,
//                                           grade
//                                         )
//                                       }
//                                       disabled={
//                                         grade.quantityType === "bulk" &&
//                                         offer.quantity !== grade.totalQty
//                                       }
//                                     >
//                                       <Text className="text-white font-medium text-sm text-center">
//                                         ✓ Accept
//                                       </Text>
//                                     </TouchableOpacity>
//                                     <TouchableOpacity
//                                       className="flex-1 py-2 px-4 rounded-md border"
//                                       style={{ borderColor: "#22c55e" }}
//                                       onPress={() =>
//                                         openCounterOfferModal(
//                                           product,
//                                           grade,
//                                           offer
//                                         )
//                                       }
//                                     >
//                                       <Text className="text-green-500 font-medium text-sm text-center">
//                                         Counter
//                                       </Text>
//                                     </TouchableOpacity>
//                                     <TouchableOpacity
//                                       className="py-2 px-3 rounded-md"
//                                       style={{ backgroundColor: "#ef4444" }}
//                                       onPress={() =>
//                                         rejectTraderOffer(
//                                           product._id,
//                                           grade._id,
//                                           offer._id
//                                         )
//                                       }
//                                     >
//                                       <Text className="text-white font-medium text-sm">
//                                         ✗
//                                       </Text>
//                                     </TouchableOpacity>
//                                   </View>
//                                 </View>
//                               ))}

//                             {/* Countered Offers */}
//                             {grade.offers
//                               ?.filter((o) => o.status === "countered")
//                               .map((offer) => (
//                                 <View
//                                   key={offer._id}
//                                   className="bg-blue-100 p-2 rounded-md mb-2"
//                                 >
//                                   <Text className="text-sm font-subheadingtext-blue-900 mb-1">
//                                     💬 Counter Sent to Trader {offer.traderId}
//                                   </Text>
//                                   <Text className="text-xs text-blue-900 mb-1">
//                                     Your counter: ₹{offer.counterPrice} ×{" "}
//                                     {offer.counterQuantity} = ₹
//                                     {(
//                                       offer.counterPrice! *
//                                       offer.counterQuantity!
//                                     ).toFixed(2)}
//                                   </Text>
//                                   <View className="bg-yellow-400 px-2 py-1 rounded self-start">
//                                     <Text className="text-amber-900 text-xs font-medium">
//                                       Private - Only visible to this trader
//                                     </Text>
//                                   </View>
//                                 </View>
//                               ))}

//                             {/* Accepted Offers */}
//                             {grade.offers
//                               ?.filter((o) => o.status === "accepted")
//                               .map((offer) => (
//                                 <View
//                                   key={offer._id}
//                                   className="bg-green-100 p-2 rounded-md mb-2"
//                                 >
//                                   <Text className="text-sm font-subheadingtext-emerald-900 mb-1">
//                                     ✓ Accepted & Sold
//                                   </Text>
//                                   <Text className="text-xs text-emerald-800">
//                                     ₹{offer.offeredPrice} × {offer.quantity} = ₹
//                                     {(
//                                       offer.offeredPrice * offer.quantity
//                                     ).toFixed(2)}
//                                   </Text>
//                                 </View>
//                               ))}

//                             {/* Rejected Offers */}
//                             {grade.offers
//                               ?.filter((o) => o.status === "rejected")
//                               .map((offer) => (
//                                 <View
//                                   key={offer._id}
//                                   className="bg-red-100 p-2 rounded-md mb-2"
//                                 >
//                                   <Text className="text-sm font-subheadingtext-red-900 mb-1">
//                                     ✗ Rejected
//                                   </Text>
//                                   <Text className="text-xs text-red-900">
//                                     Trader offered: ₹{offer.offeredPrice} ×{" "}
//                                     {offer.quantity}
//                                   </Text>
//                                 </View>
//                               ))}
//                           </ScrollView>

//                           {/* Additional Info for this grade */}
//                           <View className="pt-3 border-t border-gray-200">
//                             <View className="flex-row flex-wrap gap-3">
//                               <View className="flex-row items-center">
//                                 <Package size={14} color="#6b7280" />
//                                 <Text className="text-sm text-gray-600 ml-1.5">
//                                   {product.packageMeasurement}{" "}
//                                   {product.packagingType}
//                                 </Text>
//                               </View>

//                               <View className="flex-row items-center">
//                                 <Calendar size={14} color="#6b7280" />
//                                 <Text className="text-sm text-gray-600 ml-1.5">
//                                   {formatDate(product.deliveryDate)}
//                                 </Text>
//                               </View>

//                               <View className="flex-row items-center">
//                                 <Clock size={14} color="#6b7280" />
//                                 <Text className="text-sm text-gray-600 ml-1.5">
//                                   {product.deliveryTime}
//                                 </Text>
//                               </View>

//                               <View className="flex-row items-center">
//                                 <MapPin size={14} color="#6b7280" />
//                                 <Text className="text-sm text-gray-600 ml-1.5">
//                                   {product.nearestMarket}
//                                 </Text>
//                               </View>
//                             </View>
//                           </View>
//                         </View>
//                       ))}
//                     </ScrollView>
//                   </View>
//                 )}
//               </View>
//             </View>
//           ))}
//         </View>

//         {products.length === 0 && !loading && (
//           <View className="py-10 items-center">
//             <Text className="text-lg text-gray-500">
//               No products listed yet.
//             </Text>
//           </View>
//         )}
//       </ScrollView>

//       {/* Direct Offer Modal */}
//       <Modal
//         visible={showDirectOfferModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowDirectOfferModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center">
//           <View className="bg-white rounded-xl w-11/12 max-w-[500px] max-h-4/5">
//             <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
//               <Text className="text-xl font-subheadingtext-gray-900">
//                 Make an Offer
//               </Text>
//               <TouchableOpacity onPress={() => setShowDirectOfferModal(false)}>
//                 <Text className="text-2xl text-gray-500">✕</Text>
//               </TouchableOpacity>
//             </View>
//             <View className="p-4">
//               <Text className="text-base text-gray-500 mb-1">
//                 {selectedProduct?.cropBriefDetails}
//               </Text>
//               <Text className="text-sm text-gray-500 mb-4">
//                 Grade: {selectedGrade?.grade}
//               </Text>

//               <Text className="text-sm font-medium text-gray-700 mb-2">
//                 Price per {selectedProduct?.unitMeasurement || "unit"} (₹)
//               </Text>
//               <TextInput
//                 className="border border-gray-300 rounded-md p-3 text-base mb-4"
//                 value={directOfferPrice}
//                 onChangeText={setDirectOfferPrice}
//                 placeholder="Enter your offer price"
//                 keyboardType="numeric"
//               />

//               <Text className="text-sm font-medium text-gray-700 mb-2">
//                 Quantity ({selectedProduct?.unitMeasurement || "units"})
//               </Text>
//               <TextInput
//                 className="border border-gray-300 rounded-md p-3 text-base mb-4"
//                 value={directOfferQuantity}
//                 onChangeText={setDirectOfferQuantity}
//                 placeholder="Enter quantity"
//                 keyboardType="numeric"
//               />

//               {directOfferPrice && directOfferQuantity && (
//                 <View className="bg-gray-50 p-4 rounded-lg mt-2">
//                   <Text className="text-xs text-gray-500 mb-1">
//                     Total Amount
//                   </Text>
//                   <Text className="text-2xl font-subheadingtext-green-500">
//                     ₹
//                     {(
//                       parseFloat(directOfferPrice) *
//                       parseFloat(directOfferQuantity)
//                     ).toFixed(2)}
//                   </Text>
//                 </View>
//               )}
//             </View>
//             <View className="flex-row gap-3 p-4 border-t border-gray-200">
//               <TouchableOpacity
//                 className="flex-1 py-2.5 px-4 rounded-md"
//                 style={{ backgroundColor: "#6b7280" }}
//                 onPress={() => setShowDirectOfferModal(false)}
//               >
//                 <Text className="text-white font-medium text-sm text-center">
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="flex-1 py-2.5 px-4 rounded-md"
//                 style={{ backgroundColor: "#22c55e" }}
//                 onPress={submitDirectOffer}
//               >
//                 <Text className="text-white font-medium text-sm text-center">
//                   Submit Offer
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Counter Offer Modal */}
//       <Modal
//         visible={showCounterOfferModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowCounterOfferModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center">
//           <View className="bg-white rounded-xl w-11/12 max-w-[500px] max-h-4/5">
//             <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
//               <Text className="text-xl font-subheadingtext-gray-900">
//                 Counter Offer
//               </Text>
//               <TouchableOpacity onPress={() => setShowCounterOfferModal(false)}>
//                 <Text className="text-2xl text-gray-500">✕</Text>
//               </TouchableOpacity>
//             </View>
//             <View className="p-4">
//               <View className="bg-gray-50 p-3 rounded-lg mb-4">
//                 <Text className="text-xs text-gray-500 mb-1">
//                   Product: {selectedProduct?.cropBriefDetails}
//                 </Text>
//                 <Text className="text-xs text-gray-500 mb-1">
//                   Grade: {selectedGrade?.grade}
//                 </Text>
//                 <Text className="text-xs text-gray-500 font-bold">
//                   Trader's Offer: ₹{selectedOffer?.offeredPrice} ×{" "}
//                   {selectedOffer?.quantity}
//                 </Text>
//               </View>

//               <Text className="text-sm font-medium text-gray-700 mb-2">
//                 Your Counter Price (₹/
//                 {selectedProduct?.unitMeasurement || "unit"})
//               </Text>
//               <TextInput
//                 className="border border-gray-300 rounded-md p-3 text-base mb-4"
//                 value={counterPrice}
//                 onChangeText={setCounterPrice}
//                 placeholder="Enter your counter price"
//                 keyboardType="numeric"
//               />

//               <Text className="text-sm font-medium text-gray-700 mb-2">
//                 Quantity ({selectedProduct?.unitMeasurement || "units"})
//               </Text>
//               <TextInput
//                 className="border border-gray-300 rounded-md p-3 text-base mb-4"
//                 value={counterQuantity}
//                 onChangeText={setCounterQuantity}
//                 placeholder="Enter quantity"
//                 keyboardType="numeric"
//               />

//               {counterPrice && counterQuantity && (
//                 <View className="bg-green-100 p-4 rounded-lg mt-2">
//                   <Text className="text-xs text-gray-500 mb-1">
//                     Total Counter Amount
//                   </Text>
//                   <Text className="text-2xl font-subheading text-green-500">
//                     ₹
//                     {(
//                       parseFloat(counterPrice) * parseFloat(counterQuantity)
//                     ).toFixed(2)}
//                   </Text>
//                 </View>
//               )}
//             </View>
//             <View className="flex-row gap-3 p-4 border-t border-gray-200">
//               <TouchableOpacity
//                 className="flex-1 py-2.5 px-4 rounded-md"
//                 style={{ backgroundColor: "#6b7280" }}
//                 onPress={() => setShowCounterOfferModal(false)}
//               >
//                 <Text className="text-white font-medium text-sm text-center">
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="flex-1 py-2.5 px-4 rounded-md"
//                 style={{ backgroundColor: "#22c55e" }}
//                 onPress={submitCounterOffer}
//               >
//                 <Text className="text-white font-medium text-sm text-center">
//                   Send Counter Offer
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default FarmerOrder;


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Check,
  X,
  MessageCircle,
  Package,
  Calendar,
  Clock,
  MapPin,
  Heart,
  TrendingUp,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react-native";
import { router } from "expo-router";

interface Offer {
  _id: string;
  offerId: string;
  traderId: string;
  traderName?: string;
  offeredPrice: number;
  quantity: number;
  status: "pending" | "accepted" | "rejected" | "countered";
  counterPrice?: number;
  counterQuantity?: number;
  counterDate?: string;
  createdAt: string;
}

interface PurchaseHistory {
  traderId: string;
  traderName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  purchaseDate: string;
  purchaseType: "direct" | "offer_accepted";
}

interface GradePrice {
  grade: string;
  pricePerUnit: number;
  totalQty: number;
  _id: string;
  status?: string;
  offers?: Offer[];
  quantityType?: string;
  purchaseHistory?: PurchaseHistory[];
}

interface Product {
  _id: string;
  productId: string;
  categoryId: {
    _id: string;
    categoryName: string;
  };
  subCategoryId: {
    _id: string;
    subCategoryName: string;
  };
  cropBriefDetails: string;
  farmingType: string;
  typeOfSeeds: string;
  packagingType: string;
  packageMeasurement: string;
  unitMeasurement?: string;
  gradePrices: GradePrice[];
  deliveryDate: string;
  deliveryTime: string;
  nearestMarket: string;
  cropPhotos: string[];
  farmLocation: {
    lat: string;
    lng: string;
  };
  sellerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = "list" | "details";

const FarmerOrder: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradePrice | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [counterQuantity, setCounterQuantity] = useState("");
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [showDirectOfferModal, setShowDirectOfferModal] = useState(false);
  const [directOfferPrice, setDirectOfferPrice] = useState("");
  const [directOfferQuantity, setDirectOfferQuantity] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const farmerId = await AsyncStorage.getItem("farmerId");
      if (!farmerId) {
        throw new Error("Farmer not logged in");
      }

      const response = await fetch(
        `https://kisan.etpl.ai/product/by-farmer/${farmerId}`
      );
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleAcceptOffer = async (product: Product, grade: GradePrice) => {
    Alert.prompt(
      "Accept Offer",
      `Enter quantity to sell (Max: ${grade.totalQty} ${
        product.unitMeasurement || "units"
      })`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async (quantity: any) => {
            if (!quantity) return;
            Alert.alert(
              "Offer Accepted",
              `✅ Accepting to sell ${quantity} ${product.unitMeasurement} of ${
                grade.grade
              } at ₹${grade.pricePerUnit}/${
                product.unitMeasurement
              }\n\nTotal: ₹${(grade.pricePerUnit * Number(quantity)).toFixed(
                2
              )}\n\nThis will be available for traders to purchase.`
            );
          },
        },
      ],
      "plain-text"
    );
  };

  const handleMakeOffer = (product: Product, grade: GradePrice) => {
    setSelectedProduct(product);
    setSelectedGrade(grade);
    setDirectOfferPrice(grade.pricePerUnit.toString());
    setDirectOfferQuantity("");
    setShowDirectOfferModal(true);
  };

  const submitDirectOffer = () => {
    if (!directOfferPrice || !directOfferQuantity) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    Alert.alert(
      "Offer Created",
      `✅ Offer Created!\n\nProduct: ${selectedProduct?.cropBriefDetails}\nGrade: ${selectedGrade?.grade}\nPrice: ₹${directOfferPrice}/${selectedProduct?.unitMeasurement}\nQuantity: ${directOfferQuantity} ${selectedProduct?.unitMeasurement}\n\nThis offer will be visible to all traders.`
    );

    setShowDirectOfferModal(false);
  };

  const acceptTraderOffer = async (
    productId: string,
    gradeId: string,
    offerId: string,
    offer: Offer,
    product: Product,
    grade: GradePrice
  ) => {
    if (grade.quantityType === "bulk" && offer.quantity !== grade.totalQty) {
      Alert.alert(
        "Warning",
        "⚠️ This is a bulk purchase. The trader must buy the full quantity."
      );
      return;
    }

    const confirmMsg =
      `Accept Trader's Offer?\n\n` +
      `Product: ${product.cropBriefDetails}\n` +
      `Grade: ${grade.grade}\n\n` +
      `Trader's Offer: ₹${offer.offeredPrice}/${product.unitMeasurement}\n` +
      `Your Listed Price: ₹${grade.pricePerUnit}/${product.unitMeasurement}\n` +
      `Quantity: ${offer.quantity} ${product.unitMeasurement}\n\n` +
      `Total Amount: ₹${(offer.offeredPrice * offer.quantity).toFixed(2)}\n\n` +
      `Remaining after sale: ${grade.totalQty - offer.quantity} ${
        product.unitMeasurement
      }\n\n` +
      `Proceed?`;

    Alert.alert("Confirm", confirmMsg, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: async () => {
          try {
            const response = await fetch(
              "https://kisan.etpl.ai/product/accept-trader-offer",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, gradeId, offerId }),
              }
            );

            const data = await response.json();
            if (data.success) {
              const statusMsg =
                data.data.remainingQty === 0
                  ? "🎉 Grade SOLD OUT!"
                  : `✅ Sale Confirmed! ${data.data.remainingQty} ${product.unitMeasurement} remaining.`;

              Alert.alert(
                "Success",
                `${statusMsg}\n\nTotal Amount: ₹${data.data.totalAmount.toFixed(
                  2
                )}\n\nTrader has been notified and can proceed to payment.`
              );
              fetchProducts();
            } else {
              Alert.alert("Failed", data.message);
            }
          } catch (err) {
            Alert.alert("Error", "Error accepting offer");
            console.error(err);
          }
        },
      },
    ]);
  };

  const rejectTraderOffer = async (
    productId: string,
    gradeId: string,
    offerId: string
  ) => {
    Alert.alert("Confirm", "Reject this offer?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(
              "https://kisan.etpl.ai/product/reject-trader-offer",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, gradeId, offerId }),
              }
            );

            const data = await response.json();
            if (data.success) {
              Alert.alert("Success", "Offer rejected");
              fetchProducts();
            }
          } catch (err) {
            Alert.alert("Error", "Error rejecting offer");
          }
        },
      },
    ]);
  };

  const openCounterOfferModal = (
    product: Product,
    grade: GradePrice,
    offer: Offer
  ) => {
    setSelectedProduct(product);
    setSelectedGrade(grade);
    setSelectedOffer(offer);
    setCounterPrice(offer.offeredPrice.toString());
    setCounterQuantity(offer.quantity.toString());
    setShowCounterOfferModal(true);
  };

  const submitCounterOffer = async () => {
    if (!counterPrice || !counterQuantity) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!selectedProduct || !selectedGrade || !selectedOffer) return;

    const numPrice = Number(counterPrice);
    const numQuantity = Number(counterQuantity);

    if (numQuantity > selectedGrade.totalQty) {
      Alert.alert(
        "Error",
        `Maximum available: ${selectedGrade.totalQty} ${selectedProduct.unitMeasurement}`
      );
      return;
    }

    if (
      selectedGrade.quantityType === "bulk" &&
      numQuantity !== selectedGrade.totalQty
    ) {
      Alert.alert("Error", "Bulk purchase requires full quantity");
      return;
    }

    const confirmMsg =
      `Send Counter Offer?\n\n` +
      `Trader offered: ₹${selectedOffer.offeredPrice} × ${selectedOffer.quantity}\n` +
      `Your counter: ₹${numPrice} × ${numQuantity}\n\n` +
      `Total: ₹${(numPrice * numQuantity).toFixed(2)}\n\n` +
      `Send?`;

    Alert.alert("Confirm", confirmMsg, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send",
        onPress: async () => {
          try {
            const response = await fetch(
              "https://kisan.etpl.ai/product/make-counter-offer",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  productId: selectedProduct._id,
                  gradeId: selectedGrade._id,
                  offerId: selectedOffer._id,
                  counterPrice: numPrice,
                  counterQuantity: numQuantity,
                }),
              }
            );

            const data = await response.json();
            if (data.success) {
              Alert.alert("Success", "✅ Counter-offer sent to trader!");
              setShowCounterOfferModal(false);
              fetchProducts();
            } else {
              Alert.alert("Failed", data.message);
            }
          } catch (err) {
            Alert.alert("Error", "Error submitting counter-offer");
            console.error(err);
          }
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath)
      return "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://kisan.etpl.ai/${imagePath}`;
  };

  const handleViewGradeDetails = (product: Product, grade: GradePrice) => {
    setSelectedProduct(product);
    setSelectedGrade(grade);
    setViewMode("details");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedProduct(null);
    setSelectedGrade(null);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-4 text-base text-gray-500">
          Loading your products...
        </Text>
      </View>
    );
  }

  // Render Grade Details View
  if (viewMode === "details" && selectedProduct && selectedGrade) {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={handleBackToList} className="p-2">
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1 ml-2">
            <Text className="text-lg font-medium text-gray-900">
              Order Details
            </Text>
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              {selectedProduct.cropBriefDetails} - {selectedGrade.grade}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <View className="h-64 relative">
            <Image
              source={{ uri: getImageUrl(selectedProduct.cropPhotos[0]) }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-3 left-3 bg-black/70 px-3 py-1.5 rounded">
              <Text className="text-sm font-medium text-white">
                ID: {selectedProduct.productId}
              </Text>
            </View>
          </View>

          {/* Product Info */}
          <View className="p-4">
            <View className="flex-row justify-between items-start mb-3">
              <Text className="text-xl font-bold text-gray-900 flex-1">
                {selectedProduct.cropBriefDetails}
              </Text>
              <View className="bg-green-100 px-3 py-1.5 rounded-full">
                <Text className="text-green-800 text-sm font-medium">
                  {selectedProduct.farmingType}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2 mb-4">
              <View className="bg-gray-100 px-3 py-1.5 rounded">
                <Text className="text-gray-700 text-sm">
                  {selectedProduct.categoryId.categoryName}
                </Text>
              </View>
              <View className="bg-gray-100 px-3 py-1.5 rounded">
                <Text className="text-gray-700 text-sm">
                  {selectedProduct.subCategoryId.subCategoryName}
                </Text>
              </View>
            </View>

            {/* Grade Details */}
            <View className="bg-gray-50 p-4 rounded-xl mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-900">
                  {selectedGrade.grade}
                </Text>
                <View className="items-end">
                  <Text className="text-2xl font-bold text-green-600">
                    ₹{selectedGrade.pricePerUnit}
                  </Text>
                  <Text className="text-gray-500">
                    /{selectedProduct.unitMeasurement || "unit"}
                  </Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-600 mb-2">
                  Available Quantity: {selectedGrade.totalQty}{" "}
                  {selectedProduct.unitMeasurement}
                </Text>
                {selectedGrade.quantityType === "bulk" && (
                  <Text className="text-amber-600 font-medium">
                    🔒 Bulk purchase only
                  </Text>
                )}
              </View>

              {/* Quick Stats */}
              <View className="flex-row gap-4 mb-4">
                {selectedGrade.offers && selectedGrade.offers.length > 0 && (
                  <View className="bg-blue-50 px-3 py-2 rounded-lg">
                    <Text className="text-blue-700 font-medium">
                      {selectedGrade.offers.filter(o => o.status === "pending").length}{" "}
                      Pending Offers
                    </Text>
                  </View>
                )}
                {selectedGrade.purchaseHistory && selectedGrade.purchaseHistory.length > 0 && (
                  <View className="bg-green-50 px-3 py-2 rounded-lg">
                    <Text className="text-green-700 font-medium">
                      {selectedGrade.purchaseHistory.length} Sales
                    </Text>
                  </View>
                )}
              </View>

              {/* Product Info */}
              <View className="flex-row flex-wrap gap-4 pt-4 border-t border-gray-200">
                <View className="flex-row items-center">
                  <Package size={16} color="#6b7280" />
                  <Text className="text-gray-600 ml-2">
                    {selectedProduct.packageMeasurement}{" "}
                    {selectedProduct.packagingType}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Calendar size={16} color="#6b7280" />
                  <Text className="text-gray-600 ml-2">
                    {formatDate(selectedProduct.deliveryDate)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={16} color="#6b7280" />
                  <Text className="text-gray-600 ml-2">
                    {selectedProduct.deliveryTime}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MapPin size={16} color="#6b7280" />
                  <Text className="text-gray-600 ml-2">
                    {selectedProduct.nearestMarket}
                  </Text>
                </View>
              </View>
            </View>

            {/* Purchase History */}
            {selectedGrade.purchaseHistory &&
              selectedGrade.purchaseHistory.length > 0 && (
                <View className="mb-6">
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    📦 Purchase History
                  </Text>
                  {selectedGrade.purchaseHistory.map((purchase, idx) => (
                    <View
                      key={idx}
                      className="bg-green-50 p-4 rounded-xl mb-3 border border-green-100"
                    >
                      <View className="flex-row justify-between items-start mb-2">
                        <View>
                          <Text className="font-bold text-green-900">
                            {purchase.traderName}
                          </Text>
                          <Text className="text-sm text-green-800">
                            ID: {purchase.traderId}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="font-bold text-green-900">
                            ₹{purchase.totalAmount.toFixed(2)}
                          </Text>
                          <Text className="text-sm text-green-800">
                            {purchase.quantity} × ₹{purchase.pricePerUnit}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row justify-between items-center mt-2">
                        <Text className="text-sm text-green-800">
                          {new Date(purchase.purchaseDate).toLocaleString("en-IN")}
                        </Text>
                        <View
                          className={`px-3 py-1 rounded ${
                            purchase.purchaseType === "direct"
                              ? "bg-blue-100"
                              : "bg-green-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              purchase.purchaseType === "direct"
                                ? "text-blue-800"
                                : "text-green-800"
                            }`}
                          >
                            {purchase.purchaseType === "direct"
                              ? "Direct Purchase"
                              : "Offer Accepted"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

            {/* Offers Section */}
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Offers ({selectedGrade.offers?.length || 0})
            </Text>

            {/* Pending Offers */}
            {selectedGrade.offers
              ?.filter((o) => o.status === "pending")
              .map((offer) => (
                <View
                  key={offer._id}
                  className="bg-yellow-50 p-4 rounded-xl mb-4 border border-yellow-200"
                >
                  <Text className="text-lg font-bold text-amber-900 mb-3">
                    📩 Trader's Offer
                  </Text>

                  <View className="flex-row flex-wrap gap-2 mb-3">
                    <View className="bg-blue-500 px-3 py-1.5 rounded">
                      <Text className="text-white text-sm font-medium">
                        Trader ID: {offer.traderId}
                      </Text>
                    </View>
                    {offer.traderName && (
                      <View className="bg-gray-500 px-3 py-1.5 rounded">
                        <Text className="text-white text-sm font-medium">
                          {offer.traderName}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-800 mb-1">
                      <Text className="font-bold">₹{offer.offeredPrice}</Text>
                      <Text className="text-gray-600">
                        {" "}
                        × {offer.quantity}{" "}
                        {selectedProduct.unitMeasurement}
                      </Text>
                    </Text>
                    <Text className="text-sm text-gray-600 mb-1">
                      Total: ₹
                      {(offer.offeredPrice * offer.quantity).toFixed(2)}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Your price: ₹{selectedGrade.pricePerUnit} | Difference:{" "}
                      {offer.offeredPrice >= selectedGrade.pricePerUnit ? "+" : ""}₹
                      {(
                        (offer.offeredPrice - selectedGrade.pricePerUnit) *
                        offer.quantity
                      ).toFixed(2)}
                    </Text>
                  </View>

                  {selectedGrade.quantityType === "bulk" && (
                    <Text className="text-sm font-bold text-amber-900 mb-3">
                      🔒 Bulk purchase - must sell all{" "}
                      {selectedGrade.totalQty}{" "}
                      {selectedProduct.unitMeasurement}
                    </Text>
                  )}

                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className={`flex-1 py-3 px-4 rounded-md ${
                        selectedGrade.quantityType === "bulk" &&
                        offer.quantity !== selectedGrade.totalQty
                          ? "opacity-50 bg-gray-400"
                          : "bg-green-500"
                      }`}
                      onPress={() =>
                        acceptTraderOffer(
                          selectedProduct._id,
                          selectedGrade._id,
                          offer._id,
                          offer,
                          selectedProduct,
                          selectedGrade
                        )
                      }
                      disabled={
                        selectedGrade.quantityType === "bulk" &&
                        offer.quantity !== selectedGrade.totalQty
                      }
                    >
                      <Text className="text-white font-medium text-center">
                        ✓ Accept
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 py-3 px-4 rounded-md border border-green-500"
                      onPress={() =>
                        openCounterOfferModal(
                          selectedProduct,
                          selectedGrade,
                          offer
                        )
                      }
                    >
                      <Text className="text-green-500 font-medium text-center">
                        Counter
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="py-3 px-4 rounded-md bg-red-500"
                      onPress={() =>
                        rejectTraderOffer(
                          selectedProduct._id,
                          selectedGrade._id,
                          offer._id
                        )
                      }
                    >
                      <Text className="text-white font-medium">✗</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

            {/* Countered Offers */}
            {selectedGrade.offers
              ?.filter((o) => o.status === "countered")
              .map((offer) => (
                <View
                  key={offer._id}
                  className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-200"
                >
                  <Text className="text-lg font-bold text-blue-900 mb-2">
                    💬 Counter Sent
                  </Text>
                  <Text className="text-blue-900 mb-2">
                    Trader ID: {offer.traderId}
                  </Text>
                  <Text className="text-blue-900 mb-2">
                    Your counter: ₹{offer.counterPrice} ×{" "}
                    {offer.counterQuantity} = ₹
                    {(
                      offer.counterPrice! * offer.counterQuantity!
                    ).toFixed(2)}
                  </Text>
                  <View className="bg-yellow-100 px-3 py-2 rounded self-start">
                    <Text className="text-amber-900 text-sm font-medium">
                      Private - Only visible to this trader
                    </Text>
                  </View>
                </View>
              ))}

            {/* Accepted Offers */}
            {selectedGrade.offers
              ?.filter((o) => o.status === "accepted")
              .map((offer) => (
                <View
                  key={offer._id}
                  className="bg-green-50 p-4 rounded-xl mb-4 border border-green-200"
                >
                  <Text className="text-lg font-bold text-green-900 mb-2">
                    ✓ Accepted & Sold
                  </Text>
                  <Text className="text-green-900">
                    Trader ID: {offer.traderId}
                  </Text>
                  <Text className="text-green-900">
                    ₹{offer.offeredPrice} × {offer.quantity} = ₹
                    {(offer.offeredPrice * offer.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}

            {/* Rejected Offers */}
            {selectedGrade.offers
              ?.filter((o) => o.status === "rejected")
              .map((offer) => (
                <View
                  key={offer._id}
                  className="bg-red-50 p-4 rounded-xl mb-4 border border-red-200"
                >
                  <Text className="text-lg font-bold text-red-900 mb-2">
                    ✗ Rejected
                  </Text>
                  <Text className="text-red-900">
                    Trader ID: {offer.traderId}
                  </Text>
                  <Text className="text-red-900">
                    Offered: ₹{offer.offeredPrice} × {offer.quantity}
                  </Text>
                </View>
              ))}

            {(!selectedGrade.offers || selectedGrade.offers.length === 0) && (
              <View className="bg-gray-50 p-6 rounded-xl items-center">
                <Text className="text-gray-500 text-lg">No offers yet</Text>
                <Text className="text-gray-400 mt-2 text-center">
                  Your offers will appear here when traders make offers
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                className="flex-1 py-3 bg-green-500 rounded-xl"
                onPress={() =>
                  handleMakeOffer(selectedProduct, selectedGrade)
                }
              >
                <Text className="text-white font-medium text-center">
                  Make Offer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 border border-green-500 rounded-xl"
                onPress={() =>
                  handleAcceptOffer(selectedProduct, selectedGrade)
                }
              >
                <Text className="text-green-500 font-medium text-center">
                  Accept Offer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Counter Offer Modal (same as before) */}
        <Modal
          visible={showCounterOfferModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCounterOfferModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-white rounded-xl w-full max-w-[500px]">
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <Text className="text-xl font-bold text-gray-900">
                  Counter Offer
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCounterOfferModal(false)}
                >
                  <Text className="text-2xl text-gray-500">✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView className="max-h-[400px]">
                <View className="p-4">
                  <View className="bg-gray-50 p-3 rounded-lg mb-4">
                    <Text className="text-sm text-gray-600 mb-1">
                      Product: {selectedProduct?.cropBriefDetails}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-1">
                      Grade: {selectedGrade?.grade}
                    </Text>
                    <Text className="text-sm font-bold text-gray-800">
                      Trader's Offer: ₹{selectedOffer?.offeredPrice} ×{" "}
                      {selectedOffer?.quantity}
                    </Text>
                  </View>

                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Your Counter Price (₹/
                    {selectedProduct?.unitMeasurement || "unit"})
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base mb-4"
                    value={counterPrice}
                    onChangeText={setCounterPrice}
                    placeholder="Enter your counter price"
                    keyboardType="numeric"
                  />

                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Quantity ({selectedProduct?.unitMeasurement || "units"})
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base mb-4"
                    value={counterQuantity}
                    onChangeText={setCounterQuantity}
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                  />

                  {counterPrice && counterQuantity && (
                    <View className="bg-green-50 p-4 rounded-lg mt-2">
                      <Text className="text-sm text-gray-600 mb-1">
                        Total Counter Amount
                      </Text>
                      <Text className="text-2xl font-bold text-green-600">
                        ₹
                        {(
                          parseFloat(counterPrice) *
                          parseFloat(counterQuantity)
                        ).toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
              <View className="flex-row gap-3 p-4 border-t border-gray-200">
                <TouchableOpacity
                  className="flex-1 py-3 px-4 rounded-lg bg-gray-500"
                  onPress={() => setShowCounterOfferModal(false)}
                >
                  <Text className="text-white font-medium text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 px-4 rounded-lg bg-green-500"
                  onPress={submitCounterOffer}
                >
                  <Text className="text-white font-medium text-center">
                    Send Counter Offer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Render Main List View
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.push("/(farmer)/home")}
          className="p-2"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="ml-3 text-xl font-medium text-gray-900">My Order</Text>
      </View>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#22c55e"]}
          />
        }
      >
        {error && (
          <View className="m-4 p-4 bg-red-50 rounded-lg border-l-4 border-l-red-600">
            <Text className="font-bold text-red-800 mb-1">Error:</Text>
            <Text className="text-red-900 text-sm">{error}</Text>
          </View>
        )}

        <View className="p-4">
          {products.map((product) => (
            <View
              key={product._id}
              className="bg-white rounded-xl mb-6 border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Product Image */}
              <View className="h-56 relative">
                <Image
                  source={{ uri: getImageUrl(product.cropPhotos[0]) }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute bottom-3 left-3 bg-black/70 px-3 py-1.5 rounded">
                  <Text className="text-sm font-medium text-white">
                    ID: {product.productId}
                  </Text>
                </View>
                <View className="absolute top-3 right-3 bg-green-100 px-3 py-1.5 rounded-full">
                  <Text className="text-green-800 text-sm font-medium">
                    {product.farmingType}
                  </Text>
                </View>
              </View>

              {/* Product Details */}
              <View className="p-4">
                <Text className="text-xl font-bold text-gray-900 mb-2">
                  {product.cropBriefDetails}
                </Text>

                <View className="flex-row flex-wrap gap-2 mb-4">
                  <View className="bg-gray-100 px-3 py-1.5 rounded">
                    <Text className="text-gray-700 text-sm">
                      {product.categoryId.categoryName}
                    </Text>
                  </View>
                  <View className="bg-gray-100 px-3 py-1.5 rounded">
                    <Text className="text-gray-700 text-sm">
                      {product.subCategoryId.subCategoryName}
                    </Text>
                  </View>
                </View>

                {/* Grades Summary */}
                <View className="mb-4">
                  <Text className="text-lg font-bold text-gray-900 mb-3">
                    Available Grades ({product.gradePrices.length})
                  </Text>

                  {product.gradePrices.slice(0, 2).map((grade) => (
                    <View
                      key={grade._id}
                      className="border border-gray-200 rounded-lg p-4 mb-3"
                    >
                      <View className="flex-row justify-between items-center mb-3">
                        <Text className="font-bold text-gray-900">
                          {grade.grade}
                        </Text>
                        <View className="items-end">
                          <Text className="text-xl font-bold text-green-600">
                            ₹{grade.pricePerUnit}
                          </Text>
                          <Text className="text-gray-500 text-sm">
                            /{product.unitMeasurement}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-gray-600 mb-2">
                        Available: {grade.totalQty} {product.unitMeasurement}
                      </Text>

                      {/* Quick Stats */}
                      <View className="flex-row gap-3 mb-4">
                        {grade.offers && grade.offers.length > 0 && (
                          <View className="bg-blue-50 px-2 py-1 rounded">
                            <Text className="text-blue-700 text-xs font-medium">
                              {grade.offers.filter(o => o.status === "pending").length} Pending
                            </Text>
                          </View>
                        )}
                        {grade.purchaseHistory && grade.purchaseHistory.length > 0 && (
                          <View className="bg-green-50 px-2 py-1 rounded">
                            <Text className="text-green-700 text-xs font-medium">
                              {grade.purchaseHistory.length} Sold
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* View Details Button */}
                      <TouchableOpacity
                        className="flex-row items-center justify-center py-2.5 border border-green-500 rounded-lg"
                        onPress={() => handleViewGradeDetails(product, grade)}
                      >
                        <Text className="text-green-500 font-medium mr-2">
                          View Details
                        </Text>
                        <ExternalLink size={16} color="#22c55e" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Show More Grades Button */}
                  {product.gradePrices.length > 2 && (
                    <View className="mt-2">
                      <Text className="text-gray-500 text-sm mb-2">
                        + {product.gradePrices.length - 2} more grades available
                      </Text>
                      <TouchableOpacity
                        className="flex-row items-center justify-center py-3 bg-gray-50 rounded-lg"
                        onPress={() => {
                          // Show first grade details if user clicks "View More"
                          handleViewGradeDetails(product, product.gradePrices[0]);
                        }}
                      >
                        <Text className="text-gray-600 font-medium">
                          View All Grades
                        </Text>
                        <ChevronRight size={16} color="#6b7280" className="ml-2" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Quick Action Buttons */}
                <View className="pt-4 border-t border-gray-200">
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className="flex-1 py-3 bg-green-500 rounded-lg"
                      onPress={() => {
                        if (product.gradePrices.length > 0) {
                          handleMakeOffer(product, product.gradePrices[0]);
                        }
                      }}
                    >
                      <Text className="text-white font-medium text-center">
                        Make Offer
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 py-3 border border-green-500 rounded-lg"
                      onPress={() => {
                        if (product.gradePrices.length > 0) {
                          handleAcceptOffer(product, product.gradePrices[0]);
                        }
                      }}
                    >
                      <Text className="text-green-500 font-medium text-center">
                        Accept Offer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {products.length === 0 && !loading && (
          <View className="py-20 items-center">
            <Text className="text-lg text-gray-500 mb-2">
              No products listed yet.
            </Text>
            <Text className="text-gray-400 text-center px-8">
              Start listing your products to see offers from traders
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Direct Offer Modal */}
      <Modal
        visible={showDirectOfferModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDirectOfferModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl w-11/12 max-w-[500px] max-h-4/5">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">
                Make an Offer
              </Text>
              <TouchableOpacity
                onPress={() => setShowDirectOfferModal(false)}
              >
                <Text className="text-2xl text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>
            <View className="p-4">
              <Text className="text-base text-gray-500 mb-1">
                {selectedProduct?.cropBriefDetails}
              </Text>
              <Text className="text-sm text-gray-500 mb-4">
                Grade: {selectedGrade?.grade}
              </Text>

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Price per {selectedProduct?.unitMeasurement || "unit"} (₹)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-base mb-4"
                value={directOfferPrice}
                onChangeText={setDirectOfferPrice}
                placeholder="Enter your offer price"
                keyboardType="numeric"
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Quantity ({selectedProduct?.unitMeasurement || "units"})
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-base mb-4"
                value={directOfferQuantity}
                onChangeText={setDirectOfferQuantity}
                placeholder="Enter quantity"
                keyboardType="numeric"
              />

              {directOfferPrice && directOfferQuantity && (
                <View className="bg-gray-50 p-4 rounded-lg mt-2">
                  <Text className="text-xs text-gray-500 mb-1">
                    Total Amount
                  </Text>
                  <Text className="text-2xl font-bold text-green-500">
                    ₹
                    {(
                      parseFloat(directOfferPrice) *
                      parseFloat(directOfferQuantity)
                    ).toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-row gap-3 p-4 border-t border-gray-200">
              <TouchableOpacity
                className="flex-1 py-2.5 px-4 rounded-md bg-gray-500"
                onPress={() => setShowDirectOfferModal(false)}
              >
                <Text className="text-white font-medium text-sm text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-2.5 px-4 rounded-md bg-green-500"
                onPress={submitDirectOffer}
              >
                <Text className="text-white font-medium text-sm text-center">
                  Submit Offer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Counter Offer Modal (for list view) */}
      <Modal
        visible={showCounterOfferModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCounterOfferModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl w-11/12 max-w-[500px] max-h-4/5">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">
                Counter Offer
              </Text>
              <TouchableOpacity
                onPress={() => setShowCounterOfferModal(false)}
              >
                <Text className="text-2xl text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>
            <View className="p-4">
              <View className="bg-gray-50 p-3 rounded-lg mb-4">
                <Text className="text-xs text-gray-500 mb-1">
                  Product: {selectedProduct?.cropBriefDetails}
                </Text>
                <Text className="text-xs text-gray-500 mb-1">
                  Grade: {selectedGrade?.grade}
                </Text>
                <Text className="text-xs text-gray-500 font-bold">
                  Trader's Offer: ₹{selectedOffer?.offeredPrice} ×{" "}
                  {selectedOffer?.quantity}
                </Text>
              </View>

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Your Counter Price (₹/
                {selectedProduct?.unitMeasurement || "unit"})
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-base mb-4"
                value={counterPrice}
                onChangeText={setCounterPrice}
                placeholder="Enter your counter price"
                keyboardType="numeric"
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Quantity ({selectedProduct?.unitMeasurement || "units"})
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-base mb-4"
                value={counterQuantity}
                onChangeText={setCounterQuantity}
                placeholder="Enter quantity"
                keyboardType="numeric"
              />

              {counterPrice && counterQuantity && (
                <View className="bg-green-100 p-4 rounded-lg mt-2">
                  <Text className="text-xs text-gray-500 mb-1">
                    Total Counter Amount
                  </Text>
                  <Text className="text-2xl font-bold text-green-500">
                    ₹
                    {(
                      parseFloat(counterPrice) * parseFloat(counterQuantity)
                    ).toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-row gap-3 p-4 border-t border-gray-200">
              <TouchableOpacity
                className="flex-1 py-2.5 px-4 rounded-md bg-gray-500"
                onPress={() => setShowCounterOfferModal(false)}
              >
                <Text className="text-white font-medium text-sm text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-2.5 px-4 rounded-md bg-green-500"
                onPress={submitCounterOffer}
              >
                <Text className="text-white font-medium text-sm text-center">
                  Send Counter Offer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FarmerOrder;