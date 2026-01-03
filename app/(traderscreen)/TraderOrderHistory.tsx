// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   Modal,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import {
//   Clock,
//   User,
//   Truck,
//   Package,
//   Wallet,
//   AlertCircle,
//   CreditCard,
//   History,
//   Phone,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   ChevronRight,
// } from 'lucide-react-native';

// interface PaymentRecord {
//   _id: string;
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId?: string;
//   razorpayOrderId?: string;
// }

// interface TraderToAdminPayment {
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
//   farmerId: string;
//   farmerName?: string;
//   farmerMobile?: string;
//   productItems: ProductItem[];
//   traderToAdminPayment: TraderToAdminPayment;
//   orderStatus: string;
//   transporterStatus: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface PaymentModalState {
//   visible: boolean;
//   orderId: string;
//   maxAmount: number;
//   amount: number;
// }

// const TraderOrderHistory: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [processingPayment, setProcessingPayment] = useState<string | null>(null);
//   const [paymentModal, setPaymentModal] = useState<PaymentModalState>({
//     visible: false,
//     orderId: '',
//     maxAmount: 0,
//     amount: 0,
//   });
  
//   const [traderInfo, setTraderInfo] = useState({
//     id: '',
//     name: '',
//     mobile: '',
//   });

//   useEffect(() => {
//     fetchTraderInfo();
//   }, []);

//   const fetchTraderInfo = async () => {
//     try {
//       const [id, name, mobile] = await Promise.all([
//         AsyncStorage.getItem('traderId'),
//         AsyncStorage.getItem('userName'),
//         AsyncStorage.getItem('userMobile'),
//       ]);

//       if (!id) {
//         setError('Trader ID not found. Please login again.');
//         setLoading(false);
//         return;
//       }

//       setTraderInfo({
//         id,
//         name: name || '',
//         mobile: mobile || '',
//       });

//       fetchOrderHistory(id);
//     } catch (err) {
//       console.error('Error fetching trader info:', err);
//       setError('Failed to load trader information');
//       setLoading(false);
//     }
//   };

//   const fetchOrderHistory = async (traderId: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `https://kisan.etpl.ai/api/orders/history/trader/${traderId}`
//       );
      
//       if (response.data.success) {
//         setOrders(response.data.data);
//       }
//       setError('');
//     } catch (err: any) {
//       console.error('API Error:', err);
//       setError(err.response?.data?.message || 'Failed to fetch order history');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openPaymentModal = (order: Order) => {
//     setPaymentModal({
//       visible: true,
//       orderId: order.orderId,
//       maxAmount: order.traderToAdminPayment.remainingAmount,
//       amount: order.traderToAdminPayment.remainingAmount,
//     });
//   };

//   const closePaymentModal = () => {
//     setPaymentModal({
//       visible: false,
//       orderId: '',
//       maxAmount: 0,
//       amount: 0,
//     });
//   };

//   const handlePayment = async () => {
//     const { orderId, amount, maxAmount } = paymentModal;
//     const order = orders.find(o => o.orderId === orderId);

//     if (!order) {
//       Alert.alert('Error', 'Order not found');
//       return;
//     }

//     if (!amount || amount <= 0) {
//       Alert.alert('Error', 'Please enter a valid payment amount');
//       return;
//     }

//     if (amount > maxAmount) {
//       Alert.alert('Error', 'Payment amount cannot exceed remaining amount');
//       return;
//     }

//     try {
//       setProcessingPayment(orderId);
//       closePaymentModal();

//       // Create Razorpay order
//       const orderResponse = await axios.post(
//         'https://kisan.etpl.ai/api/orders/history/create-trader-payment',
//         {
//           orderId: orderId,
//           amount: amount,
//         }
//       );

//       const { data: razorpayOrder, key_id } = orderResponse.data;

//       // For React Native, we'll use deep linking to open Razorpay
//       // Alternatively, use react-native-razorpay package
//       const razorpayUrl = `https://razorpay.com/payment-page/${razorpayOrder.id}`;
      
//       Alert.alert(
//         'Complete Payment',
//         `Please complete payment of ₹${amount.toFixed(2)} for Order ${orderId}`,
//         [
//           {
//             text: 'Cancel',
//             style: 'cancel',
//             onPress: () => setProcessingPayment(null),
//           },
//           {
//             text: 'Open Payment',
//             onPress: async () => {
//               try {
//                 // Open Razorpay in browser
//                 // Note: In production, use react-native-razorpay or WebView
//                 const canOpen = await Linking.canOpenURL(razorpayUrl);
//                 if (canOpen) {
//                   Linking.openURL(razorpayUrl);
//                 } else {
//                   Alert.alert('Error', 'Cannot open payment link');
//                 }
//               } catch (error) {
//                 console.error('Error opening payment link:', error);
//                 Alert.alert('Error', 'Failed to open payment');
//               } finally {
//                 setProcessingPayment(null);
//               }
//             },
//           },
//         ]
//       );

//       // Note: In a real app, you would need to handle payment verification
//       // This typically involves a webhook or polling the server

//     } catch (error: any) {
//       console.error('Payment initiation failed:', error);
//       Alert.alert(
//         'Payment Failed',
//         error.response?.data?.message || 'Failed to initiate payment'
//       );
//       setProcessingPayment(null);
//     }
//   };

