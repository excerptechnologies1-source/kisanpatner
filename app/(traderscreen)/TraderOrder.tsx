// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Modal,
//   Alert,
//   Linking,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CreditCard, Package, AlertCircle, ShoppingCart, Clock, ChevronRight } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';

// const TraderOrders: React.FC = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [commissionRate, setCommissionRate] = useState(0);
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchCommission();
//     fetchPurchases();
//   }, []);

//   const fetchCommission = async () => {
//     try {
//       const response = await fetch('https://kisan.etpl.ai/api/commission/all');
//       const data = await response.json();
//       const traderCommission = data.find((c: any) => c.role?.toLowerCase() === 'trader');
//       if (traderCommission) setCommissionRate(traderCommission.commissionPercentage);
//     } catch (error) {}
//   };

//   const fetchPurchases = async () => {
//     try {
//       setLoading(true);
//       const traderId = await AsyncStorage.getItem('traderId');
//       const response = await fetch(`https://kisan.etpl.ai/product/trader-purchases/${traderId}`);
//       const data = await response.json();
//       const list = data?.data || [];
//       setPurchases(list);

//       const total = calculateGrandTotal(list);
//       const minPay = Math.ceil(total * 0.5);
//       setPaymentAmount(minPay);
//     } catch {
//       Alert.alert('Error', 'Failed to load purchases');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateCommission = (amount: number) => (amount * commissionRate) / 100;

//   const calculateTotalWithCommission = (amount: number) => amount + calculateCommission(amount);

//   const calculateGrandTotal = (list: any[] = purchases) => {
//     const subtotal = list.reduce((sum, i) => sum + i.totalAmount, 0);
//     return calculateTotalWithCommission(subtotal);
//   };

//   const navigateToOrderHistory = () => navigation.navigate('TraderOrderHistory' as never);

//   const grandTotal = calculateGrandTotal();
//   const subtotal = purchases.reduce((s, i) => s + i.totalAmount, 0);
//   const minPayment = Math.ceil(grandTotal * 0.5);

//   if (loading) {
//     return (
//       <View className="flex-1 bg-white justify-center items-center">
//         <ActivityIndicator size="large" color="#059669" />
//         <Text className="mt-3 text-gray-500">Loading purchases...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-white">
//       <View className="p-4">

        

//         {/* Header */}
//         <View className="mb-6">
//           <View className="flex-row items-center mb-1">
//             <Package size={24} color="#059669" />
//             <Text className="text-2xl font-medium text-gray-900 ml-2">My Purchases</Text>
//           </View>
//           <Text className="text-gray-500">
//             Platform fee: {commissionRate}% added to all purchases
//           </Text>
//         </View>

//         {purchases.length === 0 ? (
//           <View className="bg-white border border-gray-200 rounded-xl p-10 items-center">
//             <Package size={60} color="#9CA3AF" />
//             <Text className="text-xl font-medium text-gray-900 mt-3">No purchases yet</Text>
//             <Text className="text-gray-500 mt-1">Your purchases will appear here</Text>
//           </View>
//         ) : (
//           <>
//             {/* Info Notice */}
//             <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
//               <View className="flex-row">
//                 <AlertCircle size={20} color="#2563EB" style={{ marginTop: 1 }} />
//                 <Text className="ml-3 text-blue-900">
//                   <Text className="font-medium">Create Order:</Text> Pay minimum 50% now. Amount is editable.
//                 </Text>
//               </View>
//             </View>

//             {/* Purchases Horizontal List */}
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
//               <View className="flex-row">
//                 {purchases.map((item: any) => (
//                   <View
//                     key={item._id}
//                     className="bg-white border border-gray-200 rounded-xl w-80 mr-4"
//                   >
//                     {/* Header */}
//                     <View className="bg-green-600 p-4 rounded-t-xl">
//                       <Text className="text-white font-medium text-base">{item.product.cropBriefDetails}</Text>
//                       <Text className="text-green-100 mt-1">Grade: {item.grade}</Text>
//                     </View>

//                     {/* Body */}
//                     <View className="p-5">
//                       <View className="flex-row justify-between mb-2">
//                         <Text className="text-gray-500">Quantity</Text>
//                         <Text className="text-gray-900 font-medium">
//                           {item.quantity} {item.product.unitMeasurement}
//                         </Text>
//                       </View>

//                       <View className="flex-row justify-between">
//                         <Text className="text-gray-500">Amount</Text>
//                         <Text className="text-gray-900 font-medium">
//                           ₹{item.totalAmount.toFixed(2)}
//                         </Text>
//                       </View>

//                       <View className="border-t border-gray-200 mt-3 pt-2">
//                         <Text className="text-sm text-gray-500">
//                           Date: {new Date(item.purchaseDate).toLocaleDateString('en-IN')}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             </ScrollView>

//             {/* Summary */}
//             <View className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
//               <Text className="text-xl font-medium text-gray-900 mb-4">Order Summary</Text>

//               <View className="mb-4">
//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Total Items</Text>
//                   <Text className="font-medium">{purchases.length}</Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Subtotal</Text>
//                   <Text className="font-medium">₹{subtotal.toFixed(2)}</Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">
//                     Platform Fee ({commissionRate}%)
//                   </Text>
//                   <Text className="font-medium text-orange-600">
//                     +₹{(commissionRate * subtotal / 100).toFixed(2)}
//                   </Text>
//                 </View>
//               </View>

//               <View className="border-t border-gray-300 pt-3 flex-row justify-between">
//                 <Text className="text-lg font-medium text-gray-900">Grand Total</Text>
//                 <Text className="text-lg font-medium text-green-600">
//                   ₹{grandTotal.toFixed(2)}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 onPress={() => setShowPaymentModal(true)}
//                 className="bg-green-600 mt-5 py-4 rounded-lg flex-row justify-center items-center"
//               >
//                 <ShoppingCart size={22} color="white" />
//                 <Text className="text-white font-medium text-lg ml-2">Create Order & Pay</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         )}
//       </View>

