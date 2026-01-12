// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   RefreshControl,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from "expo-router";
// import {
//   ChevronLeft,
// } from "lucide-react-native"
// import { SafeAreaView } from "react-native-safe-area-context";
// import DotLoader from '@/components/DotLoader';

// interface PaymentRecord {
//   _id: string;
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId?: string;
//   razorpayOrderId?: string;
// }

// interface AdminToFarmerPayment {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: 'pending' | 'partial' | 'paid';
//   paymentHistory: PaymentRecord[];
// }

// interface ProductItem {
//   _id: string;
//   productId: string;
//   farmerId: string;
//   grade: string;
//   quantity: number;
//   pricePerUnit: number;
//   deliveryDate?: string;
//   totalAmount: number;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   traderName: string;
//   traderMobile?: string;
//   farmerId: string;
//   farmerName?: string;
//   productItems: ProductItem[];
//   adminToFarmerPayment: AdminToFarmerPayment;
//   orderStatus: string;
//   transporterStatus: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const FarmerOrderHistory: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState('');
//   const [farmerId, setFarmerId] = useState<string | null>(null);
  

//   useEffect(() => {
//     loadFarmerIdAndFetch();
//   }, []);

//   const loadFarmerIdAndFetch = async () => {
//     try {
//       const id = await AsyncStorage.getItem('farmerId');
//       setFarmerId(id);
//       if (id) {
//         fetchOrderHistory(id);
//       } else {
//         setError('Farmer ID not found. Please login again.');
//         setLoading(false);
//       }
//     } catch (err) {
//       setError('Failed to load farmer ID');
//       setLoading(false);
//     }
//   };

//   const fetchOrderHistory = async (id: string) => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await axios.get(
//         `https://kisan.etpl.ai/api/orders/history/farmer/${id}`
//       );

//       if (response.data.success) {
//         setOrders(response.data.data);
//       }
//       setLoading(false);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to fetch order history');
//       setLoading(false);
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     if (!farmerId) return;
//     setRefreshing(true);
//     try {
//       await fetchOrderHistory(farmerId);
//     } finally {
//       setRefreshing(false);
//     }
//   }, [farmerId]);

//   const handleManualRefresh = () => {
//     if (farmerId) fetchOrderHistory(farmerId);
//     else Alert.alert('Error', 'Farmer ID not found');
//   };

//   const getStatusColor = (status: string): string => {
//     const statusColors: { [key: string]: string } = {
//       pending: '#ffc107',
//       processing: '#17a2b8',
//       in_transit: '#007bff',
//       completed: '#28a745',
//       cancelled: '#dc3545',
//       partial: '#ffc107',
//       paid: '#28a745',
//     };
//     return statusColors[status] || '#6c757d';
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//     }).format(amount);
//   };

//   if (loading && !refreshing) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-100">
//         <DotLoader/>
//         <Text className="mt-4 text-base text-gray-500">
//           Loading order history...
//         </Text>
//       </View>
//     );
//   }

//   if (error && !refreshing) {
//     return (
//       <View className="flex-1 bg-gray-100">
//         <View className="m-5 p-4 bg-red-200 rounded-lg border border-red-300">
//           <Text className="text-red-900 text-sm">{error}</Text>
//         </View>

//         <TouchableOpacity
//           className="bg-blue-500 p-3 mx-4 rounded-lg items-center"
//           onPress={handleManualRefresh}
//         >
//           <Text className="text-white text-lg font-medium">Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     /*  NOTE:
//     This uses NativeWind Tailwind
//     npm i nativewind tailwindcss
// */<SafeAreaView className="flex-1 bg-white">
//   <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
//          <TouchableOpacity
//            onPress={() => router.push("/(farmer)/home")}
//            className="p-2"
//          >
//            <ChevronLeft size={24} color="#374151" />
//          </TouchableOpacity>
//          <Text className="ml-3 text-xl font-medium text-gray-900">Order History</Text>
//       </View>

// <ScrollView
//   refreshControl={
//     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//   }
// >

//   {/* -------- Order Cards -------- */}
//   {orders.map(order => (
//     <View
//       key={order._id}
//       className="mx-4 mt-4 bg-white border border-gray-200 rounded-lg shadow-sm"
//     >

//       {/* Summary Row */}
//       <View className="flex-row justify-between px-4 py-3 border-b border-gray-200">
//         <Text className="w-[40%] text-gray-800">
//           #{order.orderId}
//         </Text>

//         <Text className="w-[30%] text-gray-700">
//           {formatDate(order.createdAt)}
//         </Text>

//         <Text className="w-[30%] text-right font-medium text-gray-900">
//           {formatCurrency(order.adminToFarmerPayment?.totalAmount || 0)}
//         </Text>
//       </View>


//       {/* Content */}
//       {order.productItems
//         .filter(item => item.farmerId === farmerId)
//         .map((item, index, arr) => (
//           <View key={item._id} className={`p-4 flex-row gap-4 ${
//         index !== arr.length - 1 ? 'border-b border-gray-200' : ''
//       }`}>

//             {/* Product Image */}
//             <View className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden">
//               <Text className="text-xs text-center mt-7 text-gray-500">
//                 Image
//               </Text>
//             </View>

//             {/* Middle Details */}
//             <View className="flex-1">

//   {/* Product Title / Grade */}
//   <Text className="text-gray-900 font-medium text-[15px]">
//     Grade – {item.grade}
//   </Text>

//   {/* Sub Text */}
//   <Text className="text-gray-500 mt-1 text-[13px]">
//     Quantity • {item.quantity}
//   </Text>

//   {/* Product ID */}
//   <Text className="text-gray-500 text-[13px]">
//     ID • {item.productId}
//   </Text>

//   {/* Delivered Status Row */}
//   <View className="flex-row items-center mt-2">
//     <View className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2" />
//     <Text className="text-gray-700 font-medium text-[13px]">
//       Delivered on{" "}
//       <Text className="text-gray-900">
//         {formatDate(order.updatedAt)}
//       </Text>
//     </Text>
//   </View>

// </View>



//             {/* Right Price Section */}
//             <View className="items-end justify-between">
//               <Text className="text-gray-900 font-medium text-lg">
//                 {formatCurrency(item.totalAmount)}
//               </Text>

              
//             </View>

//           </View>
//         ))}

//     </View>
//   ))}

// </ScrollView>

// </SafeAreaView>
//   );
// };

// export default FarmerOrderHistory;








// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import {
//   AlertCircle,
//   Calendar,
//   CheckCircle,
//   ChevronDown,
//   ChevronLeft,
//   ChevronUp,
//   Clock,
//   DollarSign,
//   Info,
//   Package,
//   Truck,
//   User,
// } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Dimensions,
//   Modal,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// interface PaymentRecord {
//   _id: string;
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId?: string;
//   razorpayOrderId?: string;
// }

// interface AdminToFarmerPayment {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: 'pending' | 'partial' | 'paid';
//   paymentHistory: PaymentRecord[];
// }

// interface ProductItem {
//   _id: string;
//   productId: string;
//   farmerId: string;
//   grade: string;
//   quantity: number;
//   pricePerUnit: number;
//   deliveryDate?: string;
//   totalAmount: number;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   traderName: string;
//   traderMobile?: string;
//   farmerId: string;
//   farmerName?: string;
//   productItems: ProductItem[];
//   adminToFarmerPayment: AdminToFarmerPayment;
//   orderStatus: string;
//   transporterStatus: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const FarmerOrderHistory = ({ navigation }: any) => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState('');
//   const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
//   const [selectedPaymentHistory, setSelectedPaymentHistory] = useState<PaymentRecord[] | null>(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   useEffect(() => {
//     fetchOrderHistory();
//   }, []);

//   const fetchOrderHistory = async () => {
//     try {
//       setLoading(true);
//       const farmerId = await AsyncStorage.getItem('farmerId');
      
