// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';

// const Allcrops: React.FC = () => {
//   const navigation = useNavigation();
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [gradeOffers, setGradeOffers] = useState<{ [gradeId: string]: { price: string, quantity: string } }>({});
//   const [showOfferModal, setShowOfferModal] = useState(false);
//   const [quantityInput, setQuantityInput] = useState('');
//   const [showQuantityModal, setShowQuantityModal] = useState(false);
//   const [selectedGrade, setSelectedGrade] = useState<any>(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const traderId = await AsyncStorage.getItem('traderId');
//       const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${traderId}`);
//       const data = await res.json();
//       setProducts(data.data || []);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load products');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchProducts();
//   };

//   const getImageUrl = (path: string) => {
//     if (!path) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
//     if (path.startsWith('http')) return path;
//     return `https://kisan.etpl.ai/${path}`;
//   };

//   const handleAcceptOffer = async (product: any, grade: any) => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = (await AsyncStorage.getItem('traderName')) || 'Unknown Trader';
//     if (!traderId) return Alert.alert('Error', 'Please login as a trader first');

//     const maxQty = grade.totalQty;

//     if (grade.quantityType === 'bulk') {
//       const totalAmount = grade.pricePerUnit * maxQty;
//       Alert.alert(
//         'Confirm Purchase',
//         `Product: ${product.cropBriefDetails}\nGrade: ${grade.grade}\nPrice: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nQuantity: ${maxQty} ${product.unitMeasurement}\n\nTotal: ₹${totalAmount.toFixed(2)}`,
//         [
//           { text: 'Cancel' },
//           { text: 'Confirm', onPress: () => processPurchase(product, grade, traderId, traderName, maxQty) }
//         ]
//       );
//     } else {
//       setSelectedProduct(product);
//       setSelectedGrade(grade);
//       setQuantityInput('');
//       setShowQuantityModal(true);
//     }
//   };

//   const handleQuantitySubmit = async () => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = (await AsyncStorage.getItem('traderName')) || 'Unknown Trader';

//     const qty = Number(quantityInput);
//     const maxQty = selectedGrade.totalQty;

//     if (!qty || qty <= 0) return Alert.alert('Error', 'Enter valid quantity');
//     if (qty > maxQty) return Alert.alert('Error', `Max available ${maxQty}`);

//     const totalAmount = selectedGrade.pricePerUnit * qty;

//     setShowQuantityModal(false);

//     Alert.alert(
//       'Confirm Purchase',
//       `Qty: ${qty}\nTotal: ₹${totalAmount.toFixed(2)}`,
//       [
//         { text: 'Cancel' },
//         { text: 'Confirm', onPress: () => processPurchase(selectedProduct, selectedGrade, traderId!, traderName, qty) }
//       ]
//     );
//   };

//   const processPurchase = async (product: any, grade: any, traderId: string, traderName: string, quantity: number) => {
//     try {
//       const res = await fetch('https://kisan.etpl.ai/product/accept-listed-price', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ productId: product._id, gradeId: grade._id, traderId, traderName, quantity })
//       });

//       const data = await res.json();
//       if (data.success) {
//         Alert.alert('Success', 'Purchase Completed');
//         fetchProducts();
//       } else Alert.alert('Error', data.message);
//     } catch {
//       Alert.alert('Error', 'Failed');
//     }
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
//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#28a745']}
//           />
//         }
//       >

//         {/* HEADER */}
//         <View className="bg-white border-b border-gray-200 px-4 py-4">
//           <Text className="text-2xl font-medium text-gray-900">
//             Available Products
//           </Text>
//           <Text className="text-gray-500 mt-1">
//             {products.length} products
//           </Text>
//         </View>


//         {/* ERROR */}
//         {error && (
//           <View className="bg-red-50 border border-red-400 rounded-lg mx-4 mt-4 p-3">
//             <Text className="text-red-800 font-medium">
//               {error}
//             </Text>
//           </View>
//         )}


//         {/* NO PRODUCTS */}
//         {products.length === 0 ? (
//           <View className="items-center justify-center py-20">
//             <Text className="text-6xl mb-3">🏪</Text>
//             <Text className="text-lg font-semibold text-gray-700">
//               No Products Found
//             </Text>
//             <Text className="text-gray-400">
//               Come back later
//             </Text>
//           </View>
//         ) : (


//           <View className="px-4 pt-4 pb-10">

//             {products.map(product => (
//               <View
//                 key={product._id}
//                 className="bg-white border border-gray-200 rounded-lg mb-5 p-3"
//               >

//                 {/* IMAGE */}
//                 <View className="relative">
//                   <Image
//                     source={{ uri: getImageUrl(product.cropPhotos?.[0]) }}
//                     className="w-full h-52 rounded-lg"
//                   />

//                   <View className="absolute top-3 left-3 bg-green-600 px-3 py-1 rounded-full">
//                     <Text className="text-white text-xs font-semibold">
//                       {product.farmingType}
//                     </Text>
//                   </View>
//                 </View>


//                 {/* CARD BODY */}
//                 <View className="p-4">

//                   <Text className="text-xl font-medium text-gray-900">
//                     {product.cropBriefDetails}
//                   </Text>

//                   {/* PRODUCT ID */}
//                   <View className="bg-green-600 px-2 py-1 rounded mt-2 self-start">
//                     <Text className="text-white text-xs font-semibold">
//                       {product.productId}
//                     </Text>
//                   </View>


//                   {/* CATEGORY TAGS */}
//                   <View className="flex-row flex-wrap mt-3">
//                     <View className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2 border border-gray-300">
//                       <Text className="text-gray-700 text-sm">
//                         {product.categoryId?.categoryName}
//                       </Text>
//                     </View>

//                     <View className="bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
//                       <Text className="text-gray-700 text-sm">
//                         {product.subCategoryId?.subCategoryName}
//                       </Text>
//                     </View>
//                   </View>



//                   {/* GRADE BLOCKS */}
//                   {product.gradePrices
//                     .filter((g: any) => g.status !== 'sold')
//                     .map((grade: any, index: number, arr: any[]) => (

//                       <View
//                         key={grade._id}
//                         className={`mt-3 pb-3 ${index !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}
//                       >

//                         <View className="flex-row justify-between items-center">
//                           <Text className="text-lg font-medium text-gray-900">
//                             {grade.grade}
//                           </Text>

//                           <Text className="text-green-700 font-medium text-base">
//                             ₹{grade.pricePerUnit}/{product.unitMeasurement}
//                           </Text>
//                         </View>

//                         <Text className="text-gray-600 mt-1">
//                           Quantity: {grade.totalQty} {product.unitMeasurement}
//                         </Text>