//       {/* Payment Modal */}
//       <Modal visible={showPaymentModal} transparent animationType="slide">
//         <View className="flex-1 bg-black/50 justify-center items-center p-4">
//           <View className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6">
//             <Text className="text-2xl font-medium text-gray-900 mb-4">Create Order</Text>

//             <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
//               <Text className="text-blue-900">
//                 Total Items: {purchases.length} • Pay minimum 50% now
//               </Text>
//             </View>

//             <View className="flex-row justify-between mb-4">
//               <View>
//                 <Text className="text-gray-500 text-sm">Total</Text>
//                 <Text className="text-gray-900 font-medium">₹{grandTotal.toFixed(2)}</Text>
//               </View>

//               <View>
//                 <Text className="text-gray-500 text-sm">Minimum</Text>
//                 <Text className="text-orange-600 font-medium">₹{minPayment.toFixed(2)}</Text>
//               </View>
//             </View>

//             <Text className="text-sm text-gray-700 mb-1">Payment Amount</Text>

//             <View className="border border-gray-300 rounded-lg px-3 flex-row items-center">
//               <Text className="text-gray-500 mr-2">₹</Text>
//               <TextInput
//                 value={paymentAmount.toString()}
//                 keyboardType="decimal-pad"
//                 onChangeText={(t) => setPaymentAmount(parseFloat(t) || 0)}
//                 className="flex-1 py-3 text-lg font-medium"
//               />
//             </View>

//             <Text className="text-xs text-gray-500 mt-1">
//               Min: ₹{minPayment.toFixed(2)} | Max: ₹{grandTotal.toFixed(2)}
//             </Text>

//             <View className="flex-row gap-3 mt-6">
//               <TouchableOpacity
//                 onPress={() => setShowPaymentModal(false)}
//                 className="flex-1 border border-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-center text-gray-700 font-medium">Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 className={`flex-1 py-3 rounded-lg flex-row justify-center items-center ${
//                   processingPayment ? 'bg-gray-400' : 'bg-green-600'
//                 }`}
//               >
//                 {processingPayment ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <>
//                     <CreditCard size={20} color="white" />
//                     <Text className="text-white font-medium ml-2">
//                       Pay ₹{paymentAmount.toFixed(2)}
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// export default TraderOrders;


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Modal,
//   Alert,
//   Platform,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import RazorpayCheckout from 'react-native-razorpay';
// import { CreditCard, Package, AlertCircle, ShoppingCart } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';

// const TraderOrders: React.FC = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [commissionRate, setCommissionRate] = useState(0);
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const navigation = useNavigation();

//   // Razorpay Key - Replace with your actual key
//   const RAZORPAY_KEY = 'rzp_test_qUmhUFElBiSNIs'; // Replace with your key

//   useEffect(() => {
//     fetchCommission();
//     fetchPurchases();
//   }, []);

//   const fetchCommission = async () => {
//     try {
//       const response = await fetch('https://kisan.etpl.ai/api/commission/all');
//       const data = await response.json();
//       const traderCommission = data.find((c: any) => c.role?.toLowerCase() === 'trader');
//       if (traderCommission) setCommissionRate(traderCommission.commissionPercentage);
//     } catch (error) {
//       console.error('Commission fetch error:', error);
//     }
//   };

//   const fetchPurchases = async () => {
//     try {
//       setLoading(true);
//       const traderId = await AsyncStorage.getItem('traderId');
//       const response = await fetch(`https://kisan.etpl.ai/product/trader-purchases/${traderId}`);
//       const data = await response.json();
//       const list = data?.data || [];
//       setPurchases(list);

//       const total = calculateGrandTotal(list);
//       const minPay = Math.ceil(total * 0.5);
//       setPaymentAmount(minPay);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load purchases');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateCommission = (amount: number) => (amount * commissionRate) / 100;

//   const calculateTotalWithCommission = (amount: number) => amount + calculateCommission(amount);

//   const calculateGrandTotal = (list: any[] = purchases) => {
//     const subtotal = list.reduce((sum, i) => sum + i.totalAmount, 0);
//     return calculateTotalWithCommission(subtotal);
//   };

//   const createOrderOnBackend = async (amount: number) => {
//     try {
//       const traderId = await AsyncStorage.getItem('traderId');
      
//       // Create order on your backend
//       const response = await fetch('https://kisan.etpl.ai/api/razorpay/create-order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: amount * 100, // Convert to paise
//           currency: 'INR',
//           traderId: traderId,
//           purchases: purchases.map(p => p._id),
//         }),
//       });

//       const data = await response.json();
//       return data.orderId;
//     } catch (error) {
//       console.error('Order creation error:', error);
//       throw error;
//     }
//   };

//   const verifyPaymentOnBackend = async (paymentData: any) => {
//     try {
//       const response = await fetch('https://kisan.etpl.ai/api/razorpay/verify-payment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(paymentData),
//       });

//       const data = await response.json();
//       return data.success;
//     } catch (error) {
//       console.error('Payment verification error:', error);
//       return false;
//     }
//   };

//   const handlePayment = async () => {
//     const grandTotal = calculateGrandTotal();
//     const minPayment = Math.ceil(grandTotal * 0.5);

//     // Validation
//     if (paymentAmount < minPayment) {
//       Alert.alert('Invalid Amount', `Minimum payment is ₹${minPayment.toFixed(2)}`);
//       return;
//     }

//     if (paymentAmount > grandTotal) {
//       Alert.alert('Invalid Amount', `Maximum payment is ₹${grandTotal.toFixed(2)}`);
//       return;
//     }

//     setProcessingPayment(true);

//     try {
//       // Get user details
//       const traderName = await AsyncStorage.getItem('traderName') || 'Trader';
//       const traderEmail = await AsyncStorage.getItem('traderEmail') || '';
//       const traderPhone = await AsyncStorage.getItem('traderPhone') || '';