//   const getStatusBadgeStyle = (status: string) => {
//     const statusColors: { [key: string]: string } = {
//       pending: 'bg-yellow-100 border-yellow-400 text-yellow-800',
//       processing: 'bg-blue-100 border-blue-400 text-blue-800',
//       in_transit: 'bg-purple-100 border-purple-400 text-purple-800',
//       completed: 'bg-green-100 border-green-400 text-green-800',
//       cancelled: 'bg-red-100 border-red-400 text-red-800',
//       partial: 'bg-orange-100 border-orange-400 text-orange-800',
//       paid: 'bg-green-100 border-green-400 text-green-800',
//     };
//     return statusColors[status] || 'bg-gray-100 border-gray-400 text-gray-800';
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   const calculateOrderTotal = (order: Order) => {
//     return order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 bg-gray-50 justify-center items-center">
//         <ActivityIndicator size="large" color="#0d6efd" />
//         <Text className="mt-4 text-gray-600">Loading order history...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 bg-gray-50 justify-center items-center p-6">
//         <AlertCircle size={48} color="#DC2626" />
//         <Text className="text-red-600 text-center mt-4 text-lg font-medium">
//           {error}
//         </Text>
//         <TouchableOpacity
//           onPress={() => fetchTraderInfo()}
//           className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
//         >
//           <Text className="text-white font-medium">Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       <View className="p-4">
//         {/* Header */}
//         <View className="mb-6">
//           <View className="flex-row items-center mb-2">
//             <Clock size={24} color="#4B5563" />
//             <Text className="text-2xl font-medium text-gray-800 ml-2">
//               My Order History
//             </Text>
//           </View>
//           <Text className="text-gray-600">
//             View all your orders and manage payments
//           </Text>
//         </View>

//         {orders.length === 0 ? (
//           <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//             <View className="flex-row items-center">
//               <AlertCircle size={20} color="#3B82F6" />
//               <Text className="text-blue-700 ml-2 font-medium">
//                 No orders found
//               </Text>
//             </View>
//           </View>
//         ) : (
//           <View className="space-y-6">
//             {orders.map((order) => (
//               <View
//                 key={order._id}
//                 className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
//               >
//                 {/* Order Header */}
//                 <View className="bg-green-600 p-4">
//                   <View className="flex-row justify-between items-center">
//                     <View>
//                       <Text className="text-white text-lg font-medium">
//                         Order #{order.orderId}
//                       </Text>
//                       <Text className="text-green-100 text-sm mt-1">
//                         Placed on {formatDate(order.createdAt)}
//                       </Text>
//                     </View>
//                     <View className={`px-3 py-1 rounded-full border ${getStatusBadgeStyle(order.orderStatus)}`}>
//                       <Text className="font-medium text-xs">
//                         {order.orderStatus.toUpperCase()}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>

//                 <View className="p-4">
//                   {/* Farmer Information */}
//                   <View className="mb-4">
//                     <Text className="text-gray-500 font-medium mb-2 flex-row items-center">
//                       <User size={16} color="#6B7280" />
//                       <Text className="ml-1">Farmer Information</Text>
//                     </Text>
//                     <View className="bg-gray-50 p-3 rounded-lg space-y-1">
//                       {order.farmerName && (
//                         <Text className="text-gray-800">
//                           <Text className="font-medium">Name:</Text> {order.farmerName}
//                         </Text>
//                       )}
//                       {order.farmerMobile && (
//                         <Text className="text-gray-800">
//                           <Text className="font-medium">Mobile:</Text> {order.farmerMobile}
//                         </Text>
//                       )}
//                       <Text className="text-gray-800">
//                         <Text className="font-medium">Farmer ID:</Text> {order.farmerId}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Transport Status */}
//                   <View className="mb-6">
//                     <Text className="text-gray-500 font-medium mb-2 flex-row items-center">
//                       <Truck size={16} color="#6B7280" />
//                       <Text className="ml-1">Transport Status</Text>
//                     </Text>
//                     <View className={`px-3 py-1 rounded-full border ${getStatusBadgeStyle(order.transporterStatus)}`}>
//                       <Text className="font-medium text-xs">
//                         {order.transporterStatus.toUpperCase()}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Divider */}
//                   <View className="h-px bg-gray-200 my-4" />

//                   {/* Product Items */}
//                   <View className="mb-6">
//                     <Text className="text-gray-500 font-medium mb-3 flex-row items-center">
//                       <Package size={16} color="#6B7280" />
//                       <Text className="ml-1">Product Items</Text>
//                     </Text>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                       <View className="flex-row">
//                         {order.productItems.map((item, index) => (
//                           <View
//                             key={item._id}
//                             className={`bg-gray-50 p-4 rounded-lg mr-3 ${index === 0 ? '' : 'ml-0'}`}
//                             style={{ width: 280 }}
//                           >
//                             <View className="space-y-2">
//                               <View className="flex-row justify-between">
//                                 <Text className="text-gray-700">Product ID:</Text>
//                                 <Text className="text-gray-800 font-medium">{item.productId}</Text>
//                               </View>
//                               <View className="flex-row justify-between">
//                                 <Text className="text-gray-700">Farmer ID:</Text>
//                                 <Text className="text-gray-800">{item.farmerId}</Text>
//                               </View>
//                               <View className="flex-row justify-between">
//                                 <Text className="text-gray-700">Grade:</Text>
//                                 <Text className="text-gray-800">{item.grade}</Text>
//                               </View>
//                               <View className="flex-row justify-between">
//                                 <Text className="text-gray-700">Quantity:</Text>
//                                 <Text className="text-gray-800">{item.quantity}</Text>
//                               </View>
//                               <View className="flex-row justify-between">
//                                 <Text className="text-gray-700">Price/Unit:</Text>
//                                 <Text className="text-gray-800">{formatCurrency(item.pricePerUnit)}</Text>
//                               </View>
//                               <View className="flex-row justify-between">
//                                 <Text className="text-gray-700">Total:</Text>
//                                 <Text className="text-gray-800 font-medium">
//                                   {formatCurrency(item.totalAmount)}
//                                 </Text>
//                               </View>
//                               {item.deliveryDate && (
//                                 <View className="flex-row justify-between pt-2 border-t border-gray-200">
//                                   <Text className="text-gray-700">Delivery Date:</Text>
//                                   <Text className="text-gray-800">{formatDate(item.deliveryDate)}</Text>
//                                 </View>
//                               )}
//                             </View>
//                           </View>
//                         ))}
//                       </View>
//                     </ScrollView>

//                     {/* Grand Total */}
//                     <View className="mt-4 pt-4 border-t border-gray-200">
//                       <View className="flex-row justify-between items-center">
//                         <Text className="text-gray-700 font-medium">Grand Total:</Text>
//                         <Text className="text-blue-600 font-medium text-lg">
//                           {formatCurrency(calculateOrderTotal(order))}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>

//                   {/* Divider */}
//                   <View className="h-px bg-gray-200 my-4" />

//                   {/* Payment Section */}
//                   <View>
//                     <Text className="text-gray-500 font-medium mb-3 flex-row items-center">
//                       <Wallet size={16} color="#6B7280" />
//                       <Text className="ml-1">Payment Details (Trader to Admin)</Text>
//                     </Text>

//                     <View className="space-y-4">
//                       {/* Payment Summary Card */}
//                       <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                         <View className="space-y-2 mb-3">
//                           <View className="flex-row justify-between">
//                             <Text className="text-gray-700">Total Amount:</Text>
//                             <Text className="font-medium">
//                               {formatCurrency(order.traderToAdminPayment.totalAmount)}
//                             </Text>
//                           </View>
//                           <View className="flex-row justify-between">
//                             <Text className="text-green-700">Paid Amount:</Text>
//                             <Text className="font-medium text-green-700">
//                               {formatCurrency(order.traderToAdminPayment.paidAmount)}
//                             </Text>
//                           </View>
//                           <View className="flex-row justify-between">
//                             <Text className="text-red-700">Remaining Amount:</Text>
//                             <Text className="font-medium text-red-700">
//                               {formatCurrency(order.traderToAdminPayment.remainingAmount)}
//                             </Text>
//                           </View>
//                         </View>

//                         <View className="h-px bg-blue-200 my-2" />

//                         <View className="flex-row justify-between items-center">
//                           <Text className="text-gray-700">Payment Status:</Text>
//                           <View className={`px-3 py-1 rounded-full border ${getStatusBadgeStyle(order.traderToAdminPayment.paymentStatus)}`}>
//                             <Text className="font-medium text-xs">
//                               {order.traderToAdminPayment.paymentStatus.toUpperCase()}
//                             </Text>
//                           </View>
//                         </View>

//                         {/* Make Payment Button */}
//                         {order.traderToAdminPayment.remainingAmount > 0 && (
//                           <TouchableOpacity
//                             onPress={() => openPaymentModal(order)}
//                             disabled={processingPayment === order.orderId}
//                             className={`mt-4 py-3 px-4 rounded-lg flex-row items-center justify-center ${
//                               processingPayment === order.orderId
//                                 ? 'bg-gray-400'
//                                 : 'bg-blue-600 active:bg-blue-700'
//                             }`}
//                           >
//                             {processingPayment === order.orderId ? (
//                               <>
//                                 <ActivityIndicator color="white" size="small" />
//                                 <Text className="text-white font-medium ml-2">
//                                   Processing...
//                                 </Text>
//                               </>
//                             ) : (
//                               <>
//                                 <CreditCard size={20} color="white" />
//                                 <Text className="text-white font-medium ml-2">
//                                   Make Payment
//                                 </Text>
//                               </>
//                             )}
//                           </TouchableOpacity>
//                         )}
//                       </View>

//                       {/* Payment History */}
//                       <View>
//                         <Text className="text-gray-500 font-medium mb-3 flex-row items-center">
//                           <History size={16} color="#6B7280" />
//                           <Text className="ml-1">Payment History</Text>
//                         </Text>
//                         {order.traderToAdminPayment.paymentHistory.length === 0 ? (
//                           <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                             <Text className="text-blue-700 text-center">
//                               No payments made yet
//                             </Text>
//                           </View>
//                         ) : (
//                           <View className="space-y-2">
//                             {order.traderToAdminPayment.paymentHistory.map((payment) => (
//                               <View
//                                 key={payment._id}
//                                 className="bg-green-50 p-3 rounded-lg border border-green-200"
//                               >
//                                 <View className="flex-row justify-between items-center">
//                                   <Text className="text-green-800 font-medium">
//                                     {formatCurrency(payment.amount)}
//                                   </Text>
//                                   <Text className="text-gray-600 text-sm">
//                                     {formatDate(payment.paidDate)}
//                                   </Text>
//                                 </View>
//                                 {payment.razorpayPaymentId && (
//                                   <Text className="text-gray-600 text-xs mt-1">
//                                     Payment ID: {payment.razorpayPaymentId}
//                                   </Text>
//                                 )}
//                               </View>
//                             ))}
//                           </View>
//                         )}
//                       </View>
//                     </View>
//                   </View>

//                   {/* Last Updated */}
//                   <View className="mt-6 pt-4 border-t border-gray-200">
//                     <Text className="text-gray-500 text-sm">
//                       Last updated: {formatDate(order.updatedAt)}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}
//       </View>

//       {/* Payment Modal */}
//       <Modal
//         visible={paymentModal.visible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={closePaymentModal}
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center p-4">
//           <View className="bg-white rounded-lg w-full max-w-md p-6">
//             <Text className="text-xl font-medium text-gray-900 mb-4">
//               Make Payment
//             </Text>

//             <View className="space-y-4 mb-6">
//               <View className="bg-blue-50 p-4 rounded-lg">
//                 <Text className="text-blue-800">
//                   Order: #{paymentModal.orderId}
//                 </Text>
//                 <Text className="text-blue-800 mt-1">
//                   Maximum payment: {formatCurrency(paymentModal.maxAmount)}
//                 </Text>
//               </View>

//               <View>
//                 <Text className="text-sm font-medium text-gray-700 mb-2">
//                   Payment Amount (₹)
//                 </Text>
//                 <TextInput
//                   value={paymentModal.amount.toString()}
//                   onChangeText={(text) => {
//                     const amount = parseFloat(text) || 0;
//                     setPaymentModal(prev => ({
//                       ...prev,
//                       amount: Math.min(amount, paymentModal.maxAmount),
//                     }));
//                   }}
//                   className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
//                   keyboardType="decimal-pad"
//                   placeholder="Enter amount"
//                 />
//                 <Text className="text-xs text-gray-500 mt-1">
//                   Maximum: {formatCurrency(paymentModal.maxAmount)}
//                 </Text>
//               </View>
//             </View>

//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 onPress={closePaymentModal}
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-lg active:bg-gray-50"
//               >
//                 <Text className="text-center font-medium text-gray-700">
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handlePayment}
//                 disabled={paymentModal.amount <= 0 || paymentModal.amount > paymentModal.maxAmount}
//                 className={`flex-1 px-4 py-3 rounded-lg flex-row items-center justify-center ${
//                   paymentModal.amount <= 0 || paymentModal.amount > paymentModal.maxAmount
//                     ? 'bg-gray-400'
//                     : 'bg-blue-600 active:bg-blue-700'
//                 }`}
//               >
//                 <CreditCard size={20} color="white" />
//                 <Text className="text-white font-medium ml-2">
//                   Pay {formatCurrency(paymentModal.amount)}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// import { Linking } from 'react-native';