//                         {/* BUTTONS */}
//                         <View className="flex-row mt-3">

//                           <TouchableOpacity
//                             className="flex-1 bg-green-600 rounded-lg py-2 mr-2 items-center"
//                             onPress={() => handleAcceptOffer(product, grade)}
//                           >
//                             <Text className="text-white font-semibold text-sm">
//                               Accept Price
//                             </Text>
//                           </TouchableOpacity>

//                           {grade.priceType === 'negotiable' && (
//                             <TouchableOpacity
//                               className="flex-1 border border-green-600 rounded-lg py-2 items-center"
//                             >
//                               <Text className="text-green-700 font-semibold text-sm">
//                                 Make Offer
//                               </Text>
//                             </TouchableOpacity>
//                           )}
//                         </View>

//                       </View>
//                     ))}

//                 </View>
//               </View>
//             ))}

//           </View>
//         )}

//       </ScrollView>
//     </View>

//   );
// };

// export default Allcrops;











// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import { useLocalSearchParams } from 'expo-router';
// import { Filter, Search, X } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
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
//   View
// } from 'react-native';

// const Allcrops: React.FC = () => {
//   const navigation = useNavigation();
//   const params = useLocalSearchParams();
//   const [products, setProducts] = useState<any[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [gradeOffers, setGradeOffers] = useState<{ [gradeId: string]: { price: string, quantity: string } }>({});
//   const [showOfferModal, setShowOfferModal] = useState(false);
//   const [quantityInput, setQuantityInput] = useState('');
//   const [showQuantityModal, setShowQuantityModal] = useState(false);
//   const [selectedGrade, setSelectedGrade] = useState<any>(null);

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

//       // Add category to the categories list if not already there
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

//       // Extract unique categories and farming types
//       const uniqueCategories = Array.from(
//         new Set(productsData.map((p: any) => p.categoryId?.categoryName).filter(Boolean))
//       ) as string[];

//       const uniqueFarmingTypes = Array.from(
//         new Set(productsData.map((p: any) => p.farmingType).filter(Boolean))
//       ) as string[];

//       // If we have a category from params, add it to the list
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

//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase().trim();
//       filtered = filtered.filter(product =>
//         product.cropBriefDetails?.toLowerCase().includes(query) ||
//         product.productId?.toLowerCase().includes(query) ||
//         product.categoryId?.categoryName?.toLowerCase().includes(query) ||
//         product.subCategoryId?.subCategoryName?.toLowerCase().includes(query)
//       );
//     }

//     // Apply category filter
//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(product =>
//         product.categoryId?.categoryName === selectedCategory
//       );
//     }

//     // Apply farming type filter
//     if (selectedFarmingType !== 'all') {
//       filtered = filtered.filter(product =>
//         product.farmingType === selectedFarmingType
//       );
//     }

//     // Apply price range filter
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
//     // Note: This won't clear the category from params, 
//     // but it will show all products again
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

//   const getImageUrl = (path: string) => {
//     if (!path) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
//     if (path.startsWith('http')) return path;
//     return `https://kisan.etpl.ai/${path}`;
//   };

//   const handleAcceptOffer = async (product: any, grade: any) => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = (await AsyncStorage.getItem('traderName')) || 'Unknown Trader';
//     if (!traderId) return Alert.alert('Error', 'Please login as a trader first');

//     const maxQty = grade.totalQty;

//     if (grade.quantityType === 'bulk') {
//       const totalAmount = grade.pricePerUnit * maxQty;
//       Alert.alert(
//         'Confirm Purchase',
//         `Product: ${product.cropBriefDetails}\nGrade: ${grade.grade}\nPrice: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nQuantity: ${maxQty} ${product.unitMeasurement}\n\nTotal: ₹${totalAmount.toFixed(2)}`,
//         [
//           { text: 'Cancel' },
//           { text: 'Confirm', onPress: () => processPurchase(product, grade, traderId, traderName, maxQty) }
//         ]
//       );
//     } else {
//       setSelectedProduct(product);
//       setSelectedGrade(grade);
//       setQuantityInput('');
//       setShowQuantityModal(true);
//     }
//   };

//   const handleQuantitySubmit = async () => {
//     const traderId = await AsyncStorage.getItem('traderId');
//     const traderName = (await AsyncStorage.getItem('traderName')) || 'Unknown Trader';

//     const qty = Number(quantityInput);
//     const maxQty = selectedGrade.totalQty;

//     if (!qty || qty <= 0) return Alert.alert('Error', 'Enter valid quantity');
//     if (qty > maxQty) return Alert.alert('Error', `Max available ${maxQty}`);

//     const totalAmount = selectedGrade.pricePerUnit * qty;

//     setShowQuantityModal(false);

//     Alert.alert(
//       'Confirm Purchase',
//       `Qty: ${qty}\nTotal: ₹${totalAmount.toFixed(2)}`,
//       [
//         { text: 'Cancel' },
//         { text: 'Confirm', onPress: () => processPurchase(selectedProduct, selectedGrade, traderId!, traderName, qty) }
//       ]
//     );
//   };

//   const processPurchase = async (product: any, grade: any, traderId: string, traderName: string, quantity: number) => {
//     try {
//       const res = await fetch('https://kisan.etpl.ai/product/accept-listed-price', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ productId: product._id, gradeId: grade._id, traderId, traderName, quantity })
//       });

//       const data = await res.json();
//       if (data.success) {
//         Alert.alert('Success', 'Purchase Completed');
//         fetchProducts();
//       } else Alert.alert('Error', data.message);
//     } catch {
//       Alert.alert('Error', 'Failed');
//     }
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

//         {/* Show category filter info */}
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
//                 <Text className="text-xl font-semibold text-gray-900">Filters</Text>
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
//                 <Text className="text-white font-semibold text-lg">Apply Filters</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* QUANTITY MODAL */}
//       <Modal
//         visible={showQuantityModal}
//         transparent={true}
//         animationType="fade"
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center p-4">
//           <View className="bg-white rounded-xl p-6 w-full max-w-sm">
//             <Text className="text-xl font-semibold text-gray-900 mb-2">Enter Quantity</Text>
//             <Text className="text-gray-600 mb-4">
//               Available: {selectedGrade?.totalQty} {selectedProduct?.unitMeasurement}
//             </Text>

//             <TextInput
//               className="bg-gray-100 rounded-lg px-4 py-3 text-lg text-center mb-4"
//               placeholder="Enter quantity"
//               value={quantityInput}
//               onChangeText={setQuantityInput}
//               keyboardType="numeric"
//               autoFocus
//             />

