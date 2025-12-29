import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Shop,
  Package,
  Calendar,
  Clock,
  MapPin,
  ArrowClockwise,
  Tag,
  CheckCircle,
  DollarSign,
  Package2,
  TrendingUp,
  Filter,
  X,
  ShoppingCart,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface GradePrice {
  _id: string;
  grade: string;
  pricePerUnit: number;
  totalQty: number;
  quantityType: 'bulk' | 'partial';
  priceType: 'fixed' | 'negotiable';
  status: 'available' | 'partially_sold' | 'sold';
}

interface Product {
  _id: string;
  productId: string;
  cropBriefDetails: string;
  farmingType: string;
  categoryId: { categoryName: string };
  subCategoryId: { subCategoryName: string };
  cropPhotos: string[];
  gradePrices: GradePrice[];
  unitMeasurement: string;
  packageMeasurement: string;
  packagingType: string;
  deliveryDate: string;
  deliveryTime: string;
  nearestMarket: string;
}

interface GradeOffer {
  [gradeId: string]: {
    price: string;
    quantity: string;
  };
}

interface OfferItem {
  gradeId: string;
  gradeName: string;
  offeredPrice: number;
  quantity: number;
  listedPrice: number;
}

interface BatchOfferPayload {
  gradeId: string;
  offeredPrice: number;
  quantity: number;
}

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [gradeOffers, setGradeOffers] = useState<GradeOffer>({});
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const traderId = await AsyncStorage.getItem('traderId');
      const res = await fetch(`http://localhost:8080/product/all?traderId=${traderId}`);
      const data = await res.json();
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      Alert.alert('Error', 'Failed to load products');
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
    return `http://localhost:8080/${path}`;
  };

  const handleAcceptOffer = async (product: Product, grade: GradePrice) => {
    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';
    
    if (!traderId) {
      Alert.alert('Login Required', 'Please login as a trader first');
      return;
    }

    const maxQty = grade.totalQty;
    const quantityMessage = grade.quantityType === 'bulk' 
      ? `This is a bulk purchase. You must buy the full quantity: ${maxQty} ${product.unitMeasurement}`
      : `Enter quantity (Max: ${maxQty} ${product.unitMeasurement})`;

    Alert.prompt(
      'Enter Quantity',
      quantityMessage,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: (quantity) => {
            if (!quantity) return;
            
            const numQuantity = Number(quantity);

            if (isNaN(numQuantity) || numQuantity <= 0) {
              Alert.alert('Error', 'Please enter a valid quantity');
              return;
            }

            if (numQuantity > maxQty) {
              Alert.alert('Error', `Maximum available quantity is ${maxQty}`);
              return;
            }

            if (grade.quantityType === 'bulk' && numQuantity !== maxQty) {
              Alert.alert('Error', 'Bulk purchase requires buying the full quantity');
              return;
            }

            const totalAmount = grade.pricePerUnit * numQuantity;
            Alert.alert(
              'Confirm Purchase',
              `Product: ${product.cropBriefDetails}\nGrade: ${grade.grade}\nPrice: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nQuantity: ${numQuantity} ${product.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Proceed',
                  onPress: () => processPurchase(product, grade, traderId, traderName, numQuantity),
                },
              ]
            );
          },
        },
      ],
      'plain-text',
      grade.quantityType === 'bulk' ? maxQty.toString() : ''
    );
  };

  const processPurchase = async (
    product: Product,
    grade: GradePrice,
    traderId: string,
    traderName: string,
    quantity: number
  ) => {
    try {
      const response = await fetch('http://localhost:8080/product/accept-listed-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          '✅ Purchase Successful!',
          `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${product.unitMeasurement}`,
          [{ text: 'OK', onPress: () => fetchProducts() }]
        );
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      Alert.alert('Error', 'Failed to process purchase. Please try again.');
    }
  };

  const handleMakeOffer = (product: Product) => {
    const initialOffers: GradeOffer = {};
    product.gradePrices
      .filter((g) => g.status !== 'sold' && g.priceType === 'negotiable')
      .forEach((grade) => {
        initialOffers[grade._id] = {
          price: grade.pricePerUnit.toString(),
          quantity: grade.quantityType === 'bulk' ? grade.totalQty.toString() : '',
        };
      });

    setSelectedProduct(product);
    setGradeOffers(initialOffers);
    setShowOfferModal(true);
  };

  const submitOffer = async () => {
    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';

    if (!selectedProduct) return;

    const hasValidOffer = Object.values(gradeOffers).some(
      (offer) => offer.price && offer.quantity
    );

    if (!hasValidOffer) {
      Alert.alert('Error', 'Please enter price and quantity for at least one grade');
      return;
    }

    const offers: OfferItem[] = [];
    
    for (const [gradeId, offer] of Object.entries(gradeOffers)) {
      if (offer.price && offer.quantity) {
        const grade = selectedProduct.gradePrices.find((g) => g._id === gradeId);
        if (!grade) continue;
        
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
          listedPrice: grade.pricePerUnit,
        });
      }
    }

    const totalAmount = offers.reduce((sum, o) => sum + o.offeredPrice * o.quantity, 0);
    const confirmMsg =
      `Confirm Your Bid:\n\n` +
      offers
        .map(
          (o) =>
            `${o.gradeName}: ₹${o.offeredPrice} × ${o.quantity} = ₹${(
              o.offeredPrice * o.quantity
            ).toFixed(2)}`
        )
        .join('\n') +
      `\n\nTotal Bid Amount: ₹${totalAmount.toFixed(2)}`;

    Alert.alert('Confirm Bid', confirmMsg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: () => processOfferSubmission(offers, traderId, traderName),
      },
    ]);
  };

  const processOfferSubmission = async (
    offers: OfferItem[],
    traderId: string | null,
    traderName: string
  ) => {
    if (!selectedProduct || !traderId) return;

    try {
      if (offers.length === 1) {
        const offer = offers[0];
        const response = await fetch('http://localhost:8080/product/make-offer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
          Alert.alert('Success', '✅ Offer submitted successfully!\n\nThe farmer will review your bid.');
          setShowOfferModal(false);
          fetchProducts();
        } else {
          Alert.alert('Error', data.message);
        }
      } else {
        const batchOffers: BatchOfferPayload[] = offers.map((o) => ({
          gradeId: o.gradeId,
          offeredPrice: o.offeredPrice,
          quantity: o.quantity,
        }));

        const response = await fetch('http://localhost:8080/product/make-offer-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedProduct._id,
            traderId,
            traderName,
            offers: batchOffers,
          }),
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
      console.error('Error submitting offers:', error);
      Alert.alert('Error', 'Failed to submit offers. Please try again.');
    }
  };

  const navigateToMyPurchases = () => {
    navigation.navigate('MyPurchases' as never);
  };

  const renderGradeItem = (product: Product, grade: GradePrice) => {
    const isAvailable = grade.totalQty > 0;
    const isBulk = grade.quantityType === 'bulk';
    const isFixed = grade.priceType === 'fixed';

    return (
      <View key={grade._id} className="border border-gray-200 rounded-lg p-3 mb-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="font-semibold text-gray-800">{grade.grade}</Text>
              {grade.status === 'partially_sold' && (
                <View className="ml-2 bg-yellow-100 px-2 py-0.5 rounded">
                  <Text className="text-yellow-800 text-xs font-medium">Partially Sold</Text>
                </View>
              )}
              {isBulk && (
                <View className="ml-2 bg-blue-100 px-2 py-0.5 rounded">
                  <Text className="text-blue-800 text-xs font-medium">Bulk Only</Text>
                </View>
              )}
            </View>
            <View className="flex-row items-center mb-1">
              <DollarSign size={14} color="#059669" />
              <Text className="text-green-600 font-medium ml-1">
                ₹{grade.pricePerUnit}/{product.unitMeasurement || 'unit'}
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Package2 size={14} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-1">
                Qty: {grade.totalQty} {product.unitMeasurement || 'units'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <TrendingUp size={14} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-1">
                {isFixed ? 'Fixed Price' : 'Negotiable'}
              </Text>
            </View>
          </View>

          <View className="space-y-2">
            <TouchableOpacity
              onPress={() => handleAcceptOffer(product, grade)}
              disabled={!isAvailable}
              className={`px-4 py-2 rounded-lg ${isAvailable ? 'bg-green-600' : 'bg-gray-400'}`}
            >
              <Text className="text-white font-medium text-sm">Add to Cart</Text>
            </TouchableOpacity>
            
            {!isFixed && isAvailable && (
              <TouchableOpacity
                onPress={() => handleMakeOffer(product)}
                className="px-4 py-2 border border-green-600 rounded-lg"
              >
                <Text className="text-green-600 font-medium text-sm">Make Offer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderProductCard = (product: Product) => {
    const hasNegotiableGrades = product.gradePrices.some(
      (g) => g.priceType === 'negotiable' && g.status !== 'sold'
    );

    return (
      <View key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
        {/* Product Image */}
        <View className="relative">
          <Image
            source={{ uri: getImageUrl(product.cropPhotos?.[0] || '') }}
            className="w-full h-48 rounded-t-xl"
            resizeMode="cover"
          />
          <View className="absolute top-2 left-2">
            <View className="bg-green-600 px-3 py-1 rounded">
              <Text className="text-white font-medium text-sm">{product.farmingType}</Text>
            </View>
          </View>
        </View>

        {/* Product Details */}
        <View className="p-4">
          <Text className="text-xl font-medium text-gray-900 mb-2">{product.cropBriefDetails}</Text>
          
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-100 px-2 py-1 rounded mr-2">
              <Text className="text-blue-800 font-medium text-xs">{product.productId}</Text>
            </View>
            <View className="bg-gray-100 px-2 py-1 rounded mr-2">
              <Text className="text-gray-800 text-xs">{product.categoryId?.categoryName}</Text>
            </View>
            <View className="bg-gray-100 px-2 py-1 rounded">
              <Text className="text-gray-800 text-xs">{product.subCategoryId?.subCategoryName}</Text>
            </View>
          </View>

          {/* Grade Prices */}
          <View className="mb-4">
            {product.gradePrices
              .filter((grade) => grade.status !== 'sold')
              .map((grade) => renderGradeItem(product, grade))}
          </View>

          {/* Make Offer for All Grades Button */}
          {hasNegotiableGrades && (
            <TouchableOpacity
              onPress={() => handleMakeOffer(product)}
              className="bg-green-600 py-3 rounded-lg mb-4"
            >
              <Text className="text-white font-semibold text-center">
                Make Offer for All Grades
              </Text>
            </TouchableOpacity>
          )}

          {/* Product Info */}
          <View className="space-y-2 border-t border-gray-200 pt-4">
            <View className="flex-row items-center">
              <Package size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">
                {product.packageMeasurement} {product.packagingType}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">
                {new Date(product.deliveryDate).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">{product.deliveryTime}</Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">{product.nearestMarket}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-4 text-gray-600">Loading products...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Shop size={24} color="#10b981" />
            <Text className="text-2xl font-medium text-gray-900 ml-2">Available Products</Text>
          </View>
          <TouchableOpacity
            onPress={navigateToMyPurchases}
            className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <ShoppingCart size={18} color="white" />
            <Text className="text-white font-medium ml-2">My Purchases</Text>
          </TouchableOpacity>
        </View>

        {/* Stats and Refresh */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-800 font-semibold">{products.length} products</Text>
          </View>
          <TouchableOpacity
            onPress={fetchProducts}
            className="flex-row items-center border border-green-600 px-3 py-1 rounded-lg"
          >
            <ArrowClockwise size={16} color="#10b981" />
            <Text className="text-green-600 font-medium ml-1">Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-100 border border-red-400 p-3 rounded-lg mb-4">
            <Text className="text-red-700">{error}</Text>
          </View>
        )}

        {/* Products List */}
        {products.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center">
            <Shop size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-500 mt-4 mb-2">
              No products available
            </Text>
            <Text className="text-gray-400 text-center">
              Check back later for new listings.
            </Text>
          </View>
        ) : (
          <View>{products.map(renderProductCard)}</View>
        )}
      </View>

      {/* Offer Modal */}
      <Modal
        visible={showOfferModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOfferModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-xl w-full max-w-md max-h-[80%]">
            {/* Modal Header */}
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-xl font-medium text-gray-900">Bid by Trader - All Grades</Text>
              <TouchableOpacity onPress={() => setShowOfferModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView className="p-4">
              <View className="bg-blue-50 p-3 rounded-lg mb-4">
                <Text className="text-blue-800 text-sm">
                  💡 Tip: Enter your offer for each grade. Leave blank if you don't want to bid on that grade.
                </Text>
              </View>

              <Text className="font-semibold text-gray-800 mb-4">
                {selectedProduct?.cropBriefDetails}
              </Text>

              {/* Offers Table */}
              {selectedProduct?.gradePrices
                .filter((g) => g.status !== 'sold' && g.priceType === 'negotiable')
                .map((grade) => {
                  const offer = gradeOffers[grade._id] || { price: '', quantity: '' };
                  const amount = offer.price && offer.quantity 
                    ? (Number(offer.price) * Number(offer.quantity)).toFixed(2)
                    : '-';

                  return (
                    <View key={grade._id} className="border border-gray-200 rounded-lg p-3 mb-3">
                      <View className="flex-row justify-between items-center mb-3">
                        <View>
                          <Text className="font-semibold text-gray-800">{grade.grade}</Text>
                          {grade.quantityType === 'bulk' && (
                            <View className="bg-blue-100 px-2 py-0.5 rounded mt-1">
                              <Text className="text-blue-800 text-xs">Bulk</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-gray-600">
                          {selectedProduct.unitMeasurement}
                        </Text>
                      </View>

                      <View className="space-y-2">
                        <View>
                          <Text className="text-gray-700 mb-1">Price (₹)</Text>
                          <TextInput
                            value={offer.price}
                            onChangeText={(text) =>
                              setGradeOffers({
                                ...gradeOffers,
                                [grade._id]: { ...offer, price: text },
                              })
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2"
                            placeholder={`₹${grade.pricePerUnit}`}
                            keyboardType="decimal-pad"
                          />
                        </View>

                        <View>
                          <Text className="text-gray-700 mb-1">
                            Quantity (Max: {grade.totalQty})
                          </Text>
                          <TextInput
                            value={offer.quantity}
                            onChangeText={(text) =>
                              setGradeOffers({
                                ...gradeOffers,
                                [grade._id]: { ...offer, quantity: text },
                              })
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Enter quantity"
                            keyboardType="number-pad"
                            editable={grade.quantityType !== 'bulk'}
                          />
                          {grade.quantityType === 'bulk' && (
                            <Text className="text-gray-500 text-xs mt-1">
                              Full quantity required for bulk purchase
                            </Text>
                          )}
                        </View>

                        <View className="pt-2 border-t border-gray-200">
                          <Text className="text-gray-700">Amount:</Text>
                          <Text className="text-green-600 font-medium text-lg">
                            {amount !== '-' ? `₹${amount}` : '-'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}

              {/* Total Amount */}
              <View className="bg-gray-50 p-4 rounded-lg mt-4">
                <View className="flex-row justify-between items-center">
                  <Text className="font-medium text-gray-800">Total Bid Amount:</Text>
                  <Text className="text-green-600 font-medium text-lg">
                    ₹{Object.entries(gradeOffers).reduce((sum, [_, offer]) => {
                      if (offer.price && offer.quantity) {
                        return sum + Number(offer.price) * Number(offer.quantity);
                      }
                      return sum;
                    }, 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View className="p-4 border-t border-gray-200 flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowOfferModal(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg"
              >
                <Text className="text-gray-700 font-medium text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitOffer}
                className="flex-1 bg-green-600 py-3 rounded-lg"
              >
                <Text className="text-white font-medium text-center">Submit Bid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AllProducts;