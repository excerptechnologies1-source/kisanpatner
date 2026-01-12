



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
// import { useLocalSearchParams, useRouter } from 'expo-router';
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
//   const params = useLocalSearchParams();
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
// useEffect(() => {
//   if (params.selectedCategory) {
//     const category = params.selectedCategory as string;
//     setSelectedCategory(category);
//     // Remove the setCategories part - categories is computed from products
//   }
// }, [params.selectedCategory]);
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  traderId ,
  getFarmerInfo
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
       
        {/* <Text className="text-lg font-medium text-gray-900 mb-2">{product.cropBriefDetails}</Text> */}
        
      
        {/* <View className="flex-row flex-wrap gap-2 mb-3">
          <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Text className="text-blue-700 font-medium text-xs">{product.productId}</Text>
          </View>
         
       
{(() => {
  const farmerInfo = getFarmerInfo(product.farmerId);
  return (
    <View className="bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
      <Text className="text-purple-700 font-medium text-xs">
        👤 {farmerInfo.name} • 📍 {farmerInfo.place} • 📌 {farmerInfo.pincode}
      </Text>
    </View>
  );
})()}
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
        </View> */}

<View className="p-4">
  {/* Product Header */}
  <Text className="text-lg font-medium text-gray-900 mb-3">{product.cropBriefDetails}</Text>
  
  {/* Main Info Grid - Two Columns */}
  <View className="flex-row gap-3 mb-3">
    {/* Left Column - Farmer Details */}
    <View className="flex-1 bg-purple-50 rounded-lg p-3 border border-purple-200">
      <Text className="text-purple-900 font-semibold text-xs mb-2">👤 Farmer Details</Text>
      {(() => {
        const farmerInfo = getFarmerInfo(product.farmerId);
        return (
          <>
            <Text className="text-purple-700 text-xs mb-1">
              <Text className="font-semibold">Name:</Text> {farmerInfo.name}
            </Text>
            <Text className="text-purple-700 text-xs mb-1">
              <Text className="font-semibold">Place:</Text> {farmerInfo.place}
            </Text>
            <Text className="text-purple-700 text-xs">
              <Text className="font-semibold">Pincode:</Text> {farmerInfo.pincode}
            </Text>
          </>
        );
      })()}
    </View>

    {/* Right Column - Product Details */}
    <View className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-200">
      <Text className="text-blue-900 font-semibold text-xs mb-2">📦 Product Info</Text>
      <Text className="text-blue-700 text-xs mb-1">
        <Text className="font-semibold">Category:</Text> {product.categoryId.categoryName}
      </Text>
      <Text className="text-blue-700 text-xs mb-1">
        <Text className="font-semibold">Qty:</Text> {product.packageMeasurement} {product.packagingType}
      </Text>
      <Text className="text-blue-700 text-xs mb-1">
        <Text className="font-semibold">Date:</Text> {new Date(product.deliveryDate).toLocaleDateString()}
      </Text>
      <Text className="text-blue-700 text-xs">
        <Text className="font-semibold">Time:</Text> {product.deliveryTime}
      </Text>
    </View>
  </View>

  {/* Category Tags */}
  {/* <View className="flex-row flex-wrap gap-2 mb-3">
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
  </View> */}

  {/* View All Button */}
  <TouchableOpacity
    onPress={() => onViewAllGrades(product)}
    className="bg-green-500 py-3 rounded-lg"
  >
    <Text className="text-white font-medium text-center">View All Grades & Offers</Text>
  </TouchableOpacity>
</View>
      
        {/* <View className="flex-row items-center font-medium justify-between flex-wrap border-t border-gray-200 pt-3 mb-3">
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

</View> */}

      
        {/* <TouchableOpacity
          onPress={() => onViewAllGrades(product)}
          className="bg-green-500 py-3 rounded-lg"
        >
          <Text className="text-white font-medium text-center">View All Grades & Offers</Text>
        </TouchableOpacity> */}
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
    {console.log('Purchase History:', grade.purchaseHistory)}
    {console.log('Current Trader ID:', traderId)}
    <Text className="font-medium text-blue-600 mb-2">📦 Purchase History:</Text>
    {grade.purchaseHistory
      .filter(purchase => {
        console.log('Purchase traderId:', purchase.traderId, 'Match:', purchase.traderId === traderId);
        return purchase.traderId === traderId;
      }).map((purchase, idx) => (
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
  const router = useRouter();
  const params = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [traderId, setTraderId] = useState(null);
  const [traderName, setTraderName] = useState('');
  const [farmers, setFarmers] = useState([]);
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
        setTraderName(name );
      } catch (err) {
        console.error('Error loading trader info:', err);
      }
    };
    loadTraderInfo();
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchFarmers();
  }, []);
const fetchFarmers = useCallback(async () => {
  try {
    const res = await fetch('https://kisan.etpl.ai/farmer/register/all');
    const data = await res.json();
    setFarmers(data.data || []);
  } catch (err) {
    console.error('Error fetching farmers:', err);
  }
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
const getFarmerInfo = useCallback((farmerId) => {
  const farmer = farmers.find(f => f.farmerId === farmerId);
  if (!farmer) return { name: 'Unknown', place: 'N/A' };
  
  // Concatenate location fields
  const locationParts = [
    farmer.personalInfo?.villageGramaPanchayat,
    farmer.personalInfo?.taluk,
    farmer.personalInfo?.district
  ].filter(Boolean); // Remove undefined/null/empty values
  
  return {
    name: farmer.personalInfo?.name || 'Unknown',
    place: locationParts.length > 0 ? locationParts.join(', ') : 'N/A',
    pincode: farmer.personalInfo?.pincode || 'N/A'  
  };
}, [farmers]);
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
                  //traderName,
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
       getFarmerInfo={getFarmerInfo}
    />
  ), [getImageUrl, handleViewAllGrades, traderId, getFarmerInfo]);

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
           <Pressable onPress={() => router.push("/(trader)/home")}>
      <View className="flex-row items-center">
        <Ionicons name="arrow-back" size={24} color="#000000ff" />
        <Text className="text-2xl font-medium ml-2">
          Available Products
        </Text>
      </View>
    </Pressable>
            {/* <Text className="text-2xl font-medium ml-2">Available Products</Text> */}
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