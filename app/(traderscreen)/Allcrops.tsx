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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { Filter, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
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
  View
} from 'react-native';

const Allcrops: React.FC = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [gradeOffers, setGradeOffers] = useState<{ [gradeId: string]: { price: string, quantity: string } }>({});
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [quantityInput, setQuantityInput] = useState('');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFarmingType, setSelectedFarmingType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [categories, setCategories] = useState<string[]>([]);
  const [farmingTypes, setFarmingTypes] = useState<string[]>([]);

  // Get category from Home page navigation
  useEffect(() => {
    if (params.selectedCategory) {
      const category = params.selectedCategory as string;
      setSelectedCategory(category);

      // Add category to the categories list if not already there
      if (category !== 'all' && !categories.includes(category)) {
        setCategories(prev => [...prev, category]);
      }
    }
  }, [params.selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, selectedFarmingType, priceRange, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const traderId = await AsyncStorage.getItem('traderId');
      const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${traderId}`);
      const data = await res.json();
      const productsData = data.data || [];
      setProducts(productsData);
      setError(null);

      // Extract unique categories and farming types
      const uniqueCategories = Array.from(
        new Set(productsData.map((p: any) => p.categoryId?.categoryName).filter(Boolean))
      ) as string[];

      const uniqueFarmingTypes = Array.from(
        new Set(productsData.map((p: any) => p.farmingType).filter(Boolean))
      ) as string[];

      // If we have a category from params, add it to the list
      if (params.selectedCategory && !uniqueCategories.includes(params.selectedCategory as string)) {
        uniqueCategories.push(params.selectedCategory as string);
      }

      setCategories(uniqueCategories);
      setFarmingTypes(uniqueFarmingTypes);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.cropBriefDetails?.toLowerCase().includes(query) ||
        product.productId?.toLowerCase().includes(query) ||
        product.categoryId?.categoryName?.toLowerCase().includes(query) ||
        product.subCategoryId?.subCategoryName?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.categoryId?.categoryName === selectedCategory
      );
    }

    // Apply farming type filter
    if (selectedFarmingType !== 'all') {
      filtered = filtered.filter(product =>
        product.farmingType === selectedFarmingType
      );
    }

    // Apply price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product =>
        product.gradePrices.some((grade: any) => {
          const price = grade.pricePerUnit;
          const min = priceRange.min ? parseFloat(priceRange.min) : 0;
          const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
          return price >= min && price <= max;
        })
      );
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFarmingType('all');
    setPriceRange({ min: '', max: '' });
    // Note: This won't clear the category from params, 
    // but it will show all products again
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedFarmingType !== 'all') count++;
    if (priceRange.min || priceRange.max) count++;
    return count;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const getImageUrl = (path: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
    if (path.startsWith('http')) return path;
    return `https://kisan.etpl.ai/${path}`;
  };

  const handleAcceptOffer = async (product: any, grade: any) => {
    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = (await AsyncStorage.getItem('traderName')) || 'Unknown Trader';
    if (!traderId) return Alert.alert('Error', 'Please login as a trader first');

    const maxQty = grade.totalQty;

    if (grade.quantityType === 'bulk') {
      const totalAmount = grade.pricePerUnit * maxQty;
      Alert.alert(
        'Confirm Purchase',
        `Product: ${product.cropBriefDetails}\nGrade: ${grade.grade}\nPrice: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nQuantity: ${maxQty} ${product.unitMeasurement}\n\nTotal: ₹${totalAmount.toFixed(2)}`,
        [
          { text: 'Cancel' },
          { text: 'Confirm', onPress: () => processPurchase(product, grade, traderId, traderName, maxQty) }
        ]
      );
    } else {
      setSelectedProduct(product);
      setSelectedGrade(grade);
      setQuantityInput('');
      setShowQuantityModal(true);
    }
  };

  const handleQuantitySubmit = async () => {
    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = (await AsyncStorage.getItem('traderName')) || 'Unknown Trader';

    const qty = Number(quantityInput);
    const maxQty = selectedGrade.totalQty;

    if (!qty || qty <= 0) return Alert.alert('Error', 'Enter valid quantity');
    if (qty > maxQty) return Alert.alert('Error', `Max available ${maxQty}`);

    const totalAmount = selectedGrade.pricePerUnit * qty;

    setShowQuantityModal(false);

    Alert.alert(
      'Confirm Purchase',
      `Qty: ${qty}\nTotal: ₹${totalAmount.toFixed(2)}`,
      [
        { text: 'Cancel' },
        { text: 'Confirm', onPress: () => processPurchase(selectedProduct, selectedGrade, traderId!, traderName, qty) }
      ]
    );
  };

  const processPurchase = async (product: any, grade: any, traderId: string, traderName: string, quantity: number) => {
    try {
      const res = await fetch('https://kisan.etpl.ai/product/accept-listed-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, gradeId: grade._id, traderId, traderName, quantity })
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', 'Purchase Completed');
        fetchProducts();
      } else Alert.alert('Error', data.message);
    } catch {
      Alert.alert('Error', 'Failed');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#28a745" />
        <Text className="mt-2 text-gray-500 text-base">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER with Category Info */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <Text className="text-2xl font-medium text-gray-900">
          Available Products
          {selectedCategory !== 'all' && (
            <Text className="text-green-600">: {selectedCategory}</Text>
          )}
        </Text>
        <Text className="text-gray-500 mt-1">
          {filteredProducts.length} of {products.length} products
        </Text>

        {/* Show category filter info */}
        {selectedCategory !== 'all' && (
          <TouchableOpacity
            onPress={() => setSelectedCategory('all')}
            className="mt-2 flex-row items-center"
          >
            <Text className="text-green-600 underline mr-1">
              Showing only {selectedCategory} products
            </Text>
            <Text className="text-green-600">(Tap to show all)</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEARCH BAR */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Search products (e.g., tomato, potato, onion)..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            className="ml-3 p-2 bg-gray-100 rounded-lg"
            onPress={() => setShowFilterModal(true)}
          >
            <View className="relative">
              <Filter size={24} color="#4b5563" />
              {getActiveFilterCount() > 0 && (
                <View className="absolute -top-2 -right-2 bg-green-600 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {getActiveFilterCount()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* QUICK FILTERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2 ${selectedCategory === 'all' ? 'bg-green-600' : 'bg-gray-100'}`}
            onPress={() => setSelectedCategory('all')}
          >
            <Text className={`text-sm ${selectedCategory === 'all' ? 'text-white' : 'text-gray-700'}`}>
              All
            </Text>
          </TouchableOpacity>

          {categories.slice(0, 5).map(category => (
            <TouchableOpacity
              key={category}
              className={`px-3 py-1 rounded-full mr-2 ${selectedCategory === category ? 'bg-green-600' : 'bg-gray-100'}`}
              onPress={() => setSelectedCategory(category)}
            >
              <Text className={`text-sm ${selectedCategory === category ? 'text-white' : 'text-gray-700'}`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FILTER MODAL */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-3/4">
            <View className="p-6 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-semibold text-gray-900">Filters</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {getActiveFilterCount() > 0 && (
                <TouchableOpacity
                  className="mt-2 self-start"
                  onPress={clearFilters}
                >
                  <Text className="text-green-600 font-medium">Clear all filters</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView className="p-6">
              {/* Category Filter */}
              <View className="mb-6">
                <Text className="text-lg font-medium text-gray-900 mb-3">Category</Text>
                <View className="flex-row flex-wrap">
                  <TouchableOpacity
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedCategory === 'all' ? 'bg-green-600' : 'bg-gray-100'}`}
                    onPress={() => setSelectedCategory('all')}
                  >
                    <Text className={`${selectedCategory === 'all' ? 'text-white' : 'text-gray-700'}`}>
                      All Categories
                    </Text>
                  </TouchableOpacity>

                  {categories.map(category => (
                    <TouchableOpacity
                      key={category}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedCategory === category ? 'bg-green-600' : 'bg-gray-100'}`}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text className={`${selectedCategory === category ? 'text-white' : 'text-gray-700'}`}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Farming Type Filter */}
              <View className="mb-6">
                <Text className="text-lg font-medium text-gray-900 mb-3">Farming Type</Text>
                <View className="flex-row flex-wrap">
                  <TouchableOpacity
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedFarmingType === 'all' ? 'bg-green-600' : 'bg-gray-100'}`}
                    onPress={() => setSelectedFarmingType('all')}
                  >
                    <Text className={`${selectedFarmingType === 'all' ? 'text-white' : 'text-gray-700'}`}>
                      All Types
                    </Text>
                  </TouchableOpacity>

                  {farmingTypes.map(type => (
                    <TouchableOpacity
                      key={type}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedFarmingType === type ? 'bg-green-600' : 'bg-gray-100'}`}
                      onPress={() => setSelectedFarmingType(type)}
                    >
                      <Text className={`${selectedFarmingType === type ? 'text-white' : 'text-gray-700'}`}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range Filter */}
              <View className="mb-6">
                <Text className="text-lg font-medium text-gray-900 mb-3">Price Range (per unit)</Text>
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text className="text-gray-600 mb-1">Min Price</Text>
                    <TextInput
                      className="bg-gray-100 rounded-lg px-3 py-2"
                      placeholder="0"
                      value={priceRange.min}
                      onChangeText={(text) => setPriceRange({ ...priceRange, min: text })}
                      keyboardType="numeric"
                    />
                  </View>
                  <Text className="mx-3 text-gray-500">-</Text>
                  <View className="flex-1">
                    <Text className="text-gray-600 mb-1">Max Price</Text>
                    <TextInput
                      className="bg-gray-100 rounded-lg px-3 py-2"
                      placeholder="1000"
                      value={priceRange.max}
                      onChangeText={(text) => setPriceRange({ ...priceRange, max: text })}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className="p-6 border-t border-gray-200">
              <TouchableOpacity
                className="bg-green-600 rounded-lg py-3 items-center"
                onPress={() => setShowFilterModal(false)}
              >
                <Text className="text-white font-semibold text-lg">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* QUANTITY MODAL */}
      <Modal
        visible={showQuantityModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-xl p-6 w-full max-w-sm">
            <Text className="text-xl font-semibold text-gray-900 mb-2">Enter Quantity</Text>
            <Text className="text-gray-600 mb-4">
              Available: {selectedGrade?.totalQty} {selectedProduct?.unitMeasurement}
            </Text>

            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-lg text-center mb-4"
              placeholder="Enter quantity"
              value={quantityInput}
              onChangeText={setQuantityInput}
              keyboardType="numeric"
              autoFocus
            />

            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3 mr-2 items-center"
                onPress={() => setShowQuantityModal(false)}
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-green-600 rounded-lg py-3 ml-2 items-center"
                onPress={handleQuantitySubmit}
              >
                <Text className="text-white font-semibold">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#28a745']}
          />
        }
      >
        {/* ERROR */}
        {error && (
          <View className="bg-red-50 border border-red-400 rounded-lg mx-4 mt-4 p-3">
            <Text className="text-red-800 font-medium">
              {error}
            </Text>
          </View>
        )}

        {/* NO PRODUCTS */}
        {filteredProducts.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Search size={64} color="#9ca3af" />
            <Text className="text-lg font-semibold text-gray-700 mt-4">
              No Products Found
            </Text>
            <Text className="text-gray-400 mt-1">
              {selectedCategory !== 'all'
                ? `No ${selectedCategory} products available`
                : 'Try adjusting your search or filters'}
            </Text>
            {(searchQuery || getActiveFilterCount() > 0) && (
              <TouchableOpacity
                className="mt-4 px-6 py-2 bg-green-600 rounded-lg"
                onPress={clearFilters}
              >
                <Text className="text-white font-medium">Clear All Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="px-4 pt-4 pb-10">
            {filteredProducts.map(product => (
              <View
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg mb-5 p-3"
              >
                {/* IMAGE */}
                <View className="relative">
                  <Image
                    source={{ uri: getImageUrl(product.cropPhotos?.[0]) }}
                    className="w-full h-52 rounded-lg"
                  />

                  <View className="absolute top-3 left-3 bg-green-600 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">
                      {product.farmingType}
                    </Text>
                  </View>
                </View>

                {/* CARD BODY */}
                <View className="p-4">
                  <Text className="text-xl font-medium text-gray-900">
                    {product.cropBriefDetails}
                  </Text>

                  {/* PRODUCT ID */}
                  <View className="bg-green-600 px-2 py-1 rounded mt-2 self-start">
                    <Text className="text-white text-xs font-semibold">
                      {product.productId}
                    </Text>
                  </View>

                  {/* CATEGORY TAGS */}
                  <View className="flex-row flex-wrap mt-3">
                    <View className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2 border border-gray-300">
                      <Text className="text-gray-700 text-sm">
                        {product.categoryId?.categoryName}
                      </Text>
                    </View>

                    <View className="bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
                      <Text className="text-gray-700 text-sm">
                        {product.subCategoryId?.subCategoryName}
                      </Text>
                    </View>
                  </View>

                  {/* GRADE BLOCKS */}
                  {product.gradePrices
                    .filter((g: any) => g.status !== 'sold')
                    .map((grade: any, index: number, arr: any[]) => (
                      <View
                        key={grade._id}
                        className={`mt-3 pb-3 ${index !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <View className="flex-row justify-between items-center">
                          <Text className="text-lg font-medium text-gray-900">
                            {grade.grade}
                          </Text>

                          <Text className="text-green-700 font-medium text-base">
                            ₹{grade.pricePerUnit}/{product.unitMeasurement}
                          </Text>
                        </View>

                        <Text className="text-gray-600 mt-1">
                          Quantity: {grade.totalQty} {product.unitMeasurement}
                        </Text>

                        {/* BUTTONS */}
                        <View className="flex-row mt-3">
                          <TouchableOpacity
                            className="flex-1 bg-green-600 rounded-lg py-2 mr-2 items-center"
                            onPress={() => handleAcceptOffer(product, grade)}
                          >
                            <Text className="text-white font-semibold text-sm">
                              Accept Price
                            </Text>
                          </TouchableOpacity>

                          {grade.priceType === 'negotiable' && (
                            <TouchableOpacity
                              className="flex-1 border border-green-600 rounded-lg py-2 items-center"
                            >
                              <Text className="text-green-700 font-semibold text-sm">
                                Make Offer
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Allcrops;