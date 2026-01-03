
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
  
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";
// import {
//   ChevronLeft,
// } from "lucide-react-native"

// interface OrderData {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   traderName: string;
//   farmerId: string;
//   productItems: {
//     productId: string;
//     farmerId: string;
//     grade: string;
//     quantity: number;
//     pricePerUnit: number;
//     totalAmount: number;
//   }[];
//   traderToAdminPayment: {
//     totalAmount: number;
//   };
//   farmerAcceptedStatus: boolean;
//   createdAt: string;
// }

// interface Commission {
//   role: string;
//   commissionPercentage: number;
// }

// const FarmerOrderAccept = () => {
//   const navigation = useNavigation();
//   const [orders, setOrders] = useState<OrderData[]>([]);
//   const [allOrders, setAllOrders] = useState<OrderData[]>([]);
//   const [showOnlyPending, setShowOnlyPending] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [commissionRate, setCommissionRate] = useState(0);
//   const [accepting, setAccepting] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState("");

//   useEffect(() => {
//     fetchCommission();
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     if (showOnlyPending)
//       setOrders(allOrders.filter((o) => !o.farmerAcceptedStatus));
//     else setOrders(allOrders);
//   }, [showOnlyPending, allOrders]);

//   const fetchCommission = async () => {
//     try {
//       const res = await fetch("https://kisan.etpl.ai/api/commission/all");
//       const data = await res.json();
//       const farmer = data.find((c: Commission) => c.role === "FARMER");
//       if (farmer) setCommissionRate(farmer.commissionPercentage);
//     } catch (e) {
//       console.log("commission error", e);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const farmerId = await AsyncStorage.getItem("farmerId");
//       if (!farmerId) return;

//       const res = await fetch(
//         `https://kisan.etpl.ai/api/orders/farmer/${farmerId}`
//       );
//       const data = await res.json();

//       let list: OrderData[] = [];
//       if (data?.data) list = data.data;
//       else if (Array.isArray(data)) list = data;
//       else if (data?.orders) list = data.orders;

//       setAllOrders(list);
//     } catch (e) {
//       Alert.alert("Error", "Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchCommission();
//     await fetchOrders();
//     setRefreshing(false);
//   };

//   const calcCommission = (a: number) => (a * commissionRate) / 100;
//   const calcNet = (a: number) => a - calcCommission(a);

//   const handleAcceptOrder = async (order: OrderData) => {
//     try {
//       setAccepting(order._id);

//       const farmerId = await AsyncStorage.getItem("farmerId");
//       const farmerName = (await AsyncStorage.getItem("farmerName")) || "";
//       const farmerMobile =
//         (await AsyncStorage.getItem("farmerMobile")) || "";
//       const farmerEmail =
//         (await AsyncStorage.getItem("farmerEmail")) || "";

//       const gross = order.traderToAdminPayment.totalAmount;
//       const net = calcNet(gross);

//       const productItems = order.productItems.map((i) => ({
//         productId: i.productId,
//         grade: i.grade,
//         quantity: i.quantity,
//       }));

//       const res = await fetch(
//         "https://kisan.etpl.ai/api/orders/farmer-accept",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             farmerId,
//             traderId: order.traderId,
//             productItems,
//             farmerName,
//             farmerMobile,
//             farmerEmail,
//             totalFarmerAmount: net,
//             commissionRate,
//           }),
//         }
//       );

//       const result = await res.json();

//       if (result.success) {
//         setSuccessMessage(`Order ${order.orderId} accepted successfully!`);
//         setTimeout(() => {
//           setSuccessMessage("");
//           fetchOrders();
//         }, 2500);
//       } else Alert.alert("Error", result.message);
//     } catch {
//       Alert.alert("Error", "Failed to accept");
//     } finally {
//       setAccepting(null);
//     }
//   };

//   if (loading && !refreshing)
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-100">
//         <ActivityIndicator size="large" color="#22c55e" />
//         <Text className="mt-3 text-gray-500 text-base">
//           Loading orders...
//         </Text>
//       </View>
//     );

//   return (
    
//     <SafeAreaView className="flex-1 bg-white">
//       <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
//          <TouchableOpacity
//            onPress={() => router.push("/(farmer)/home")}
//            className="p-2"
//          >
//            <ChevronLeft size={24} color="#374151" />
//          </TouchableOpacity>
//          <Text className="ml-3 text-xl font-medium text-gray-900">Order</Text>
//       </View>

//       <ScrollView
//         className="flex-1"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* TABS */}
//         <View className="flex-row px-5 py-4 bg-white space-x-3">
//           <TouchableOpacity
//             onPress={() => setShowOnlyPending(true)}
//             className={`px-6 py-2 rounded-full ${
//               showOnlyPending ? "bg-black" : "bg-transparent"
//             }`}
//           >
//             <Text
//               className={`text-sm font-medium ${
//                 showOnlyPending ? "text-white" : "text-gray-500"
//               }`}
//             >
//               Pending Orders
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => setShowOnlyPending(false)}
//             className={`px-6 py-2 rounded-full ${
//               !showOnlyPending ? "bg-black" : "bg-transparent"
//             }`}
//           >
//             <Text
//               className={`text-sm font-medium ${
//                 !showOnlyPending ? "text-white" : "text-gray-500"
//               }`}
//             >
//               Completed Orders
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* SUCCESS */}
//         {successMessage !== "" && (
//           <View className="flex-row bg-green-100 mx-5 mt-4 p-4 rounded-xl items-center">
//             <Text className="text-green-700 text-lg mr-2">✓</Text>
//             <Text className="text-green-700 font-medium flex-1">
//               {successMessage}
//             </Text>
//           </View>
//         )}

//         {/* ORDERS */}
//         <View className="px-5 py-5">
//           {orders.length === 0 ? (
//             <View className="bg-white rounded-2xl py-16 items-center shadow">
//               <Text className="text-7xl mb-3">📦</Text>
//               <Text className="text-lg font-medium text-gray-800">
//                 {showOnlyPending
//                   ? "No pending orders"
//                   : "No orders found"}
//               </Text>
//               <Text className="text-gray-500 text-sm">
//                 {showOnlyPending
//                   ? "Orders will appear here"
//                   : "You have no orders yet"}
//               </Text>
//             </View>
//           ) : (
//             orders.map((order) => {
//               const gross = order.traderToAdminPayment.totalAmount;
//               const commission = calcCommission(gross);
//               const net = calcNet(gross);

//               return (
//                 <View
//                   key={order._id}
//                   className="bg-white rounded-lg p-5 mb-4 border border-gray-200"
//                 >
//                   {/* HEADER */}
//                   <View className="flex-row justify-between items-center mb-3">
//                     <View className="flex-row items-center flex-1">
//                       <View className="w-12 h-12 bg-blue-500 rounded-xl justify-center items-center mr-3">
//                         <Text className="text-white font-medium">
//                           {order.traderName.substring(0, 2).toUpperCase()}
//                         </Text>
//                       </View>

//                       <View className="flex-1">
//                         <Text className="font-medium text-base">
//                           {order.farmerAcceptedStatus
//                             ? "Order accepted"
//                             : "Review order"}
//                         </Text>

//                         <Text className="text-gray-500 text-xs">
//                           Delivery today by{" "}
//                           {new Date(order.createdAt).toLocaleTimeString(
//                             "en-IN",
//                             { hour: "2-digit", minute: "2-digit" }
//                           )}
//                         </Text>
//                       </View>
//                     </View>

                    
//                   </View>

//                   {/* MESSAGE */}
//                   <Text className="text-gray-600 text-sm leading-5 mb-4">
//                     {order.traderName} needs to confirm order details.
//                     Review or chat with them.
//                   </Text>


//                   {/* PRODUCTS */}
//                   {order.productItems.map((item, i) => (
//                     <View
//                       key={i}
//                       className="flex-row items-center py-1"
//                     >
//                       <View className="w-10 h-10 bg-amber-100 rounded-xl justify-center items-center mr-3">
//                         <Text className="text-xl">
//                           {i === 0 ? "🥕" : i === 1 ? "🧅" : "🫚"}
//                         </Text>
//                       </View>

//                       <View className="flex-1">
//                         <Text className="font-medium">
//                           Grade {item.grade}
//                         </Text>
//                         <Text className="text-gray-500 text-xs">
//                           {item.quantity} units
//                         </Text>
//                       </View>
//                     </View>
//                   ))}

//                   {/* SUMMARY */}
//                   <View className="bg-gray-100 rounded-xl p-4 my-4">
//                     <View className="flex-row justify-between mb-1">
//                       <Text className="text-gray-500 text-sm">
//                         Gross Amount
//                       </Text>
//                       <Text className="font-medium">
//                         ₹{gross.toFixed(2)}
//                       </Text>
//                     </View>

//                     <View className="flex-row justify-between mb-1">
//                       <Text className="text-gray-500 text-sm">
//                         Platform Fee ({commissionRate}%)
//                       </Text>
//                       <Text className="text-red-500 font-medium">
//                         -₹{commission.toFixed(2)}
//                       </Text>
//                     </View>

//                     <View className="h-px bg-gray-300 my-2" />