//             <View className="flex-row">
//               <TouchableOpacity
//                 className="flex-1 bg-gray-200 rounded-lg py-3 mr-2 items-center"
//                 onPress={() => setShowQuantityModal(false)}
//               >
//                 <Text className="text-gray-700 font-medium">Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 className="flex-1 bg-green-600 rounded-lg py-3 ml-2 items-center"
//                 onPress={handleQuantitySubmit}
//               >
//                 <Text className="text-white font-semibold">Continue</Text>
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
//             <Text className="text-lg font-semibold text-gray-700 mt-4">
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
//               <View
//                 key={product._id}
//                 className="bg-white border border-gray-200 rounded-lg mb-5 p-3"
//               >
//                 {/* IMAGE */}
//                 <View className="relative">
//                   <Image
//                     source={{ uri: getImageUrl(product.cropPhotos?.[0]) }}
//                     className="w-full h-52 rounded-lg"
//                   />

//                   <View className="absolute top-3 left-3 bg-green-600 px-3 py-1 rounded-full">
//                     <Text className="text-white text-xs font-semibold">
//                       {product.farmingType}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* CARD BODY */}
//                 <View className="p-4">
//                   <Text className="text-xl font-medium text-gray-900">
//                     {product.cropBriefDetails}
//                   </Text>

//                   {/* PRODUCT ID */}
//                   <View className="bg-green-600 px-2 py-1 rounded mt-2 self-start">
//                     <Text className="text-white text-xs font-semibold">
//                       {product.productId}
//                     </Text>
//                   </View>

//                   {/* CATEGORY TAGS */}
//                   <View className="flex-row flex-wrap mt-3">
//                     <View className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2 border border-gray-300">
//                       <Text className="text-gray-700 text-sm">
//                         {product.categoryId?.categoryName}
//                       </Text>
//                     </View>

//                     <View className="bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
//                       <Text className="text-gray-700 text-sm">
//                         {product.subCategoryId?.subCategoryName}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* GRADE BLOCKS */}
//                   {product.gradePrices
//                     .filter((g: any) => g.status !== 'sold')
//                     .map((grade: any, index: number, arr: any[]) => (
//                       <View
//                         key={grade._id}
//                         className={`mt-3 pb-3 ${index !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}
//                       >
//                         <View className="flex-row justify-between items-center">
//                           <Text className="text-lg font-medium text-gray-900">
//                             {grade.grade}
//                           </Text>

//                           <Text className="text-green-700 font-medium text-base">
//                             ₹{grade.pricePerUnit}/{product.unitMeasurement}
//                           </Text>
//                         </View>

//                         <Text className="text-gray-600 mt-1">
//                           Quantity: {grade.totalQty} {product.unitMeasurement}
//                         </Text>

//                         {/* BUTTONS */}
//                         <View className="flex-row mt-3">
//                           <TouchableOpacity
//                             className="flex-1 bg-green-600 rounded-lg py-2 mr-2 items-center"
//                             onPress={() => handleAcceptOffer(product, grade)}
//                           >
//                             <Text className="text-white font-semibold text-sm">
//                               Accept Price
//                             </Text>
//                           </TouchableOpacity>

//                           {grade.priceType === 'negotiable' && (
//                             <TouchableOpacity
//                               className="flex-1 border border-green-600 rounded-lg py-2 items-center"
//                             >
//                               <Text className="text-green-700 font-semibold text-sm">
//                                 Make Offer
//                               </Text>
//                             </TouchableOpacity>
//                           )}
//                         </View>
//                       </View>
//                     ))}
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default Allcrops;








// import { Feather } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { ChevronLeft } from 'lucide-react-native';
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
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [gradeOffers, setGradeOffers] = useState<{[gradeId: string]: { price: string; quantity: string }}>({});
//   const [showOfferModal, setShowOfferModal] = useState(false);
//   const [quantityInput, setQuantityInput] = useState("");
//   const [showQuantityModal, setShowQuantityModal] = useState(false);
//   const [selectedGrade, setSelectedGrade] = useState<any>(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const traderId = await AsyncStorage.getItem("traderId");
//       const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${traderId}`);
//       const data = await res.json();
//       setProducts(data.data || []);
//       setError(null);
//     } catch (err) {
//       setError("Failed to load products");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
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

//   return (<SafeAreaView className="flex-1 bg-white">
//     <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           className="p-2"
//         >
//           <ChevronLeft size={24} color="#374151" />  
           
//         </TouchableOpacity>
//          <Text className="text-2xl font-medium text-gray-900">Available Crops</Text>
//       </View>
//     <View className="flex-1 bg-gray-50">
//       <ScrollView
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#16a34a"]} />}
//       >
       

//         {error && (
//           <View className="m-4 p-4 bg-red-50 border border-red-200 rounded-xl">
//             <Text className="text-red-700 text-sm font-medium">{error}</Text>
//           </View>
//         )}

//         {products.length === 0 ? (
//           <View className="items-center justify-center p-10 mt-10">
//             <Text className="text-6xl mb-4">🌾</Text>
//             <Text className="text-lg font-semibold text-gray-700 mb-2">No products available</Text>
//             <Text className="text-gray-400 text-sm">Check back later for new listings</Text>
//           </View>
//         ) : (
//           <View className="p-4">
//             {products.map((product) => (
//               <View
//                 key={product._id}
//                 className="bg-white border border-gray-200 rounded-lg mb-5 p-3"
//               >
//                 {/* Product Image with Badge */}
//                 <View className="relative">
//                   <Image
//                     source={{ uri: getImageUrl(product.cropPhotos?.[0]) }}
//                     className="w-full h-56 rounded-lg"
//                     resizeMode="cover"
//                   />
                  
//                   <View className="absolute top-3 left-3 bg-green-600 px-4 py-1.5 rounded-full">
//                     <Text className="text-white text-xs font-medium">{product.farmingType}</Text>
//                   </View>
//                 </View>

//                 {/* Product Details */}
//                 <View className="p-4">
//                   {/* Product Title */}
//                   <Text className="text-xl font-medium text-gray-900 mb-3">
//                     {product.cropBriefDetails}
//                   </Text>

//                   {/* Product ID Badge */}
//                   <View className="bg-green-600 px-3 py-1.5 rounded-full self-start mb-3">
//                     <Text className="text-white text-xs font-medium">{product.productId}</Text>
//                   </View>

