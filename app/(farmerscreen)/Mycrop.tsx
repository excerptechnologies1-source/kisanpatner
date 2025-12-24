import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Leaf,
  TrendingUp,
  Check,
  X,
  Send,
  ShoppingBag,
  Users,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  BarChart3,
  Filter,
  Search,
  MoreVertical,
  ChevronRight,
} from 'lucide-react-native';

// API configuration
const API_BASE_URL = 'https://kisan.etpl.ai';
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Interfaces
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

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradePrice | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [showDirectOfferModal, setShowDirectOfferModal] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterQuantity, setCounterQuantity] = useState('');
  const [directOfferPrice, setDirectOfferPrice] = useState('');
  const [directOfferQuantity, setDirectOfferQuantity] = useState('');
  const [showGradeDetails, setShowGradeDetails] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'sold'>('all');

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const farmerId = await AsyncStorage.getItem('farmerId');


      if (!farmerId) {
        Alert.alert('Error', 'Please login as farmer first');
        return;
      }

      const response = await api.get(`/product/by-farmer/${farmerId}`);
      setProducts(response.data.data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch products');
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
      `Enter quantity to sell (Max: ${grade.totalQty} ${product.unitMeasurement || 'units'})`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: (quantity: any) => {
            if (quantity) {
              const total = grade.pricePerUnit * Number(quantity);
              Alert.alert(
                '✅ Offer Accepted',
                `Selling ${quantity} ${product.unitMeasurement} of ${grade.grade}\nPrice: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nTotal: ₹${total.toFixed(2)}\n\nThis will be available for traders to purchase.`
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
      '✅ Offer Created',
      `Product: ${selectedProduct?.cropBriefDetails}\nGrade: ${selectedGrade?.grade}\nPrice: ₹${directOfferPrice}/${selectedProduct?.unitMeasurement}\nQuantity: ${directOfferQuantity} ${selectedProduct?.unitMeasurement}\n\nThis offer will be visible to all traders.`
    );
    setShowDirectOfferModal(false);
  };

  const acceptTraderOffer = async (productId: string, gradeId: string, offerId: string, offer: Offer, product: Product, grade: GradePrice) => {
    if (grade.quantityType === 'bulk' && offer.quantity !== grade.totalQty) {
      Alert.alert('Bulk Purchase', 'This is a bulk purchase. The trader must buy the full quantity.');
      return;
    }

    Alert.alert(
      'Accept Trader Offer',
      `Product: ${product.cropBriefDetails}\nGrade: ${grade.grade}\n\nTrader's Offer: ₹${offer.offeredPrice}/${product.unitMeasurement}\nYour Listed Price: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nQuantity: ${offer.quantity} ${product.unitMeasurement}\n\nTotal Amount: ₹${(offer.offeredPrice * offer.quantity).toFixed(2)}\n\nRemaining after sale: ${grade.totalQty - offer.quantity} ${product.unitMeasurement}\n\nProceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'default',
          onPress: async () => {
            try {
              const response = await api.post('/product/accept-trader-offer', {
                productId,
                gradeId,
                offerId,
              });

              const data = response.data;
              const statusMsg =
                data.data.remainingQty === 0
                  ? '🎉 Grade SOLD OUT!'
                  : `✅ Sale Confirmed! ${data.data.remainingQty} ${product.unitMeasurement} remaining.`;

              Alert.alert(
                'Success',
                `${statusMsg}\n\nTotal Amount: ₹${data.data.totalAmount.toFixed(
                  2
                )}\n\nTrader has been notified and can proceed to payment.`
              );
              fetchProducts();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to accept offer');
            }
          },
        },
      ]
    );
  };

  const rejectTraderOffer = async (productId: string, gradeId: string, offerId: string) => {
    Alert.alert('Reject Offer', 'Are you sure you want to reject this offer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.post('/product/reject-trader-offer', {
              productId,
              gradeId,
              offerId,
            });
            Alert.alert('Success', 'Offer rejected');
            fetchProducts();
          } catch (error) {
            Alert.alert('Error', 'Failed to reject offer');
          }
        },
      },
    ]);
  };

  const openCounterModal = (product: Product, grade: GradePrice, offer: Offer) => {
    setSelectedProduct(product);
    setSelectedGrade(grade);
    setSelectedOffer(offer);
    setCounterPrice(offer.offeredPrice.toString());
    setCounterQuantity(offer.quantity.toString());
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
      Alert.alert('Bulk Purchase', 'Bulk purchase requires full quantity');
      return;
    }

    Alert.alert(
      'Send Counter Offer',
      `Trader offered: ₹${selectedOffer.offeredPrice} × ${selectedOffer.quantity}\nYour counter: ₹${numPrice} × ${numQuantity}\n\nTotal: ₹${(numPrice * numQuantity).toFixed(2)}\n\nSend?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              const response = await api.post('/product/make-counter-offer', {
                productId: selectedProduct._id,
                gradeId: selectedGrade._id,
                offerId: selectedOffer._id,
                counterPrice: numPrice,
                counterQuantity: numQuantity,
              });

              if (response.data.success) {
                Alert.alert('Success', '✅ Counter-offer sent to trader!');
                setShowCounterModal(false);
                fetchProducts();
              }
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to send counter offer');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'countered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={14} color="#059669" />;
      case 'pending':
        return <Clock size={14} color="#D97706" />;
      case 'rejected':
        return <X size={14} color="#DC2626" />;
      case 'countered':
        return <MessageCircle size={14} color="#2563EB" />;
      default:
        return null;
    }
  };

  const renderProductCard = ({ item: product }: { item: Product }) => (
    <View className="mb-4 rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
      {/* Product Image */}
      <View className="relative" style={{ height: 180 }}>
        <Image
          source={{
            uri:
              product.cropPhotos?.[0]?.startsWith('http')
                ? product.cropPhotos[0]
                : `${API_BASE_URL}/${product.cropPhotos?.[0]?.replace(/^\//, '')}`,
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-3 left-3">
          <View className="bg-green-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">{product.farmingType}</Text>
          </View>
        </View>
      </View>

      {/* Product Details */}
      <View className="p-4">
        {/* Product Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="font-bold text-gray-900 text-lg" numberOfLines={1}>
              {product.cropBriefDetails}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-600 text-sm">{product.categoryId.categoryName}</Text>
              <Text className="text-gray-400 mx-2">•</Text>
              <Text className="text-gray-600 text-sm">{product.subCategoryId.subCategoryName}</Text>
            </View>
          </View>
          <TouchableOpacity className="p-2">
            <MoreVertical size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Grade Prices */}
        {product.gradePrices.map((grade) => (
          <TouchableOpacity
            key={grade._id}
            onPress={() => setShowGradeDetails(showGradeDetails === grade._id ? null : grade._id)}
            className={`border rounded-xl p-3 mb-3 ${
              showGradeDetails === grade._id ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            {/* Grade Header */}
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Tag size={16} color="#10B981" />
                <Text className="ml-2 font-bold text-gray-900">{grade.grade}</Text>
              </View>
              <View className="items-end">
                <Text className="text-green-600 font-bold text-lg">₹{grade.pricePerUnit}</Text>
                <Text className="text-gray-500 text-xs">
                  /{product.unitMeasurement || 'unit'} • {grade.totalQty} available
                </Text>
              </View>
            </View>

            {/* Expandable Content */}
            {showGradeDetails === grade._id && (
              <View className="mt-3">
                {/* Action Buttons */}
                <View className="flex-row space-x-2 mb-4">
                  <TouchableOpacity
                    onPress={() => handleAcceptOffer(product, grade)}
                    disabled={grade.totalQty === 0}
                    className={`flex-1 py-2 rounded-lg items-center ${
                      grade.totalQty === 0 ? 'bg-gray-300' : 'bg-green-500'
                    }`}
                  >
                    <Text className="text-white font-medium">Accept Offer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleMakeOffer(product, grade)}
                    disabled={grade.totalQty === 0}
                    className={`flex-1 py-2 rounded-lg items-center border ${
                      grade.totalQty === 0
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-green-500 bg-white'
                    }`}
                  >
                    <Text
                      className={`font-medium ${grade.totalQty === 0 ? 'text-gray-500' : 'text-green-600'}`}
                    >
                      Make Offer
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Pending Offers */}
                {grade.offers?.filter((o) => o.status === 'pending').map((offer) => (
                  <View key={offer._id} className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <View className="flex-row justify-between items-start mb-2">
                      <View>
                        <View className="flex-row items-center mb-1">
                          <Users size={14} color="#D97706" />
                          <Text className="ml-2 text-yellow-800 text-sm font-medium">
                            Trader Offer
                          </Text>
                        </View>
                        <Text className="text-xs text-gray-600 mb-1">ID: {offer.traderId}</Text>
                        {offer.traderName && (
                          <Text className="text-xs text-gray-600">Name: {offer.traderName}</Text>
                        )}
                      </View>
                      <View className="items-end">
                        <Text className="font-bold text-gray-900">
                          ₹{offer.offeredPrice} × {offer.quantity}
                        </Text>
                        <Text className="text-gray-600 text-xs">
                          Total: ₹{(offer.offeredPrice * offer.quantity).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        onPress={() =>
                          acceptTraderOffer(product._id, grade._id, offer._id, offer, product, grade)
                        }
                        disabled={grade.quantityType === 'bulk' && offer.quantity !== grade.totalQty}
                        className="flex-1 py-2 bg-green-500 rounded-lg items-center"
                      >
                        <Text className="text-white font-medium">Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => openCounterModal(product, grade, offer)}
                        className="flex-1 py-2 bg-white border border-green-500 rounded-lg items-center"
                      >
                        <Text className="text-green-600 font-medium">Counter</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => rejectTraderOffer(product._id, grade._id, offer._id)}
                        className="px-4 py-2 bg-red-500 rounded-lg items-center"
                      >
                        <X size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* Purchase History */}
                {grade.purchaseHistory && grade.purchaseHistory.length > 0 && (
                  <View className="mt-3">
                    <Text className="font-medium text-gray-700 mb-2">Purchase History</Text>
                    {grade.purchaseHistory.map((purchase, idx) => (
                      <View key={idx} className="mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <View className="flex-row justify-between items-start">
                          <View className="flex-1">
                            <Text className="font-medium text-gray-900">{purchase.traderName}</Text>
                            <Text className="text-gray-600 text-xs mt-1">
                              {purchase.quantity} × ₹{purchase.pricePerUnit}
                            </Text>
                          </View>
                          <View className="items-end">
                            <Text className="font-bold text-green-600">
                              ₹{purchase.totalAmount.toFixed(2)}
                            </Text>
                            <Text className="text-gray-500 text-xs mt-1">
                              {formatDate(purchase.purchaseDate)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Collapsed Status Indicators */}
            {showGradeDetails !== grade._id && grade.offers && grade.offers.length > 0 && (
              <View className="flex-row flex-wrap gap-1 mt-2">
                {grade.offers.map((offer) => (
                  <View
                    key={offer._id}
                    className={`px-2 py-1 rounded-full flex-row items-center ${getStatusColor(
                      offer.status
                    )}`}
                  >
                    {getStatusIcon(offer.status)}
                    <Text className="text-xs ml-1 capitalize">{offer.status}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Product Footer */}
        <View className="border-t border-gray-100 pt-3 mt-3">
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Calendar size={14} color="#6B7280" />
              <Text className="ml-2 text-gray-600 text-xs">{formatDate(product.deliveryDate)}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={14} color="#6B7280" />
              <Text className="ml-2 text-gray-600 text-xs">{product.deliveryTime}</Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={14} color="#6B7280" />
              <Text className="ml-2 text-gray-600 text-xs" numberOfLines={1}>
                {product.nearestMarket}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const filteredProducts = products.filter((product) => {
    if (filter === 'active') {
      return product.gradePrices.some((grade) => grade.totalQty > 0);
    } else if (filter === 'sold') {
      return product.gradePrices.every((grade) => grade.totalQty === 0);
    }
    return true;
  });

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="mt-4 text-gray-600">Loading your products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-4 pb-3 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-2xl font-bold text-gray-900">My Products</Text>
          <TouchableOpacity onPress={fetchProducts} className="p-2">
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2">
            {['all', 'active', 'sold'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilter(tab as any)}
                className={`px-4 py-2 rounded-full ${
                  filter === tab ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`font-medium ${filter === tab ? 'text-white' : 'text-gray-700'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'all' ? products.length : filteredProducts.length})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProductCard}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Package size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg font-medium mt-4">No products found</Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              {filter === 'all'
                ? 'Start by adding your first product'
                : filter === 'active'
                ? 'No active products available'
                : 'No sold products yet'}
            </Text>
          </View>
        }
      />

      {/* Direct Offer Modal */}
      <Modal visible={showDirectOfferModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-white rounded-2xl w-11/12 max-w-md">
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">Make an Offer</Text>
                <TouchableOpacity onPress={() => setShowDirectOfferModal(false)} className="p-2">
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {selectedProduct && selectedGrade && (
                <>
                  <Text className="text-gray-600 mb-1">{selectedProduct.cropBriefDetails}</Text>
                  <Text className="text-gray-500 text-sm mb-4">Grade: {selectedGrade.grade}</Text>

                  <View className="space-y-4">
                    <View>
                      <Text className="font-medium text-gray-700 mb-2">
                        Price per {selectedProduct.unitMeasurement || 'unit'} (₹)
                      </Text>
                      <TextInput
                        value={directOfferPrice}
                        onChangeText={setDirectOfferPrice}
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Enter your offer price"
                      />
                    </View>

                    <View>
                      <Text className="font-medium text-gray-700 mb-2">
                        Quantity ({selectedProduct.unitMeasurement || 'units'})
                      </Text>
                      <TextInput
                        value={directOfferQuantity}
                        onChangeText={setDirectOfferQuantity}
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Enter quantity"
                      />
                    </View>

                    {directOfferPrice && directOfferQuantity && (
                      <View className="bg-gray-50 p-4 rounded-lg">
                        <Text className="text-gray-500 text-sm">Total Amount</Text>
                        <Text className="text-green-600 text-2xl font-bold">
                          ₹{(parseFloat(directOfferPrice) * parseFloat(directOfferQuantity)).toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row space-x-3 mt-6">
                    <TouchableOpacity
                      onPress={() => setShowDirectOfferModal(false)}
                      className="flex-1 py-3 border border-gray-300 rounded-lg items-center"
                    >
                      <Text className="text-gray-700 font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={submitDirectOffer}
                      className="flex-1 py-3 bg-green-500 rounded-lg items-center"
                    >
                      <Text className="text-white font-medium">Submit Offer</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Counter Offer Modal */}
      <Modal visible={showCounterModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-white rounded-2xl w-11/12 max-w-md">
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">Counter Offer</Text>
                <TouchableOpacity onPress={() => setShowCounterModal(false)} className="p-2">
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {selectedProduct && selectedGrade && selectedOffer && (
                <>
                  <View className="bg-gray-50 p-4 rounded-lg mb-4">
                    <Text className="text-gray-500 text-sm">Product</Text>
                    <Text className="font-medium text-gray-900">{selectedProduct.cropBriefDetails}</Text>
                    <Text className="text-gray-600 text-sm mt-1">Grade: {selectedGrade.grade}</Text>
                    <Text className="text-gray-700 font-medium mt-2">
                      Trader's Offer: ₹{selectedOffer.offeredPrice} × {selectedOffer.quantity}
                    </Text>
                  </View>

                  <View className="space-y-4">
                    <View>
                      <Text className="font-medium text-gray-700 mb-2">
                        Your Counter Price (₹/{selectedProduct.unitMeasurement || 'unit'})
                      </Text>
                      <TextInput
                        value={counterPrice}
                        onChangeText={setCounterPrice}
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Enter your counter price"
                      />
                    </View>

                    <View>
                      <Text className="font-medium text-gray-700 mb-2">
                        Quantity ({selectedProduct.unitMeasurement || 'units'})
                      </Text>
                      <TextInput
                        value={counterQuantity}
                        onChangeText={setCounterQuantity}
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Enter quantity"
                      />
                    </View>

                    {counterPrice && counterQuantity && (
                      <View className="bg-green-50 p-4 rounded-lg">
                        <Text className="text-gray-500 text-sm">Total Counter Amount</Text>
                        <Text className="text-green-600 text-2xl font-bold">
                          ₹{(parseFloat(counterPrice) * parseFloat(counterQuantity)).toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row space-x-3 mt-6">
                    <TouchableOpacity
                      onPress={() => setShowCounterModal(false)}
                      className="flex-1 py-3 border border-gray-300 rounded-lg items-center"
                    >
                      <Text className="text-gray-700 font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={submitCounterOffer}
                      className="flex-1 py-3 bg-green-500 rounded-lg items-center"
                    >
                      <Text className="text-white font-medium">Send Counter</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductGrid;