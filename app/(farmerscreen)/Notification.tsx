import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  ChevronLeft
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

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
  purchaseHistory?: PurchaseHistory[];
}

interface Product {
  _id: string;
  productId: string;
  cropBriefDetails: string;
  unitMeasurement?: string;
  gradePrices: GradePrice[];
  cropPhotos: string[];
  farmerId: string;
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

const NotificationScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingOrders, setPendingOrders] = useState<OrderFromDB[]>([]);
  const [displayOrders, setDisplayOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      processOrders();
    }
  }, [products, pendingOrders]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (!farmerId) {
        setLoading(false);
        return;
      }

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
      console.error('Error fetching notifications:', err);
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleNotificationPress = (orderItem: OrderItem) => {
    router.push('/(farmerscreen)/FarmerOrder' as any);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-4 text-base text-gray-500">Loading notifications...</Text>
      </View>
    );
  }

  return (
   <SafeAreaView className="bg-white flex-1">
      {/* Header */}
      <View className="flex-row items-center px-4 bg-white shadow-sm mb-4">
        <TouchableOpacity
          onPress={() => router.push("/(farmer)/home")}
          className="p-2"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="ml-3 text-xl font-medium text-gray-900">
          Notifications
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
        }
      >
        {displayOrders.length === 0 ? (
          <View className="items-center justify-center py-20 px-8">
            <Text className="text-6xl mb-4 opacity-50">🔔</Text>
            <Text className="text-xl font-semibold text-gray-900 mb-2">No notifications</Text>
            <Text className="text-sm text-gray-500">You're all caught up!</Text>
          </View>
        ) : (
          <View className="p-3">
            {displayOrders.map((orderItem, index) => {
              const uniqueKey = `${orderItem.orderData._id}-${orderItem.productItem.productId}-${index}`;

              return (
                <TouchableOpacity
                  key={uniqueKey}
                  className="bg-green-50 rounded-xl mb-2.5 overflow-hidden shadow-sm border border-green-200"
                  style={{
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 3,
                  }}
                  onPress={() => handleNotificationPress(orderItem)}
                  activeOpacity={0.7}
                >
                  {/* Unread indicator dot */}
                  <View className="absolute top-3 left-3 w-2 h-2 rounded-full bg-green-600 z-10" />

                  <View className="flex-row p-3 pl-5 items-center">
                    {/* Product Image */}
                    <Image
                      source={{ uri: getImageUrl(orderItem.product.cropPhotos[0]) }}
                      className="w-15 h-15 rounded-lg mr-3"
                      resizeMode="cover"
                    />

                    <View className="flex-1 pr-2">
                      {/* Title */}
                      <Text className="text-base font-medium text-gray-900 mb-1">
                        New Order: {orderItem.product.cropBriefDetails}
                      </Text>

                      {/* Details */}
                      <Text className="text-xs font-medium text-gray-600 leading-5 mb-1.5">
                        {orderItem.orderData.traderId} • {orderItem.productItem.quantity}{' '}
                        {orderItem.product.unitMeasurement || 'units'} • Grade {orderItem.grade.grade}
                      </Text>

                      {/* Footer */}
                      <View className="flex-row items-center flex-wrap">
                        <Text className="text-xs text-gray-500">
                          {getTimeAgo(orderItem.orderData.createdAt)}
                        </Text>
                        <Text className="text-xs text-gray-300 mx-1.5">•</Text>
                        <Text className="text-xs text-green-600 font-semibold">
                          ₹{orderItem.productItem.totalAmount.toFixed(2)}
                        </Text>
                        <Text className="text-xs text-gray-300 mx-1.5">•</Text>
                        <Text className="text-xs text-gray-500">
                          {orderItem.orderData.orderId}
                        </Text>
                      </View>
                    </View>

                    <View className="justify-center pl-2">
                      <Text className="text-2xl text-gray-300">›</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default NotificationScreen;