import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Allcrops: React.FC = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [gradeOffers, setGradeOffers] = useState<{[gradeId: string]: {price: string, quantity: string}}>({});
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [quantityInput, setQuantityInput] = useState('');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const traderId = await AsyncStorage.getItem('traderId');
      const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${traderId}`);
      const data = await res.json();
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
  <ScrollView
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={['#28a745']}
      />
    }
  >

    {/* HEADER */}
    <View className="bg-white border-b border-gray-200 px-4 py-4">
      <Text className="text-2xl font-medium text-gray-900">
         Available Products
      </Text>
      <Text className="text-gray-500 mt-1">
        {products.length} products
      </Text>
    </View>


    {/* ERROR */}
    {error && (
      <View className="bg-red-50 border border-red-400 rounded-lg mx-4 mt-4 p-3">
        <Text className="text-red-800 font-medium">
          {error}
        </Text>
      </View>
    )}


    {/* NO PRODUCTS */}
    {products.length === 0 ? (
      <View className="items-center justify-center py-20">
        <Text className="text-6xl mb-3">🏪</Text>
        <Text className="text-lg font-semibold text-gray-700">
          No Products Found
        </Text>
        <Text className="text-gray-400">
          Come back later
        </Text>
      </View>
    ) : (


      <View className="px-4 pt-4 pb-10">

        {products.map(product => (
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