//                   {/* Category Tags */}
//                   <View className="flex-row flex-wrap mb-4">
//                     <View className="bg-gray-100 px-4 py-1.5 rounded-full mr-2 mb-2">
//                       <Text className="text-gray-700 text-sm font-medium">
//                         {product.categoryId?.categoryName}
//                       </Text>
//                     </View>
//                     <View className="bg-gray-100 px-4 py-1.5 rounded-full mb-2">
//                       <Text className="text-gray-700 text-sm font-medium">
//                         {product.subCategoryId?.subCategoryName}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Grades Section */}
//                   {product.gradePrices
//                     .filter((g: any) => g.status !== "sold")
//                     .map((grade: any, index: number) => (
//                       <View
//                         key={grade._id}
//                         className={`py-4 ${
//                           index !== product.gradePrices.filter((g: any) => g.status !== "sold").length - 1
//                             ? "border-b border-gray-100"
//                             : "border border-gray-200 p-3 rounded-lg"
//                         }`}
//                       >
//                         {/* Grade Header */}
//                         <View className="flex-row justify-between items-center mb-2">
//                           <Text className="text-lg font-medium text-gray-900">{grade.grade}</Text>
//                           <Text className="text-xl font-medium text-green-600">
//                             ₹{grade.pricePerUnit}/{product.unitMeasurement}
//                           </Text>
//                         </View>

//                         {/* Quantity */}
//                         <Text className="text-gray-600 text-sm mb-3">
//                           Quantity: {grade.totalQty} {product.unitMeasurement}
//                         </Text>

//                         {/* Badges */}
//                         <View className="flex-row flex-wrap mb-3">
//                           {grade.priceType === "negotiable" ? (
//                             <View className="bg-yellow-100 px-3 py-1 rounded-full mr-2 mb-1">
//                               <Text className="text-yellow-800 text-xs font-semibold">Negotiable</Text>
//                             </View>
//                           ) : (
//                             <View className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-1">
//                               <Text className="text-green-800 text-xs font-semibold">Fixed Price</Text>
//                             </View>
//                           )}

//                           {grade.quantityType === "bulk" && (
//                             <View className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-1">
//                               <Text className="text-blue-800 text-xs font-semibold">Bulk Only</Text>
//                             </View>
//                           )}

//                           {grade.status === "partially_sold" && (
//                             <View className="bg-orange-100 px-3 py-1 rounded-full mb-1">
//                               <Text className="text-orange-800 text-xs font-semibold">Partially Sold</Text>
//                             </View>
//                           )}
//                         </View>

//                         {/* Action Buttons */}
//                         <View className="flex-row">
//                           <TouchableOpacity
//                             className={`flex-1 bg-green-600 rounded-xl py-3 mr-2 items-center ${
//                               grade.totalQty === 0 ? "opacity-50" : ""
//                             }`}
//                             disabled={grade.totalQty === 0}
//                             onPress={() => handleAcceptOffer(product, grade)}
//                           >
//                             <Text className="text-white font-medium text-sm">Accept Price</Text>
//                           </TouchableOpacity>

//                           {grade.priceType === "negotiable" && (
//                             <TouchableOpacity
//                               className={`flex-1 border-2 border-green-600 rounded-xl py-3 items-center ${
//                                 grade.totalQty === 0 ? "opacity-50" : ""
//                               }`}
//                               disabled={grade.totalQty === 0}
//                               onPress={() => handleMakeOffer(product)}
//                             >
//                               <Text className="text-green-600 font-medium text-sm">Make Offer</Text>
//                             </TouchableOpacity>
//                           )}
//                         </View>
//                       </View>
//                     ))}

//                   {/* Product Info Footer */}
//                   <View className="mt-4 pt-4 border-t border-gray-100 flex-row justify-between">
//   <View className="flex-row items-center">
//     <Feather name="package" size={16} color="#6B7280" />
//     <Text className="text-gray-600 text-sm ml-1.5">
//       {product.packageMeasurement} {product.packagingType}
//     </Text>
//   </View>

//   <View className="flex-row items-center">
//     <Feather name="calendar" size={16} color="#6B7280" />
//     <Text className="text-gray-600 text-sm ml-1.5">
//       {new Date(product.deliveryDate).toLocaleDateString()}
//     </Text>
//   </View>

//   <View className="flex-row items-center">
//     <Feather name="clock" size={16} color="#6B7280" />
//     <Text className="text-gray-600 text-sm ml-1.5">
//       {product.deliveryTime}
//     </Text>
//   </View>
// </View>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}
//       </ScrollView>

//       {/* Quantity Modal */}
//       <Modal visible={showQuantityModal} transparent animationType="fade">
//         <View className="flex-1 bg-black/50 justify-center items-center px-5">
//           <View className="bg-white rounded-2xl p-6 w-full">
//             <Text className="text-xl font-medium text-gray-900 mb-2">Enter Quantity</Text>

//             {selectedGrade && selectedProduct && (
//               <Text className="text-gray-500 mb-4 text-sm">
//                 Maximum: {selectedGrade.totalQty} {selectedProduct.unitMeasurement}
//               </Text>
//             )}

//             <TextInput
//               className="border border-gray-300 rounded-xl p-4 text-base mb-5 bg-gray-50"
//               value={quantityInput}
//               onChangeText={setQuantityInput}
//               keyboardType="numeric"
//               placeholder="Enter quantity"
//               placeholderTextColor="#9ca3af"
//             />

//             <View className="flex-row justify-end">
//               <TouchableOpacity
//                 className="bg-gray-200 px-5 py-3 rounded-xl mr-3"
//                 onPress={() => setShowQuantityModal(false)}
//               >
//                 <Text className="text-gray-700 font-semibold">Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 className="bg-green-600 px-5 py-3 rounded-xl" 
//                 onPress={handleQuantitySubmit}
//               >
//                 <Text className="text-white font-semibold">Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Offer Modal */}
//       <Modal visible={showOfferModal} transparent animationType="slide">
//         <View className="flex-1 bg-black/50 justify-center items-center px-3">
//           <View className="bg-white rounded-2xl w-full max-h-[85%]">
//             <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
//               <Text className="text-xl font-medium text-gray-900">Make Your Bid</Text>
//               <TouchableOpacity onPress={() => setShowOfferModal(false)}>
//                 <Text className="text-2xl text-gray-400 font-medium">✕</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView className="p-5">
//               <View className="bg-cyan-50 p-4 rounded-xl mb-4 border border-cyan-200">
//                 <Text className="text-xs text-cyan-900">
//                   💡 Enter your bid price and quantity for each grade. Leave blank to skip.
//                 </Text>
//               </View>

//               {selectedProduct &&
//                 selectedProduct.gradePrices
//                   .filter((g: any) => g.status !== "sold" && g.priceType === "negotiable")
//                   .map((grade: any) => {
//                     const offer = gradeOffers[grade._id] || { price: "", quantity: "" };
//                     const amount =
//                       offer.price && offer.quantity
//                         ? (Number(offer.price) * Number(offer.quantity)).toFixed(2)
//                         : "-";