//                     <View className="flex-row justify-between">
//                       <Text className="font-medium">
//                         You'll Receive
//                       </Text>
//                       <Text className="text-green-600 font-medium text-lg">
//                         ₹{net.toFixed(2)}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* ACCEPT BUTTON */}
//                   {!order.farmerAcceptedStatus ? (
//                     <TouchableOpacity
//                       disabled={accepting === order._id}
//                       onPress={() => handleAcceptOrder(order)}
//                       className={`py-4 rounded-xl items-center ${
//                         accepting === order._id
//                           ? "bg-gray-400"
//                           : "bg-green-500"
//                       }`}
//                     >
//                       {accepting === order._id ? (
//                         <ActivityIndicator color="#fff" />
//                       ) : (
//                         <Text className="text-white font-medium text-base">
//                           Accept Order
//                         </Text>
//                       )}
//                     </TouchableOpacity>
//                   ) : (
//                     <View className="bg-green-100 py-3 rounded-xl items-center">
//                       <Text className="text-green-700 font-medium">
//                         ✓ Already Accepted
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               );
//             })
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default FarmerOrderAccept;






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
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading pending orders...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>🛒</Text>
          <View>
            <Text style={styles.headerTitle}>Pending Orders</Text>
            <Text style={styles.headerSubtitle}>Review and accept orders from traders</Text>
          </View>
        </View>
      </View>

      {successMessage ? (
        <View style={styles.successBanner}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      {displayOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No pending orders</Text>
          <Text style={styles.emptySubtitle}>Orders from traders will appear here</Text>
        </View>
      ) : (
        <View style={styles.ordersContainer}>
          {displayOrders.map((orderItem, index) => {
            const grossAmount = orderItem.productItem.totalAmount;
            const commission = calculateCommission(grossAmount);
            const netAmount = calculateNetAmount(grossAmount);
            const uniqueKey = `${orderItem.orderData._id}-${orderItem.productItem.productId}-${index}`;

            return (
              <View key={uniqueKey} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderTitle}>{orderItem.product.cropBriefDetails}</Text>
                    <Text style={styles.orderTrader}>From: {orderItem.orderData.traderId}</Text>
                    <Text style={styles.orderIdText}>Order ID: {orderItem.orderData.orderId}</Text>
                  </View>
                  <View style={styles.orderHeaderRight}>
                    <Text style={styles.orderDateLabel}>Order Date</Text>
                    <Text style={styles.orderDate}>
                      {new Date(orderItem.orderData.createdAt).toLocaleDateString('en-IN')}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderBody}>
                  <View style={styles.orderImageRow}>
                    <Image
                      source={{ uri: getImageUrl(orderItem.product.cropPhotos[0]) }}
                      style={styles.orderImage}
                      resizeMode="cover"
                    />
                    <View style={styles.orderDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Product ID</Text>
                          <Text style={styles.detailValue}>{orderItem.product.productId}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Grade</Text>
                          <Text style={styles.detailValueGreen}>{orderItem.grade.grade}</Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Quantity</Text>
                          <Text style={styles.detailValue}>
                            {orderItem.productItem.quantity} {orderItem.product.unitMeasurement || 'units'}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Price/unit</Text>
                          <Text style={styles.detailValue}>
                            ₹{orderItem.productItem.pricePerUnit.toFixed(2)}/{orderItem.product.unitMeasurement || 'unit'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.amountContainer}>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountIcon}>📈</Text>
                      <Text style={styles.amountLabel}>Gross Amount</Text>
                      <Text style={styles.amountValue}>₹{grossAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountIcon}>⚠️</Text>
                      <Text style={styles.amountLabel}>Platform Fee ({commissionRate}%)</Text>
                      <Text style={styles.amountValueRed}>-₹{commission.toFixed(2)}</Text>
                    </View>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountIcon}>✓</Text>
                      <Text style={styles.amountLabel}>You'll Receive</Text>
                      <Text style={styles.amountValueGreen}>₹{netAmount.toFixed(2)}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      accepting === uniqueKey && styles.acceptButtonDisabled
                    ]}
                    onPress={() => handleAcceptOrder(orderItem)}
                    disabled={accepting === uniqueKey}
                  >
                    {accepting === uniqueKey ? (
                      <>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.acceptButtonText}>Processing...</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.acceptButtonIcon}>✓</Text>
                        <Text style={styles.acceptButtonText}>Accept Order</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <View style={styles.noteContainer}>
                    <Text style={styles.noteText}>
                      <Text style={styles.noteBold}>Note:</Text> By accepting, you confirm the order. 
                      Payment of ₹{netAmount.toFixed(2)} will be processed after delivery.
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  successBanner: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successIcon: {
    fontSize: 24,
    color: '#16a34a',
  },
  successText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#065f46',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
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
  ordersContainer: {
    padding: 16,
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 8,
  },
  orderHeader: {
    backgroundColor: '#16a34a',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  orderTrader: {
    fontSize: 13,
    color: '#d1fae5',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 11,
    color: '#d1fae5',
  },
  orderHeaderRight: {
    alignItems: 'flex-end',
  },
  orderDateLabel: {
    fontSize: 12,
    color: '#d1fae5',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  orderBody: {
    padding: 16,
  },
  orderImageRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  orderImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  detailValueGreen: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  amountContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  amountIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  amountValueRed: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  amountValueGreen: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  acceptButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  acceptButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  acceptButtonIcon: {
    fontSize: 20,
    color: '#fff',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  noteContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
  },
  noteText: {
    fontSize: 11,
    color: '#92400e',
    lineHeight: 16,
  },
  noteBold: {
    fontWeight: 'bold',
  },
});

export default FarmerOrderAccept;