//       if (!farmerId) {
//         setError('Farmer ID not found. Please login again.');
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(
//         `https://kisan.etpl.ai/api/orders/history/farmer/${farmerId}`
//       );
      
//       if (response.data.success) {
//         setOrders(response.data.data);
//         setError('');
//       }
//       console.log('Fetched Orders:', response.data.data);
//       setLoading(false);
//       setRefreshing(false);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to fetch order history');
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchOrderHistory();
//   };

//   const toggleOrderExpansion = (orderId: string) => {
//     const newExpanded = new Set(expandedOrders);
//     if (newExpanded.has(orderId)) {
//       newExpanded.delete(orderId);
//     } else {
//       newExpanded.add(orderId);
//     }
//     setExpandedOrders(newExpanded);
//   };

//   const getStatusColor = (status: string) => {
//     const colors: { [key: string]: string } = {
//       pending: '#f59e0b',
//       processing: '#3b82f6',
//       in_transit: '#8b5cf6',
//       completed: '#10b981',
//       cancelled: '#ef4444',
//       partial: '#f59e0b',
//       paid: '#10b981',
//     };
//     return colors[status] || '#6b7280';
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//     }).format(amount);
//   };

//   const openPaymentHistory = (history: PaymentRecord[]) => {
//     setSelectedPaymentHistory(history);
//     setShowPaymentModal(true);
//   };

//   if (loading && !refreshing) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#16a34a" />
//           <Text style={styles.loadingText}>Loading order history...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (error && !loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <ChevronLeft size={24} color="#374151" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Order History</Text>
//         </View>
//         <View style={styles.errorContainer}>
//           <AlertCircle size={48} color="#ef4444" />
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchOrderHistory}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         {/* <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <ChevronLeft size={24} color="#374151" />
//         </TouchableOpacity> */}
//         <View style={styles.headerContent}>
//           <View style={styles.headerTitleContainer}>
//             <Clock size={24} color="#16a34a" />
//             <Text style={styles.headerTitle}>My Order History</Text>
//           </View>
//           <Text style={styles.headerSubtitle}>
//             View all your orders and payment details
//           </Text>
//         </View>
//       </View>

//       {/* Summary Cards */}
//       <View style={styles.summaryContainer}>
//         <View style={styles.summaryCard}>
//           <View style={styles.summaryIconContainer}>
//             <Package size={24} color="#3b82f6" />
//           </View>
//           <Text style={styles.summaryValue}>{orders.length}</Text>
//           <Text style={styles.summaryLabel}>Total Orders</Text>
//         </View>
//         <View style={styles.summaryCard}>
//           <View style={[styles.summaryIconContainer, { backgroundColor: '#d1fae5' }]}>
//             <CheckCircle size={24} color="#16a34a" />
//           </View>
//           <Text style={styles.summaryValue}>
//             {orders.filter(o => o.orderStatus === 'completed').length}
//           </Text>
//           <Text style={styles.summaryLabel}>Completed</Text>
//         </View>
//         <View style={styles.summaryCard}>
//           <View style={[styles.summaryIconContainer, { backgroundColor: '#fef3c7' }]}>
//             <DollarSign size={24} color="#f59e0b" />
//           </View>
//           <Text style={styles.summaryValue}>
//             {orders.filter(o => o.adminToFarmerPayment.paymentStatus === 'paid').length}
//           </Text>
//           <Text style={styles.summaryLabel}>Paid</Text>
//         </View>
//       </View>

//       {/* Orders List */}
//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#16a34a"
//           />
//         }
//       >
//         {orders.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <View style={styles.emptyBox}>
//               <Package size={64} color="#9ca3af" />
//               <Text style={styles.emptyTitle}>No Orders Found</Text>
//               <Text style={styles.emptyText}>
//                 Your order history will appear here once you receive orders
//               </Text>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.ordersContainer}>
//             {orders.map((order) => {
//               const isExpanded = expandedOrders.has(order._id);
//               const farmerItems = order.productItems.filter(
//                 item => item.farmerId === order.farmerId
//               );

//               return (
//                 <View key={order._id} style={styles.orderCard}>
//                   {/* Order Header */}
//                   <TouchableOpacity
//                     onPress={() => toggleOrderExpansion(order._id)}
//                     activeOpacity={0.7}
//                   >
//                     <View style={styles.orderHeader}>
//                       <View style={styles.orderHeaderLeft}>
//                         <Text style={styles.orderId}>Order #{order.orderId}</Text>
//                         <Text style={styles.orderDate}>
//                           {formatDate(order.createdAt)}
//                         </Text>
//                       </View>
//                       <View style={styles.orderHeaderRight}>
//                         <View
//                           style={[
//                             styles.statusBadge,
//                             { backgroundColor: getStatusColor(order.orderStatus) },
//                           ]}
//                         >
//                           <Text style={styles.statusText}>
//                             {order.orderStatus.toUpperCase()}
//                           </Text>
//                         </View>
//                         {isExpanded ? (
//                           <ChevronUp size={20} color="#6b7280" />
//                         ) : (
//                           <ChevronDown size={20} color="#6b7280" />
//                         )}
//                       </View>
//                     </View>
//                   </TouchableOpacity>

