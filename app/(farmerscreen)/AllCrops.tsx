// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   Bell,
//   Calendar,
//   Check,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   MapPin,
//   MessageCircle,
//   Package,
//   ShoppingBag,
//   TrendingUp,
//   X
// } from 'lucide-react-native';
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
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter,router } from "expo-router";

// const { width } = Dimensions.get('window');

// interface Offer {
//   _id: string;
//   offerId: string;
//   traderId: string;
//   traderName?: string;
//   offeredPrice: number;
//   quantity: number;
//   status: 'pending' | 'accepted' | 'rejected' | 'countered';
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
//   purchaseType: 'direct' | 'offer_accepted';
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

// const FarmerProducts = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [unreadCount, setUnreadCount] = useState(0);
  
//   // Modal states
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [selectedGrade, setSelectedGrade] = useState<GradePrice | null>(null);
//   const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
//   const [showGradeModal, setShowGradeModal] = useState(false);
//   const [showOffersModal, setShowOffersModal] = useState(false);
//   const [showCounterModal, setShowCounterModal] = useState(false);
//   const [showDirectOfferModal, setShowDirectOfferModal] = useState(false);
//   const [showPurchaseHistoryModal, setShowPurchaseHistoryModal] = useState(false);
  
//   // Form states
//   const [counterPrice, setCounterPrice] = useState('');
//   const [counterQuantity, setCounterQuantity] = useState('');
//   const [directOfferPrice, setDirectOfferPrice] = useState('');
//   const [directOfferQuantity, setDirectOfferQuantity] = useState('');

//   useEffect(() => {
//     fetchProducts();
//     fetchUnreadCount();
//     const interval = setInterval(fetchUnreadCount, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchUnreadCount = async () => {
//     try {
//       const farmerId = await AsyncStorage.getItem('farmerId');
//       if (!farmerId) return;

//       const response = await fetch(`https://kisan.etpl.ai/product/farmer-notifications/${farmerId}`);
//       const data = await response.json();
      
//       if (data.success) {
//         setUnreadCount(data.unreadCount);
//       }
//     } catch (err) {
//       console.error('Error fetching unread count:', err);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const farmerId = await AsyncStorage.getItem('farmerId');
//       console.log(farmerId);
//       if (!farmerId) {
//         throw new Error('Farmer not logged in');
//       }

//       const response = await fetch(`https://kisan.etpl.ai/product/by-farmer/${farmerId}`);
//       if (!response.ok) throw new Error('Failed to fetch products');

//       const data = await response.json();
//       setProducts(data.data || []);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || 'An error occurred');
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

//   const handleAcceptOffer = (product: Product, grade: GradePrice) => {
//     Alert.prompt(
//       'Accept Offer',
//       `Enter quantity to sell (Max: ${grade.totalQty} ${product.unitMeasurement})`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Accept',
//           onPress: (quantity) => {
//             if (quantity) {
//               Alert.alert(
//                 'Offer Accepted',
//                 `✅ Accepting to sell ${quantity} ${product.unitMeasurement} of ${grade.grade} at ₹${grade.pricePerUnit}/${product.unitMeasurement}\n\nTotal: ₹${(grade.pricePerUnit * Number(quantity)).toFixed(2)}\n\nThis will be available for traders to purchase.`
//               );
//             }
//           },
//         },
//       ],
//       'plain-text'
//     );
//   };

//   const handleMakeOffer = (product: Product, grade: GradePrice) => {
//     setSelectedProduct(product);
//     setSelectedGrade(grade);
//     setDirectOfferPrice(grade.pricePerUnit.toString());
//     setDirectOfferQuantity('');
//     setShowDirectOfferModal(true);
//   };

//   const submitDirectOffer = () => {
//     if (!directOfferPrice || !directOfferQuantity) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     Alert.alert(
//       'Offer Created',
//       `✅ Offer Created!\n\nProduct: ${selectedProduct?.cropBriefDetails}\nGrade: ${selectedGrade?.grade}\nPrice: ₹${directOfferPrice}/${selectedProduct?.unitMeasurement}\nQuantity: ${directOfferQuantity} ${selectedProduct?.unitMeasurement}\n\nThis offer will be visible to all traders.`
//     );

//     setShowDirectOfferModal(false);
//     setDirectOfferPrice('');
//     setDirectOfferQuantity('');
//   };

//   const acceptTraderOffer = async (
//     productId: string,
//     gradeId: string,
//     offerId: string,
//     offer: Offer,
//     product: Product,
//     grade: GradePrice
//   ) => {
//     if (grade.quantityType === 'bulk' && offer.quantity !== grade.totalQty) {
//       Alert.alert('Warning', '⚠️ This is a bulk purchase. The trader must buy the full quantity.');
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
//       `Remaining after sale: ${grade.totalQty - offer.quantity} ${product.unitMeasurement}\n\n` +
//       `Proceed?`;

//     Alert.alert('Confirm', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Accept',
//         onPress: async () => {
//           try {
//             const response = await fetch('https://kisan.etpl.ai/product/accept-trader-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ productId, gradeId, offerId }),
//             });

//             const data = await response.json();
//             if (data.success) {
//               const statusMsg =
//                 data.data.remainingQty === 0
//                   ? '🎉 Grade SOLD OUT!'
//                   : `✅ Sale Confirmed! ${data.data.remainingQty} ${product.unitMeasurement} remaining.`;

//               Alert.alert(
//                 'Success',
//                 `${statusMsg}\n\nTotal Amount: ₹${data.data.totalAmount.toFixed(2)}\n\nTrader has been notified and can proceed to payment.`
//               );
//               setShowOffersModal(false);
//               fetchProducts();
//             } else {
//               Alert.alert('Failed', data.message);
//             }
//           } catch (err) {
//             Alert.alert('Error', 'Error accepting offer');
//             console.error(err);
//           }
//         },
//       },
//     ]);
//   };

//   const rejectTraderOffer = async (productId: string, gradeId: string, offerId: string) => {
//     Alert.alert('Confirm', 'Reject this offer?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Reject',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             const response = await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ productId, gradeId, offerId }),
//             });

//             const data = await response.json();
//             if (data.success) {
//               Alert.alert('Success', 'Offer rejected');
//               setShowOffersModal(false);
//               fetchProducts();
//             }
//           } catch (err) {
//             Alert.alert('Error', 'Error rejecting offer');
//           }
//         },
//       },
//     ]);
//   };

//   const openCounterOfferModal = (product: Product, grade: GradePrice, offer: Offer) => {
//     setSelectedProduct(product);
//     setSelectedGrade(grade);
//     setSelectedOffer(offer);
//     setCounterPrice(offer.offeredPrice.toString());
//     setCounterQuantity(offer.quantity.toString());
//     setShowOffersModal(false);
//     setShowCounterModal(true);
//   };

//   const submitCounterOffer = async () => {
//     if (!counterPrice || !counterQuantity) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     if (!selectedProduct || !selectedGrade || !selectedOffer) return;

//     const numPrice = Number(counterPrice);
//     const numQuantity = Number(counterQuantity);

//     if (numQuantity > selectedGrade.totalQty) {
//       Alert.alert('Error', `Maximum available: ${selectedGrade.totalQty} ${selectedProduct.unitMeasurement}`);
//       return;
//     }

//     if (selectedGrade.quantityType === 'bulk' && numQuantity !== selectedGrade.totalQty) {
//       Alert.alert('Error', 'Bulk purchase requires full quantity');
//       return;
//     }

//     const confirmMsg =
//       `Send Counter Offer?\n\n` +
//       `Trader offered: ₹${selectedOffer.offeredPrice} × ${selectedOffer.quantity}\n` +
//       `Your counter: ₹${numPrice} × ${numQuantity}\n\n` +
//       `Total: ₹${(numPrice * numQuantity).toFixed(2)}\n\n` +
//       `Send?`;

//     Alert.alert('Confirm', confirmMsg, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Send',
//         onPress: async () => {
//           try {
//             const response = await fetch('https://kisan.etpl.ai/product/make-counter-offer', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 productId: selectedProduct._id,
//                 gradeId: selectedGrade._id,
//                 offerId: selectedOffer._id,
//                 counterPrice: numPrice,
//                 counterQuantity: numQuantity,
//               }),
//             });

