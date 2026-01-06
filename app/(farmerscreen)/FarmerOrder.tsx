import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface Offer {
  _id: string;
  offerId: string;
  traderId: string;
  traderName?: string;
  offeredPrice: number;
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: string;
}

interface PurchaseHistory {
  _id: string;
  traderId: string;
  traderName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  purchaseDate: string;
  purchaseType: 'direct' | 'offer_accepted';
  paymentStatus: string;
  orderCreated: boolean;
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
  farmerId: string;
  status: string;
}

interface OrderFromDB {
  _id: string;
  orderId: string;
  traderId: string;
  traderName: string;
  farmerId: string;
  farmerAcceptedStatus: boolean;
  traderAcceptedStatus: boolean;
  productItems: Array<{
    productId: string;
    farmerId: string;
    grade: string;
    quantity: number;
    pricePerUnit: number;
    totalAmount: number;
  }>;
  createdAt: string;
}

interface OrderItem {
  product: Product;
  grade: GradePrice;
  orderData: OrderFromDB;
  productItem: any;
}

interface Commission {
  role: string;
  commissionPercentage: number;
}

const FarmerOrderAccept = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingOrders, setPendingOrders] = useState<OrderFromDB[]>([]);
  const [displayOrders, setDisplayOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commissionRate, setCommissionRate] = useState<number>(0);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCommission();
    fetchData();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      processOrders();
    }
  }, [products, pendingOrders]);

  const fetchCommission = async () => {
    try {
      const response = await fetch('https://kisan.etpl.ai/api/commission/all');
      const data = await response.json();
      const farmerCommission = data.find((c: Commission) => c.role.toLowerCase() === 'farmer');
      if (farmerCommission) {
        setCommissionRate(farmerCommission.commissionPercentage);
      }
    } catch (error) {
      console.error('Error fetching commission:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (!farmerId) throw new Error('Farmer not logged in');

      const productsResponse = await fetch(`https://kisan.etpl.ai/product/by-farmer/${farmerId}`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.data || []);
      }

      const ordersResponse = await fetch(`https://kisan.etpl.ai/api/orders/farmer-pending/${farmerId}`);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setPendingOrders(ordersData.orders || []);
        
        if (ordersData.pendingPurchases && ordersData.pendingPurchases.length > 0) {
          setProducts(prev => {
            const productMap = new Map();
            prev.forEach(p => productMap.set(p._id, p));
            ordersData.pendingPurchases.forEach(p => productMap.set(p._id, p));
            return Array.from(productMap.values());
          });
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      Alert.alert('Error', 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processOrders = () => {
    const allOrders: OrderItem[] = [];
    
    pendingOrders.forEach(order => {
      if (!order.farmerAcceptedStatus && order.traderAcceptedStatus) {
        order.productItems?.forEach(productItem => {
          const product = products.find(p => p.productId === productItem.productId);
          if (product) {
            const grade = product.gradePrices.find(g => g.grade === productItem.grade);
            if (grade) {
              allOrders.push({
                product,
                grade,
                orderData: order,
                productItem
              });
            }
          }
        });
      }
    });
    
    products.forEach(product => {
      product.gradePrices.forEach(grade => {
        if (grade.purchaseHistory && grade.purchaseHistory.length > 0) {
          grade.purchaseHistory.forEach(purchase => {
            if (!purchase.orderCreated) {
              const alreadyExists = allOrders.some(
                item => 
                  item.product.productId === product.productId &&
                  item.grade.grade === grade.grade &&
                  item.orderData.traderId === purchase.traderId
              );
              
              if (!alreadyExists) {
                const mockOrder: OrderFromDB = {
                  _id: purchase._id,
                  orderId: 'PENDING',
                  traderId: purchase.traderId,
                  traderName: purchase.traderName,
                  farmerId: product.farmerId,
                  farmerAcceptedStatus: false,
                  traderAcceptedStatus: true,
                  productItems: [],
                  createdAt: purchase.purchaseDate
                };
                
                const mockProductItem = {
                  productId: product.productId,
                  farmerId: product.farmerId,
                  grade: grade.grade,
                  quantity: purchase.quantity,
                  pricePerUnit: purchase.pricePerUnit,
                  totalAmount: purchase.totalAmount
                };
                
                allOrders.push({
                  product,
                  grade,
                  orderData: mockOrder,
                  productItem: mockProductItem
                });
              }
            }
          });
        }
      });
    });
    
    allOrders.sort((a, b) => {
      const dateA = new Date(a.orderData.createdAt);
      const dateB = new Date(b.orderData.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    setDisplayOrders(allOrders);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://kisan.etpl.ai/${imagePath}`;
  };

  const calculateCommission = (amount: number) => (amount * commissionRate) / 100;
  const calculateNetAmount = (amount: number) => amount - calculateCommission(amount);

  const handleAcceptOrder = async (orderItem: OrderItem) => {
    try {
      const uniqueKey = `${orderItem.orderData._id}-${orderItem.productItem.productId}`;
      setAccepting(uniqueKey);
      
      const farmerId = await AsyncStorage.getItem('farmerId');
      const farmerName = await AsyncStorage.getItem('farmerName') || 'Farmer';
      const farmerMobile = await AsyncStorage.getItem('farmerMobile') || '';
      const farmerEmail = await AsyncStorage.getItem('farmerEmail') || '';

      const grossAmount = orderItem.productItem.totalAmount;
      const netAmount = calculateNetAmount(grossAmount);

      const isPendingPurchase = orderItem.orderData.orderId === 'PENDING';
      let purchaseHistoryId = null;
      
      if (isPendingPurchase) {
        const purchase = orderItem.grade.purchaseHistory?.find(
          p => !p.orderCreated && 
               p.traderId === orderItem.orderData.traderId &&
               p.quantity === orderItem.productItem.quantity
        );
        purchaseHistoryId = purchase?._id || null;
      }

      const response = await fetch('https://kisan.etpl.ai/api/orders/farmer-accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId,
          traderId: orderItem.orderData.traderId,
          productItems: [orderItem.productItem],
          farmerName,
          farmerMobile,
          farmerEmail,
          totalFarmerAmount: netAmount,
          commissionRate,
          productId: orderItem.product._id,
          gradeId: orderItem.grade._id,
          purchaseHistoryId
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(`Order from ${orderItem.orderData.traderName} accepted successfully!`);
        Alert.alert('Success', `Order from ${orderItem.orderData.traderName} accepted successfully!`);
        setTimeout(() => {
          setSuccessMessage('');
          fetchData();
        }, 3000);
      } else {
        Alert.alert('Error', 'Failed to accept order: ' + result.message);
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      Alert.alert('Error', 'Failed to accept order. Please try again.');
    } finally {
      setAccepting(null);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-4 text-base text-gray-500">Loading pending orders...</Text>
      </View>
    );
  }

  return (
     <SafeAreaView 
      className="flex-1 bg-white"
     
    >


      <View className="flex-row items-center bg-white px-4 py-4">
              <TouchableOpacity
                 onPress={() => router.push('/(farmer)/home')}
                className="p-2"
              >
                <ChevronLeft size={24} color="#374151" />
              </TouchableOpacity>
              <View>
            <Text className="text-2xl font-medium text-gray-800">Pending Orders</Text>
            <Text className="text-sm text-gray-500">Review and accept orders</Text>
          </View>

          <View className="ml-auto bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-sm font-medium text-blue-600">
              {displayOrders.length} pending
            </Text>
          </View>
            </View>

      <View className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
        }
      >
        {/* Success Banner */}
        {successMessage ? (
          <View className="mx-4 mt-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
            <View className="flex-row items-center">
              <Icon name="check-circle" size={20} color="#059669" />
              <Text className="ml-2 text-sm font-medium text-green-800 flex-1">
                {successMessage}
              </Text>
            </View>
          </View>
        ) : null}

        {displayOrders.length === 0 ? (
          <View className="flex-1 items-center justify-center py-16 px-8">
            <View className="bg-gray-100 p-6 rounded-full mb-4">
              <Icon name="package-variant" size={48} color="#9ca3af" />
            </View>
            <Text className="text-xl font-medium text-gray-700 mb-2">No pending orders</Text>
            <Text className="text-sm text-gray-500 text-center">
              Orders from traders will appear here for your review
            </Text>
            <TouchableOpacity 
              className="mt-6 bg-green-500 px-6 py-2 rounded-lg"
              onPress={onRefresh}
            >
              <Text className="text-white font-medium">Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="p-4 space-y-4">
            {displayOrders.map((orderItem, index) => {
              const grossAmount = orderItem.productItem.totalAmount;
              const commission = calculateCommission(grossAmount);
              const netAmount = calculateNetAmount(grossAmount);
              const uniqueKey = `${orderItem.orderData._id}-${orderItem.productItem.productId}-${index}`;

              return (
                <Card key={uniqueKey} className="mb-3 ">
                  {/* Card Header */}
                  <Card.Content className="pb-0 bg-white">
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Icon name="store" size={16} color="#6b7280" />
                          <Text className="ml-1 text-sm text-gray-600">
                            {orderItem.orderData.traderName || orderItem.orderData.traderId}
                          </Text>
                        </View>
                        <Text className="text-lg font-medium text-gray-800">
                          {orderItem.product.cropBriefDetails}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Icon name="identifier" size={14} color="#6b7280" />
                          <Text className="ml-1 text-xs text-gray-500">
                            Order #{orderItem.orderData.orderId}
                          </Text>
                          <Text className="mx-2 text-gray-300">•</Text>
                          <Icon name="calendar" size={14} color="#6b7280" />
                          <Text className="ml-1 text-xs text-gray-500">
                            {new Date(orderItem.orderData.createdAt).toLocaleDateString('en-IN')}
                          </Text>
                        </View>
                      </View>
                      <View className="bg-green-100 px-2 py-1 rounded">
                        <Text className="text-xs font-medium text-green-800">
                          Grade {orderItem.grade.grade}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>

                  <Divider />

                  {/* Product Details */}
                  <Card.Content className="py-3 bg-white">
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: getImageUrl(orderItem.product.cropPhotos[0]) }}
                        className="w-20 h-20 rounded-lg mr-3"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <View className="flex-row justify-between mb-2">
                          <View>
                            <Text className="text-xs text-gray-500">Quantity</Text>
                            <Text className="text-sm font-medium text-gray-800">
                              {orderItem.productItem.quantity} {orderItem.product.unitMeasurement || 'units'}
                            </Text>
                          </View>
                          <View>
                            <Text className="text-xs text-gray-500">Price/Unit</Text>
                            <Text className="text-sm font-medium text-gray-800">
                              ₹{orderItem.productItem.pricePerUnit.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                        <View className="bg-gray-50 p-2 rounded">
                          <View className="flex-row justify-between">
                            <View className="flex-row items-center">
                              <Icon name="currency-inr" size={14} color="#059669" />
                              <Text className="ml-1 text-sm text-gray-700">Gross Amount</Text>
                            </View>
                            <Text className="text-sm font-medium text-gray-800">
                              ₹{grossAmount.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Card.Content>

                  <Divider />

                  {/* Commission & Net Amount */}
                  <Card.Content className="py-3 bg-white">
                    <View className="space-y-2">
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <Icon name="percent" size={16} color="#ef4444" />
                          <Text className="ml-2 text-sm text-gray-600">Platform Fee ({commissionRate}%)</Text>
                        </View>
                        <Text className="text-sm font-medium text-red-600">
                          -₹{commission.toFixed(2)}
                        </Text>
                      </View>
                      
                      <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
                        <View className="flex-row items-center">
                          <Icon name="cash" size={18} color="#059669" />
                          <Text className="ml-2 text-base font-medium text-gray-800">You'll Receive</Text>
                        </View>
                        <View className="bg-green-50 px-3 py-1 rounded">
                          <Text className="text-lg font-medium text-green-700">
                            ₹{netAmount.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card.Content>

                  <Divider />

                  {/* Action Button */}
                  <Card.Content className="pt-3 bg-white">
                    <TouchableOpacity
                      className={`rounded-lg py-3 flex-row items-center justify-center ${
                        accepting === uniqueKey ? 'bg-gray-400' : 'bg-green-600'
                      }`}
                      onPress={() => handleAcceptOrder(orderItem)}
                      disabled={accepting === uniqueKey}
                    >
                      {accepting === uniqueKey ? (
                        <>
                          <ActivityIndicator size="small" color="#fff" />
                          <Text className="ml-2 text-base font-medium text-white">
                            Processing...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Icon name="check-circle" size={20} color="#fff" />
                          <Text className="ml-2 text-base font-medium text-white">
                            Accept Order
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <View className="mt-3 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      <View className="flex-row">
                        <Icon name="information" size={16} color="#d97706" />
                        <Text className="ml-2 text-xs text-yellow-800 flex-1">
                          By accepting, you confirm this order. Payment will be processed after successful delivery.
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-20" />
      </ScrollView>

      {/* Stats Bar (Optional) */}
      {displayOrders.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-gray-500">Total Pending</Text>
              <Text className="text-lg font-medium text-gray-800">{displayOrders.length} orders</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-gray-500">Est. Total</Text>
              <Text className="text-lg font-medium text-green-600">
                ₹{displayOrders.reduce((sum, item) => sum + calculateNetAmount(item.productItem.totalAmount), 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};

export default FarmerOrderAccept;