//                   {/* Order Details - Expanded */}
//                   {isExpanded && (
//                     <View style={styles.orderBody}>
//                       {/* Trader Info & Transport Status */}
//                       <View style={styles.infoSection}>
//                         <View style={styles.infoColumn}>
//                           <View style={styles.infoHeader}>
//                             <User size={16} color="#6b7280" />
//                             <Text style={styles.infoHeaderText}>Trader Information</Text>
//                           </View>
//                           <Text style={styles.infoText}>
//                             <Text style={styles.infoLabel}>Name: </Text>
//                             {order.traderName}
//                           </Text>
//                           {order.traderMobile && (
//                             <Text style={styles.infoText}>
//                               <Text style={styles.infoLabel}>Mobile: </Text>
//                               {order.traderMobile}
//                             </Text>
//                           )}
//                         </View>

//                         <View style={styles.infoColumn}>
//                           <View style={styles.infoHeader}>
//                             <Truck size={16} color="#6b7280" />
//                             <Text style={styles.infoHeaderText}>Transport Status</Text>
//                           </View>
//                           <View
//                             style={[
//                               styles.statusBadge,
//                               { backgroundColor: getStatusColor(order.transporterStatus) },
//                             ]}
//                           >
//                             <Text style={styles.statusText}>
//                               {order.transporterStatus.toUpperCase()}
//                             </Text>
//                           </View>
//                         </View>
//                       </View>

//                       <View style={styles.divider} />

//                       {/* Product Items */}
//                       <View style={styles.section}>
//                         <View style={styles.sectionHeader}>
//                           <Package size={18} color="#16a34a" />
//                           <Text style={styles.sectionTitle}>Product Items</Text>
//                         </View>
//                         {farmerItems.map((item) => (
//                           <View key={item._id} style={styles.productItem}>
//                             <View style={styles.productRow}>
//                               <Text style={styles.productLabel}>Product ID:</Text>
//                               <Text style={styles.productValue}>{item.productId}</Text>
//                             </View>
//                             <View style={styles.productRow}>
//                               <Text style={styles.productLabel}>Grade:</Text>
//                               <Text style={styles.productValue}>{item.grade}</Text>
//                             </View>
//                             <View style={styles.productRow}>
//                               <Text style={styles.productLabel}>Quantity:</Text>
//                               <Text style={styles.productValue}>{item.quantity}</Text>
//                             </View>
//                             <View style={styles.productRow}>
//                               <Text style={styles.productLabel}>Price/Unit:</Text>
//                               <Text style={styles.productValue}>
//                                 {formatCurrency(item.pricePerUnit)}
//                               </Text>
//                             </View>
//                             <View style={[styles.productRow, styles.productTotal]}>
//                               <Text style={styles.productLabel}>Total:</Text>
//                               <Text style={styles.productTotalValue}>
//                                 {formatCurrency(item.totalAmount)}
//                               </Text>
//                             </View>
//                             {item.deliveryDate && (
//                               <View style={styles.productRow}>
//                                 <Calendar size={14} color="#6b7280" />
//                                 <Text style={styles.deliveryDate}>
//                                   Delivery: {formatDate(item.deliveryDate)}
//                                 </Text>
//                               </View>
//                             )}
//                           </View>
//                         ))}
//                       </View>

//                       <View style={styles.divider} />

//                       {/* Payment Details */}
//                       <View style={styles.section}>
//                         <View style={styles.sectionHeader}>
//                           <DollarSign size={18} color="#16a34a" />
//                           <Text style={styles.sectionTitle}>Payment Details</Text>
//                         </View>
//                         <View style={styles.paymentCard}>
//                           <View style={styles.paymentRow}>
//                             <Text style={styles.paymentLabel}>Total Amount:</Text>
//                             <Text style={styles.paymentValue}>
//                               {formatCurrency(order.adminToFarmerPayment.totalAmount)}
//                             </Text>
//                           </View>
//                           <View style={styles.paymentRow}>
//                             <Text style={[styles.paymentLabel, { color: '#16a34a' }]}>
//                               Paid Amount:
//                             </Text>
//                             <Text style={[styles.paymentValue, { color: '#16a34a' }]}>
//                               {formatCurrency(order.adminToFarmerPayment.paidAmount)}
//                             </Text>
//                           </View>
//                           <View style={styles.paymentRow}>
//                             <Text style={[styles.paymentLabel, { color: '#ef4444' }]}>
//                               Remaining Amount:
//                             </Text>
//                             <Text style={[styles.paymentValue, { color: '#ef4444' }]}>
//                               {formatCurrency(order.adminToFarmerPayment.remainingAmount)}
//                             </Text>
//                           </View>
//                           <View style={styles.paymentDivider} />
//                           <View style={styles.paymentRow}>
//                             <Text style={styles.paymentLabel}>Payment Status:</Text>
//                             <View
//                               style={[
//                                 styles.statusBadge,
//                                 {
//                                   backgroundColor: getStatusColor(
//                                     order.adminToFarmerPayment.paymentStatus
//                                   ),
//                                 },
//                               ]}
//                             >
//                               <Text style={styles.statusText}>
//                                 {order.adminToFarmerPayment.paymentStatus.toUpperCase()}
//                               </Text>
//                             </View>
//                           </View>
//                         </View>
//                       </View>

