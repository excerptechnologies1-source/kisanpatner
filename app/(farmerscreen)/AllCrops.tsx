import React, { useState, useEffect } from 'react';
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
  Dimensions,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
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
  ChevronRight
} from 'lucide-react-native';
import { router } from "expo-router";
import CustomAlert from '@/components/CustomAlert';
import DotLoader from '@/components/DotLoader';

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

const Mycrop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradePrice | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterQuantity, setCounterQuantity] = useState('');
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [showDirectOfferModal, setShowDirectOfferModal] = useState(false);
  const [showAllGradesModal, setShowAllGradesModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [directOfferPrice, setDirectOfferPrice] = useState('');
  const [directOfferQuantity, setDirectOfferQuantity] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState<null | (() => void)>(null);
  
  const showAppAlert = (title: string, message: string, action?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertAction(() => action || null);
    setShowAlert(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      setProducts(data.data || []);
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

  const handleAcceptOffer = async (product: Product, grade: GradePrice) => {
    Alert.prompt(
      'Accept Offer',
      `Enter quantity to sell (Max: ${grade.totalQty} ${product.unitMeasurement || 'units'})`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: (quantity:any) => {
            if (quantity) {
              showAppAlert(
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
      showAppAlert('Error', 'Please fill in all fields');
      return;
    }

    showAppAlert(
      'Offer Created',
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
    if (grade.quantityType === 'bulk' && offer.quantity !== grade.totalQty) {
      showAppAlert('Warning', '⚠️ This is a bulk purchase. The trader must buy the full quantity.');
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

              showAppAlert(
                'Success',
                `${statusMsg}\n\nTotal Amount: ₹${data.data.totalAmount.toFixed(2)}\n\nTrader has been notified and can proceed to payment.`
              );
              fetchProducts();
            } else {
              showAppAlert('Failed', data.message);
            }
          } catch (err) {
            showAppAlert('Error', 'Error accepting offer');
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
              showAppAlert('Success', 'Offer rejected');
              fetchProducts();
            }
          } catch (err) {
            showAppAlert('Error', 'Error rejecting offer');
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
    setShowCounterOfferModal(true);
  };

  const submitCounterOffer = async () => {
    if (!counterPrice || !counterQuantity) {
      showAppAlert('Error', 'Please fill in all fields');
      return;
    }

    if (!selectedProduct || !selectedGrade || !selectedOffer) return;

    const numPrice = Number(counterPrice);
    const numQuantity = Number(counterQuantity);

    if (numQuantity > selectedGrade.totalQty) {
      showAppAlert('Error', `Maximum available: ${selectedGrade.totalQty} ${selectedProduct.unitMeasurement}`);
      return;
    }

    if (selectedGrade.quantityType === 'bulk' && numQuantity !== selectedGrade.totalQty) {
      showAppAlert('Error', 'Bulk purchase requires full quantity');
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
              showAppAlert('Success', '✅ Counter-offer sent to trader!');
              setShowCounterOfferModal(false);
              fetchProducts();
            } else {
              showAppAlert('Failed', data.message);
            }
          } catch (err) {
            showAppAlert('Error', 'Error submitting counter-offer');
            console.error(err);
          }
        },
      },
    ]);
  };

  const openAllGradesModal = (product: Product) => {
    setSelectedProduct(product);
    setShowAllGradesModal(true);
  };

  const openOffersModal = (product: Product, grade: GradePrice) => {
    setSelectedProduct(product);
    setSelectedGrade(grade);
    setShowOffersModal(true);
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

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <DotLoader/>
        <Text className="mt-4 text-gray-600 font-medium">Loading your products...</Text>
      </View>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      sold: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sold' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expired' }
    };
    
    return badges[status as keyof typeof badges] || badges.active;
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-row items-center px-4 py-4 bg-white mb-3">
        <TouchableOpacity
          onPress={() => router.push('/(farmer)/home')}
          className="p-2"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="ml-3 text-xl font-medium text-gray-900">My Crop</Text>
      </View>

      <ScrollView
        className="flex-1 bg-white pb-5"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#16a34a"
          />
        }
      >
        {error && (
          <View className="mx-5 mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <View className="flex-row items-start">
              <View className="bg-red-100 p-2 rounded-lg mr-3">
                <X size={20} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-red-800 mb-1">Unable to load products</Text>
                <Text className="text-sm text-red-700">{error}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Products List */}
        <View className="px-4">
          {products.map((product) => {
            const statusBadge = getStatusBadge(product.status);
            
            return (
              <View 
                key={product._id} 
                className="bg-white rounded-lg mb-4 overflow-hidden border border-gray-200"
              >
                {/* Product Header with Image */}
                <View className="relative">
                  <View className="h-40 bg-gray-200 m-4 rounded-xl overflow-hidden">
                    <Image 
                      source={{ uri: getImageUrl(product.cropPhotos[0]) }} 
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  
                  <View className={`absolute top-3 left-3 ${statusBadge.bg} px-3 py-1.5 rounded-full`}>
                    <Text className={`text-xs font-medium ${statusBadge.text}`}>
                      {statusBadge.label}
                    </Text>
                  </View>

                  <View className="absolute bottom-3 left-3 bg-black/70 px-2.5 py-1 rounded">
                    <Text className="text-xs font-medium text-white">ID: {product.productId}</Text>
                  </View>
                </View>

                {/* Product Details */}
                <View className="p-4">
                  <View className="mb-3">
                    <Text className="text-lg font-medium text-gray-900 mb-1" numberOfLines={1}>
                      {product.cropBriefDetails}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <View className="bg-gray-100 px-2.5 py-1 rounded-md">
                        <Text className="text-xs font-medium text-gray-700">
                          {product.categoryId.categoryName}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-600">
                        {product.subCategoryId.subCategoryName}
                      </Text>
                    </View>
                  </View>

                  {/* Grade Prices Summary */}
                  {product.gradePrices.length > 0 && (
                    <View className="mb-4">
                      <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-lg font-medium text-gray-900">Grades Available</Text>
                        <TouchableOpacity 
                          onPress={() => openAllGradesModal(product)}
                          className="flex-row items-center bg-green-600 px-3 py-1.5 rounded-lg"
                        >
                          <Text className="text-white text-sm font-medium mr-1">
                            View All ({product.gradePrices.length})
                          </Text>
                          <ChevronRight size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                      
                      {/* Show first 2 grades */}
                      {product.gradePrices.slice(0, 2).map((grade) => (
                        <View 
                          key={grade._id} 
                          className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2"
                        >
                          <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1">
                              <Text className="font-medium text-gray-900">{grade.grade} Grade</Text>
                              <Text className="text-xs text-gray-500 mt-1">
                                {grade.totalQty} {product.unitMeasurement} available
                              </Text>
                            </View>
                            <Text className="text-xl font-medium text-green-600">
                              ₹{grade.pricePerUnit}
                            </Text>
                          </View>

                          <View className="flex-row gap-2">
                            <View className="flex-1 bg-yellow-100 px-2 py-1 rounded">
                              <Text className="text-xs text-yellow-800 text-center">
                                {grade.offers?.length || 0} Offers
                              </Text>
                            </View>
                            <View className="flex-1 bg-green-100 px-2 py-1 rounded">
                              <Text className="text-xs text-green-800 text-center">
                                {grade.purchaseHistory?.length || 0} Sold
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Product Details Footer */}
                  <View className="pt-3 border-t border-gray-200">
                    <View className="flex-row flex-wrap gap-3">
                      <View className="flex-row items-center">
                        <Package size={14} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-1.5">
                          {product.packageMeasurement} {product.packagingType}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Calendar size={14} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-1.5">
                          {formatDate(product.deliveryDate)}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Clock size={14} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-1.5">
                          {product.deliveryTime}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        <MapPin size={14} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-1.5">
                          {product.nearestMarket}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {products.length === 0 && !loading && (
          <View className="py-16 items-center px-4">
            <View className="bg-gray-100 p-8 rounded-2xl items-center">
              <Package size={48} color="#9ca3af" />
              <Text className="text-lg font-medium text-gray-600 mt-4">
                No products listed yet
              </Text>
              <Text className="text-sm text-gray-500 mt-2 text-center">
                Start by adding your first product to see it here
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* All Grades Modal */}
      <Modal visible={showAllGradesModal} animationType="slide">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setShowAllGradesModal(false)}
              className="p-2"
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="ml-3 text-xl font-medium text-gray-900">All Grades</Text>
          </View>

          <ScrollView className="flex-1 p-4">
            {selectedProduct?.gradePrices.map((grade) => (
              <View 
                key={grade._id} 
                className="bg-white border border-gray-300 rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* Grade Header */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 text-lg">{grade.grade} Grade</Text>
                    <View className="flex-row items-center mt-2 gap-2">
                      <View className="bg-green-100 px-2 py-1 rounded">
                        <Text className="text-xs font-medium text-green-800">
                          {grade.totalQty} {selectedProduct.unitMeasurement} available
                        </Text>
                      </View>
                      {grade.quantityType === 'bulk' && (
                        <View className="bg-blue-100 px-2 py-1 rounded">
                          <Text className="text-xs font-medium text-blue-800">Bulk Only</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-medium text-green-600">
                      ₹{grade.pricePerUnit}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      /{selectedProduct.unitMeasurement}
                    </Text>
                  </View>
                </View>

                {/* Purchase History */}
                {grade.purchaseHistory && grade.purchaseHistory.length > 0 && (
                  <View className="mb-3">
                    <View className="flex-row items-center mb-2">
                      <ShoppingBag size={16} color="#16a34a" />
                      <Text className="font-medium text-gray-900 ml-2">Recent Sales</Text>
                      <Text className="text-xs text-gray-500 ml-auto">
                        {grade.purchaseHistory.length} sales
                      </Text>
                    </View>
                    {grade.purchaseHistory.slice(0, 3).map((purchase, idx) => (
                      <View 
                        key={idx} 
                        className="bg-green-50 p-3 rounded-lg border border-green-100 mb-2"
                      >
                        <View className="flex-row justify-between items-center">
                          <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-900">
                              {purchase.traderName}
                            </Text>
                            <Text className="text-xs text-gray-500 mt-1">
                              {new Date(purchase.purchaseDate).toLocaleDateString('en-IN')}
                            </Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-base font-medium text-gray-900">
                              ₹{purchase.totalAmount.toLocaleString('en-IN')}
                            </Text>
                            <Text className="text-xs text-gray-500">
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
                    className={`flex-row items-center justify-center py-3 rounded-lg ${
                      grade.totalQty === 0 ? 'bg-gray-200' : 'bg-green-600'
                    }`}
                    onPress={() => handleAcceptOffer(selectedProduct, grade)}
                    disabled={grade.totalQty === 0}
                  >
                    <Check size={16} color={grade.totalQty === 0 ? "#9ca3af" : "#ffffff"} />
                    <Text className={`ml-2 font-medium ${
                      grade.totalQty === 0 ? 'text-gray-500' : 'text-white'
                    }`}>
                      Accept Offer
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    className={`flex-row items-center justify-center py-3 rounded-lg border ${
                      grade.totalQty === 0 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-green-600'
                    }`}
                    onPress={() => handleMakeOffer(selectedProduct, grade)}
                    disabled={grade.totalQty === 0}
                  >
                    <TrendingUp 
                      size={16} 
                      color={grade.totalQty === 0 ? "#9ca3af" : "#16a34a"} 
                    />
                    <Text className={`ml-2 font-medium ${
                      grade.totalQty === 0 ? 'text-gray-500' : 'text-green-600'
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
                      className="flex-row justify-between items-center p-3 bg-yellow-50 rounded-lg"
                    >
                      <View>
                        <Text className="font-medium text-gray-900">View All Offers</Text>
                        <Text className="text-xs text-gray-500 mt-1">
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
                      <Text className="text-xs text-gray-500">Offers</Text>
                      <Text className="text-base font-medium text-gray-900">
                        {grade.offers?.length || 0}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-gray-500">Sold</Text>
                      <Text className="text-base font-medium text-gray-900">
                        {grade.purchaseHistory?.length || 0}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-gray-500">Available</Text>
                      <Text className="text-base font-medium text-gray-900">
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

      {/* All Offers Modal */}
      <Modal visible={showOffersModal} animationType="slide">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setShowOffersModal(false)}
              className="p-2"
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1 ml-3">
              <Text className="text-xl font-medium text-gray-900">All Offers</Text>
              <Text className="text-sm text-gray-500">
                {selectedGrade?.grade} Grade
              </Text>
            </View>
          </View>

          <ScrollView className="flex-1 p-4">
            {selectedGrade?.offers && selectedGrade.offers.length > 0 ? (
              selectedGrade.offers.map((offer) => (
                <View 
                  key={offer._id} 
                  className={`bg-white border-2 rounded-xl p-4 mb-3 ${
                    offer.status === 'pending' ? 'border-yellow-300' :
                    offer.status === 'accepted' ? 'border-green-300' :
                    offer.status === 'rejected' ? 'border-red-300' :
                    'border-blue-300'
                  }`}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900">
                        {offer.traderName || `Trader ${offer.traderId.substring(0, 8)}...`}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {new Date(offer.createdAt).toLocaleDateString('en-IN')}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${
                      offer.status === 'pending' ? 'bg-yellow-100' :
                      offer.status === 'accepted' ? 'bg-green-100' :
                      offer.status === 'rejected' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        offer.status === 'pending' ? 'text-yellow-800' :
                        offer.status === 'accepted' ? 'text-green-800' :
                        offer.status === 'rejected' ? 'text-red-800' :
                        'text-blue-800'
                      }`}>
                        {offer.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-gray-50 p-3 rounded-lg mb-3">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-sm text-gray-600">Offered Price:</Text>
                      <Text className="text-base font-medium text-gray-900">
                        ₹{offer.offeredPrice}/{selectedProduct?.unitMeasurement}
                      </Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-sm text-gray-600">Quantity:</Text>
                      <Text className="text-base font-medium text-gray-900">
                        {offer.quantity} {selectedProduct?.unitMeasurement}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pt-2 border-t border-gray-200">
                      <Text className="text-sm font-medium text-gray-900">Total Amount:</Text>
                      <Text className="text-lg font-medium text-green-600">
                        ₹{(offer.offeredPrice * offer.quantity).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  {offer.status === 'pending' && selectedProduct && selectedGrade && (
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-3 bg-green-600 rounded-lg"
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
                        <Text className="ml-2 font-medium text-white">Accept</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-3 bg-blue-600 rounded-lg"
                        onPress={() => openCounterOfferModal(selectedProduct, selectedGrade, offer)}
                      >
                        <TrendingUp size={16} color="#fff" />
                        <Text className="ml-2 font-medium text-white">Counter</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-3 bg-red-600 rounded-lg"
                        onPress={() => rejectTraderOffer(
                          selectedProduct._id,
                          selectedGrade._id,
                          offer._id
                        )}
                      >
                        <X size={16} color="#fff" />
                        <Text className="ml-2 font-medium text-white">Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {offer.status === 'countered' && (
                    <View className="bg-blue-50 p-3 rounded-lg">
                      <Text className="text-sm font-medium text-blue-900 mb-2">Your Counter Offer</Text>
                      <View className="flex-row justify-between">
                        <Text className="text-xs text-blue-700">
                          ₹{offer.counterPrice} × {offer.counterQuantity} = ₹{((offer.counterPrice || 0) * (offer.counterQuantity || 0)).toLocaleString('en-IN')}
                        </Text>
                        <Text className="text-xs text-blue-600">
                          Waiting for response
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View className="py-16 items-center">
                <View className="bg-gray-100 p-8 rounded-2xl items-center">
                  <MessageCircle size={48} color="#9ca3af" />
                  <Text className="text-lg font-medium text-gray-600 mt-4">
                    No offers yet
                  </Text>
                  <Text className="text-sm text-gray-500 mt-2 text-center">
                    Offers from traders will appear here
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Direct Offer Modal */}
      <Modal visible={showDirectOfferModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl w-full max-w-md">
            <View className="p-5 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-medium text-gray-900">Make an Offer</Text>
                <TouchableOpacity 
                  onPress={() => setShowDirectOfferModal(false)}
                  className="w-10 h-10 items-center justify-center"
                >
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500 mt-1">
                {selectedProduct?.cropBriefDetails} • {selectedGrade?.grade}
              </Text>
            </View>

            <ScrollView className="max-h-96">
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
                  <View className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <Text className="text-sm font-medium text-green-800 mb-1">
                      Total Amount
                    </Text>
                    <Text className="text-2xl font-medium text-green-700">
                      ₹{(parseFloat(directOfferPrice) * parseFloat(directOfferQuantity)).toLocaleString('en-IN')}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <View className="flex-row gap-3 p-5 border-t border-gray-200">
              <TouchableOpacity 
                className="flex-1 py-3 rounded-xl border border-gray-300 items-center"
                onPress={() => setShowDirectOfferModal(false)}
              >
                <Text className="font-medium text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 py-3 bg-green-600 rounded-xl items-center"
                onPress={submitDirectOffer}
              >
                <Text className="font-medium text-white">Submit Offer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Counter Offer Modal */}
      <Modal visible={showCounterOfferModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl w-full max-w-md">
            <View className="p-5 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-medium text-gray-900">Counter Offer</Text>
                <TouchableOpacity 
                  onPress={() => setShowCounterOfferModal(false)}
                  className="w-10 h-10 items-center justify-center"
                >
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500 mt-1">
                Respond to trader's offer
              </Text>
            </View>

            <ScrollView className="max-h-96">
              <View className="p-5">
                <View className="bg-gray-50 p-4 rounded-xl mb-4">
                  <Text className="text-sm font-medium text-gray-900 mb-2">
                    Current Offer
                  </Text>
                  <Text className="text-lg font-medium text-gray-900">
                    ₹{selectedOffer?.offeredPrice} × {selectedOffer?.quantity}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    Total: ₹{(selectedOffer?.offeredPrice || 0) * (selectedOffer?.quantity || 0)}
                  </Text>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-900 mb-2">
                    Your Counter Price (₹)
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50"
                    value={counterPrice}
                    onChangeText={setCounterPrice}
                    placeholder="Enter counter price"
                    keyboardType="numeric"
                  />
                </View>

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

                {counterPrice && counterQuantity && (
                  <View className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <Text className="text-sm font-medium text-blue-800 mb-1">
                      Counter Offer Total
                    </Text>
                    <Text className="text-2xl font-medium text-blue-700">
                      ₹{(parseFloat(counterPrice) * parseFloat(counterQuantity)).toLocaleString('en-IN')}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <View className="flex-row gap-3 p-5 border-t border-gray-200">
              <TouchableOpacity 
                className="flex-1 py-3 rounded-xl border border-gray-300 items-center"
                onPress={() => setShowCounterOfferModal(false)}
              >
                <Text className="font-medium text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 py-3 bg-green-600 rounded-xl items-center"
                onPress={submitCounterOffer}
              >
                <Text className="font-medium text-white">Send Counter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

       <CustomAlert
  visible={showAlert}
  title={alertTitle}
  message={alertMessage}
  onClose={() => {
    setShowAlert(false);
    if (alertAction) alertAction();
  }}
/>
    </SafeAreaView>
  );
};

export default Mycrop;