//             const data = await response.json();
//             if (data.success) {
//               Alert.alert('Success', '✅ Counter-offer sent to trader!');
//               setShowCounterModal(false);
//               setCounterPrice('');
//               setCounterQuantity('');
//               fetchProducts();
//             } else {
//               Alert.alert('Failed', data.message);
//             }
//           } catch (err) {
//             Alert.alert('Error', 'Error submitting counter-offer');
//             console.error(err);
//           }
//         },
//       },
//     ]);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
//     if (imagePath.startsWith('http')) return imagePath;
//     return `https://kisan.etpl.ai/${imagePath}`;
//   };

//   const openGradeModal = (product: Product) => {
//     setSelectedProduct(product);
//     setShowGradeModal(true);
//   };

//   const openOffersModal = (product: Product, grade: GradePrice) => {
//     setSelectedProduct(product);
//     setSelectedGrade(grade);
//     setShowGradeModal(false);
//     setShowOffersModal(true);
//   };

//   const openPurchaseHistoryModal = (product: Product, grade: GradePrice) => {
//     setSelectedProduct(product);
//     setSelectedGrade(grade);
//     setShowGradeModal(false);
//     setShowPurchaseHistoryModal(true);
//   };

//   if (loading && !refreshing) {
//     return (
//       <SafeAreaView className="flex-1 bg-white">
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#16a34a" />
//           <Text className="mt-4 text-gray-500 text-base">
//             Loading your products...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
//         <View className="flex-row items-center">
//           <TouchableOpacity
//             onPress={() => router.back()}
//             className="p-2 mr-2"
//           >
//             <ChevronLeft size={24} color="#374151" />
//           </TouchableOpacity>
//           <View>
//             <Text className="text-xl font-medium text-gray-900">
//               My Products
//             </Text>
//             <Text className="text-sm text-gray-500 mt-0.5">
//               {products.length} products listed
//             </Text>
//           </View>
//         </View>

//         <View className="flex-row gap-2">
//           <TouchableOpacity
//             onPress={() => {/* Navigate to notifications */}}
//             className="bg-amber-100 px-3 py-2 rounded-lg flex-row items-center relative"
//           >
//             <Bell size={18} color="#f59e0b" />
//             {unreadCount > 0 && (
//               <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 justify-center items-center px-1">
//                 <Text className="text-white text-[10px] font-medium">
//                   {unreadCount}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => {/* Navigate to orders */}}
//             className="bg-blue-500 px-3 py-2 rounded-lg flex-row items-center"
//           >
//             <Package size={18} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Error Message */}
//       {error && (
//         <View className="m-4 p-4 bg-red-50 rounded-xl border border-red-200">
//           <View className="flex-row items-start">
//             <View className="bg-red-200 p-2 rounded-lg mr-3">
//               <X size={20} color="#dc2626" />
//             </View>
//             <View className="flex-1">
//               <Text className="font-medium text-red-900 mb-1">
//                 Error
//               </Text>
//               <Text className="text-red-700 text-sm">
//                 {error}
//               </Text>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Products List */}
//       <ScrollView
//         className="flex-1"
//         contentContainerClassName="p-4"
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#16a34a"
//           />
//         }
//       >
//         {products.map((product) => {
//           const pendingOffersCount = product.gradePrices.reduce(
//             (sum, grade) => sum + (grade.offers?.filter(o => o.status === 'pending').length || 0),
//             0
//           );
//           const totalSalesCount = product.gradePrices.reduce(
//             (sum, grade) => sum + (grade.purchaseHistory?.length || 0),
//             0
//           );

//           return (
//             <View
//               key={product._id}
//               className="bg-white rounded-lg mb-4 overflow-hidden border border-gray-200 p-3"
//             >
//               {/* Product Image */}
//               <View className="relative">
//                 <Image
//                   source={{ uri: getImageUrl(product.cropPhotos[0]) }}
//                   className="w-full h-[200px] rounded-xl"
//                   resizeMode="cover"
//                 />
                

//                 <View className="absolute bottom-3 left-3 bg-black/70 px-2.5 py-1 rounded-md">
//                   <Text className="text-white text-[11px] font-medium">
//                     ID: {product.productId}
//                   </Text>
//                 </View>
//               </View>

//               {/* Product Details */}
//               <View className="p-4">
//                 <View className="mb-3">
//                   <Text className="text-lg font-medium text-gray-900 mb-1.5">
//                     {product.cropBriefDetails}
//                   </Text>
//                   <View className="flex-row flex-wrap gap-2">
//                     <View className="bg-gray-100 px-2.5 py-1 rounded-md">
//                       <Text className="text-xs text-gray-700 font-medium">
//                         {product.categoryId.categoryName}
//                       </Text>
//                     </View>
//                     <View className="bg-gray-100 px-2.5 py-1 rounded-md">
//                       <Text className="text-xs text-gray-700 font-medium">
//                         {product.subCategoryId.subCategoryName}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>

//                 {/* Stats Cards */}
//                 <View className="flex-row gap-2 mb-3">
//                   <View className="flex-1 bg-amber-100 p-3 rounded-lg items-center">
//                     <Text className="text-2xl font-medium text-amber-500">
//                       {pendingOffersCount}
//                     </Text>
//                     <Text className="text-[11px] text-amber-900 mt-0.5">
//                       Pending Offers
//                     </Text>
//                   </View>
//                   <View className="flex-1 bg-green-100 p-3 rounded-lg items-center">
//                     <Text className="text-2xl font-medium text-green-600">
//                       {totalSalesCount}
//                     </Text>
//                     <Text className="text-[11px] text-green-900 mt-0.5">
//                       Total Sales
//                     </Text>
//                   </View>
//                   <View className="flex-1 bg-blue-100 p-3 rounded-lg items-center">
//                     <Text className="text-2xl font-medium text-blue-600">
//                       {product.gradePrices.length}
//                     </Text>
//                     <Text className="text-[11px] text-blue-900 mt-0.5">
//                       Grades
//                     </Text>
//                   </View>
//                 </View>

//                 {/* View All Grades Button */}
//                 <TouchableOpacity
//                   onPress={() => openGradeModal(product)}
//                   className="bg-green-600 py-3.5 rounded-xl flex-row justify-center items-center mb-3"
//                 >
//                   <Text className="text-white font-medium text-[15px] mr-2">
//                     View All Grades & Offers
//                   </Text>
//                   <ChevronRight size={18} color="#fff" />
//                 </TouchableOpacity>

//                 {/* Product Info */}
//                 <View className="gap-2 flex-row justify-between flex-wrap border-t border-gray-200 ">
//                   <View className="flex-row items-center pt-3">
//                     <Package size={16} color="#6b7280" />
//                     <Text className="text-[13px] text-gray-500 ml-2">
//                       {product.packageMeasurement} {product.packagingType}
//                     </Text>
//                   </View>
//                   <View className="flex-row items-center">
//                     <Calendar size={16} color="#6b7280" />
//                     <Text className="text-[13px] text-gray-500 ml-2">
//                       {formatDate(product.deliveryDate)}
//                     </Text>
//                   </View>
//                   <View className="flex-row items-center">
//                     <Clock size={16} color="#6b7280" />
//                     <Text className="text-[13px] text-gray-500 ml-2">
//                       {product.deliveryTime}
//                     </Text>
//                   </View>
//                   <View className="flex-row items-center">
//                     <MapPin size={16} color="#6b7280" />
//                     <Text className="text-[13px] text-gray-500 ml-2">
//                       {product.nearestMarket}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           );
//         })}

//         {products.length === 0 && !loading && (
//           <View className="py-16 items-center">
//             <View className="bg-gray-100 p-8 rounded-3xl items-center">
//               <Package size={48} color="#9ca3af" />
//               <Text className="text-lg font-medium text-gray-500 mt-4">
//                 No products listed yet
//               </Text>
//               <Text className="text-sm text-gray-400 mt-2 text-center">
//                 Start by adding your first product to see it here
//               </Text>
//             </View>
//           </View>
//         )}
//       </ScrollView>

//       {/* All Grades Modal */}
//       <Modal
//         visible={showGradeModal}
//         animationType="slide"
//         presentationStyle="pageSheet"
//       >
//         <SafeAreaView className="flex-1 bg-white">
//           <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
//             <TouchableOpacity
//               onPress={() => setShowGradeModal(false)}
//               className="p-2"
//             >
//               <ChevronLeft size={24} color="#374151" />
//             </TouchableOpacity>
//             <View className="ml-3 flex-1">
//               <Text className="text-xl font-medium text-gray-900">
//                 All Grades
//               </Text>
//               <Text className="text-sm text-gray-500 mt-0.5">
//                 {selectedProduct?.cropBriefDetails}
//               </Text>
//             </View>
//           </View>

//           <ScrollView className="flex-1" contentContainerClassName="p-4">
//             {selectedProduct?.gradePrices.map((grade) => (
//               <View
//                 key={grade._id}
//                 className="bg-white border-2 border-gray-200 rounded-2xl p-4 mb-4"
//               >
//                 {/* Grade Header */}
//                 <View className="flex-row justify-between items-start mb-3">
//                   <View className="flex-1">
//                     <Text className="text-lg font-medium text-gray-900">
//                       {grade.grade} Grade
//                     </Text>
//                     <View className="flex-row items-center mt-2 gap-2">
//                       <View className="bg-green-100 px-2 py-1 rounded-md">
//                         <Text className="text-[11px] font-medium text-green-900">
//                           {grade.totalQty} {selectedProduct.unitMeasurement} available
//                         </Text>
//                       </View>
//                       {grade.quantityType === 'bulk' && (
//                         <View className="bg-blue-100 px-2 py-1 rounded-md">
//                           <Text className="text-[11px] font-medium text-blue-900">
//                             Bulk Only
//                           </Text>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                   <View className="items-end">
//                     <Text className="text-[28px] font-medium text-green-600">
//                       ₹{grade.pricePerUnit}
//                     </Text>
//                     <Text className="text-xs text-gray-500">
//                       /{selectedProduct.unitMeasurement}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Purchase History Summary */}
//                 {grade.purchaseHistory && grade.purchaseHistory.length > 0 && (
//                   <View className="mb-3">
//                     <View className="flex-row items-center justify-between mb-2">
//                       <View className="flex-row items-center">
//                         <ShoppingBag size={16} color="#16a34a" />
//                         <Text className="text-[15px] font-medium text-gray-900 ml-2">
//                           Recent Sales
//                         </Text>
//                       </View>
//                       <TouchableOpacity
//                         onPress={() => openPurchaseHistoryModal(selectedProduct, grade)}
//                       >
//                         <Text className="text-[13px] text-blue-600 font-medium">
//                           View All ({grade.purchaseHistory.length})
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                     {grade.purchaseHistory.slice(0, 2).map((purchase, idx) => (
//                       <View
//                         key={idx}
//                         className="bg-green-50 p-3 rounded-xl border border-green-200 mb-2"
//                       >
//                         <View className="flex-row justify-between items-center">
//                           <View className="flex-1">
//                             <Text className="text-sm font-medium text-gray-900">
//                               {purchase.traderName}
//                             </Text>
//                             <Text className="text-[11px] text-gray-500 mt-0.5">
//                               {new Date(purchase.purchaseDate).toLocaleDateString('en-IN')}
//                             </Text>
//                           </View>
//                           <View className="items-end">
//                             <Text className="text-base font-medium text-green-600">
//                               ₹{purchase.totalAmount.toLocaleString('en-IN')}
//                             </Text>
//                             <Text className="text-[11px] text-gray-500">
//                               {purchase.quantity} × ₹{purchase.pricePerUnit}
//                             </Text>
//                           </View>
//                         </View>
//                       </View>
//                     ))}
//                   </View>
//                 )}

//                 {/* Action Buttons */}
//                 <View className="mb-3 gap-2">
//                   <TouchableOpacity
//                     className={`flex-row items-center justify-center py-3.5 rounded-xl ${
//                       grade.totalQty === 0 ? 'bg-gray-200' : 'bg-green-600'
//                     }`}
//                     onPress={() => handleAcceptOffer(selectedProduct, grade)}
//                     disabled={grade.totalQty === 0}
//                   >
//                     <Check size={18} color={grade.totalQty === 0 ? '#9ca3af' : '#fff'} />
//                     <Text className={`ml-2 font-medium text-[15px] ${
//                       grade.totalQty === 0 ? 'text-gray-400' : 'text-white'
//                     }`}>
//                       Accept Offer
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     className={`flex-row items-center justify-center py-3.5 rounded-xl border-2 ${
//                       grade.totalQty === 0
//                         ? 'border-gray-200 bg-gray-50'
//                         : 'border-green-600 bg-white'
//                     }`}
//                     onPress={() => handleMakeOffer(selectedProduct, grade)}
//                     disabled={grade.totalQty === 0}
//                   >
//                     <TrendingUp size={18} color={grade.totalQty === 0 ? '#9ca3af' : '#16a34a'} />
//                     <Text className={`ml-2 font-medium text-[15px] ${
//                       grade.totalQty === 0 ? 'text-gray-400' : 'text-green-600'
//                     }`}>
//                       Make Offer
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Offers Summary */}
//                 {grade.offers && grade.offers.length > 0 && (
//                   <View className="pt-3 border-t border-gray-200">
//                     <TouchableOpacity
//                       onPress={() => openOffersModal(selectedProduct, grade)}
//                       className="flex-row justify-between items-center p-3 bg-amber-100 rounded-xl"
//                     >
//                       <View>
//                         <Text className="text-[15px] font-medium text-gray-900">
//                           View All Offers
//                         </Text>
//                         <Text className="text-xs text-gray-500 mt-0.5">
//                           {grade.offers.filter(o => o.status === 'pending').length} pending offers
//                         </Text>
//                       </View>
//                       <ChevronRight size={20} color="#374151" />
//                     </TouchableOpacity>
//                   </View>
//                 )}

//                 {/* Quick Stats */}
//                 <View className="mt-3 pt-3 border-t border-gray-200">
//                   <View className="flex-row justify-around">
//                     <View className="items-center">
//                       <Text className="text-xs text-gray-500 mb-1">Offers</Text>
//                       <Text className="text-xl font-medium text-gray-900">
//                         {grade.offers?.length || 0}
//                       </Text>
//                     </View>
//                     <View className="items-center">
//                       <Text className="text-xs text-gray-500 mb-1">Sold</Text>
//                       <Text className="text-xl font-medium text-gray-900">
//                         {grade.purchaseHistory?.length || 0}
//                       </Text>
//                     </View>
//                     <View className="items-center">
//                       <Text className="text-xs text-gray-500 mb-1">Available</Text>
//                       <Text className="text-xl font-medium text-gray-900">
//                         {grade.totalQty}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>

//       {/* Offers Modal */}
//       <Modal
//         visible={showOffersModal}
//         animationType="slide"
//         presentationStyle="pageSheet"
//       >
//         <SafeAreaView className="flex-1 bg-white">
//           <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
//             <TouchableOpacity
//               onPress={() => setShowOffersModal(false)}
//               className="p-2"
//             >
//               <ChevronLeft size={24} color="#374151" />
//             </TouchableOpacity>
//             <View className="ml-3 flex-1">
//               <Text className="text-xl font-medium text-gray-900">
//                 All Offers
//               </Text>
//               <Text className="text-sm text-gray-500 mt-0.5">
//                 {selectedGrade?.grade} Grade
//               </Text>
//             </View>
//           </View>

//           <ScrollView className="flex-1" contentContainerClassName="p-4">
//             {selectedGrade?.offers && selectedGrade.offers.length > 0 ? (
//               selectedGrade.offers.map((offer) => (
//                 <View
//                   key={offer._id}
//                   className={`bg-white border-2 rounded-2xl p-4 mb-3 ${
//                     offer.status === 'pending' ? 'border-yellow-300' :
//                     offer.status === 'accepted' ? 'border-green-300' :
//                     offer.status === 'rejected' ? 'border-red-300' :
//                     'border-blue-300'
//                   }`}
//                 >
//                   <View className="flex-row justify-between items-start mb-3">
//                     <View className="flex-1">
//                       <Text className="text-[15px] font-medium text-gray-900">
//                         {offer.traderName || `Trader ${offer.traderId.substring(0, 8)}...`}
//                       </Text>
//                       <Text className="text-xs text-gray-500 mt-1">
//                         {new Date(offer.createdAt).toLocaleDateString('en-IN')}
//                       </Text>
//                     </View>
//                     <View className={`px-2.5 py-1 rounded-xl ${
//                       offer.status === 'pending' ? 'bg-amber-100' :
//                       offer.status === 'accepted' ? 'bg-green-100' :
//                       offer.status === 'rejected' ? 'bg-red-50' :
//                       'bg-blue-100'
//                     }`}>
//                       <Text className={`text-[11px] font-medium ${
//                         offer.status === 'pending' ? 'text-amber-900' :
//                         offer.status === 'accepted' ? 'text-green-900' :
//                         offer.status === 'rejected' ? 'text-red-900' :
//                         'text-blue-900'
//                       }`}>
//                         {offer.status.toUpperCase()}
//                       </Text>
//                     </View>
//                   </View>

//                   <View className="bg-gray-50 p-3 rounded-xl mb-3">
//                     <View className="flex-row justify-between mb-2">
//                       <Text className="text-[13px] text-gray-500">Offered Price:</Text>
//                       <Text className="text-[15px] font-medium text-gray-900">
//                         ₹{offer.offeredPrice}/{selectedProduct?.unitMeasurement}
//                       </Text>
//                     </View>
//                     <View className="flex-row justify-between mb-2">
//                       <Text className="text-[13px] text-gray-500">Quantity:</Text>
//                       <Text className="text-[15px] font-medium text-gray-900">
//                         {offer.quantity} {selectedProduct?.unitMeasurement}
//                       </Text>
//                     </View>
//                     <View className="flex-row justify-between pt-2 border-t border-gray-200">
//                       <Text className="text-sm font-medium text-gray-900">
//                         Total Amount:
//                       </Text>
//                       <Text className="text-lg font-medium text-green-600">
//                         ₹{(offer.offeredPrice * offer.quantity).toLocaleString('en-IN')}
//                       </Text>
//                     </View>
//                   </View>

//                   {offer.status === 'pending' && selectedProduct && selectedGrade && (
//                     <View className="flex-row gap-2">
//                       <TouchableOpacity
//                         className="flex-1 flex-row items-center justify-center py-3 bg-green-600 rounded-xl"
//                         onPress={() => acceptTraderOffer(
//                           selectedProduct._id,
//                           selectedGrade._id,
//                           offer._id,
//                           offer,
//                           selectedProduct,
//                           selectedGrade
//                         )}
//                       >
//                         <Check size={16} color="#fff" />
//                         <Text className="ml-1.5 font-medium text-white">
//                           Accept
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         className="flex-1 flex-row items-center justify-center py-3 bg-blue-500 rounded-xl"
//                         onPress={() => openCounterOfferModal(selectedProduct, selectedGrade, offer)}
//                       >
//                         <TrendingUp size={16} color="#fff" />
//                         <Text className="ml-1.5 font-medium text-white">
//                           Counter
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         className="flex-1 flex-row items-center justify-center py-3 bg-red-500 rounded-xl"
//                         onPress={() => rejectTraderOffer(
//                           selectedProduct._id,
//                           selectedGrade._id,
//                           offer._id
//                         )}
//                       >
//                         <X size={16} color="#fff" />
//                         <Text className="ml-1.5 font-medium text-white">
//                           Reject
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   )}