//       // Create order on backend
//       const orderId = await createOrderOnBackend(paymentAmount);

//       // Razorpay options
//       const options = {
//         description: 'Order Payment',
//         image: 'https://your-logo-url.com/logo.png', // Your logo URL
//         currency: 'INR',
//         key: RAZORPAY_KEY,
//         amount: paymentAmount * 100, // Amount in paise
//         order_id: orderId,
//         name: 'Kisan Platform',
//         prefill: {
//           email: traderEmail,
//           contact: traderPhone,
//           name: traderName,
//         },
//         theme: { color: '#059669' },
//       };

//       // Open Razorpay
//       RazorpayCheckout.open(options)
//         .then(async (data: any) => {
//           // Payment successful
//           console.log('Payment Success:', data);

//           // Verify payment on backend
//           const verificationData = {
//             razorpay_order_id: data.razorpay_order_id,
//             razorpay_payment_id: data.razorpay_payment_id,
//             razorpay_signature: data.razorpay_signature,
//             amount: paymentAmount,
//             purchases: purchases.map(p => p._id),
//           };

//           const verified = await verifyPaymentOnBackend(verificationData);

//           if (verified) {
//             Alert.alert(
//               'Success!',
//               `Payment of ₹${paymentAmount.toFixed(2)} completed successfully!`,
//               [
//                 {
//                   text: 'OK',
//                   onPress: () => {
//                     setShowPaymentModal(false);
//                     fetchPurchases(); // Refresh purchases
//                   },
//                 },
//               ]
//             );
//           } else {
//             Alert.alert('Error', 'Payment verification failed. Please contact support.');
//           }
//         })
//         .catch((error: any) => {
//           // Payment failed or cancelled
//           console.log('Payment Error:', error);
          
//           if (error.code === RazorpayCheckout.PAYMENT_CANCELLED) {
//             Alert.alert('Payment Cancelled', 'You cancelled the payment');
//           } else {
//             Alert.alert('Payment Failed', error.description || 'Something went wrong');
//           }
//         })
//         .finally(() => {
//           setProcessingPayment(false);
//         });
//     } catch (error) {
//       console.error('Payment initiation error:', error);
//       Alert.alert('Error', 'Failed to initiate payment. Please try again.');
//       setProcessingPayment(false);
//     }
//   };

//   const grandTotal = calculateGrandTotal();
//   const subtotal = purchases.reduce((s, i) => s + i.totalAmount, 0);
//   const minPayment = Math.ceil(grandTotal * 0.5);

//   if (loading) {
//     return (
//       <View className="flex-1 bg-white justify-center items-center">
//         <ActivityIndicator size="large" color="#059669" />
//         <Text className="mt-3 text-gray-500">Loading purchases...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-white">
//       <View className="p-4">
//         {/* Header */}
//         <View className="mb-6">
//           <View className="flex-row items-center mb-1">
//             <Package size={24} color="#059669" />
//             <Text className="text-2xl font-medium text-gray-900 ml-2">My Purchases</Text>
//           </View>
//           <Text className="text-gray-500">
//             Platform fee: {commissionRate}% added to all purchases
//           </Text>
//         </View>

//         {purchases.length === 0 ? (
//           <View className="bg-white border border-gray-200 rounded-xl p-10 items-center">
//             <Package size={60} color="#9CA3AF" />
//             <Text className="text-xl font-medium text-gray-900 mt-3">No purchases yet</Text>
//             <Text className="text-gray-500 mt-1">Your purchases will appear here</Text>
//           </View>
//         ) : (
//           <>
//             {/* Info Notice */}
//             <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
//               <View className="flex-row">
//                 <AlertCircle size={20} color="#2563EB" style={{ marginTop: 1 }} />
//                 <Text className="ml-3 text-blue-900">
//                   <Text className="font-medium">Create Order:</Text> Pay minimum 50% now. Amount is editable.
//                 </Text>
//               </View>
//             </View>

//             {/* Purchases Horizontal List */}
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
//               <View className="flex-row">
//                 {purchases.map((item: any) => (
//                   <View
//                     key={item._id}
//                     className="bg-white border border-gray-200 rounded-xl w-80 mr-4"
//                   >
//                     {/* Header */}
//                     <View className="bg-green-600 p-4 rounded-t-xl">
//                       <Text className="text-white font-medium text-base">{item.product.cropBriefDetails}</Text>
//                       <Text className="text-green-100 mt-1">Grade: {item.grade}</Text>
//                     </View>

//                     {/* Body */}
//                     <View className="p-5">
//                       <View className="flex-row justify-between mb-2">
//                         <Text className="text-gray-500">Quantity</Text>
//                         <Text className="text-gray-900 font-medium">
//                           {item.quantity} {item.product.unitMeasurement}
//                         </Text>
//                       </View>

//                       <View className="flex-row justify-between">
//                         <Text className="text-gray-500">Amount</Text>
//                         <Text className="text-gray-900 font-medium">
//                           ₹{item.totalAmount.toFixed(2)}
//                         </Text>
//                       </View>

//                       <View className="border-t border-gray-200 mt-3 pt-2">
//                         <Text className="text-sm text-gray-500">
//                           Date: {new Date(item.purchaseDate).toLocaleDateString('en-IN')}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             </ScrollView>

//             {/* Summary */}
//             <View className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
//               <Text className="text-xl font-medium text-gray-900 mb-4">Order Summary</Text>

//               <View className="mb-4">
//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Total Items</Text>
//                   <Text className="font-medium">{purchases.length}</Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Subtotal</Text>
//                   <Text className="font-medium">₹{subtotal.toFixed(2)}</Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">
//                     Platform Fee ({commissionRate}%)
//                   </Text>
//                   <Text className="font-medium text-orange-600">
//                     +₹{(commissionRate * subtotal / 100).toFixed(2)}
//                   </Text>
//                 </View>
//               </View>