//                     return (
//                       <View key={grade._id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
//                         <View className="flex-row items-center mb-3">
//                           <Text className="text-base font-medium text-gray-900">{grade.grade}</Text>
//                           {grade.quantityType === "bulk" && (
//                             <View className="bg-cyan-600 px-2 py-1 rounded-full ml-2">
//                               <Text className="text-white text-[10px] font-medium">BULK</Text>
//                             </View>
//                           )}
//                         </View>

//                         <View className="flex-row mb-3">
//                           <View className="flex-1 mr-2">
//                             <Text className="text-xs text-gray-600 mb-2 font-medium">Price (₹)</Text>
//                             <TextInput
//                               className="border border-gray-300 rounded-lg px-3 py-3 bg-white text-sm"
//                               placeholder={`₹${grade.pricePerUnit}`}
//                               placeholderTextColor="#9ca3af"
//                               value={offer.price}
//                               onChangeText={(v) => updateGradeOffer(grade._id, "price", v)}
//                               keyboardType="numeric"
//                             />
//                           </View>

//                           <View className="flex-1">
//                             <Text className="text-xs text-gray-600 mb-2 font-medium">
//                               Qty ({selectedProduct.unitMeasurement})
//                             </Text>
//                             <TextInput
//                               className="border border-gray-300 rounded-lg px-3 py-3 bg-white text-sm"
//                               placeholder={`Max: ${grade.totalQty}`}
//                               placeholderTextColor="#9ca3af"
//                               value={offer.quantity}
//                               onChangeText={(v) => updateGradeOffer(grade._id, "quantity", v)}
//                               editable={grade.quantityType !== "bulk"}
//                               keyboardType="numeric"
//                             />
//                           </View>
//                         </View>

//                         <View className="bg-white p-2 rounded-lg">
//                           <Text className="text-gray-600 text-sm">
//                             Amount:{" "}
//                             <Text className="text-green-700 font-medium">
//                               {amount !== "-" ? `₹${amount}` : "-"}
//                             </Text>
//                           </Text>
//                         </View>
//                       </View>
//                     );
//                   })}

//               <View className="bg-green-50 p-4 rounded-xl border border-green-200 flex-row justify-between items-center mt-2">
//                 <Text className="text-base font-semibold text-gray-900">Total Bid:</Text>
//                 <Text className="text-2xl font-medium text-green-700">
//                   ₹{calculateTotalBid().toFixed(2)}
//                 </Text>
//               </View>
//             </ScrollView>

//             <View className="flex-row justify-end p-5 border-t border-gray-200">
//               <TouchableOpacity
//                 className="bg-gray-200 px-5 py-3 rounded-xl mr-3"
//                 onPress={() => setShowOfferModal(false)}
//               >
//                 <Text className="text-gray-700 font-semibold">Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 className="bg-green-600 px-6 py-3 rounded-xl" 
//                 onPress={submitOffer}
//               >
//                 <Text className="text-white font-semibold">Submit Bid</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//     </SafeAreaView>
//   );
// };

// export default Allcrops;