//                   {offer.status === 'countered' && (
//                     <View className="bg-blue-100 p-3 rounded-xl">
//                       <Text className="text-sm font-medium text-blue-950 mb-1.5">
//                         Your Counter Offer
//                       </Text>
//                       <View className="flex-row justify-between">
//                         <Text className="text-xs text-blue-700">
//                           ₹{offer.counterPrice} × {offer.counterQuantity} = ₹{((offer.counterPrice || 0) * (offer.counterQuantity || 0)).toLocaleString('en-IN')}
//                         </Text>
//                         <Text className="text-[11px] text-blue-600">
//                           Waiting for response
//                         </Text>
//                       </View>
//                     </View>
//                   )}
//                 </View>
//               ))
//             ) : (
//               <View className="py-16 items-center">
//                 <View className="bg-gray-100 p-8 rounded-3xl items-center">
//                   <MessageCircle size={48} color="#9ca3af" />
//                   <Text className="text-lg font-medium text-gray-500 mt-4">
//                     No offers yet
//                   </Text>
//                   <Text className="text-sm text-gray-400 mt-2 text-center">
//                     Offers from traders will appear here
//                   </Text>
//                 </View>
//               </View>
//             )}
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>

//       {/* Purchase History Modal */}
//       <Modal
//         visible={showPurchaseHistoryModal}
//         animationType="slide"
//         presentationStyle="pageSheet"
//       >
//         <SafeAreaView className="flex-1 bg-white">
//           <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
//             <TouchableOpacity
//               onPress={() => setShowPurchaseHistoryModal(false)}
//               className="p-2"
//             >
//               <ChevronLeft size={24} color="#374151" />
//             </TouchableOpacity>
//             <View className="ml-3 flex-1">
//               <Text className="text-xl font-medium text-gray-900">
//                 Purchase History
//               </Text>
//               <Text className="text-sm text-gray-500 mt-0.5">
//                 {selectedGrade?.grade} Grade
//               </Text>
//             </View>
//           </View>

//           <ScrollView className="flex-1" contentContainerClassName="p-4">
//             {selectedGrade?.purchaseHistory && selectedGrade.purchaseHistory.length > 0 ? (
//               selectedGrade.purchaseHistory.map((purchase, idx) => (
//                 <View
//                   key={idx}
//                   className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3"
//                 >
//                   <View className="flex-row justify-between items-start mb-3">
//                     <View className="flex-1">
//                       <Text className="text-base font-medium text-gray-900">
//                         {purchase.traderName}
//                       </Text>
//                       <Text className="text-xs text-gray-500 mt-1">
//                         ID: {purchase.traderId}
//                       </Text>
//                     </View>
//                     <View className="items-end">
//                       <Text className="text-xl font-medium text-green-600">
//                         ₹{purchase.totalAmount.toLocaleString('en-IN')}
//                       </Text>
//                       <Text className="text-xs text-gray-500 mt-0.5">
//                         {purchase.quantity} × ₹{purchase.pricePerUnit}
//                       </Text>
//                     </View>
//                   </View>

//                   <View className="flex-row justify-between items-center">
//                     <Text className="text-xs text-gray-500">
//                       {new Date(purchase.purchaseDate).toLocaleString('en-IN')}
//                     </Text>
//                     <View className="bg-green-600 px-2 py-1 rounded-md">
//                       <Text className="text-[10px] font-medium text-white">
//                         {purchase.purchaseType === 'direct' ? 'Direct Purchase' : 'Offer Accepted'}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               ))
//             ) : (
//               <View className="py-16 items-center">
//                 <View className="bg-gray-100 p-8 rounded-3xl items-center">
//                   <ShoppingBag size={48} color="#9ca3af" />
//                   <Text className="text-lg font-medium text-gray-500 mt-4">
//                     No sales yet
//                   </Text>
//                   <Text className="text-sm text-gray-400 mt-2 text-center">
//                     Your sales history will appear here
//                   </Text>
//                 </View>
//               </View>
//             )}
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>

//       {/* Direct Offer Modal */}
//       <Modal
//         visible={showDirectOfferModal}
//         transparent
//         animationType="fade"
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center p-4">
//           <View className="bg-white rounded-2xl w-full max-w-[400px]">
//             <View className="p-5 border-b border-gray-200">
//               <View className="flex-row justify-between items-center">
//                 <Text className="text-xl font-medium text-gray-900">
//                   Make an Offer
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setShowDirectOfferModal(false);
//                     setDirectOfferPrice('');
//                     setDirectOfferQuantity('');
//                   }}
//                   className="w-8 h-8 justify-center items-center"
//                 >
//                   <X size={24} color="#6b7280" />
//                 </TouchableOpacity>
//               </View>
//               <Text className="text-sm text-gray-500 mt-1">
//                 {selectedProduct?.cropBriefDetails} • {selectedGrade?.grade}
//               </Text>
//             </View>

//             <ScrollView className="max-h-[400px]">
//               <View className="p-5">
//                 <View className="mb-4">
//                   <Text className="text-sm font-medium text-gray-900 mb-2">
//                     Price per {selectedProduct?.unitMeasurement || 'unit'} (₹)
//                   </Text>
//                   <TextInput
//                     className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
//                     value={directOfferPrice}
//                     onChangeText={setDirectOfferPrice}
//                     placeholder="Enter offer price"
//                     keyboardType="numeric"
//                   />
//                 </View>

//                 <View className="mb-4">
//                   <Text className="text-sm font-medium text-gray-900 mb-2">
//                     Quantity ({selectedProduct?.unitMeasurement || 'units'})
//                   </Text>
//                   <TextInput
//                     className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
//                     value={directOfferQuantity}
//                     onChangeText={setDirectOfferQuantity}
//                     placeholder="Enter quantity"
//                     keyboardType="numeric"
//                   />
//                 </View>