// export default TraderOrderHistory;



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   Linking,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import {
//   Clock,
//   User,
//   Truck,
//   Package,
//   CreditCard,
//   AlertCircle,
//   CheckCircle,
//   ChevronDown,
//   ChevronUp,
//   ChevronLeft,
//   X,
// } from 'lucide-react-native';

// import { router } from "expo-router";

// interface PaymentRecord {
//   _id: string;
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId?: string;
//   razorpayOrderId?: string;
// }

// interface TraderToAdminPayment {
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
//   farmerId: string;
//   farmerName?: string;
//   farmerMobile?: string;
//   productItems: ProductItem[];
//   traderToAdminPayment: TraderToAdminPayment;
//   orderStatus: string;
//   transporterStatus: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface PaymentModalState {
//   visible: boolean;
//   orderId: string;
//   maxAmount: number;
//   amount: number;
// }

// const TraderOrderHistory: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [processingPayment, setProcessingPayment] = useState<string | null>(null);
//   const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});
//   const [paymentModal, setPaymentModal] = useState<PaymentModalState>({
//     visible: false,
//     orderId: '',
//     maxAmount: 0,
//     amount: 0,
//   });
  
//   const [traderInfo, setTraderInfo] = useState({
//     id: '',
//     name: '',
//     mobile: '',
//   });

//   useEffect(() => {
//     fetchTraderInfo();
//   }, []);

//   const fetchTraderInfo = async () => {
//     try {
//       const [id, name, mobile] = await Promise.all([
//         AsyncStorage.getItem('traderId'),
//         AsyncStorage.getItem('userName'),
//         AsyncStorage.getItem('userMobile'),
//       ]);

//       if (!id) {
//         setError('Trader ID not found. Please login again.');
//         setLoading(false);
//         return;
//       }

//       setTraderInfo({
//         id,
//         name: name || '',
//         mobile: mobile || '',
//       });

//       fetchOrderHistory(id);
//     } catch (err) {
//       console.error('Error fetching trader info:', err);
//       setError('Failed to load trader information');
//       setLoading(false);
//     }
//   };

//   const fetchOrderHistory = async (traderId: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `https://kisan.etpl.ai/api/orders/history/trader/${traderId}`
//       );
      
//       if (response.data.success) {
//         setOrders(response.data.data);
//       }
//       setError('');
//     } catch (err: any) {
//       console.error('API Error:', err);
//       setError(err.response?.data?.message || 'Failed to fetch order history');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleOrder = (orderId: string) => {
//     setExpandedOrders(prev => ({
//       ...prev,
//       [orderId]: !prev[orderId]
//     }));
//   };

//   const openPaymentModal = (order: Order) => {
//     setPaymentModal({
//       visible: true,
//       orderId: order.orderId,
//       maxAmount: order.traderToAdminPayment.remainingAmount,
//       amount: order.traderToAdminPayment.remainingAmount,
//     });
//   };

//   const closePaymentModal = () => {
//     setPaymentModal({
//       visible: false,
//       orderId: '',
//       maxAmount: 0,
//       amount: 0,
//     });
//   };

//   const handlePayment = async () => {
//     const { orderId, amount, maxAmount } = paymentModal;
//     const order = orders.find(o => o.orderId === orderId);

//     if (!order) {
//       Alert.alert('Error', 'Order not found');
//       return;
//     }

//     if (!amount || amount <= 0) {
//       Alert.alert('Error', 'Please enter a valid payment amount');
//       return;
//     }

//     if (amount > maxAmount) {
//       Alert.alert('Error', 'Payment amount cannot exceed remaining amount');
//       return;
//     }

//     try {
//       setProcessingPayment(orderId);
//       closePaymentModal();

//       // Create Razorpay order
//       const orderResponse = await axios.post(
//         'https://kisan.etpl.ai/api/orders/history/create-trader-payment',
//         {
//           orderId: orderId,
//           amount: amount,
//         }
//       );

//       const { data: razorpayOrder, key_id } = orderResponse.data;

//       // For React Native, we'll use deep linking to open Razorpay
//       const razorpayUrl = `https://razorpay.com/payment-page/${razorpayOrder.id}`;
      
//       Alert.alert(
//         'Complete Payment',
//         `Please complete payment of ₹${amount.toFixed(2)} for Order ${orderId}`,
//         [
//           {
//             text: 'Cancel',
//             style: 'cancel',
//             onPress: () => setProcessingPayment(null),
//           },
//           {
//             text: 'Open Payment',
//             onPress: async () => {
//               try {
//                 const canOpen = await Linking.canOpenURL(razorpayUrl);
//                 if (canOpen) {
//                   Linking.openURL(razorpayUrl);
//                 } else {
//                   Alert.alert('Error', 'Cannot open payment link');
//                 }
//               } catch (error) {
//                 console.error('Error opening payment link:', error);
//                 Alert.alert('Error', 'Failed to open payment');
//               } finally {
//                 setProcessingPayment(null);
//               }
//             },
//           },
//         ]
//       );

//     } catch (error: any) {
//       console.error('Payment initiation failed:', error);
//       Alert.alert(
//         'Payment Failed',
//         error.response?.data?.message || 'Failed to initiate payment'
//       );
//       setProcessingPayment(null);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: { [key: string]: string } = {
//       pending: 'bg-amber-100 text-amber-800',
//       processing: 'bg-indigo-100 text-indigo-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       in_transit: 'bg-purple-100 text-purple-800',
//       completed: 'bg-emerald-100 text-emerald-800',
//       delivered: 'bg-emerald-100 text-emerald-800',
//       cancelled: 'bg-red-100 text-red-800',
//       partial: 'bg-amber-100 text-amber-800',
//       paid: 'bg-emerald-100 text-emerald-800',
//     };
//     return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
//   };

//   const getStatusBorderColor = (status: string) => {
//     const colors: { [key: string]: string } = {
//       pending: 'border-amber-400',
//       processing: 'border-indigo-400',
//       confirmed: 'border-blue-400',
//       in_transit: 'border-purple-400',
//       completed: 'border-emerald-400',
//       delivered: 'border-emerald-400',
//       cancelled: 'border-red-400',
//       partial: 'border-amber-400',
//       paid: 'border-emerald-400',
//     };
//     return colors[status.toLowerCase()] || 'border-gray-300';
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const calculateOrderTotal = (order: Order) => {
//     return order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 bg-gray-50 justify-center items-center">
//         <ActivityIndicator size="large" color="#2563EB" />
//         <Text className="mt-4 text-gray-600">Loading order history...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 bg-gray-50 justify-center items-center p-6">
//         <AlertCircle size={48} color="#DC2626" />
//         <Text className="text-red-600 text-center mt-4 text-lg font-medium">
//           {error}
//         </Text>
//         <TouchableOpacity
//           onPress={() => fetchTraderInfo()}
//           className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
//         >
//           <Text className="text-white font-medium">Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header - Clean & Simple */}
//        <View className="flex-row items-center px-4 py-4 bg-white border border-gray-200">
//             <TouchableOpacity
//               onPress={() => router.push('/(trader)/home')}
//               className="p-2"
//             >
//               <ChevronLeft size={24} color="#374151" />
//             </TouchableOpacity>
//             <Text className="ml-3 text-xl font-medium text-gray-900">Order History</Text>
//           </View>

//       {/* Main Content */}
//       <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//         <View className="px-4 py-5">
//           {orders.length === 0 ? (
//             /* Empty State */
//             <View className="flex items-center justify-center py-20">
//               <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
//                 <Package size={40} color="#9CA3AF" />
//               </View>
//               <Text className="text-lg font-medium text-gray-900 mb-2">
//                 No Orders Yet
//               </Text>
//               <Text className="text-gray-600 mb-6 text-center">
//                 Start exploring products to place your first order
//               </Text>
//               <TouchableOpacity className="px-6 py-3 bg-blue-600 rounded-lg">
//                 <Text className="text-white font-medium">Browse Products</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             /* Order Cards */
//             <View>
//               {orders.map((order) => {
//                 const isExpanded = expandedOrders[order._id];
//                 const totalAmount = calculateOrderTotal(order);
//                 const itemCount = order.productItems.length;

//                 return (
//                   <View
//                     key={order._id}
//                     className={`bg-white border border-gray-200 rounded-lg overflow-hidden mb-4`}
//                   >
//                     {/* Collapsed View */}
//                     <View className="p-4">
//                       <View className="flex-row items-start justify-between mb-3">
//                         <View className="flex-1">
//                           <View className="flex-row items-center mb-1 flex-wrap">
//                             <Text className="text-lg font-medium text-gray-900 mr-2">
//                               Order #{order.orderId}
//                             </Text>
//                             <View className={`px-2.5 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
//                               <Text className="text-xs font-medium">
//                                 {order.orderStatus.toUpperCase()}
//                               </Text>
//                             </View>
//                           </View>
//                           <Text className="text-sm text-gray-600">
//                             {formatDate(order.createdAt)}
//                           </Text>
//                         </View>
//                       </View>

//                       <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
//                         <View>
//                           <Text className="text-2xl font-medium text-gray-900">
//                             {formatCurrency(totalAmount)}
//                           </Text>
//                           <Text className="text-sm text-gray-600 mt-0.5">
//                             {itemCount} {itemCount === 1 ? 'item' : 'items'} • {order.farmerName}
//                           </Text>
//                         </View>

//                         {order.traderToAdminPayment.remainingAmount > 0 && (
//                           <TouchableOpacity
//                             onPress={() => openPaymentModal(order)}
//                             disabled={processingPayment === order.orderId}
//                             className={`px-4 py-2 rounded-xl flex-row items-center ${
//                               processingPayment === order.orderId
//                                 ? 'bg-gray-400'
//                                 : 'bg-blue-600'
//                             }`}
//                           >
//                             {processingPayment === order.orderId ? (
//                               <ActivityIndicator color="white" size="small" />
//                             ) : (
//                               <>
//                                 <CreditCard size={16} color="white" />
//                                 <Text className="text-white font-medium text-sm ml-2">
//                                   Pay Now
//                                 </Text>
//                               </>
//                             )}
//                           </TouchableOpacity>
//                         )}
//                       </View>

//                       {/* View Details Button */}
//                       <TouchableOpacity
//                         onPress={() => toggleOrder(order._id)}
//                         className="w-full mt-3 py-2.5 border border-gray-200 rounded-lg flex-row items-center justify-center"
//                       >
//                         <Text className="text-sm font-medium text-gray-700 mr-2">
//                           {isExpanded ? 'View Less' : 'View Details'}
//                         </Text>
//                         {isExpanded ? (
//                           <ChevronUp size={16} color="#374151" />
//                         ) : (
//                           <ChevronDown size={16} color="#374151" />
//                         )}
//                       </TouchableOpacity>
//                     </View>

//                     {/* Expanded View */}
//                     {isExpanded && (
//                       <View className="border-t border-gray-200 bg-gray-50">
//                         <View className="p-4">
//                           {/* Farmer Information */}
//                           <View className="mb-5">
//                             <View className="flex-row items-center mb-3">
//                               <User size={16} color="#6B7280" />
//                               <Text className="text-sm font-medium text-gray-600 ml-2">
//                                 Farmer Details
//                               </Text>
//                             </View>
//                             <View className="bg-white rounded-lg p-3">
//                               <View className="flex-row justify-between py-1.5">
//                                 <Text className="text-sm text-gray-600">Name</Text>
//                                 <Text className="text-sm font-medium text-gray-900">
//                                   {order.farmerName}
//                                 </Text>
//                               </View>
//                               <View className="flex-row justify-between py-1.5">
//                                 <Text className="text-sm text-gray-600">Mobile</Text>
//                                 <Text className="text-sm font-medium text-gray-900">
//                                   {order.farmerMobile}
//                                 </Text>
//                               </View>
//                               <View className="flex-row justify-between py-1.5">
//                                 <Text className="text-sm text-gray-600">Farmer ID</Text>
//                                 <Text className="text-sm font-medium text-gray-900">
//                                   {order.farmerId}
//                                 </Text>
//                               </View>
//                             </View>
//                           </View>

//                           {/* Transport Status */}
//                           <View className="mb-5">
//                             <View className="flex-row items-center mb-3">
//                               <Truck size={16} color="#6B7280" />
//                               <Text className="text-sm font-medium text-gray-600 ml-2">
//                                 Transport
//                               </Text>
//                             </View>
//                             <View className={`self-start px-3 py-1.5 rounded-full ${getStatusColor(order.transporterStatus)}`}>
//                               <Text className="text-xs font-medium">
//                                 {order.transporterStatus.toUpperCase()}
//                               </Text>
//                             </View>
//                           </View>

//                           {/* Product Items */}
//                           <View className="mb-5">
//                             <View className="flex-row items-center mb-3">
//                               <Package size={16} color="#6B7280" />
//                               <Text className="text-sm font-medium text-gray-600 ml-2">
//                                 Items
//                               </Text>
//                             </View>
//                             {order.productItems.map((item) => (
//                               <View key={item._id} className="bg-white rounded-lg p-3 mb-3">
//                                 <View className="flex-row justify-between items-center mb-2 pb-2 border-b border-gray-100">
//                                   <Text className="text-sm font-medium text-gray-900">
//                                     {item.productId}
//                                   </Text>
//                                   <Text className="text-sm font-medium text-gray-900">
//                                     {formatCurrency(item.totalAmount)}
//                                   </Text>
//                                 </View>
//                                 <View className="flex-row flex-wrap">
//                                   <View className="w-1/2 py-1">
//                                     <Text className="text-xs text-gray-600">Grade</Text>
//                                     <Text className="text-sm font-medium text-gray-900 mt-0.5">
//                                       {item.grade}
//                                     </Text>
//                                   </View>
//                                   <View className="w-1/2 py-1">
//                                     <Text className="text-xs text-gray-600">Quantity</Text>
//                                     <Text className="text-sm font-medium text-gray-900 mt-0.5">
//                                       {item.quantity}
//                                     </Text>
//                                   </View>
//                                   <View className="w-1/2 py-1">
//                                     <Text className="text-xs text-gray-600">Price/Unit</Text>
//                                     <Text className="text-sm font-medium text-gray-900 mt-0.5">
//                                       {formatCurrency(item.pricePerUnit)}
//                                     </Text>
//                                   </View>
//                                   {item.deliveryDate && (
//                                     <View className="w-1/2 py-1">
//                                       <Text className="text-xs text-gray-600">Delivery</Text>
//                                       <Text className="text-sm font-medium text-gray-900 mt-0.5">
//                                         {formatDate(item.deliveryDate)}
//                                       </Text>
//                                     </View>
//                                   )}
//                                 </View>
//                               </View>
//                             ))}
//                           </View>

//                           {/* Payment Section */}
//                           <View className="mb-5">
//                             <View className="flex-row items-center mb-3">
//                               <CreditCard size={16} color="#6B7280" />
//                               <Text className="text-sm font-medium text-gray-600 ml-2">
//                                 Payment
//                               </Text>
//                             </View>

//                             {/* Payment Progress */}
//                             <View className="bg-white rounded-lg p-4 mb-3">
//                               <View className="flex-row justify-between items-center mb-2">
//                                 <Text className="text-sm text-gray-600">Payment Progress</Text>
//                                 <View className={`px-2.5 py-1 rounded-full ${getStatusColor(order.traderToAdminPayment.paymentStatus)}`}>
//                                   <Text className="text-xs font-medium">
//                                     {order.traderToAdminPayment.paymentStatus.toUpperCase()}
//                                   </Text>
//                                 </View>
//                               </View>
                              
//                               {/* Progress Bar */}
//                               <View className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
//                                 <View
//                                   className="h-full bg-emerald-500 rounded-full"
//                                   style={{
//                                     width: `${(order.traderToAdminPayment.paidAmount / order.traderToAdminPayment.totalAmount) * 100}%`
//                                   }}
//                                 />
//                               </View>

//                               <View className="flex-row justify-between py-1">
//                                 <Text className="text-sm text-gray-600">Total</Text>
//                                 <Text className="text-sm font-medium text-gray-900">
//                                   {formatCurrency(order.traderToAdminPayment.totalAmount)}
//                                 </Text>
//                               </View>
//                               <View className="flex-row justify-between py-1">
//                                 <Text className="text-sm text-gray-600">Paid</Text>
//                                 <Text className="text-sm font-medium text-emerald-600">
//                                   {formatCurrency(order.traderToAdminPayment.paidAmount)}
//                                 </Text>
//                               </View>
//                               <View className="flex-row justify-between py-1">
//                                 <Text className="text-sm text-gray-600">Remaining</Text>
//                                 <Text className="text-sm font-medium text-red-600">
//                                   {formatCurrency(order.traderToAdminPayment.remainingAmount)}
//                                 </Text>
//                               </View>
//                             </View>

//                             {/* Payment History */}
//                             {order.traderToAdminPayment.paymentHistory.length > 0 && (
//                               <View>
//                                 <Text className="text-xs font-medium text-gray-600 mb-2">
//                                   Payment History
//                                 </Text>
//                                 {order.traderToAdminPayment.paymentHistory.map((payment) => (
//                                   <View
//                                     key={payment._id}
//                                     className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 mb-2"
//                                   >
//                                     <View className="flex-row justify-between items-center">
//                                       <View>
//                                         <Text className="text-sm font-medium text-emerald-900">
//                                           {formatCurrency(payment.amount)}
//                                         </Text>
//                                         <Text className="text-xs text-emerald-700 mt-0.5">
//                                           {formatDate(payment.paidDate)}
//                                         </Text>
//                                       </View>
//                                       <CheckCircle size={18} color="#059669" />
//                                     </View>
//                                     {payment.razorpayPaymentId && (
//                                       <Text className="text-xs text-emerald-600 mt-2 font-mono">
//                                         ID: {payment.razorpayPaymentId}
//                                       </Text>
//                                     )}
//                                   </View>
//                                 ))}
//                               </View>
//                             )}
//                           </View>

//                           {/* Last Updated */}
//                           <View className="pt-4 border-t border-gray-200">
//                             <Text className="text-xs text-gray-500">
//                               Last updated: {formatDate(order.updatedAt)}
//                             </Text>
//                           </View>
//                         </View>
//                       </View>
//                     )}
//                   </View>
//                 );
//               })}
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Payment Modal - Bottom Sheet */}
//       <Modal
//         visible={paymentModal.visible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={closePaymentModal}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="bg-white rounded-t-2xl">
//             {/* Handle Bar */}
//             <View className="items-center pt-3 pb-2">
//               <View className="w-12 h-1 bg-gray-300 rounded-full" />
//             </View>

//             {/* Modal Content */}
//             <View className="p-6">
//               <View className="flex-row items-center justify-between mb-6">
//                 <Text className="text-xl font-medium text-gray-900">Make Payment</Text>
//                 <TouchableOpacity
//                   onPress={closePaymentModal}
//                   className="p-2 rounded-full"
//                 >
//                   <X size={20} color="#6B7280" />
//                 </TouchableOpacity>
//               </View>

//               {/* Order Info */}
//               <View className="bg-blue-50 rounded-lg p-4 mb-6">
//                 <View className="flex-row justify-between items-center mb-2">
//                   <Text className="text-sm text-blue-900 font-medium">
//                     Order #{paymentModal.orderId}
//                   </Text>
//                 </View>
//                 <View className="flex-row justify-between items-center">
//                   <Text className="text-sm text-blue-700">Amount Due</Text>
//                   <Text className="text-xl font-medium text-blue-900">
//                     {formatCurrency(paymentModal.maxAmount)}
//                   </Text>
//                 </View>
//               </View>

//               {/* Payment Input */}
//               <View className="mb-6">
//                 <Text className="text-sm font-medium text-gray-700 mb-2">
//                   Payment Amount
//                 </Text>
//                 <View className="flex-row items-center border-2 border-gray-300 rounded-xl">
//                   <Text className="pl-4 text-gray-600 text-lg">₹</Text>
//                   <TextInput
//                     value={paymentModal.amount.toString()}
//                     onChangeText={(text) => {
//                       const amount = parseFloat(text) || 0;
//                       setPaymentModal(prev => ({
//                         ...prev,
//                         amount: Math.min(amount, paymentModal.maxAmount)
//                       }));
//                     }}
//                     className="flex-1 px-2 py-4 text-xl font-medium"
//                     keyboardType="decimal-pad"
//                     placeholder="0"
//                   />
//                 </View>
//                 <Text className="text-xs text-gray-500 mt-2">
//                   Maximum: {formatCurrency(paymentModal.maxAmount)}
//                 </Text>
//               </View>

//               {/* Quick Select */}
//               <View className="mb-6">
//                 <Text className="text-xs font-medium text-gray-600 mb-2">Quick Select</Text>
//                 <View className="flex-row gap-2">
//                   {[
//                     Math.floor(paymentModal.maxAmount * 0.25),
//                     Math.floor(paymentModal.maxAmount * 0.5),
//                     paymentModal.maxAmount
//                   ].map((amount, i) => (
//                     <TouchableOpacity
//                       key={i}
//                       onPress={() => setPaymentModal(prev => ({ ...prev, amount }))}
//                       className="flex-1 py-2.5 px-3 border-2 border-gray-200 rounded-lg"
//                     >
//                       <Text className="text-sm font-medium text-gray-700 text-center">
//                         {formatCurrency(amount)}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* Action Buttons */}
//               <View className="flex-row gap-3">
//                 <TouchableOpacity
//                   onPress={closePaymentModal}
//                   className="flex-1 py-3.5 px-4 border-2 border-gray-300 rounded-xl"
//                 >
//                   <Text className="text-center font-medium text-gray-700">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={handlePayment}
//                   disabled={paymentModal.amount <= 0 || paymentModal.amount > paymentModal.maxAmount}
//                   className={`flex-1 py-3.5 px-4 rounded-xl flex-row items-center justify-center ${
//                     paymentModal.amount <= 0 || paymentModal.amount > paymentModal.maxAmount
//                       ? 'bg-gray-300'
//                       : 'bg-blue-600'
//                   }`}
//                 >
//                   <CreditCard size={18} color="white" />
//                   <Text className="text-white font-medium ml-2">
//                     Pay {formatCurrency(paymentModal.amount)}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default TraderOrderHistory;









import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import {
  Clock,
  User,
  Truck,
  Package,
  Wallet,
  AlertCircle,
  CreditCard,
  History,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronRight,
} from 'lucide-react-native';

const RAZORPAY_KEY_ID = 'rzp_test_qUmhUFElBiSNIs';

interface PaymentRecord {
  _id: string;
  amount: number;
  paidDate: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

interface TraderToAdminPayment {
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
  farmerId: string;
  farmerName?: string;
  farmerMobile?: string;
  productItems: ProductItem[];
  traderToAdminPayment: TraderToAdminPayment;
  orderStatus: string;
  transporterStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentModalState {
  visible: boolean;
  orderId: string;
  maxAmount: number;
  amount: number;
}

const TraderOrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState<PaymentModalState>({
    visible: false,
    orderId: '',
    maxAmount: 0,
    amount: 0,
  });
  
  const [traderInfo, setTraderInfo] = useState({
    id: '',
    name: '',
    mobile: '',
    email: '',
  });

  useEffect(() => {
    fetchTraderInfo();
  }, []);

  const fetchTraderInfo = async () => {
    try {
      const [id, name, mobile, email] = await Promise.all([
        AsyncStorage.getItem('traderId'),
        AsyncStorage.getItem('userName'),
        AsyncStorage.getItem('userMobile'),
        AsyncStorage.getItem('userEmail'),
      ]);

      if (!id) {
        setError('Trader ID not found. Please login again.');
        setLoading(false);
        return;
      }

      setTraderInfo({
        id,
        name: name || '',
        mobile: mobile || '',
        email: email || '',
      });

      fetchOrderHistory(id);
    } catch (err) {
      console.error('Error fetching trader info:', err);
      setError('Failed to load trader information');
      setLoading(false);
    }
  };

  const fetchOrderHistory = async (traderId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://kisan.etpl.ai/api/orders/history/trader/${traderId}`
      );
      
      if (response.data.success) {
        setOrders(response.data.data);
      }
      setError('');
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (order: Order) => {
    setPaymentModal({
      visible: true,
      orderId: order.orderId,
      maxAmount: order.traderToAdminPayment.remainingAmount,
      amount: order.traderToAdminPayment.remainingAmount,
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({
      visible: false,
      orderId: '',
      maxAmount: 0,
      amount: 0,
    });
  };

  const handlePayment = async () => {
    const { orderId, amount, maxAmount } = paymentModal;
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
      Alert.alert('Error', 'Order not found');
      return;
    }

    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }

    if (amount > maxAmount) {
      Alert.alert('Error', 'Payment amount cannot exceed remaining amount');
      return;
    }

    try {
      setProcessingPayment(orderId);
      closePaymentModal();

      // Create Razorpay order on backend
      const orderResponse = await axios.post(
        'https://kisan.etpl.ai/api/orders/history/create-trader-payment',
        {
          orderId: orderId,
          amount: amount,
          traderId: traderInfo.id,
        }
      );

      const { razorpayOrderId, key_id } = orderResponse.data;

      // Razorpay options
      const options = {
        description: `Payment for Order #${orderId}`,
        image: 'https://your-logo-url.com/logo.png', // Add your logo URL
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100), // Amount in paise
        name: 'Kisan Platform',
        order_id: razorpayOrderId,
        prefill: {
          email: traderInfo.email,
          contact: traderInfo.mobile,
          name: traderInfo.name,
        },
        theme: { color: '#059669' },
      };

      // Open Razorpay
      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // Payment successful
          console.log('Payment Success:', data);
          
          // Verify payment on backend
          try {
            const verifyResponse = await axios.post(
              'https://kisan.etpl.ai/api/orders/history/verify-trader-payment',
              {
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_order_id: data.razorpay_order_id,
                razorpay_signature: data.razorpay_signature,
                orderId: orderId,
                amount: amount,
                traderId: traderInfo.id,
              }
            );

            if (verifyResponse.data.success) {
              Alert.alert(
                'Payment Successful!',
                `Payment of ${formatCurrency(amount)} completed successfully for Order #${orderId}`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Refresh order history
                      fetchOrderHistory(traderInfo.id);
                    },
                  },
                ]
              );
            } else {
              Alert.alert('Verification Failed', 'Please contact support with Payment ID: ' + data.razorpay_payment_id);
            }
          } catch (error) {
            console.error('Verification error:', error);
            Alert.alert(
              'Verification Error', 
              'Payment may have been successful. Please check your order history or contact support with Payment ID: ' + data.razorpay_payment_id
            );
          }
        })
        .catch((error: any) => {
          // Payment failed or cancelled
          console.log('Payment Error:', error);
          
          if (error.code === RazorpayCheckout.PAYMENT_CANCELLED) {
            Alert.alert('Payment Cancelled', 'You cancelled the payment');
          } else {
            Alert.alert('Payment Failed', error.description || 'Something went wrong. Please try again.');
          }
        })
        .finally(() => {
          setProcessingPayment(null);
        });

    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      Alert.alert(
        'Payment Failed',
        error.response?.data?.message || 'Failed to initiate payment. Please try again.'
      );
      setProcessingPayment(null);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: 'bg-yellow-100 border-yellow-400 text-yellow-800',
      processing: 'bg-blue-100 border-blue-400 text-blue-800',
      in_transit: 'bg-purple-100 border-purple-400 text-purple-800',
      completed: 'bg-green-100 border-green-400 text-green-800',
      cancelled: 'bg-red-100 border-red-400 text-red-800',
      partial: 'bg-orange-100 border-orange-400 text-orange-800',
      paid: 'bg-green-100 border-green-400 text-green-800',
    };
    return statusColors[status] || 'bg-gray-100 border-gray-400 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateOrderTotal = (order: Order) => {
    return order.productItems.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0d6efd" />
        <Text className="mt-4 text-gray-600">Loading order history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-6">
        <AlertCircle size={48} color="#DC2626" />
        <Text className="text-red-600 text-center mt-4 text-lg font-semibold">
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => fetchTraderInfo()}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Clock size={24} color="#4B5563" />
            <Text className="text-2xl font-bold text-gray-800 ml-2">
              My Order History
            </Text>
          </View>
          <Text className="text-gray-600">
            View all your orders and manage payments
          </Text>
        </View>

        {orders.length === 0 ? (
          <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <View className="flex-row items-center">
              <AlertCircle size={20} color="#3B82F6" />
              <Text className="text-blue-700 ml-2 font-medium">
                No orders found
              </Text>
            </View>
          </View>
        ) : (
          <View className="space-y-6">
            {orders.map((order) => (
              <View
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <View className="bg-green-600 p-4">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-white text-lg font-bold">
                        Order #{order.orderId}
                      </Text>
                      <Text className="text-green-100 text-sm mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full border ${getStatusBadgeStyle(order.orderStatus)}`}>
                      <Text className="font-semibold text-xs">
                        {order.orderStatus.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="p-4">
                  {/* Farmer Information */}
                  <View className="mb-4">
                    <Text className="text-gray-500 font-medium mb-2 flex-row items-center">
                      <User size={16} color="#6B7280" />
                      <Text className="ml-1">Farmer Information</Text>
                    </Text>
                    <View className="bg-gray-50 p-3 rounded-lg space-y-1">
                      {order.farmerName && (
                        <Text className="text-gray-800">
                          <Text className="font-semibold">Name:</Text> {order.farmerName}
                        </Text>
                      )}
                      {order.farmerMobile && (
                        <Text className="text-gray-800">
                          <Text className="font-semibold">Mobile:</Text> {order.farmerMobile}
                        </Text>
                      )}
                      <Text className="text-gray-800">
                        <Text className="font-semibold">Farmer ID:</Text> {order.farmerId}
                      </Text>
                    </View>
                  </View>

                  {/* Transport Status */}
                  <View className="mb-6">
                    <Text className="text-gray-500 font-medium mb-2 flex-row items-center">
                      <Truck size={16} color="#6B7280" />
                      <Text className="ml-1">Transport Status</Text>
                    </Text>
                    <View className={`px-3 py-1 rounded-full border ${getStatusBadgeStyle(order.transporterStatus)}`}>
                      <Text className="font-semibold text-xs">
                        {order.transporterStatus.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200 my-4" />

                  {/* Product Items */}
                  <View className="mb-6">
                    <Text className="text-gray-500 font-medium mb-3 flex-row items-center">
                      <Package size={16} color="#6B7280" />
                      <Text className="ml-1">Product Items</Text>
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View className="flex-row">
                        {order.productItems.map((item, index) => (
                          <View
                            key={item._id}
                            className={`bg-gray-50 p-4 rounded-lg mr-3 ${index === 0 ? '' : 'ml-0'}`}
                            style={{ width: 280 }}
                          >
                            <View className="space-y-2">
                              <View className="flex-row justify-between">
                                <Text className="text-gray-700">Product ID:</Text>
                                <Text className="text-gray-800 font-medium">{item.productId}</Text>
                              </View>
                              <View className="flex-row justify-between">
                                <Text className="text-gray-700">Farmer ID:</Text>
                                <Text className="text-gray-800">{item.farmerId}</Text>
                              </View>
                              <View className="flex-row justify-between">
                                <Text className="text-gray-700">Grade:</Text>
                                <Text className="text-gray-800">{item.grade}</Text>
                              </View>
                              <View className="flex-row justify-between">
                                <Text className="text-gray-700">Quantity:</Text>
                                <Text className="text-gray-800">{item.quantity}</Text>
                              </View>
                              <View className="flex-row justify-between">
                                <Text className="text-gray-700">Price/Unit:</Text>
                                <Text className="text-gray-800">{formatCurrency(item.pricePerUnit)}</Text>
                              </View>
                              <View className="flex-row justify-between">
                                <Text className="text-gray-700">Total:</Text>
                                <Text className="text-gray-800 font-bold">
                                  {formatCurrency(item.totalAmount)}
                                </Text>
                              </View>
                              {item.deliveryDate && (
                                <View className="flex-row justify-between pt-2 border-t border-gray-200">
                                  <Text className="text-gray-700">Delivery Date:</Text>
                                  <Text className="text-gray-800">{formatDate(item.deliveryDate)}</Text>
                                </View>
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    </ScrollView>

                    {/* Grand Total */}
                    <View className="mt-4 pt-4 border-t border-gray-200">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-700 font-semibold">Grand Total:</Text>
                        <Text className="text-blue-600 font-bold text-lg">
                          {formatCurrency(calculateOrderTotal(order))}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200 my-4" />

                  {/* Payment Section */}
                  <View>
                    <Text className="text-gray-500 font-medium mb-3 flex-row items-center">
                      <Wallet size={16} color="#6B7280" />
                      <Text className="ml-1">Payment Details (Trader to Admin)</Text>
                    </Text>

                    <View className="space-y-4">
                      {/* Payment Summary Card */}
                      <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <View className="space-y-2 mb-3">
                          <View className="flex-row justify-between">
                            <Text className="text-gray-700">Total Amount:</Text>
                            <Text className="font-semibold">
                              {formatCurrency(order.traderToAdminPayment.totalAmount)}
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-green-700">Paid Amount:</Text>
                            <Text className="font-semibold text-green-700">
                              {formatCurrency(order.traderToAdminPayment.paidAmount)}
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-red-700">Remaining Amount:</Text>
                            <Text className="font-semibold text-red-700">
                              {formatCurrency(order.traderToAdminPayment.remainingAmount)}
                            </Text>
                          </View>
                        </View>

                        <View className="h-px bg-blue-200 my-2" />

                        <View className="flex-row justify-between items-center">
                          <Text className="text-gray-700">Payment Status:</Text>
                          <View className={`px-3 py-1 rounded-full border ${getStatusBadgeStyle(order.traderToAdminPayment.paymentStatus)}`}>
                            <Text className="font-semibold text-xs">
                              {order.traderToAdminPayment.paymentStatus.toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        {/* Make Payment Button */}
                        {order.traderToAdminPayment.remainingAmount > 0 && (
                          <TouchableOpacity
                            onPress={() => openPaymentModal(order)}
                            disabled={processingPayment === order.orderId}
                            className={`mt-4 py-3 px-4 rounded-lg flex-row items-center justify-center ${
                              processingPayment === order.orderId
                                ? 'bg-gray-400'
                                : 'bg-blue-600 active:bg-blue-700'
                            }`}
                          >
                            {processingPayment === order.orderId ? (
                              <>
                                <ActivityIndicator color="white" size="small" />
                                <Text className="text-white font-medium ml-2">
                                  Processing...
                                </Text>
                              </>
                            ) : (
                              <>
                                <CreditCard size={20} color="white" />
                                <Text className="text-white font-medium ml-2">
                                  Make Payment
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Payment History */}
                      <View>
                        <Text className="text-gray-500 font-medium mb-3 flex-row items-center">
                          <History size={16} color="#6B7280" />
                          <Text className="ml-1">Payment History</Text>
                        </Text>
                        {order.traderToAdminPayment.paymentHistory.length === 0 ? (
                          <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <Text className="text-blue-700 text-center">
                              No payments made yet
                            </Text>
                          </View>
                        ) : (
                          <View className="space-y-2">
                            {order.traderToAdminPayment.paymentHistory.map((payment) => (
                              <View
                                key={payment._id}
                                className="bg-green-50 p-3 rounded-lg border border-green-200"
                              >
                                <View className="flex-row justify-between items-center">
                                  <Text className="text-green-800 font-bold">
                                    {formatCurrency(payment.amount)}
                                  </Text>
                                  <Text className="text-gray-600 text-sm">
                                    {formatDate(payment.paidDate)}
                                  </Text>
                                </View>
                                {payment.razorpayPaymentId && (
                                  <Text className="text-gray-600 text-xs mt-1">
                                    Payment ID: {payment.razorpayPaymentId}
                                  </Text>
                                )}
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Last Updated */}
                  <View className="mt-6 pt-4 border-t border-gray-200">
                    <Text className="text-gray-500 text-sm">
                      Last updated: {formatDate(order.updatedAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Payment Modal */}
      <Modal
        visible={paymentModal.visible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePaymentModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-lg w-full max-w-md p-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Make Payment
            </Text>

            <View className="space-y-4 mb-6">
              <View className="bg-blue-50 p-4 rounded-lg">
                <Text className="text-blue-800">
                  Order: #{paymentModal.orderId}
                </Text>
                <Text className="text-blue-800 mt-1">
                  Maximum payment: {formatCurrency(paymentModal.maxAmount)}
                </Text>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (₹)
                </Text>
                <TextInput
                  value={paymentModal.amount.toString()}
                  onChangeText={(text) => {
                    const amount = parseFloat(text) || 0;
                    setPaymentModal(prev => ({
                      ...prev,
                      amount: Math.min(amount, paymentModal.maxAmount),
                    }));
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
                  keyboardType="decimal-pad"
                  placeholder="Enter amount"
                />
                <Text className="text-xs text-gray-500 mt-1">
                  Maximum: {formatCurrency(paymentModal.maxAmount)}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={closePaymentModal}
                disabled={processingPayment !== null}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg active:bg-gray-50"
              >
                <Text className="text-center font-medium text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePayment}
                disabled={paymentModal.amount <= 0 || paymentModal.amount > paymentModal.maxAmount}
                className={`flex-1 px-4 py-3 rounded-lg flex-row items-center justify-center ${
                  paymentModal.amount <= 0 || paymentModal.amount > paymentModal.maxAmount
                    ? 'bg-gray-400'
                    : 'bg-blue-600 active:bg-blue-700'
                }`}
              >
                <CreditCard size={20} color="white" />
                <Text className="text-white font-medium ml-2">
                  Pay {formatCurrency(paymentModal.amount)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default TraderOrderHistory;