//               <View className="border-t border-gray-300 pt-3 flex-row justify-between">
//                 <Text className="text-lg font-medium text-gray-900">Grand Total</Text>
//                 <Text className="text-lg font-medium text-green-600">
//                   ₹{grandTotal.toFixed(2)}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 onPress={() => setShowPaymentModal(true)}
//                 className="bg-green-600 mt-5 py-4 rounded-lg flex-row justify-center items-center"
//               >
//                 <ShoppingCart size={22} color="white" />
//                 <Text className="text-white font-medium text-lg ml-2">Create Order & Pay</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         )}
//       </View>

//       {/* Payment Modal */}
//       <Modal visible={showPaymentModal} transparent animationType="slide">
//         <View className="flex-1 bg-black/50 justify-center items-center p-4">
//           <View className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6">
//             <Text className="text-2xl font-medium text-gray-900 mb-4">Create Order</Text>

//             <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
//               <Text className="text-blue-900">
//                 Total Items: {purchases.length} • Pay minimum 50% now
//               </Text>
//             </View>

//             <View className="flex-row justify-between mb-4">
//               <View>
//                 <Text className="text-gray-500 text-sm">Total</Text>
//                 <Text className="text-gray-900 font-medium">₹{grandTotal.toFixed(2)}</Text>
//               </View>

//               <View>
//                 <Text className="text-gray-500 text-sm">Minimum</Text>
//                 <Text className="text-orange-600 font-medium">₹{minPayment.toFixed(2)}</Text>
//               </View>
//             </View>

//             <Text className="text-sm text-gray-700 mb-1">Payment Amount</Text>

//             <View className="border border-gray-300 rounded-lg px-3 flex-row items-center">
//               <Text className="text-gray-500 mr-2">₹</Text>
//               <TextInput
//                 value={paymentAmount.toString()}
//                 keyboardType="decimal-pad"
//                 onChangeText={(t) => setPaymentAmount(parseFloat(t) || 0)}
//                 className="flex-1 py-3 text-lg font-medium"
//               />
//             </View>

//             <Text className="text-xs text-gray-500 mt-1">
//               Min: ₹{minPayment.toFixed(2)} | Max: ₹{grandTotal.toFixed(2)}
//             </Text>

//             <View className="flex-row gap-3 mt-6">
//               <TouchableOpacity
//                 onPress={() => setShowPaymentModal(false)}
//                 disabled={processingPayment}
//                 className="flex-1 border border-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-center text-gray-700 font-medium">Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={handlePayment}
//                 disabled={processingPayment}
//                 className={`flex-1 py-3 rounded-lg flex-row justify-center items-center ${
//                   processingPayment ? 'bg-gray-400' : 'bg-green-600'
//                 }`}
//               >
//                 {processingPayment ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <>
//                     <CreditCard size={20} color="white" />
//                     <Text className="text-white font-medium ml-2">
//                       Pay ₹{paymentAmount.toFixed(2)}
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// export default TraderOrders;









// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Modal,
//   Alert,
//   Linking,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import RazorpayCheckout from 'react-native-razorpay';
// import { CreditCard, Package, AlertCircle, ShoppingCart, Clock, ChevronRight } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';

// const RAZORPAY_KEY_ID = 'rzp_test_qUmhUFElBiSNIs';

// const TraderOrders: React.FC = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [commissionRate, setCommissionRate] = useState(0);
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchCommission();
//     fetchPurchases();
//   }, []);

//   const fetchCommission = async () => {
//     try {
//       const response = await fetch('https://kisan.etpl.ai/api/commission/all');
//       const data = await response.json();
//       const traderCommission = data.find((c: any) => c.role?.toLowerCase() === 'trader');
//       if (traderCommission) setCommissionRate(traderCommission.commissionPercentage);
//     } catch (error) {}
//   };

//   const fetchPurchases = async () => {
//     try {
//       setLoading(true);
//       const traderId = await AsyncStorage.getItem('traderId');
//       const response = await fetch(`https://kisan.etpl.ai/product/trader-purchases/${traderId}`);
//       const data = await response.json();
//       const list = data?.data || [];
//       setPurchases(list);

//       const total = calculateGrandTotal(list);
//       const minPay = Math.ceil(total * 0.5);
//       setPaymentAmount(minPay);
//     } catch {
//       Alert.alert('Error', 'Failed to load purchases');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateCommission = (amount: number) => (amount * commissionRate) / 100;

//   const calculateTotalWithCommission = (amount: number) => amount + calculateCommission(amount);

//   const calculateGrandTotal = (list: any[] = purchases) => {
//     const subtotal = list.reduce((sum, i) => sum + i.totalAmount, 0);
//     return calculateTotalWithCommission(subtotal);
//   };

//   const navigateToOrderHistory = () => navigation.navigate('TraderOrderHistory' as never);

//   const handlePayment = async () => {
//     // Validation
//     const grandTotal = calculateGrandTotal();
//     const minPayment = Math.ceil(grandTotal * 0.5);

//     if (paymentAmount < minPayment) {
//       Alert.alert('Invalid Amount', `Minimum payment required is ₹${minPayment.toFixed(2)}`);
//       return;
//     }

//     if (paymentAmount > grandTotal) {
//       Alert.alert('Invalid Amount', `Maximum payment amount is ₹${grandTotal.toFixed(2)}`);
//       return;
//     }

//     try {
//       setProcessingPayment(true);

//       // Get trader details
//       const traderId = await AsyncStorage.getItem('traderId');
//       const traderName = await AsyncStorage.getItem('traderName') || 'Trader';
//       const traderEmail = await AsyncStorage.getItem('traderEmail') || '';
//       const traderPhone = await AsyncStorage.getItem('traderPhone') || '';

//       // Create order on backend (optional - for verification)
//       // You might want to create an order endpoint on your backend first
//       // const orderResponse = await fetch('https://kisan.etpl.ai/api/create-order', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify({ amount: paymentAmount, traderId, purchases })
//       // });
//       // const orderData = await orderResponse.json();