//                 {directOfferPrice && directOfferQuantity && (
//                   <View className="bg-green-100 p-4 rounded-xl border border-green-300">
//                     <Text className="text-[13px] font-medium text-green-900 mb-1">
//                       Total Amount
//                     </Text>
//                     <Text className="text-[28px] font-medium text-green-600">
//                       ₹{(parseFloat(directOfferPrice) * parseFloat(directOfferQuantity)).toLocaleString('en-IN')}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </ScrollView>

//             <View className="flex-row gap-3 p-5 border-t border-gray-200">
//               <TouchableOpacity
//                 className="flex-1 py-3.5 rounded-xl border border-gray-300 items-center"
//                 onPress={() => {
//                   setShowDirectOfferModal(false);
//                   setDirectOfferPrice('');
//                   setDirectOfferQuantity('');
//                 }}
//               >
//                 <Text className="font-medium text-gray-700">
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="flex-1 py-3.5 bg-green-600 rounded-xl items-center"
//                 onPress={submitDirectOffer}
//               >
//                 <Text className="font-medium text-white">
//                   Submit Offer
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Counter Offer Modal */}
//       <Modal
//         visible={showCounterModal}
//         transparent
//         animationType="fade"
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center p-4">
//           <View className="bg-white rounded-2xl w-full max-w-[400px]">
//             <View className="p-5 border-b border-gray-200">
//               <View className="flex-row justify-between items-center">
//                 <Text className="text-xl font-medium text-gray-900">
//                   Counter Offer
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setShowCounterModal(false);
//                     setCounterPrice('');
//                     setCounterQuantity('');
//                   }}
//                   className="w-8 h-8 justify-center items-center"
//                 >
//                   <X size={24} color="#6b7280" />
//                 </TouchableOpacity>
//               </View>
//               <Text className="text-sm text-gray-500 mt-1">
//                 {selectedProduct?.cropBriefDetails} • {selectedGrade?.grade}
//               </Text>
//             </View>

//             <ScrollView className="max-h-[400px]">
//               <View className="p-5">
//                 {/* Trader's Original Offer */}
//                 <View className="bg-amber-100 p-3 rounded-xl mb-4 border border-yellow-300">
//                   <Text className="text-[13px] font-medium text-amber-900 mb-1">
//                     Trader's Offer
//                   </Text>
//                   <Text className="text-sm text-amber-900">
//                     ₹{selectedOffer?.offeredPrice} × {selectedOffer?.quantity} = ₹
//                     {selectedOffer ? (selectedOffer.offeredPrice * selectedOffer.quantity).toLocaleString('en-IN') : '0'}
//                   </Text>
//                 </View>

//                 {/* Counter Price Input */}
//                 <View className="mb-4">
//                   <Text className="text-sm font-medium text-gray-900 mb-2">
//                     Your Counter Price (₹/{selectedProduct?.unitMeasurement || 'unit'})
//                   </Text>
//                   <TextInput
//                     className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
//                     value={counterPrice}
//                     onChangeText={setCounterPrice}
//                     placeholder="Enter your counter price"
//                     keyboardType="numeric"
//                   />
//                 </View>

//                 {/* Counter Quantity Input */}
//                 <View className="mb-4">
//                   <Text className="text-sm font-medium text-gray-900 mb-2">
//                     Quantity ({selectedProduct?.unitMeasurement || 'units'})
//                   </Text>
//                   <TextInput
//                     className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
//                     value={counterQuantity}
//                     onChangeText={setCounterQuantity}
//                     placeholder="Enter quantity"
//                     keyboardType="numeric"
//                   />
//                 </View>

//                 {/* Total Counter Amount */}
//                 {counterPrice && counterQuantity && (
//                   <View className="bg-green-100 p-4 rounded-xl border border-green-300">
//                     <Text className="text-[13px] font-medium text-green-900 mb-1">
//                       Total Counter Amount
//                     </Text>
//                     <Text className="text-[28px] font-medium text-green-600">
//                       ₹{(parseFloat(counterPrice) * parseFloat(counterQuantity)).toLocaleString('en-IN')}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </ScrollView>

//             {/* Modal Footer Buttons */}
//             <View className="flex-row gap-3 p-5 border-t border-gray-200">
//               <TouchableOpacity
//                 className="flex-1 py-3.5 rounded-xl border border-gray-300 items-center"
//                 onPress={() => {
//                   setShowCounterModal(false);
//                   setCounterPrice('');
//                   setCounterQuantity('');
//                 }}
//               >
//                 <Text className="font-medium text-gray-700">
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="flex-1 py-3.5 bg-green-600 rounded-xl items-center"
//                 onPress={submitCounterOffer}
//               >
//                 <Text className="font-medium text-white">
//                   Send Counter Offer
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default FarmerProducts;




import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Package,
  ShoppingBag,
  TrendingUp,
  X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Offer {
  _id: string;
  offerId: string;
  traderId: string;
  traderName?: string;
  offeredPrice: number;
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
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
  purchaseType: 'direct' | 'offer_accepted';
}

interface GradePrice {
  grade: string;
  pricePerUnit: number;
  gradephotos?: string[];
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

const FarmerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradePrice | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [showDirectOfferModal, setShowDirectOfferModal] = useState(false);
  const [showPurchaseHistoryModal, setShowPurchaseHistoryModal] = useState(false);
  
  // Form states
  const [counterPrice, setCounterPrice] = useState('');
  const [counterQuantity, setCounterQuantity] = useState('');
  const [directOfferPrice, setDirectOfferPrice] = useState('');
  const [directOfferQuantity, setDirectOfferQuantity] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (!farmerId) return;