import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Filter, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Allcrops: React.FC = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [gradeOffers, setGradeOffers] = useState<{[gradeId: string]: { price: string; quantity: string }}>({});
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [quantityInput, setQuantityInput] = useState("");
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFarmingType, setSelectedFarmingType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [farmingTypes, setFarmingTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedFarmingType, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const traderId = await AsyncStorage.getItem("traderId");
      const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${traderId}`);
      const data = await res.json();
      const productsData = data.data || [];
      setProducts(productsData);
      
      // Extract unique farming types and categories
      const uniqueFarmingTypes = [...new Set(productsData.map((p: any) => p.farmingType).filter(Boolean))];
      const uniqueCategories = [...new Set(productsData.map((p: any) => p.categoryId?.categoryName).filter(Boolean))];
      
      setFarmingTypes(uniqueFarmingTypes);
      setCategories(uniqueCategories);
      setError(null);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        const cropName = product.cropBriefDetails?.toLowerCase() || "";
        const productId = product.productId?.toLowerCase() || "";
        const categoryName = product.categoryId?.categoryName?.toLowerCase() || "";
        const subCategoryName = product.subCategoryId?.subCategoryName?.toLowerCase() || "";
        
        return (
          cropName.includes(query) ||
          productId.includes(query) ||
          categoryName.includes(query) ||
          subCategoryName.includes(query)
        );
      });
    }

    // Apply farming type filter
    if (selectedFarmingType !== "all") {
      filtered = filtered.filter((product) => product.farmingType === selectedFarmingType);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.categoryId?.categoryName === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFarmingType("all");
    setSelectedCategory("all");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedFarmingType !== "all") count++;
    if (selectedCategory !== "all") count++;
    return count;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const getImageUrl = (path: string) => {
    if (!path) return "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400";
    if (path.startsWith("http")) return path;
    return `https://kisan.etpl.ai/${path}`;
  };

  const handleAcceptOffer = async (product: any, grade: any) => {
    const traderId = await AsyncStorage.getItem("traderId");
    const traderName = (await AsyncStorage.getItem("traderName")) || "Unknown Trader";

    if (!traderId) {
      Alert.alert("Error", "Please login as a trader first");
      return;
    }

    const maxQty = grade.totalQty;

    if (grade.quantityType === "bulk") {
      const totalAmount = grade.pricePerUnit * maxQty;
      Alert.alert(
        "Confirm Purchase",
        `Product: ${product.cropBriefDetails}\nGrade: ${grade.grade}\nPrice: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nQuantity: ${maxQty} ${product.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(
          2
        )}\n\nThis is a bulk purchase. You must buy the full quantity.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: () => processPurchase(product, grade, traderId, traderName, maxQty),
          },
        ]
      );
    } else {
      setSelectedProduct(product);
      setSelectedGrade(grade);
      setQuantityInput("");
      setShowQuantityModal(true);
    }
  };

  const handleQuantitySubmit = async () => {
    const traderId = await AsyncStorage.getItem("traderId");
    const traderName = (await AsyncStorage.getItem("traderName")) || "Unknown Trader";

    const numQuantity = Number(quantityInput);
    const maxQty = selectedGrade.totalQty;

    if (!quantityInput || isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    if (numQuantity > maxQty) {
      Alert.alert("Error", `Maximum available quantity is ${maxQty}`);
      return;
    }

    const totalAmount = selectedGrade.pricePerUnit * numQuantity;

    setShowQuantityModal(false);

    Alert.alert(
      "Confirm Purchase",
      `Product: ${selectedProduct.cropBriefDetails}\nGrade: ${selectedGrade.grade}\nPrice: ₹${selectedGrade.pricePerUnit}/${selectedProduct.unitMeasurement}\nQuantity: ${numQuantity} ${selectedProduct.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(
        2
      )}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => processPurchase(selectedProduct, selectedGrade, traderId, traderName, numQuantity),
        },
      ]
    );
  };

  const processPurchase = async (product: any, grade: any, traderId: string, traderName: string, quantity: number) => {
    try {
      const response = await fetch("https://kisan.etpl.ai/product/accept-listed-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          gradeId: grade._id,
          traderId,
          traderName,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "✅ Purchase Successful!",
          `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${
            data.data.remainingQty
          } ${product.unitMeasurement}\n\nProceeding to payment...`
        );
        fetchProducts();
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process purchase. Please try again.");
    }
  };

  const handleMakeOffer = (product: any) => {
    AsyncStorage.getItem("traderId").then((traderId) => {
      if (!traderId) {
        Alert.alert("Error", "Please login as a trader first");
        return;
      }

      const initialOffers: { [key: string]: { price: string; quantity: string } } = {};
      product.gradePrices
        .filter((g: any) => g.status !== "sold" && g.priceType === "negotiable")
        .forEach((grade: any) => {
          initialOffers[grade._id] = {
            price: grade.pricePerUnit.toString(),
            quantity: grade.quantityType === "bulk" ? grade.totalQty.toString() : "",
          };
        });

      setSelectedProduct(product);
      setGradeOffers(initialOffers);
      setShowOfferModal(true);
    });
  };

  const submitOffer = async () => {
    const traderId = await AsyncStorage.getItem("traderId");
    const traderName = (await AsyncStorage.getItem("traderName")) || "Unknown Trader";

    const hasValidOffer = Object.values(gradeOffers).some((offer) => offer.price && offer.quantity);

    if (!hasValidOffer) {
      Alert.alert("Error", "Please enter price and quantity for at least one grade");
      return;
    }

    const offers: any[] = [];
    for (const [gradeId, offer] of Object.entries(gradeOffers)) {
      if (offer.price && offer.quantity) {
        const grade = selectedProduct.gradePrices.find((g: any) => g._id === gradeId);

        const numPrice = Number(offer.price);
        const numQuantity = Number(offer.quantity);

        if (numQuantity > grade.totalQty) {
          Alert.alert("Error", `${grade.grade}: Maximum available is ${grade.totalQty}`);
          return;
        }

        if (grade.quantityType === "bulk" && numQuantity !== grade.totalQty) {
          Alert.alert("Error", `${grade.grade}: Bulk purchase requires full quantity`);
          return;
        }

        offers.push({
          gradeId,
          gradeName: grade.grade,
          offeredPrice: numPrice,
          quantity: numQuantity,
          listedPrice: grade.pricePerUnit,
        });
      }
    }

    const totalAmount = offers.reduce((sum, o) => sum + o.offeredPrice * o.quantity, 0);
    const offerSummary = offers
      .map((o) => `${o.gradeName}: ₹${o.offeredPrice} × ${o.quantity} = ₹${(o.offeredPrice * o.quantity).toFixed(2)}`)
      .join("\n");

    Alert.alert("Confirm Your Bid", `${offerSummary}\n\nTotal Bid Amount: ₹${totalAmount.toFixed(2)}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Submit",
        onPress: () => processOfferSubmission(offers, traderId!, traderName),
      },
    ]);
  };

  const processOfferSubmission = async (offers: any[], traderId: string, traderName: string) => {
    try {
      if (offers.length === 1) {
        const offer = offers[0];
        const response = await fetch("https://kisan.etpl.ai/product/make-offer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: selectedProduct._id,
            gradeId: offer.gradeId,
            traderId,
            traderName,
            offeredPrice: offer.offeredPrice,
            quantity: offer.quantity,
          }),
        });

        const data = await response.json();

        if (data.success) {
          Alert.alert("Success", "✅ Offer submitted successfully!\n\nThe farmer will review your bid.");
          setShowOfferModal(false);
          fetchProducts();
        } else {
          Alert.alert("Error", data.message);
        }
      } else {
        const response = await fetch("https://kisan.etpl.ai/product/make-offer-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: selectedProduct._id,
            traderId,
            traderName,
            offers: offers.map((o) => ({
              gradeId: o.gradeId,
              offeredPrice: o.offeredPrice,
              quantity: o.quantity,
            })),
          }),
        });

        const data = await response.json();

        if (data.success) {
          Alert.alert("Success", "✅ All offers submitted successfully!\n\nThe farmer will review your bid.");
          setShowOfferModal(false);
          fetchProducts();
        } else {
          Alert.alert("Error", "Some offers failed. Please try again.");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit offers. Please try again.");
    }
  };

  const updateGradeOffer = (gradeId: string, field: "price" | "quantity", value: string) => {
    setGradeOffers((prev) => ({
      ...prev,
      [gradeId]: {
        ...prev[gradeId],
        [field]: value,
      },
    }));
  };

  const calculateTotalBid = () => {
    return Object.entries(gradeOffers).reduce((sum, [_, offer]) => {
      if (offer.price && offer.quantity) return sum + Number(offer.price) * Number(offer.quantity);
      return sum;
    }, 0);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-2 text-gray-500 text-base">Loading products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white shadow-sm">
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-medium text-gray-900">Available Crops</Text>
        </View>

        {/* Search and Filter Bar */}
        <View className="px-4 pb-4">
          <View className="flex-row items-center">
            {/* Search Input */}
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mr-2">
              <Search size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-gray-900 text-base"
                placeholder="Search crops, categories..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Button */}
            <TouchableOpacity
              className="bg-green-600 rounded-xl p-3 relative"
              onPress={() => setShowFilterModal(true)}
            >
              <Filter size={24} color="#FFFFFF" />
              {getActiveFilterCount() > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">{getActiveFilterCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active Filters Display */}
          {(selectedFarmingType !== "all" || selectedCategory !== "all" || searchQuery) && (
            <View className="flex-row flex-wrap mt-3">
              {searchQuery && (
                <View className="bg-blue-100 px-3 py-1.5 rounded-full mr-2 mb-2 flex-row items-center">
                  <Text className="text-blue-800 text-xs font-medium mr-1">Search: {searchQuery}</Text>
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <X size={14} color="#1E40AF" />
                  </TouchableOpacity>
                </View>
              )}
              
              {selectedFarmingType !== "all" && (
                <View className="bg-green-100 px-3 py-1.5 rounded-full mr-2 mb-2 flex-row items-center">
                  <Text className="text-green-800 text-xs font-medium mr-1">{selectedFarmingType}</Text>
                  <TouchableOpacity onPress={() => setSelectedFarmingType("all")}>
                    <X size={14} color="#166534" />
                  </TouchableOpacity>
                </View>
              )}
              
              {selectedCategory !== "all" && (
                <View className="bg-purple-100 px-3 py-1.5 rounded-full mr-2 mb-2 flex-row items-center">
                  <Text className="text-purple-800 text-xs font-medium mr-1">{selectedCategory}</Text>
                  <TouchableOpacity onPress={() => setSelectedCategory("all")}>
                    <X size={14} color="#6B21A8" />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                className="bg-red-100 px-3 py-1.5 rounded-full mb-2"
                onPress={clearFilters}
              >
                <Text className="text-red-800 text-xs font-medium">Clear All</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Results Count */}
          <Text className="text-gray-500 text-sm mt-2">
            Showing {filteredProducts.length} of {products.length} products
          </Text>
        </View>
      </View>

      <View className="flex-1 bg-gray-50">
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#16a34a"]} />}
        >
          {error && (
            <View className="m-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <Text className="text-red-700 text-sm font-medium">{error}</Text>
            </View>
          )}

          {filteredProducts.length === 0 ? (
            <View className="items-center justify-center p-10 mt-10">
              <Text className="text-6xl mb-4">🌾</Text>
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                {searchQuery || selectedFarmingType !== "all" || selectedCategory !== "all"
                  ? "No products match your filters"
                  : "No products available"}
              </Text>
              <Text className="text-gray-400 text-sm text-center">
                {searchQuery || selectedFarmingType !== "all" || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Check back later for new listings"}
              </Text>
            </View>
          ) : (
            <View className="p-4">
              {filteredProducts.map((product) => (
                <View
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-lg mb-5 p-3"
                >
                  {/* Product Image with Badge */}
                  <View className="relative">
                    <Image
                      source={{ uri: getImageUrl(product.cropPhotos?.[0]) }}
                      className="w-full h-56 rounded-lg"
                      resizeMode="cover"
                    />
                    
                    <View className="absolute top-3 left-3 bg-green-600 px-4 py-1.5 rounded-full">
                      <Text className="text-white text-xs font-medium">{product.farmingType}</Text>
                    </View>
                  </View>

                  {/* Product Details */}
                  <View className="p-4">
                    {/* Product Title */}
                    <Text className="text-xl font-medium text-gray-900 mb-3">
                      {product.cropBriefDetails}
                    </Text>

                    {/* Product ID Badge */}
                    <View className="bg-green-600 px-3 py-1.5 rounded-full self-start mb-3">
                      <Text className="text-white text-xs font-medium">{product.productId}</Text>
                    </View>

                    {/* Category Tags */}
                    <View className="flex-row flex-wrap mb-4">
                      <View className="bg-gray-100 px-4 py-1.5 rounded-full mr-2 mb-2">
                        <Text className="text-gray-700 text-sm font-medium">
                          {product.categoryId?.categoryName}
                        </Text>
                      </View>
                      <View className="bg-gray-100 px-4 py-1.5 rounded-full mb-2">
                        <Text className="text-gray-700 text-sm font-medium">
                          {product.subCategoryId?.subCategoryName}
                        </Text>
                      </View>
                    </View>

                    {/* Grades Section */}
                    {product.gradePrices
                      .filter((g: any) => g.status !== "sold")
                      .map((grade: any, index: number) => (
                        <View
                          key={grade._id}
                          className={`py-4 ${
                            index !== product.gradePrices.filter((g: any) => g.status !== "sold").length - 1
                              ? "border-b border-gray-100"
                              : "border border-gray-200 p-3 rounded-lg"
                          }`}
                        >
                          {/* Grade Header */}
                          <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-lg font-medium text-gray-900">{grade.grade}</Text>
                            <Text className="text-xl font-medium text-green-600">
                              ₹{grade.pricePerUnit}/{product.unitMeasurement}
                            </Text>
                          </View>

                          {/* Quantity */}
                          <Text className="text-gray-600 text-sm mb-3">
                            Quantity: {grade.totalQty} {product.unitMeasurement}
                          </Text>

                          {/* Badges */}
                          <View className="flex-row flex-wrap mb-3">
                            {grade.priceType === "negotiable" ? (
                              <View className="bg-yellow-100 px-3 py-1 rounded-full mr-2 mb-1">
                                <Text className="text-yellow-800 text-xs font-semibold">Negotiable</Text>
                              </View>
                            ) : (
                              <View className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-1">
                                <Text className="text-green-800 text-xs font-semibold">Fixed Price</Text>
                              </View>
                            )}

                            {grade.quantityType === "bulk" && (
                              <View className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-1">
                                <Text className="text-blue-800 text-xs font-semibold">Bulk Only</Text>
                              </View>
                            )}

                            {grade.status === "partially_sold" && (
                              <View className="bg-orange-100 px-3 py-1 rounded-full mb-1">
                                <Text className="text-orange-800 text-xs font-semibold">Partially Sold</Text>
                              </View>
                            )}
                          </View>

                          {/* Action Buttons */}
                          <View className="flex-row">
                            <TouchableOpacity
                              className={`flex-1 bg-green-600 rounded-xl py-3 mr-2 items-center ${
                                grade.totalQty === 0 ? "opacity-50" : ""
                              }`}
                              disabled={grade.totalQty === 0}
                              onPress={() => handleAcceptOffer(product, grade)}
                            >
                              <Text className="text-white font-medium text-sm">Accept Price</Text>
                            </TouchableOpacity>

                            {grade.priceType === "negotiable" && (
                              <TouchableOpacity
                                className={`flex-1 border-2 border-green-600 rounded-xl py-3 items-center ${
                                  grade.totalQty === 0 ? "opacity-50" : ""
                                }`}
                                disabled={grade.totalQty === 0}
                                onPress={() => handleMakeOffer(product)}
                              >
                                <Text className="text-green-600 font-medium text-sm">Make Offer</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      ))}

                    {/* Product Info Footer */}
                    <View className="mt-4 pt-4 border-t border-gray-100 flex-row justify-between">
                      <View className="flex-row items-center">
                        <Feather name="package" size={16} color="#6B7280" />
                        <Text className="text-gray-600 text-sm ml-1.5">
                          {product.packageMeasurement} {product.packagingType}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Feather name="calendar" size={16} color="#6B7280" />
                        <Text className="text-gray-600 text-sm ml-1.5">
                          {new Date(product.deliveryDate).toLocaleDateString()}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Feather name="clock" size={16} color="#6B7280" />
                        <Text className="text-gray-600 text-sm ml-1.5">
                          {product.deliveryTime}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Filter Modal */}
        <Modal visible={showFilterModal} transparent animationType="slide">
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl">
              <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
                <Text className="text-xl font-medium text-gray-900">Filter Products</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView className="p-5" style={{ maxHeight: 500 }}>
                {/* Farming Type Filter */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">Farming Type</Text>
                  <View className="flex-row flex-wrap">
                    <TouchableOpacity
                      className={`px-4 py-2.5 rounded-xl mr-2 mb-2 ${
                        selectedFarmingType === "all" ? "bg-green-600" : "bg-gray-100"
                      }`}
                      onPress={() => setSelectedFarmingType("all")}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selectedFarmingType === "all" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        All Types
                      </Text>
                    </TouchableOpacity>

                    {farmingTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        className={`px-4 py-2.5 rounded-xl mr-2 mb-2 ${
                          selectedFarmingType === type ? "bg-green-600" : "bg-gray-100"
                        }`}
                        onPress={() => setSelectedFarmingType(type)}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            selectedFarmingType === type ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Category Filter */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">Category</Text>
                  <View className="flex-row flex-wrap">
                    <TouchableOpacity
                      className={`px-4 py-2.5 rounded-xl mr-2 mb-2 ${
                        selectedCategory === "all" ? "bg-green-600" : "bg-gray-100"
                      }`}
                      onPress={() => setSelectedCategory("all")}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selectedCategory === "all" ? "text-white" : "text-gray-700"
                        }`}
                      >
                        All Categories
                      </Text>
                    </TouchableOpacity>

                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        className={`px-4 py-2.5 rounded-xl mr-2 mb-2 ${
                          selectedCategory === category ? "bg-green-600" : "bg-gray-100"
                        }`}
                        onPress={() => setSelectedCategory(category)}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            selectedCategory === category ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View className="flex-row p-5 border-t border-gray-200">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 rounded-xl py-3.5 mr-3"
                  onPress={clearFilters}
                >
                  <Text className="text-gray-700 font-semibold text-center">Clear All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-green-600 rounded-xl py-3.5"
                  onPress={() => setShowFilterModal(false)}
                >
                  <Text className="text-white font-semibold text-center">Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Quantity Modal */}
        <Modal visible={showQuantityModal} transparent animationType="fade">
          <View className="flex-1 bg-black/50 justify-center items-center px-5">
            <View className="bg-white rounded-2xl p-6 w-full">
              <Text className="text-xl font-medium text-gray-900 mb-2">Enter Quantity</Text>

              {selectedGrade && selectedProduct && (
                <Text className="text-gray-500 mb-4 text-sm">
                  Maximum: {selectedGrade.totalQty} {selectedProduct.unitMeasurement}
                </Text>
              )}

              <TextInput
                className="border border-gray-300 rounded-xl p-4 text-base mb-5 bg-gray-50"
                value={quantityInput}
                onChangeText={setQuantityInput}
                keyboardType="numeric"
                placeholder="Enter quantity"
                placeholderTextColor="#9ca3af"
              />

              <View className="flex-row justify-end">
                <TouchableOpacity
                  className="bg-gray-200 px-5 py-3 rounded-xl mr-3"
                  onPress={() => setShowQuantityModal(false)}
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="bg-green-600 px-5 py-3 rounded-xl" 
                  onPress={handleQuantitySubmit}
                >
                  <Text className="text-white font-semibold">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Offer Modal */}
        <Modal visible={showOfferModal} transparent animationType="slide">
          <View className="flex-1 bg-black/50 justify-center items-center px-3">
            <View className="bg-white rounded-2xl w-full max-h-[85%]">
              <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
                <Text className="text-xl font-medium text-gray-900">Make Your Bid</Text>
                <TouchableOpacity onPress={() => setShowOfferModal(false)}>
                  <Text className="text-2xl text-gray-400 font-medium">✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView className="p-5">
                <View className="bg-cyan-50 p-4 rounded-xl mb-4 border border-cyan-200">
                  <Text className="text-xs text-cyan-900">
                    💡 Enter your bid price and quantity for each grade. Leave blank to skip.
                  </Text>
                </View>

                {selectedProduct &&
                  selectedProduct.gradePrices
                    .filter((g: any) => g.status !== "sold" && g.priceType === "negotiable")
                    .map((grade: any) => {
                      const offer = gradeOffers[grade._id] || { price: "", quantity: "" };
                      const amount =
                        offer.price && offer.quantity
                          ? (Number(offer.price) * Number(offer.quantity)).toFixed(2)
                          : "-";

                      return (
                        <View key={grade._id} className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
                          <View className="flex-row items-center mb-3">
                            <Text className="text-base font-medium text-gray-900">{grade.grade}</Text>
                            {grade.quantityType === "bulk" && (
                              <View className="bg-cyan-600 px-2 py-1 rounded-full ml-2">
                                <Text className="text-white text-[10px] font-medium">BULK</Text>
                              </View>
                            )}
                          </View>

                          <View className="flex-row mb-3">
                            <View className="flex-1 mr-2">
                              <Text className="text-xs text-gray-600 mb-2 font-medium">Price (₹)</Text>
                              <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-3 bg-white text-sm"
                                placeholder={`₹${grade.pricePerUnit}`}
                                placeholderTextColor="#9ca3af"
                                value={offer.price}
                                onChangeText={(v) => updateGradeOffer(grade._id, "price", v)}
                                keyboardType="numeric"
                              />
                            </View>

                            <View className="flex-1">
                              <Text className="text-xs text-gray-600 mb-2 font-medium">
                                Qty ({selectedProduct.unitMeasurement})
                              </Text>
                              <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-3 bg-white text-sm"
                                placeholder={`Max: ${grade.totalQty}`}
                                placeholderTextColor="#9ca3af"
                                value={offer.quantity}
                                onChangeText={(v) => updateGradeOffer(grade._id, "quantity", v)}
                                editable={grade.quantityType !== "bulk"}
                                keyboardType="numeric"
                              />
                            </View>
                          </View>

                          <View className="bg-white p-2 rounded-lg">
                            <Text className="text-gray-600 text-sm">
                              Amount:{" "}
                              <Text className="text-green-700 font-medium">
                                {amount !== "-" ? `₹${amount}` : "-"}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      );
                    })}

                <View className="bg-green-50 p-4 rounded-xl border border-green-200 flex-row justify-between items-center mt-2">
                  <Text className="text-base font-semibold text-gray-900">Total Bid:</Text>
                  <Text className="text-2xl font-medium text-green-700">
                    ₹{calculateTotalBid().toFixed(2)}
                  </Text>
                </View>
              </ScrollView>

              <View className="flex-row justify-end p-5 border-t border-gray-200">
                <TouchableOpacity
                  className="bg-gray-200 px-5 py-3 rounded-xl mr-3"
                  onPress={() => setShowOfferModal(false)}
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="bg-green-600 px-6 py-3 rounded-xl" 
                  onPress={submitOffer}
                >
                  <Text className="text-white font-semibold">Submit Bid</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Allcrops;