//                       {/* Payment History Button */}
//                       <TouchableOpacity
//                         style={styles.paymentHistoryButton}
//                         onPress={() =>
//                           openPaymentHistory(order.adminToFarmerPayment.paymentHistory)
//                         }
//                       >
//                         <Clock size={16} color="#fff" />
//                         <Text style={styles.paymentHistoryButtonText}>
//                           View Payment History (
//                           {order.adminToFarmerPayment.paymentHistory.length})
//                         </Text>
//                       </TouchableOpacity>

//                       {/* Footer */}
//                       <View style={styles.orderFooter}>
//                         <Info size={12} color="#9ca3af" />
//                         <Text style={styles.footerText}>
//                           Last updated: {formatDate(order.updatedAt)}
//                         </Text>
//                       </View>
//                     </View>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         )}
//       </ScrollView>

//       {/* Payment History Modal */}
//       <Modal
//         visible={showPaymentModal}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowPaymentModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <View style={styles.modalHeaderLeft}>
//                 <Clock size={24} color="#16a34a" />
//                 <Text style={styles.modalTitle}>Payment History</Text>
//               </View>
//               <TouchableOpacity
//                 onPress={() => setShowPaymentModal(false)}
//                 style={styles.closeButton}
//               >
//                 <Text style={styles.closeButtonText}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalScroll}>
//               {selectedPaymentHistory && selectedPaymentHistory.length === 0 ? (
//                 <View style={styles.noPaymentsContainer}>
//                   <AlertCircle size={48} color="#3b82f6" />
//                   <Text style={styles.noPaymentsText}>No payments received yet</Text>
//                 </View>
//               ) : (
//                 selectedPaymentHistory?.map((payment) => (
//                   <View key={payment._id} style={styles.paymentHistoryItem}>
//                     <View style={styles.paymentHistoryHeader}>
//                       <Text style={styles.paymentAmount}>
//                         {formatCurrency(payment.amount)}
//                       </Text>
//                       <Text style={styles.paymentHistoryDate}>
//                         {formatDate(payment.paidDate)}
//                       </Text>
//                     </View>
//                     {payment.razorpayPaymentId && (
//                       <View style={styles.paymentIdContainer}>
//                         <Text style={styles.paymentIdLabel}>Payment ID:</Text>
//                         <Text style={styles.paymentId}>
//                           {payment.razorpayPaymentId}
//                         </Text>
//                       </View>
//                     )}
//                   </View>
//                 ))
//               )}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#6b7280',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 8,
//   },
//   headerContent: {
//     flex: 1,
//   },
//   headerTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginTop: 4,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 32,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#6b7280',
//     textAlign: 'center',
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   retryButton: {
//     backgroundColor: '#16a34a',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   summaryContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     gap: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   summaryCard: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//     borderRadius: 12,
//     padding: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   summaryIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#dbeafe',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   summaryValue: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   summaryLabel: {
//     fontSize: 12,
//     color: '#6b7280',
//     textAlign: 'center',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   ordersContainer: {
//     padding: 16,
//   },
//   orderCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//     overflow: 'hidden',
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f9fafb',
//   },
//   orderHeaderLeft: {
//     flex: 1,
//   },
//   orderId: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   orderDate: {
//     fontSize: 12,
//     color: '#6b7280',
//   },
//   orderHeaderRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   statusText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   orderBody: {
//     padding: 16,
//   },
//   infoSection: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   infoColumn: {
//     flex: 1,
//   },
//   infoHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginBottom: 8,
//   },
//   infoHeaderText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#6b7280',
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#374151',
//     marginBottom: 4,
//   },
//   infoLabel: {
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginVertical: 16,
//   },
//   section: {
//     marginBottom: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   productItem: {
//     backgroundColor: '#f9fafb',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   productRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   productLabel: {
//     fontSize: 13,
//     color: '#6b7280',
//   },
//   productValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//   },
//   productTotal: {
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//     marginTop: 4,
//   },
//   productTotalValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#16a34a',
//   },
//   deliveryDate: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginLeft: 6,
//   },
//   paymentCard: {
//     backgroundColor: '#f9fafb',
//     padding: 16,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   paymentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   paymentLabel: {
//     fontSize: 14,
//     color: '#374151',
//   },
//   paymentValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   paymentDivider: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginVertical: 8,
//   },
//   paymentHistoryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#16a34a',
//     paddingVertical: 14,
//     borderRadius: 10,
//     gap: 8,
//     marginTop: 8,
//   },
//   paymentHistoryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 15,
//   },
//   orderFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//   },
//   footerText: {
//     fontSize: 11,
//     color: '#9ca3af',
//   },
//   emptyContainer: {
//     padding: 32,
//     alignItems: 'center',
//   },
//   emptyBox: {
//     backgroundColor: '#f3f4f6',
//     padding: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     maxWidth: 300,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#6b7280',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#9ca3af',
//     textAlign: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   modalHeaderLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   closeButton: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     fontSize: 24,
//     color: '#6b7280',
//   },
//   modalScroll: {
//     padding: 20,
//   },
//   noPaymentsContainer: {
//     alignItems: 'center',
//     paddingVertical: 48,
//   },
//   noPaymentsText: {
//     fontSize: 16,
//     color: '#6b7280',
//     marginTop: 16,
//   },
//   paymentHistoryItem: {
//     backgroundColor: '#f0fdf4',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#bbf7d0',
//   },
//   paymentHistoryHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   paymentAmount: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#16a34a',
//   },
//   paymentHistoryDate: {
//     fontSize: 12,
//     color: '#6b7280',
//   },
//   paymentIdContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   paymentIdLabel: {
//     fontSize: 12,
//     color: '#6b7280',
//     fontWeight: '600',
//   },
//   paymentId: {
//     fontSize: 11,
//     color: '#9ca3af',
//     flex: 1,
//   },
// });

// export default FarmerOrderHistory;










import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Package,
  Truck,
  User,
  X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import {
  ChevronLeft,
  MessageCircle // WhatsApp-like icon
} from 'lucide-react-native';

interface PaymentRecord {
  _id: string;
  amount: number;
  paidDate: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

interface AdminToFarmerPayment {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentHistory: PaymentRecord[];
}

interface ProductItem {
  _id: string;
  productId: string;
  farmerId: string;
  grade: string;
  quantity: number;
  pricePerUnit: number;
  deliveryDate?: string;
  totalAmount: number;
}

interface Order {
  _id: string;
  orderId: string;
  traderId: string;
  traderName: string;
  traderMobile?: string;
  farmerId: string;
  farmerName?: string;
  productItems: ProductItem[];
  adminToFarmerPayment: AdminToFarmerPayment;
  orderStatus: string;
  transporterStatus: string;
  createdAt: string;
  updatedAt: string;
}

const FarmerOrderHistory = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const farmerId = await AsyncStorage.getItem('farmerId');
      
      if (!farmerId) {
        setError('Farmer ID not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://kisan.etpl.ai/api/orders/history/farmer/${farmerId}`
      );
      
      if (response.data.success) {
        setOrders(response.data.data);
        setError('');
      }
      setLoading(false);
      setRefreshing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order history');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrderHistory();
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'text-amber-500',
      processing: 'text-blue-500',
      in_transit: 'text-purple-500',
      completed: 'text-emerald-500',
      cancelled: 'text-red-500',
      partial: 'text-amber-500',
      paid: 'text-emerald-500',
    };
    return colors[status] || 'text-gray-500';
  };

  const getStatusBgColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-amber-100',
      processing: 'bg-blue-100',
      in_transit: 'bg-purple-100',
      completed: 'bg-emerald-100',
      cancelled: 'bg-red-100',
      partial: 'bg-amber-100',
      paid: 'bg-emerald-100',
    };
    return colors[status] || 'bg-gray-100';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="mt-3 text-sm font-medium text-gray-500">Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-white px-4 py-4 border-b border-gray-100">
          <Text className="text-2xl font-medium text-gray-900">Orders</Text>
        </View>
        <View className="flex-1 justify-center items-center p-6">
          <AlertCircle size={48} color="#ef4444" />
          <Text className="mt-3 mb-4 text-sm font-medium text-gray-500 text-center">{error}</Text>
          <TouchableOpacity 
            className="bg-emerald-500 px-6 py-2.5 rounded-lg"
            onPress={fetchOrderHistory}
          >
            <Text className="text-white font-medium text-sm">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View>
       
      </View>

      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm mb-4">
        <TouchableOpacity
          onPress={() => router.push("/(farmer)/home")}
          className="p-2"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="ml-3 text-xl font-medium text-gray-900">
          Orders
        </Text>
      </View>

      {/* Orders List */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
          />
        }
      >
        {orders.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Package size={64} color="#d1d5db" />
            <Text className="mt-4 text-lg font-medium text-gray-500">No Orders Yet</Text>
            <Text className="mt-2 text-sm font-medium text-gray-400">
              Your order history will appear here
            </Text>
          </View>
        ) : (
          orders.map((order) => {
            const farmerItems = order.productItems.filter(
              item => item.farmerId === order.farmerId
            );
            const totalQuantity = farmerItems.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <View key={order._id} className="bg-white rounded-xl mb-3 p-4 shadow-sm">
                {/* Order Header */}
                <View className="flex-row items-center mb-3">
                  <View className="w-10 h-10 rounded-lg bg-emerald-100 justify-center items-center mr-3">
                    <Package size={20} color="#10b981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900 mb-0.5">{order.traderName}</Text>
                    <Text className="text-xs font-medium text-gray-500">Order #{order.orderId}</Text>
                  </View>
                  <View className={`px-2.5 py-1 rounded-md ${getStatusBgColor(order.orderStatus)}`}>
                    <Text className={`text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </Text>
                  </View>
                </View>

                {/* Order Details */}
                <View className="flex-row gap-4 mb-3">
                  <View className="flex-row items-center gap-1">
                    <Package size={14} color="#9ca3af" />
                    <Text className="text-xs font-medium text-gray-500">{totalQuantity} pieces</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color="#9ca3af" />
                    <Text className="text-xs font-medium text-gray-500">{formatTime(order.createdAt)}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Calendar size={14} color="#9ca3af" />
                    <Text className="text-xs font-medium text-gray-500">{formatDate(order.createdAt)}</Text>
                  </View>
                </View>

                {/* View Details Button */}
                <TouchableOpacity
                  className="flex-row items-center justify-center py-2.5 border-t border-gray-100 mt-1"
                  onPress={() => openOrderDetails(order)}
                  activeOpacity={0.7}
                >
                  <Text className="text-sm font-medium text-emerald-500 mr-1">View Details</Text>
                  <ChevronRight size={16} color="#10b981" />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Order Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[90%]">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
              <Text className="text-xl font-medium text-gray-900">Order Details</Text>
              <TouchableOpacity
                onPress={() => setShowDetailsModal(false)}
                className="p-1"
              >
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-5">
              {selectedOrder && (
                <>
                  {/* Order Info Card */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <View className="flex-row items-center gap-2 mb-4">
                      <Text className="text-base font-medium text-gray-900">Order Information</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-sm font-medium text-gray-500">Order ID</Text>
                      <Text className="text-sm font-medium text-gray-900">#{selectedOrder.orderId}</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-sm font-medium text-gray-500">Order Date</Text>
                      <Text className="text-sm font-medium text-gray-900">
                        {formatDate(selectedOrder.createdAt)} at {formatTime(selectedOrder.createdAt)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm font-medium text-gray-500">Order Status</Text>
                      <View className={`px-2.5 py-1 rounded-md ${getStatusBgColor(selectedOrder.orderStatus)}`}>
                        <Text className={`text-xs font-medium capitalize ${getStatusColor(selectedOrder.orderStatus)}`}>
                          {selectedOrder.orderStatus}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Trader Info Card */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <View className="flex-row items-center gap-2 mb-4">
                      <User size={18} color="#10b981" />
                      <Text className="text-base font-medium text-gray-900">Trader Information</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-sm font-medium text-gray-500">Name</Text>
                      <Text className="text-sm font-medium text-gray-900">{selectedOrder.traderName}</Text>
                    </View>
                    {selectedOrder.traderMobile && (
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-medium text-gray-500">Mobile</Text>
                        <Text className="text-sm font-medium text-gray-900">{selectedOrder.traderMobile}</Text>
                      </View>
                    )}
                  </View>

                  {/* Transport Status Card */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <View className="flex-row items-center gap-2 mb-4">
                      <Truck size={18} color="#10b981" />
                      <Text className="text-base font-medium text-gray-900">Transport Status</Text>
                    </View>
                    <View className={`px-4 py-2 rounded-lg items-center ${getStatusBgColor(selectedOrder.transporterStatus)}`}>
                      <Text className={`text-sm font-medium uppercase ${getStatusColor(selectedOrder.transporterStatus)}`}>
                        {selectedOrder.transporterStatus.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>

                  {/* Product Items Card */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <View className="flex-row items-center gap-2 mb-4">
                      <Package size={18} color="#10b981" />
                      <Text className="text-base font-medium text-gray-900">Product Items</Text>
                    </View>
                    {selectedOrder.productItems
                      .filter(item => item.farmerId === selectedOrder.farmerId)
                      .map((item) => (
                        <View key={item._id} className="bg-white rounded-lg p-3 mb-3">
                          <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-base font-medium text-gray-900">{item.productId}</Text>
                            <Text className="text-xs font-medium text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded">
                              Grade {item.grade}
                            </Text>
                          </View>
                          <View className="gap-2">
                            <View className="flex-row justify-between items-center">
                              <Text className="text-sm font-medium text-gray-500">Quantity</Text>
                              <Text className="text-sm font-medium text-gray-900">{item.quantity} pcs</Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                              <Text className="text-sm font-medium text-gray-500">Price/Unit</Text>
                              <Text className="text-sm font-medium text-gray-900">
                                {formatCurrency(item.pricePerUnit)}
                              </Text>
                            </View>
                            <View className="flex-row justify-between items-center pt-2 mt-1 border-t border-gray-100">
                              <Text className="text-sm font-medium text-gray-900">Total Amount</Text>
                              <Text className="text-base font-medium text-emerald-500">
                                {formatCurrency(item.totalAmount)}
                              </Text>
                            </View>
                          </View>
                          {item.deliveryDate && (
                            <View className="flex-row items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
                              <Calendar size={14} color="#10b981" />
                              <Text className="text-xs font-medium text-gray-500">
                                Delivery: {formatDate(item.deliveryDate)}
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                  </View>

                  {/* Payment Details Card */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <View className="flex-row items-center gap-2 mb-4">
                      <DollarSign size={18} color="#10b981" />
                      <Text className="text-base font-medium text-gray-900">Payment Details</Text>
                    </View>
                    <View className="gap-3">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-medium text-gray-500">Total Amount</Text>
                        <Text className="text-base font-medium text-gray-900">
                          {formatCurrency(selectedOrder.adminToFarmerPayment.totalAmount)}
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-medium text-emerald-500">Paid Amount</Text>
                        <Text className="text-base font-medium text-emerald-500">
                          {formatCurrency(selectedOrder.adminToFarmerPayment.paidAmount)}
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-medium text-red-500">Remaining Amount</Text>
                        <Text className="text-base font-medium text-red-500">
                          {formatCurrency(selectedOrder.adminToFarmerPayment.remainingAmount)}
                        </Text>
                      </View>
                      <View className="h-px bg-gray-200 my-1"></View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm font-medium text-gray-500">Payment Status</Text>
                        <View className={`px-2.5 py-1 rounded-md ${getStatusBgColor(selectedOrder.adminToFarmerPayment.paymentStatus)}`}>
                          <Text className={`text-xs font-medium capitalize ${getStatusColor(selectedOrder.adminToFarmerPayment.paymentStatus)}`}>
                            {selectedOrder.adminToFarmerPayment.paymentStatus}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Payment History Card */}
                  {selectedOrder.adminToFarmerPayment.paymentHistory.length > 0 && (
                    <View className="bg-gray-50 rounded-xl p-4 mb-4">
                      <View className="flex-row items-center gap-2 mb-4">
                        <Clock size={18} color="#10b981" />
                        <Text className="text-base font-medium text-gray-900">Payment History</Text>
                      </View>
                      {selectedOrder.adminToFarmerPayment.paymentHistory.map((payment) => (
                        <View key={payment._id} className="bg-white rounded-lg p-3 mb-2 border border-emerald-100">
                          <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-base font-medium text-emerald-500">
                              {formatCurrency(payment.amount)}
                            </Text>
                            <Text className="text-xs font-medium text-gray-500">
                              {formatDate(payment.paidDate)}
                            </Text>
                          </View>
                          {payment.razorpayPaymentId && (
                            <Text className="text-xs font-medium text-gray-400">
                              ID: {payment.razorpayPaymentId}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Last Updated */}
                  <View className="flex-row items-center justify-center gap-1.5 py-4">
                    <Clock size={12} color="#9ca3af" />
                    <Text className="text-xs font-medium text-gray-400">
                      Last updated: {formatDate(selectedOrder.updatedAt)} at{' '}
                      {formatTime(selectedOrder.updatedAt)}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FarmerOrderHistory;