      const response = await fetch(`https://kisan.etpl.ai/product/farmer-notifications/${farmerId}`);
      const data = await response.json();
      
      
      if (data.success) {
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (!farmerId) {
        throw new Error('Farmer not logged in');
      }

      const response = await fetch(`https://kisan.etpl.ai/product/by-farmer/${farmerId}`);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      const sortedProducts = (data.data || []).sort((a, b) => 
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
setProducts(sortedProducts);
      //setProducts(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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

  const handleAcceptOffer = (product: Product, grade: GradePrice) => {
    Alert.prompt(
      'Accept Offer',
      `Enter quantity to sell (Max: ${grade.totalQty} ${product.unitMeasurement})`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: (quantity) => {
            if (quantity) {
              Alert.alert(
                'Offer Accepted',
                `✅ Accepting to sell ${quantity} ${product.unitMeasurement} of ${grade.grade} at ₹${grade.pricePerUnit}/${product.unitMeasurement}\n\nTotal: ₹${(grade.pricePerUnit * Number(quantity)).toFixed(2)}\n\nThis will be available for traders to purchase.`
              );
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleMakeOffer = (product: Product, grade: GradePrice) => {
    setSelectedProduct(product);
    setSelectedGrade(grade);
    setDirectOfferPrice(grade.pricePerUnit.toString());
    setDirectOfferQuantity('');
    setShowDirectOfferModal(true);
  };

  const submitDirectOffer = () => {
    if (!directOfferPrice || !directOfferQuantity) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Offer Created',
      `✅ Offer Created!\n\nProduct: ${selectedProduct?.cropBriefDetails}\nGrade: ${selectedGrade?.grade}\nPrice: ₹${directOfferPrice}/${selectedProduct?.unitMeasurement}\nQuantity: ${directOfferQuantity} ${selectedProduct?.unitMeasurement}\n\nThis offer will be visible to all traders.`
    );

    setShowDirectOfferModal(false);
    setDirectOfferPrice('');
    setDirectOfferQuantity('');
  };

  const acceptTraderOffer = async (
    productId: string,
    gradeId: string,
    offerId: string,
    offer: Offer,
    product: Product,
    grade: GradePrice
  ) => {
    if (grade.quantityType === 'bulk' && offer.quantity !== grade.totalQty) {
      Alert.alert('Warning', '⚠️ This is a bulk purchase. The trader must buy the full quantity.');
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
      `Remaining after sale: ${grade.totalQty - offer.quantity} ${product.unitMeasurement}\n\n` +
      `Proceed?`;

    Alert.alert('Confirm', confirmMsg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept',
        onPress: async () => {
          try {
            const response = await fetch('https://kisan.etpl.ai/product/accept-trader-offer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId, gradeId, offerId }),
            });

            const data = await response.json();
            if (data.success) {
              const statusMsg =
                data.data.remainingQty === 0
                  ? '🎉 Grade SOLD OUT!'
                  : `✅ Sale Confirmed! ${data.data.remainingQty} ${product.unitMeasurement} remaining.`;

              Alert.alert(
                'Success',
                `${statusMsg}\n\nTotal Amount: ₹${data.data.totalAmount.toFixed(2)}\n\nTrader has been notified and can proceed to payment.`
              );
              setShowOffersModal(false);
              fetchProducts();
            } else {
              Alert.alert('Failed', data.message);
            }
          } catch (err) {
            Alert.alert('Error', 'Error accepting offer');
            console.error(err);
          }
        },
      },
    ]);
  };

  const rejectTraderOffer = async (productId: string, gradeId: string, offerId: string) => {
    Alert.alert('Confirm', 'Reject this offer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch('https://kisan.etpl.ai/product/reject-trader-offer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId, gradeId, offerId }),
            });

            const data = await response.json();
            if (data.success) {
              Alert.alert('Success', 'Offer rejected');
              setShowOffersModal(false);
              fetchProducts();
            }
          } catch (err) {
            Alert.alert('Error', 'Error rejecting offer');
          }
        },
      },
    ]);
  };

  const openCounterOfferModal = (product: Product, grade: GradePrice, offer: Offer) => {
    setSelectedProduct(product);
    setSelectedGrade(grade);
    setSelectedOffer(offer);
    setCounterPrice(offer.offeredPrice.toString());
    setCounterQuantity(offer.quantity.toString());
    setShowOffersModal(false);
    setShowCounterModal(true);
  };

  const submitCounterOffer = async () => {
    if (!counterPrice || !counterQuantity) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!selectedProduct || !selectedGrade || !selectedOffer) return;

    const numPrice = Number(counterPrice);
    const numQuantity = Number(counterQuantity);

    if (numQuantity > selectedGrade.totalQty) {
      Alert.alert('Error', `Maximum available: ${selectedGrade.totalQty} ${selectedProduct.unitMeasurement}`);
      return;
    }

    if (selectedGrade.quantityType === 'bulk' && numQuantity !== selectedGrade.totalQty) {
      Alert.alert('Error', 'Bulk purchase requires full quantity');
      return;
    }

    const confirmMsg =
      `Send Counter Offer?\n\n` +
      `Trader offered: ₹${selectedOffer.offeredPrice} × ${selectedOffer.quantity}\n` +
      `Your counter: ₹${numPrice} × ${numQuantity}\n\n` +
      `Total: ₹${(numPrice * numQuantity).toFixed(2)}\n\n` +
      `Send?`;

    Alert.alert('Confirm', confirmMsg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send',
        onPress: async () => {
          try {
            const response = await fetch('https://kisan.etpl.ai/product/make-counter-offer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: selectedProduct._id,
                gradeId: selectedGrade._id,
                offerId: selectedOffer._id,
                counterPrice: numPrice,
                counterQuantity: numQuantity,
              }),
            });

            const data = await response.json();
            if (data.success) {
              Alert.alert('Success', '✅ Counter-offer sent to trader!');
              setShowCounterModal(false);
              setCounterPrice('');
              setCounterQuantity('');
              fetchProducts();
            } else {
              Alert.alert('Failed', data.message);
            }
          } catch (err) {
            Alert.alert('Error', 'Error submitting counter-offer');
            console.error(err);
          }
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://kisan.etpl.ai/${imagePath}`;
  };

  const openGradeModal = (product: Product) => {
    setSelectedProduct(product);
    setShowGradeModal(true);
  };

  const openOffersModal = (product: Product, grade: GradePrice) => {
    setSelectedProduct(product);
    setSelectedGrade(grade);
    setShowGradeModal(false);
    setShowOffersModal(true);
  };

  const openPurchaseHistoryModal = (product: Product, grade: GradePrice) => {
    setSelectedProduct(product);
    setSelectedGrade(grade);
    setShowGradeModal(false);
    setShowPurchaseHistoryModal(true);
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="mt-4 text-gray-500 text-base">
            Loading your products...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 mr-2"
          >
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-medium text-gray-900">
              My Products
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">
              {products.length} products listed
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => {/* Navigate to notifications */}}
            className="bg-amber-100 px-3 py-2 rounded-lg flex-row items-center relative"
          >
            <Bell size={18} color="#f59e0b" />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 justify-center items-center px-1">
                <Text className="text-white text-[10px] font-medium">
                  {unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {/* Navigate to orders */}}
            className="bg-blue-500 px-3 py-2 rounded-lg flex-row items-center"
          >
            <Package size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View className="m-4 p-4 bg-red-50 rounded-xl border border-red-200">
          <View className="flex-row items-start">
            <View className="bg-red-200 p-2 rounded-lg mr-3">
              <X size={20} color="#dc2626" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-red-900 mb-1">
                Error
              </Text>
              <Text className="text-red-700 text-sm">
                {error}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Products List */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#16a34a"
          />
        }
      >
        {products.map((product) => {
          const pendingOffersCount = product.gradePrices.reduce(
            (sum, grade) => sum + (grade.offers?.filter(o => o.status === 'pending').length || 0),
            0
          );
          const totalSalesCount = product.gradePrices.reduce(
            (sum, grade) => sum + (grade.purchaseHistory?.length || 0),
            0
          );

          return (
            <View
              key={product._id}
              className="bg-white rounded-lg mb-4 overflow-hidden border border-gray-200 p-3"
            >
              {/* Product Image */}
              <View className="relative">
                {/* <Image
                  source={{ uri: getImageUrl(product.cropPhotos[0]) }}
                  className="w-full h-[200px] rounded-xl"
                  resizeMode="cover"
                /> */}
                {/* Product Image Slider */}
<View className="relative">
  <ScrollView 
    horizontal 
    pagingEnabled
    showsHorizontalScrollIndicator={false}
  >
    {product.gradePrices.flatMap(grade => grade.gradePhotos || []).map((photo, idx) => (
      <Image
        key={idx}
        source={{ uri: getImageUrl(photo) }}
        className="rounded-xl"
        style={{ width: width - 32, height: 200 }}
        resizeMode="cover"
      />
    ))}
  </ScrollView>
  {/* Pagination dots */}

  <View className="absolute bottom-3 left-3 bg-black/70 px-2.5 py-1 rounded-md">
    <Text className="text-white text-[11px] font-medium">
      ID: {product.productId}
    </Text>
  </View>
</View>


                <View className="absolute bottom-3 left-3 bg-black/70 px-2.5 py-1 rounded-md">
                  <Text className="text-white text-[11px] font-medium">
                    ID: {product.productId}
                  </Text>
                </View>
              </View>

              {/* Product Details */}
              <View className="p-4">
                <View className="mb-3">
                  <Text className="text-lg font-medium text-gray-900 mb-1.5">
                    {product.cropBriefDetails}
                  </Text>
                  {/* <View className="flex-row flex-wrap gap-2">
                    <View className="bg-gray-100 px-2.5 py-1 rounded-md">
                      <Text className="text-xs text-gray-700 font-medium">
                        {product.categoryId.categoryName}
                      </Text>
                    </View>
                    <View className="bg-gray-100 px-2.5 py-1 rounded-md">
                      <Text className="text-xs text-gray-700 font-medium">
                        {product.subCategoryId.subCategoryName}
                      </Text>
                    </View>
                  </View> */}
                </View>

                {/* Stats Cards */}
                <View className="flex-row gap-2 mb-3">
                  <View className="flex-1 bg-amber-100 p-3 rounded-lg items-center">
                    <Text className="text-2xl font-medium text-amber-500">
                      {pendingOffersCount}
                    </Text>
                    <Text className="text-[11px] text-amber-900 mt-0.5">
                      Pending Offers
                    </Text>
                  </View>
                  <View className="flex-1 bg-green-100 p-3 rounded-lg items-center">
                    <Text className="text-2xl font-medium text-green-600">
                      {totalSalesCount}
                    </Text>
                    <Text className="text-[11px] text-green-900 mt-0.5">
                      Total Sales
                    </Text>
                  </View>
                  <View className="flex-1 bg-blue-100 p-3 rounded-lg items-center">
                    <Text className="text-2xl font-medium text-blue-600">
                      {product.gradePrices.length}
                    </Text>
                    <Text className="text-[11px] text-blue-900 mt-0.5">
                      Grades
                    </Text>
                  </View>
                </View>

                {/* View All Grades Button */}
                <TouchableOpacity
                  onPress={() => openGradeModal(product)}
                  className="bg-green-600 py-3.5 rounded-xl flex-row justify-center items-center mb-3"
                >
                  <Text className="text-white font-medium text-[15px] mr-2">
                    View All Grades & Offers
                  </Text>
                  <ChevronRight size={18} color="#fff" />
                </TouchableOpacity>

                {/* Product Info */}
                <View className="gap-2 flex-row justify-between flex-wrap border-t border-gray-200 ">
                  <View className="flex-row items-center pt-3">
                    <Package size={16} color="#6b7280" />
                    <Text className="text-[13px] text-gray-500 ml-2">
         {product.packagingType}{product.unitMeasurement}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Calendar size={16} color="#6b7280" />
                    <Text className="text-[13px] text-gray-500 ml-2">
                      {formatDate(product.deliveryDate)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={16} color="#6b7280" />
                    <Text className="text-[13px] text-gray-500 ml-2">
                      {product.deliveryTime}
                    </Text>
                  </View>
                  {/* <View className="flex-row items-center">
                    <MapPin size={16} color="#6b7280" />
                    <Text className="text-[13px] text-gray-500 ml-2">
                      {product.nearestMarket}
                    </Text>
                  </View> */}
                </View>
              </View>
            </View>
          );
        })}

        {products.length === 0 && !loading && (
          <View className="py-16 items-center">
            <View className="bg-gray-100 p-8 rounded-3xl items-center">
              <Package size={48} color="#9ca3af" />
              <Text className="text-lg font-medium text-gray-500 mt-4">
                No products listed yet
              </Text>
              <Text className="text-sm text-gray-400 mt-2 text-center">
                Start by adding your first product to see it here
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* All Grades Modal */}
      <Modal
        visible={showGradeModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setShowGradeModal(false)}
              className="p-2"
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="ml-3 flex-1">
              <Text className="text-xl font-medium text-gray-900">
                All Grades
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                {selectedProduct?.cropBriefDetails}
              </Text>
            </View>
          </View>

          <ScrollView className="flex-1" contentContainerClassName="p-4">
            {selectedProduct?.gradePrices.map((grade) => (
              <View
                key={grade._id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-4 mb-4"
              >
                {/* Grade Header */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-medium text-gray-900">
                      {grade.grade} Grade
                    </Text>
                    <View className="flex-row items-center mt-2 gap-2">
                      <View className="bg-green-100 px-2 py-1 rounded-md">
                        <Text className="text-[11px] font-medium text-green-900">
                          {grade.totalQty} {selectedProduct.unitMeasurement} available
                        </Text>
                      </View>
                      {grade.quantityType === 'bulk' && (
                        <View className="bg-blue-100 px-2 py-1 rounded-md">
                          <Text className="text-[11px] font-medium text-blue-900">
                            Bulk Only
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-[28px] font-medium text-green-600">
                      ₹{grade.pricePerUnit}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      /{selectedProduct.unitMeasurement}
                    </Text>
                  </View>
                </View>

                {/* Purchase History Summary */}
                {grade.purchaseHistory && grade.purchaseHistory.length > 0 && (
                  <View className="mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <ShoppingBag size={16} color="#16a34a" />
                        <Text className="text-[15px] font-medium text-gray-900 ml-2">
                          Recent Sales
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => openPurchaseHistoryModal(selectedProduct, grade)}
                      >
                        <Text className="text-[13px] text-blue-600 font-medium">
                          View All ({grade.purchaseHistory.length})
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {grade.purchaseHistory.slice(0, 2).map((purchase, idx) => (
                      <View
                        key={idx}
                        className="bg-green-50 p-3 rounded-xl border border-green-200 mb-2"
                      >
                        <View className="flex-row justify-between items-center">
                          <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-900">
                              {purchase.traderName}
                            </Text>
                            <Text className="text-[11px] text-gray-500 mt-0.5">
                              {new Date(purchase.purchaseDate).toLocaleDateString('en-IN')}
                            </Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-base font-medium text-green-600">
                              ₹{purchase.totalAmount.toLocaleString('en-IN')}
                            </Text>
                            <Text className="text-[11px] text-gray-500">
                              {purchase.quantity} × ₹{purchase.pricePerUnit}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Action Buttons */}
                <View className="mb-3 gap-2">
                  <TouchableOpacity
                    className={`flex-row items-center justify-center py-3.5 rounded-xl ${
                      grade.totalQty === 0 ? 'bg-gray-200' : 'bg-green-600'
                    }`}
                    onPress={() => handleAcceptOffer(selectedProduct, grade)}
                    disabled={grade.totalQty === 0}
                  >
                    <Check size={18} color={grade.totalQty === 0 ? '#9ca3af' : '#fff'} />
                    <Text className={`ml-2 font-medium text-[15px] ${
                      grade.totalQty === 0 ? 'text-gray-400' : 'text-white'
                    }`}>
                      Accept Offer
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-row items-center justify-center py-3.5 rounded-xl border-2 ${
                      grade.totalQty === 0
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-green-600 bg-white'
                    }`}
                    onPress={() => handleMakeOffer(selectedProduct, grade)}
                    disabled={grade.totalQty === 0}
                  >
                    <TrendingUp size={18} color={grade.totalQty === 0 ? '#9ca3af' : '#16a34a'} />
                    <Text className={`ml-2 font-medium text-[15px] ${
                      grade.totalQty === 0 ? 'text-gray-400' : 'text-green-600'
                    }`}>
                      Make Offer
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Offers Summary */}
                {grade.offers && grade.offers.length > 0 && (
                  <View className="pt-3 border-t border-gray-200">
                    <TouchableOpacity
                      onPress={() => openOffersModal(selectedProduct, grade)}
                      className="flex-row justify-between items-center p-3 bg-amber-100 rounded-xl"
                    >
                      <View>
                        <Text className="text-[15px] font-medium text-gray-900">
                          View All Offers
                        </Text>
                        <Text className="text-xs text-gray-500 mt-0.5">
                          {grade.offers.filter(o => o.status === 'pending').length} pending offers
                        </Text>
                      </View>
                      <ChevronRight size={20} color="#374151" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Quick Stats */}
                <View className="mt-3 pt-3 border-t border-gray-200">
                  <View className="flex-row justify-around">
                    <View className="items-center">
                      <Text className="text-xs text-gray-500 mb-1">Offers</Text>
                      <Text className="text-xl font-medium text-gray-900">
                        {grade.offers?.length || 0}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-gray-500 mb-1">Sold</Text>
                      <Text className="text-xl font-medium text-gray-900">
                        {grade.purchaseHistory?.length || 0}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-gray-500 mb-1">Available</Text>
                      <Text className="text-xl font-medium text-gray-900">
                        {grade.totalQty}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Offers Modal */}
      <Modal
        visible={showOffersModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setShowOffersModal(false)}
              className="p-2"
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="ml-3 flex-1">
              <Text className="text-xl font-medium text-gray-900">
                All Offers
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                {selectedGrade?.grade} Grade
              </Text>
            </View>
          </View>

          <ScrollView className="flex-1" contentContainerClassName="p-4">
            {selectedGrade?.offers && selectedGrade.offers.length > 0 ? (
              selectedGrade.offers.map((offer) => (
                <View
                  key={offer._id}
                  className={`bg-white border-2 rounded-2xl p-4 mb-3 ${
                    offer.status === 'pending' ? 'border-yellow-300' :
                    offer.status === 'accepted' ? 'border-green-300' :
                    offer.status === 'rejected' ? 'border-red-300' :
                    'border-blue-300'
                  }`}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-[15px] font-medium text-gray-900">
                        {offer.traderName || `Trader ${offer.traderId.substring(0, 8)}...`}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {new Date(offer.createdAt).toLocaleDateString('en-IN')}
                      </Text>
                    </View>
                    <View className={`px-2.5 py-1 rounded-xl ${
                      offer.status === 'pending' ? 'bg-amber-100' :
                      offer.status === 'accepted' ? 'bg-green-100' :
                      offer.status === 'rejected' ? 'bg-red-50' :
                      'bg-blue-100'
                    }`}>
                      <Text className={`text-[11px] font-medium ${
                        offer.status === 'pending' ? 'text-amber-900' :
                        offer.status === 'accepted' ? 'text-green-900' :
                        offer.status === 'rejected' ? 'text-red-900' :
                        'text-blue-900'
                      }`}>
                        {offer.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-gray-50 p-3 rounded-xl mb-3">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-[13px] text-gray-500">Offered Price:</Text>
                      <Text className="text-[15px] font-medium text-gray-900">
                        ₹{offer.offeredPrice}/{selectedProduct?.unitMeasurement}
                      </Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-[13px] text-gray-500">Quantity:</Text>
                      <Text className="text-[15px] font-medium text-gray-900">
                        {offer.quantity} {selectedProduct?.unitMeasurement}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pt-2 border-t border-gray-200">
                      <Text className="text-sm font-medium text-gray-900">
                        Total Amount:
                      </Text>
                      <Text className="text-lg font-medium text-green-600">
                        ₹{(offer.offeredPrice * offer.quantity).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  {offer.status === 'pending' && selectedProduct && selectedGrade && (
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-3 bg-green-600 rounded-xl"
                        onPress={() => acceptTraderOffer(
                          selectedProduct._id,
                          selectedGrade._id,
                          offer._id,
                          offer,
                          selectedProduct,
                          selectedGrade
                        )}
                      >
                        <Check size={16} color="#fff" />
                        <Text className="ml-1.5 font-medium text-white">
                          Accept
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-3 bg-blue-500 rounded-xl"
                        onPress={() => openCounterOfferModal(selectedProduct, selectedGrade, offer)}
                      >
                        <TrendingUp size={16} color="#fff" />
                        <Text className="ml-1.5 font-medium text-white">
                          Counter
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-3 bg-red-500 rounded-xl"
                        onPress={() => rejectTraderOffer(
                          selectedProduct._id,
                          selectedGrade._id,
                          offer._id
                        )}
                      >
                        <X size={16} color="#fff" />
                        <Text className="ml-1.5 font-medium text-white">
                          Reject
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {offer.status === 'countered' && (
                    <View className="bg-blue-100 p-3 rounded-xl">
                      <Text className="text-sm font-medium text-blue-950 mb-1.5">
                        Your Counter Offer
                      </Text>
                      <View className="flex-row justify-between">
                        <Text className="text-xs text-blue-700">
                          ₹{offer.counterPrice} × {offer.counterQuantity} = ₹{((offer.counterPrice || 0) * (offer.counterQuantity || 0)).toLocaleString('en-IN')}
                        </Text>
                        <Text className="text-[11px] text-blue-600">
                          Waiting for response
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View className="py-16 items-center">
                <View className="bg-gray-100 p-8 rounded-3xl items-center">
                  <MessageCircle size={48} color="#9ca3af" />
                  <Text className="text-lg font-medium text-gray-500 mt-4">
                    No offers yet
                  </Text>
                  <Text className="text-sm text-gray-400 mt-2 text-center">
                    Offers from traders will appear here
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Purchase History Modal */}
      <Modal
        visible={showPurchaseHistoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setShowPurchaseHistoryModal(false)}
              className="p-2"
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="ml-3 flex-1">
              <Text className="text-xl font-medium text-gray-900">
                Purchase History
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                {selectedGrade?.grade} Grade
              </Text>
            </View>
          </View>

          <ScrollView className="flex-1" contentContainerClassName="p-4">
            {selectedGrade?.purchaseHistory && selectedGrade.purchaseHistory.length > 0 ? (
              selectedGrade.purchaseHistory.map((purchase, idx) => (
                <View
                  key={idx}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-gray-900">
                        {purchase.traderName}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        ID: {purchase.traderId}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xl font-medium text-green-600">
                        ₹{purchase.totalAmount.toLocaleString('en-IN')}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {purchase.quantity} × ₹{purchase.pricePerUnit}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-gray-500">
                      {new Date(purchase.purchaseDate).toLocaleString('en-IN')}
                    </Text>
                    <View className="bg-green-600 px-2 py-1 rounded-md">
                      <Text className="text-[10px] font-medium text-white">
                        {purchase.purchaseType === 'direct' ? 'Direct Purchase' : 'Offer Accepted'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="py-16 items-center">
                <View className="bg-gray-100 p-8 rounded-3xl items-center">
                  <ShoppingBag size={48} color="#9ca3af" />
                  <Text className="text-lg font-medium text-gray-500 mt-4">
                    No sales yet
                  </Text>
                  <Text className="text-sm text-gray-400 mt-2 text-center">
                    Your sales history will appear here
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Direct Offer Modal */}
      <Modal
        visible={showDirectOfferModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl w-full max-w-[400px]">
            <View className="p-5 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-medium text-gray-900">
                  Make an Offer
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowDirectOfferModal(false);
                    setDirectOfferPrice('');
                    setDirectOfferQuantity('');
                  }}
                  className="w-8 h-8 justify-center items-center"
                >
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500 mt-1">
                {selectedProduct?.cropBriefDetails} • {selectedGrade?.grade}
              </Text>
            </View>

            <ScrollView className="max-h-[400px]">
              <View className="p-5">
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-900 mb-2">
                    Price per {selectedProduct?.unitMeasurement || 'unit'} (₹)
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                    value={directOfferPrice}
                    onChangeText={setDirectOfferPrice}
                    placeholder="Enter offer price"
                    keyboardType="numeric"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-900 mb-2">
                    Quantity ({selectedProduct?.unitMeasurement || 'units'})
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                    value={directOfferQuantity}
                    onChangeText={setDirectOfferQuantity}
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                  />
                </View>

                {directOfferPrice && directOfferQuantity && (
                  <View className="bg-green-100 p-4 rounded-xl border border-green-300">
                    <Text className="text-[13px] font-medium text-green-900 mb-1">
                      Total Amount
                    </Text>
                    <Text className="text-[28px] font-medium text-green-600">
                      ₹{(parseFloat(directOfferPrice) * parseFloat(directOfferQuantity)).toLocaleString('en-IN')}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <View className="flex-row gap-3 p-5 border-t border-gray-200">
              <TouchableOpacity
                className="flex-1 py-3.5 rounded-xl border border-gray-300 items-center"
                onPress={() => {
                  setShowDirectOfferModal(false);
                  setDirectOfferPrice('');
                  setDirectOfferQuantity('');
                }}
              >
                <Text className="font-medium text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3.5 bg-green-600 rounded-xl items-center"
                onPress={submitDirectOffer}
              >
                <Text className="font-medium text-white">
                  Submit Offer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Counter Offer Modal */}
      <Modal
        visible={showCounterModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl w-full max-w-[400px]">
            <View className="p-5 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-medium text-gray-900">
                  Counter Offer
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowCounterModal(false);
                    setCounterPrice('');
                    setCounterQuantity('');
                  }}
                  className="w-8 h-8 justify-center items-center"
                >
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500 mt-1">
                {selectedProduct?.cropBriefDetails} • {selectedGrade?.grade}
              </Text>
            </View>

            <ScrollView className="max-h-[400px]">
              <View className="p-5">
                {/* Trader's Original Offer */}
                <View className="bg-amber-100 p-3 rounded-xl mb-4 border border-yellow-300">
                  <Text className="text-[13px] font-medium text-amber-900 mb-1">
                    Trader's Offer
                  </Text>
                  <Text className="text-sm text-amber-900">
                    ₹{selectedOffer?.offeredPrice} × {selectedOffer?.quantity} = ₹
                    {selectedOffer ? (selectedOffer.offeredPrice * selectedOffer.quantity).toLocaleString('en-IN') : '0'}
                  </Text>
                </View>

                {/* Counter Price Input */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-900 mb-2">
                    Your Counter Price (₹/{selectedProduct?.unitMeasurement || 'unit'})
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                    value={counterPrice}
                    onChangeText={setCounterPrice}
                    placeholder="Enter your counter price"
                    keyboardType="numeric"
                  />
                </View>

                {/* Counter Quantity Input */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-900 mb-2">
                    Quantity ({selectedProduct?.unitMeasurement || 'units'})
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                    value={counterQuantity}
                    onChangeText={setCounterQuantity}
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                  />
                </View>

                {/* Total Counter Amount */}
                {counterPrice && counterQuantity && (
                  <View className="bg-green-100 p-4 rounded-xl border border-green-300">
                    <Text className="text-[13px] font-medium text-green-900 mb-1">
                      Total Counter Amount
                    </Text>
                    <Text className="text-[28px] font-medium text-green-600">
                      ₹{(parseFloat(counterPrice) * parseFloat(counterQuantity)).toLocaleString('en-IN')}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Modal Footer Buttons */}
            <View className="flex-row gap-3 p-5 border-t border-gray-200">
              <TouchableOpacity
                className="flex-1 py-3.5 rounded-xl border border-gray-300 items-center"
                onPress={() => {
                  setShowCounterModal(false);
                  setCounterPrice('');
                  setCounterQuantity('');
                }}
              >
                <Text className="font-medium text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3.5 bg-green-600 rounded-xl items-center"
                onPress={submitCounterOffer}
              >
                <Text className="font-medium text-white">
                  Send Counter Offer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FarmerProducts;