//       // Razorpay options
//       const options = {
//         description: 'Purchase Order Payment',
//         image: 'https://your-logo-url.com/logo.png', // Add your logo URL
//         currency: 'INR',
//         key: RAZORPAY_KEY_ID,
//         amount: Math.round(paymentAmount * 100), // Amount in paise
//         name: 'Kisan Platform',
//         // order_id: orderData.orderId, // If you create order on backend
//         prefill: {
//           email: traderEmail,
//           contact: traderPhone,
//           name: traderName,
//         },
//         theme: { color: '#059669' },
//       };

//       // Open Razorpay
//       RazorpayCheckout.open(options)
//         .then(async (data: any) => {
//           // Payment successful
//           console.log('Payment Success:', data);
          
//           // Verify payment on backend
//           try {
//             const verifyResponse = await fetch('https://kisan.etpl.ai/api/verify-payment', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 razorpay_payment_id: data.razorpay_payment_id,
//                 razorpay_order_id: data.razorpay_order_id,
//                 razorpay_signature: data.razorpay_signature,
//                 traderId,
//                 purchases,
//                 amount: paymentAmount,
//                 grandTotal,
//               }),
//             });

//             const verifyData = await verifyResponse.json();

//             if (verifyData.success) {
//               Alert.alert(
//                 'Payment Successful!',
//                 `Payment ID: ${data.razorpay_payment_id}`,
//                 [
//                   {
//                     text: 'OK',
//                     onPress: () => {
//                       setShowPaymentModal(false);
//                       fetchPurchases(); // Refresh the list
//                       navigateToOrderHistory();
//                     },
//                   },
//                 ]
//               );
//             } else {
//               Alert.alert('Verification Failed', 'Please contact support');
//             }
//           } catch (error) {
//             console.error('Verification error:', error);
//             Alert.alert('Error', 'Payment verification failed');
//           }
//         })
//         .catch((error: any) => {
//           // Payment failed or cancelled
//           console.log('Payment Error:', error);
          
//           if (error.code === RazorpayCheckout.PAYMENT_CANCELLED) {
//             Alert.alert('Payment Cancelled', 'You cancelled the payment');
//           } else {
//             Alert.alert('Payment Failed', error.description || 'Something went wrong');
//           }
//         })
//         .finally(() => {
//           setProcessingPayment(false);
//         });
//     } catch (error) {
//       console.error('Payment initialization error:', error);
//       Alert.alert('Error', 'Failed to initialize payment');
//       setProcessingPayment(false);
//     }
//   };

//   const grandTotal = calculateGrandTotal();
//   const subtotal = purchases.reduce((s, i) => s + i.totalAmount, 0);
//   const minPayment = Math.ceil(grandTotal * 0.5);

//   if (loading) {
//     return (
//       <View className="flex-1 bg-white justify-center items-center">
//         <ActivityIndicator size="large" color="#059669" />
//         <Text className="mt-3 text-gray-500">Loading purchases...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-white">
//       <View className="p-4">
//         {/* Header */}
//         <View className="mb-6">
//           <View className="flex-row items-center mb-1">
//             <Package size={24} color="#059669" />
//             <Text className="text-2xl font-medium text-gray-900 ml-2">My Purchases</Text>
//           </View>
//           <Text className="text-gray-500">
//             Platform fee: {commissionRate}% added to all purchases
//           </Text>
//         </View>

//         {purchases.length === 0 ? (
//           <View className="bg-white border border-gray-200 rounded-xl p-10 items-center">
//             <Package size={60} color="#9CA3AF" />
//             <Text className="text-xl font-medium text-gray-900 mt-3">No purchases yet</Text>
//             <Text className="text-gray-500 mt-1">Your purchases will appear here</Text>
//           </View>
//         ) : (
//           <>
//             {/* Info Notice */}
//             <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
//               <View className="flex-row">
//                 <AlertCircle size={20} color="#2563EB" style={{ marginTop: 1 }} />
//                 <Text className="ml-3 text-blue-900">
//                   <Text className="font-medium">Create Order:</Text> Pay minimum 50% now. Amount is editable.
//                 </Text>
//               </View>
//             </View>

//             {/* Purchases Horizontal List */}
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
//               <View className="flex-row">
//                 {purchases.map((item: any) => (
//                   <View
//                     key={item._id}
//                     className="bg-white border border-gray-200 rounded-xl w-80 mr-4"
//                   >
//                     {/* Header */}
//                     <View className="bg-green-600 p-4 rounded-t-xl">
//                       <Text className="text-white font-medium text-base">{item.product.cropBriefDetails}</Text>
//                       <Text className="text-green-100 mt-1">Grade: {item.grade}</Text>
//                     </View>

//                     {/* Body */}
//                     <View className="p-5">
//                       <View className="flex-row justify-between mb-2">
//                         <Text className="text-gray-500">Quantity</Text>
//                         <Text className="text-gray-900 font-medium">
//                           {item.quantity} {item.product.unitMeasurement}
//                         </Text>
//                       </View>

//                       <View className="flex-row justify-between">
//                         <Text className="text-gray-500">Amount</Text>
//                         <Text className="text-gray-900 font-medium">
//                           ₹{item.totalAmount.toFixed(2)}
//                         </Text>
//                       </View>

//                       <View className="border-t border-gray-200 mt-3 pt-2">
//                         <Text className="text-sm text-gray-500">
//                           Date: {new Date(item.purchaseDate).toLocaleDateString('en-IN')}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             </ScrollView>

//             {/* Summary */}
//             <View className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
//               <Text className="text-xl font-medium text-gray-900 mb-4">Order Summary</Text>

//               <View className="mb-4">
//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Total Items</Text>
//                   <Text className="font-medium">{purchases.length}</Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">Subtotal</Text>
//                   <Text className="font-medium">₹{subtotal.toFixed(2)}</Text>
//                 </View>

//                 <View className="flex-row justify-between mb-2">
//                   <Text className="text-gray-600">
//                     Platform Fee ({commissionRate}%)
//                   </Text>
//                   <Text className="font-medium text-orange-600">
//                     +₹{(commissionRate * subtotal / 100).toFixed(2)}
//                   </Text>
//                 </View>
//               </View>

//               <View className="border-t border-gray-300 pt-3 flex-row justify-between">
//                 <Text className="text-lg font-medium text-gray-900">Grand Total</Text>
//                 <Text className="text-lg font-medium text-green-600">
//                   ₹{grandTotal.toFixed(2)}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 onPress={() => setShowPaymentModal(true)}
//                 className="bg-green-600 mt-5 py-4 rounded-lg flex-row justify-center items-center"
//               >
//                 <ShoppingCart size={22} color="white" />
//                 <Text className="text-white font-medium text-lg ml-2">Create Order & Pay</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         )}
//       </View>

//       {/* Payment Modal */}
//       <Modal visible={showPaymentModal} transparent animationType="slide">
//         <View className="flex-1 bg-black/50 justify-center items-center p-4">
//           <View className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6">
//             <Text className="text-2xl font-medium text-gray-900 mb-4">Create Order</Text>

//             <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
//               <Text className="text-blue-900">
//                 Total Items: {purchases.length} • Pay minimum 50% now
//               </Text>
//             </View>

//             <View className="flex-row justify-between mb-4">
//               <View>
//                 <Text className="text-gray-500 text-sm">Total</Text>
//                 <Text className="text-gray-900 font-medium">₹{grandTotal.toFixed(2)}</Text>
//               </View>

//               <View>
//                 <Text className="text-gray-500 text-sm">Minimum</Text>
//                 <Text className="text-orange-600 font-medium">₹{minPayment.toFixed(2)}</Text>
//               </View>
//             </View>

//             <Text className="text-sm text-gray-700 mb-1">Payment Amount</Text>

//             <View className="border border-gray-300 rounded-lg px-3 flex-row items-center">
//               <Text className="text-gray-500 mr-2">₹</Text>
//               <TextInput
//                 value={paymentAmount.toString()}
//                 keyboardType="decimal-pad"
//                 onChangeText={(t) => setPaymentAmount(parseFloat(t) || 0)}
//                 className="flex-1 py-3 text-lg font-medium"
//               />
//             </View>

//             <Text className="text-xs text-gray-500 mt-1">
//               Min: ₹{minPayment.toFixed(2)} | Max: ₹{grandTotal.toFixed(2)}
//             </Text>

//             <View className="flex-row gap-3 mt-6">
//               <TouchableOpacity
//                 onPress={() => setShowPaymentModal(false)}
//                 disabled={processingPayment}
//                 className="flex-1 border border-gray-300 py-3 rounded-lg"
//               >
//                 <Text className="text-center text-gray-700 font-medium">Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={handlePayment}
//                 disabled={processingPayment}
//                 className={`flex-1 py-3 rounded-lg flex-row justify-center items-center ${
//                   processingPayment ? 'bg-gray-400' : 'bg-green-600'
//                 }`}
//               >
//                 {processingPayment ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <>
//                     <CreditCard size={20} color="white" />
//                     <Text className="text-white font-medium ml-2">
//                       Pay ₹{paymentAmount.toFixed(2)}
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// export default TraderOrders;




