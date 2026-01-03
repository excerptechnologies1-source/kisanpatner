import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>🔔</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {displayOrders.length} {displayOrders.length === 1 ? 'order' : 'orders'} pending
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
        }
      >
        {displayOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        ) : (
          <View style={styles.notificationsContainer}>
            {displayOrders.map((orderItem, index) => {
              const uniqueKey = `${orderItem.orderData._id}-${orderItem.productItem.productId}-${index}`;

              return (
                <TouchableOpacity
                  key={uniqueKey}
                  style={styles.notificationCard}
                  onPress={() => handleNotificationPress(orderItem)}
                  activeOpacity={0.7}
                >
                  {/* Unread indicator dot */}
                  <View style={styles.unreadDot} />

                  <View style={styles.notificationContent}>
                    {/* Product Image */}
                    <Image
                      source={{ uri: getImageUrl(orderItem.product.cropPhotos[0]) }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />

                    <View style={styles.notificationTextContainer}>
                      {/* Title */}
                      <Text style={styles.notificationTitle}>
                        New Order: {orderItem.product.cropBriefDetails}
                      </Text>

                      {/* Details */}
                      <Text style={styles.notificationMessage}>
                        {orderItem.orderData.traderId} • {orderItem.productItem.quantity} {orderItem.product.unitMeasurement || 'units'} • Grade {orderItem.grade.grade}
                      </Text>

                      {/* Footer */}
                      <View style={styles.notificationFooter}>
                        <Text style={styles.notificationTime}>
                          {getTimeAgo(orderItem.orderData.createdAt)}
                        </Text>
                        <Text style={styles.notificationDot}>•</Text>
                        <Text style={styles.notificationAmount}>
                          ₹{orderItem.productItem.totalAmount.toFixed(2)}
                        </Text>
                        <Text style={styles.notificationDot}>•</Text>
                        <Text style={styles.notificationOrderId}>
                          {orderItem.orderData.orderId}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.notificationArrow}>
                      <Text style={styles.arrowIcon}>›</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#16a34a',
    marginTop: 2,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  notificationsContainer: {
    padding: 12,
  },
  notificationCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
    zIndex: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  notificationTime: {
    fontSize: 11,
    color: '#6b7280',
  },
  notificationDot: {
    fontSize: 11,
    color: '#d1d5db',
    marginHorizontal: 6,
  },
  notificationAmount: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '600',
  },
  notificationOrderId: {
    fontSize: 11,
    color: '#6b7280',
  },
  notificationArrow: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  arrowIcon: {
    fontSize: 24,
    color: '#d1d5db',
  },
});

export default NotificationScreen;