import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import {
  CreditCard,
  Package,
  AlertCircle,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react-native';

interface Product {
  cropBriefDetails: string;
  unitMeasurement: string;
  productId: string;
  categoryId: { categoryName: string };
  subCategoryId: { subCategoryName: string };
  cropPhotos: string[];
  farmerId: string;
}

interface Purchase {
  _id: string;
  product: Product;
  grade: string;
  quantity: number;
  gradeId: string;
  deliveryDate: string;
  totalAmount: number;
  purchaseDate: string;
  paymentStatus: string;
  paidAmount?: number;
  remainingAmount?: number;
  quantityType?: 'bulk' | 'custom';
    gradePhotos?: string[];  
}

interface Commission {
  _id: string;
  role: string;
  commissionPercentage: number;
}

const TraderOrders: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commissionRate, setCommissionRate] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchCommission();
    fetchPurchases();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPurchases();
    setRefreshing(false);
  };

  const fetchCommission = async () => {
    try {
      const response = await fetch('https://kisan.etpl.ai/api/commission/all');
      const data = await response.json();
      const traderCommission = data.find(
        (c: Commission) => c.role.toLowerCase() === 'trader'
      );
      if (traderCommission) {
        setCommissionRate(traderCommission.commissionPercentage);
      }
    } catch (error) {
      console.error('Error fetching commission:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const traderId = await AsyncStorage.getItem('traderId');
      console.log('Fetching purchases for traderId:', traderId);
      const response = await fetch(
        `https://kisan.etpl.ai/product/trader-purchases/${traderId}`
      );
      const data = await response.json();
      console.log('Purchases fetched:', data);
      const purchasesList = data.data || [];
      setPurchases(purchasesList);
      const total = calculateGrandTotal(purchasesList);
      const minPayment = Math.ceil(total * 0.5);
      setPaymentAmount(minPayment);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCommission = (amount: number) => {
    return (amount * commissionRate) / 100;
  };

  const calculateTotalWithCommission = (amount: number) => {
    return amount + calculateCommission(amount);
  };

  const updateQuantity = async (
    purchaseId: string,
    productId: string,
    gradeId: string,
    currentQty: number,
    change: number
  ) => {
    const newQuantity = currentQty + change;
    if (newQuantity <= 0) {
      Alert.alert('Error', 'Quantity must be at least 1');
      return;
    }

    try {
      const response = await fetch(
        'https://kisan.etpl.ai/product/purchase/update-quantity',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            gradeId,
            purchaseId,
            newQuantity,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchPurchases();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const removePurchase = async (
    purchaseId: string,
    productId: string,
    gradeId: string
  ) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                'https://kisan.etpl.ai/product/purchase/remove',
                {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ productId, gradeId, purchaseId }),
                }
              );
              const data = await response.json();
              if (data.success) {
                fetchPurchases();
              } else {
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              console.error('Error removing purchase:', error);
              Alert.alert('Error', 'Failed to remove purchase');
            }
          },
        },
      ]
    );
  };

  const calculateGrandTotal = (purchasesList: Purchase[] = purchases) => {
    const subtotal = purchasesList.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    return calculateTotalWithCommission(subtotal);
  };

  const openPaymentModal = () => {
    if (purchases.length === 0) {
      Alert.alert('Error', 'No purchases to create order!');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleCreateOrder = async () => {
    if (purchases.length === 0) {
      Alert.alert('Error', 'No purchases available!');
      return;
    }

    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = (await AsyncStorage.getItem('traderName')) || 'Trader';
    const traderMobile = (await AsyncStorage.getItem('traderMobile')) || '';
    const traderEmail = (await AsyncStorage.getItem('traderEmail')) || '';

    const totalAmount = calculateGrandTotal();
    const minPayment = Math.ceil(totalAmount * 0.5);

    if (paymentAmount < minPayment || paymentAmount > totalAmount) {
      Alert.alert(
        'Invalid Amount',
        `Payment amount must be between ₹${minPayment.toFixed(
          2
        )} and ₹${totalAmount.toFixed(2)}`
      );
      return;
    }

    try {
      // Create Razorpay order
      const orderRes = await fetch(
        'https://kisan.etpl.ai/api/payment/create-razorpay-order',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: paymentAmount,
            currency: 'INR',
            receipt: `ORDER_${traderId}_${Date.now()}`,
          }),
        }
      );

      const orderData = await orderRes.json();
      if (!orderData.success) {
        Alert.alert('Error', 'Failed to create payment order');
        return;
      }

      // Razorpay options for React Native
      const options = {
        description: `Order for ${purchases.length} items`,
        image: 'https://your-logo-url.com/logo.png', // Replace with your logo
        currency: orderData.data.currency,
        key: 'rzp_test_qUmhUFElBiSNIs', // Replace with your Razorpay key
        amount: orderData.data.amount,
        name: 'Farmer Marketplace',
        order_id: orderData.data.id,
        prefill: {
          email: traderEmail,
          contact: traderMobile,
          name: traderName,
        },
        theme: { color: '#198754' },
      };

      // Open Razorpay
      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // Payment success - Create order
          try {
            const cartItems = purchases.map((purchase) => ({
              productId: purchase.product.productId,
              farmerId: purchase.product.farmerId,
              grade: purchase.grade,
              deliveryDate: purchase.deliveryDate,
              quantity: purchase.quantity,
              pricePerUnit: purchase.totalAmount / purchase.quantity,
            }));

            const createOrderRes = await fetch(
              'https://kisan.etpl.ai/api/orders/create',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  traderId,
                  traderName,
                  traderMobile,
                  traderEmail,
                  cartItems,
                  totalAmount,
                  paidAmount: paymentAmount,
                  razorpayPaymentId: data.razorpay_payment_id,
                  razorpayOrderId: data.razorpay_order_id,
                  razorpaySignature: data.razorpay_signature,
                }),
              }
            );

            const orderResult = await createOrderRes.json();
            if (orderResult.success) {
              Alert.alert(
                'Success',
                `Order created successfully! Order ID: ${orderResult.data.orderId}`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setShowPaymentModal(false);
                      fetchPurchases();
                    },
                  },
                ]
              );
            } else {
              Alert.alert('Error', 'Order creation failed: ' + orderResult.message);
            }
          } catch (err) {
            console.error('Error creating order:', err);
            Alert.alert('Error', 'Failed to create order');
          }
        })
        .catch((error: any) => {
          // Payment failed or cancelled
          console.error('Payment error:', error);
          Alert.alert('Payment Failed', error.description || 'Payment was cancelled');
        });
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to initiate payment');
    }
  };

  const grandTotal = calculateGrandTotal();
  const minPayment = Math.ceil(grandTotal * 0.5);
  const subtotal = purchases.reduce((sum, item) => sum + item.totalAmount, 0);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#198754" />
        <Text className="mt-4 text-gray-600 text-base">Loading purchases...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-6 px-4">
        <View className="flex-row items-center mb-2">
          <ShoppingCart color="white" size={28} />
          <Text className="text-white text-2xl font-bold ml-3">Order History</Text>
        </View>
        <Text className="text-green-100 text-base">My Purchases</Text>
        <Text className="text-green-200 text-sm mt-1">
          Platform fee: {commissionRate}% added to all purchases
        </Text>
      </View>

      {purchases.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Package color="#9CA3AF" size={64} />
          <Text className="text-gray-500 text-xl font-semibold mt-4">
            No purchases yet
          </Text>
          <Text className="text-gray-400 text-base mt-2">
            Your purchases will appear here
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Info Alert */}
            <View className="bg-blue-50 border border-blue-200 rounded-lg mx-4 mt-4 p-4 flex-row">
              <AlertCircle color="#3B82F6" size={20} />
              <Text className="text-blue-800 text-sm ml-3 flex-1">
                Create Order: Pay minimum 50% now to create order for all purchases.
                Payment amount is editable.
              </Text>
            </View>

            {/* Purchases List */}
            <View className="px-4 py-4">
              {purchases.map((item) => (
                <View
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border border-gray-200"
                >
                  <View className="flex-row p-4">
                    {/* Product Image */}
                    {/* <Image
                      source={{
                        uri:
                          item.product.cropPhotos?.[0] ||
                          'https://via.placeholder.com/80',
                      }}
                      className="w-20 h-20 rounded-lg"
                    /> */}

                    {/* Product Image - REPLACE THIS SECTION */}
<Image
  source={{
    uri:
      item.gradePhotos?.[0] 
        ? `https://kisan.etpl.ai/${item.gradePhotos[0]}`
        : item.product.cropPhotos?.[0]
        ? `https://kisan.etpl.ai/${item.product.cropPhotos[0]}`
        : 'https://via.placeholder.com/80',
  }}
  className="w-20 h-20 rounded-lg"
/>

                    {/* Product Details */}
                    <View className="flex-1 ml-4">
                      <Text className="text-gray-900 text-base font-semibold">
                        {item.product.cropBriefDetails}
                      </Text>
                      <Text className="text-gray-600 text-sm mt-1">
                        Grade: {item.grade}
                      </Text>

                      {/* Quantity Controls */}
                      <View className="mt-3">
                        <Text className="text-gray-700 text-sm font-medium mb-2">
                          Quantity:
                        </Text>
                        {item.quantityType === 'bulk' ? (
                          <View className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                            <Text className="text-orange-800 font-semibold text-sm">
                              BULK
                            </Text>
                            <Text className="text-orange-700 text-sm">
                              {item.quantity} {item.product.unitMeasurement}
                            </Text>
                          </View>
                        ) : (
                          <View className="flex-row items-center">
                            <TouchableOpacity
                              onPress={() =>
                                updateQuantity(
                                  item._id,
                                  item.product.productId,
                                  item.gradeId,
                                  item.quantity,
                                  -1
                                )
                              }
                              className="bg-gray-200 rounded-lg p-2"
                            >
                              <Minus color="#374151" size={16} />
                            </TouchableOpacity>
                            <Text className="mx-4 text-gray-900 font-semibold text-base">
                              {item.quantity} {item.product.unitMeasurement}
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                updateQuantity(
                                  item._id,
                                  item.product.productId,
                                  item.gradeId,
                                  item.quantity,
                                  1
                                )
                              }
                              className="bg-green-600 rounded-lg p-2"
                            >
                              <Plus color="white" size={16} />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      {/* Bulk Info Text */}
                      {item.quantityType === 'bulk' && (
                        <View className="mt-2 bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                          <Text className="text-yellow-800 text-xs">
                            ⚠️ Bulk purchase - quantity cannot be modified
                          </Text>
                        </View>
                      )}

                      {/* Amount */}
                      {/* <View className="mt-3">
                        <Text className="text-green-600 font-bold text-lg">
                          ₹{item.totalAmount.toFixed(2)}
                        </Text>
                      </View> */}
                      {/* Amount - REPLACE THIS SECTION */}
<View className="mt-3">
  <Text className="text-gray-600 text-xs">
    ₹{item.pricePerUnit?.toFixed(2) || (item.totalAmount / item.quantity).toFixed(2)}/{item.product.unitMeasurement}
  </Text>
  <Text className="text-green-600 font-bold text-lg">
    Total: ₹{item.totalAmount.toFixed(2)}
  </Text>
</View>

                      {/* Date */}
                      <Text className="text-gray-500 text-xs mt-1">
                        Date:{' '}
                        {new Date(item.purchaseDate).toLocaleDateString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  {/* Remove Button */}
                  <TouchableOpacity
                    onPress={() =>
                      removePurchase(item._id, item.product._id, item.gradeId)
                    }
                    className="bg-red-600 py-3 flex-row justify-center items-center"
                  >
                    <Trash2 color="white" size={16} />
                    <Text className="text-white font-semibold ml-2">
                      Remove from Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Summary and Create Order */}
          <View className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
            <Text className="text-gray-900 text-lg font-bold mb-3">
              Order Summary
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Total Items:</Text>
                <Text className="text-gray-900 font-semibold">
                  {purchases.length}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Subtotal:</Text>
                <Text className="text-gray-900 font-semibold">
                  ₹{subtotal.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">
                  Platform Fee ({commissionRate}%):
                </Text>
                <Text className="text-green-600 font-semibold">
                  +₹{calculateCommission(subtotal).toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between border-t border-gray-200 pt-2 mt-2">
                <Text className="text-gray-900 font-bold text-lg">Grand Total:</Text>
                <Text className="text-green-600 font-bold text-xl">
                  ₹{grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={openPaymentModal}
              className="bg-green-600 rounded-lg py-4 mt-4 flex-row justify-center items-center"
            >
              <CreditCard color="white" size={20} />
              <Text className="text-white font-bold text-base ml-2">
                Create Order & Pay
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-gray-900 text-2xl font-bold mb-4">
              Create Order
            </Text>
            
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <Text className="text-blue-800 text-sm">
                Total Items: {purchases.length}
              </Text>
              <Text className="text-blue-700 text-xs mt-1">
                Pay minimum 50% now, rest can be paid later.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Total Amount</Text>
              <Text className="text-gray-900 text-3xl font-bold">
                ₹{grandTotal.toFixed(2)}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Minimum (50%)
              </Text>
              <Text className="text-green-600 text-xl font-bold">
                ₹{minPayment.toFixed(2)}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Payment Amount (Editable)
              </Text>
              <View className="border-2 border-green-600 rounded-lg px-4 py-3">
                <TextInput
                  value={paymentAmount.toString()}
                  onChangeText={(text) =>
                    setPaymentAmount(parseFloat(text) || 0)
                  }
                  keyboardType="decimal-pad"
                  className="text-gray-900 font-bold text-xl"
                  placeholder="Enter amount"
                />
              </View>
              <Text className="text-gray-500 text-xs mt-2">
                Min: ₹{minPayment.toFixed(2)} | Max: ₹{grandTotal.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-200 rounded-lg py-4"
              >
                <Text className="text-gray-700 text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateOrder}
                disabled={paymentAmount < minPayment || paymentAmount > grandTotal}
                className={`flex-1 rounded-lg py-4 flex-row justify-center items-center ${
                  paymentAmount < minPayment || paymentAmount > grandTotal
                    ? 'bg-gray-400'
                    : 'bg-green-600'
                }`}
              >
                <CreditCard color="white" size={20} />
                <Text className="text-white font-bold ml-2">
                  Pay ₹{paymentAmount.toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TraderOrders;