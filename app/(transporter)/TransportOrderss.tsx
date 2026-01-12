// import { AlertCircle, Calendar, CheckCircle, Clock, MapPin, Package, Truck, XCircle } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Modal,
//   RefreshControl,
//   ScrollView,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// interface MarketDetails {
//   marketName: string;
//   pincode: string;
//   postOffice?: string;
//   district?: string;
//   state?: string;
//   exactAddress: string;
//   landmark?: string;
// }

// interface ProductItem {
//   productId: string;
//   productName: string;
//   grade: string;
//   quantity: number;
//   deliveryDate: string;
//   nearestMarket: string;
//   marketDetails: MarketDetails | null;
// }

// interface TransporterDetails {
//   transporterId: string;
//   transporterName: string;
//   transporterMobile?: string;
//   vehicleType: string;
//   vehicleNumber: string;
//   vehicleCapacity?: string;
//   driverName?: string;
//   driverMobile?: string;
//   acceptedAt: string;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderName: string;
//   farmerName: string;
//   productItems: ProductItem[];
//   orderStatus: string;
//   transporterStatus?: string;
//   transporterDetails?: TransporterDetails;
//   createdAt: string;
// }

// const TransporterOrders: React.FC = () => {
//   const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
//   const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [activeTab, setActiveTab] = useState<'available' | 'accepted'>('available');
//   const [showAcceptModal, setShowAcceptModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [transporterDetails, setTransporterDetails] = useState({
//     vehicleType: '',
//     vehicleNumber: '',
//     vehicleCapacity: '',
//     driverName: '',
//     driverMobile: '',
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const transporterId = 'tran-01';

//       const availableResponse = await fetch('https://kisan.etpl.ai/api/transporter/eligible-orders');
//       const availableData = await availableResponse.json();

//       const acceptedResponse = await fetch(`https://kisan.etpl.ai/api/transporter/${transporterId}/orders`);
//       const acceptedData = await acceptedResponse.json();

//       if (availableData.success) {
//         setAvailableOrders(availableData.data);
//       }

//       if (acceptedData.success) {
//         setAcceptedOrders(acceptedData.data);
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       Alert.alert('Error', 'Failed to fetch orders');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchOrders();
//   };

//   const handleAcceptClick = (order: Order) => {
//     setSelectedOrder(order);
//     setShowAcceptModal(true);
//   };

//   const handleAcceptOrder = async () => {
//     if (!selectedOrder) return;

//     const transporterId = 'tran-01';
//     const transporterName = 'Transporter';
//     const transporterMobile = '';
//     const transporterEmail = '';

//     if (!transporterDetails.vehicleType || !transporterDetails.vehicleNumber) {
//       Alert.alert('Required Fields', 'Please fill in vehicle type and number');
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://kisan.etpl.ai/api/transporter/${selectedOrder.orderId}/accept`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             transporterId,
//             transporterName,
//             transporterMobile,
//             transporterEmail,
//             ...transporterDetails,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         Alert.alert('Success', 'Order accepted successfully!');
//         setShowAcceptModal(false);
//         setSelectedOrder(null);
//         setTransporterDetails({
//           vehicleType: '',
//           vehicleNumber: '',
//           vehicleCapacity: '',
//           driverName: '',
//           driverMobile: '',
//         });
//         fetchOrders();
//         setActiveTab('accepted');
//       } else {
//         Alert.alert('Error', 'Failed to accept order: ' + data.message);
//       }
//     } catch (error) {
//       console.error('Error accepting order:', error);
//       Alert.alert('Error', 'Failed to accept order');
//     }
//   };

//   const handleRejectOrder = async (orderId: string) => {
//     Alert.alert(
//       'Confirm Rejection',
//       'Are you sure you want to reject this order?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Reject',
//           style: 'destructive',
//           onPress: async () => {
//             const transporterId = 'tran-01';

//             try {
//               const response = await fetch(
//                 `https://kisan.etpl.ai/api/transporter/${orderId}/reject`,
//                 {
//                   method: 'POST',
//                   headers: { 'Content-Type': 'application/json' },
//                   body: JSON.stringify({ transporterId }),
//                 }
//               );

//               const data = await response.json();

//               if (data.success) {
//                 Alert.alert('Success', 'Order rejected');
//                 fetchOrders();
//               } else {
//                 Alert.alert('Error', 'Failed to reject order: ' + data.message);
//               }
//             } catch (error) {
//               console.error('Error rejecting order:', error);
//               Alert.alert('Error', 'Failed to reject order');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const renderOrderCard = (order: Order, showActions: boolean = true) => (
//     <View key={order._id} className="bg-white rounded-2xl p-5 mb-4 border border-slate-100 shadow-sm mx-4">
//       {/* Order Header */}
//       <View className="flex-row justify-between items-start mb-4">
//         <View>
//           <Text className="text-slate-900 text-lg font-medium">Order #{order.orderId}</Text>
//           <Text className="text-slate-500 text-xs mt-1">
//              Farmer: {order.farmerName}
//           </Text>
//         </View>
//         <View className={`px-3 py-1.5 rounded-full ${
//             order.orderStatus === 'Accepted' ? 'bg-emerald-100' : 'bg-blue-100'
//         }`}>
//           <Text className={`text-xs font-medium ${
//              order.orderStatus === 'Accepted' ? 'text-emerald-700' : 'text-blue-700'
//           }`}>{order.orderStatus}</Text>
//         </View>
//       </View>

//       {/* Product Items */}
//       <View>
//         {order.productItems.map((item, index) => (
//           <View key={index} className="bg-slate-50 rounded-xl p-4 mb-3 border border-slate-100">
//             {/* Product Info */}
//             <View className="mb-4">
//               <Text className="text-slate-900 text-base font-medium mb-3">{item.productName}</Text>
              
//               <View className="flex-row items-center mb-2">
//                 <Package size={14} color="#64748b" />
//                 <Text className="text-slate-500 text-sm ml-2 mr-1">Grade:</Text>
//                 <Text className="text-slate-900 text-sm font-medium">{item.grade}</Text>
//               </View>
              
//               <View className="flex-row items-center mb-2">
//                 <Truck size={14} color="#64748b" />
//                 <Text className="text-slate-500 text-sm ml-2 mr-1">Quantity:</Text>
//                 <Text className="text-slate-900 text-sm font-medium">{item.quantity}</Text>
//               </View>
              
//               <View className="flex-row items-center">
//                 <Calendar size={14} color="#64748b" />
//                 <Text className="text-slate-500 text-sm ml-2 mr-1">Delivery:</Text>
//                 <Text className="text-emerald-600 text-sm font-medium">
//                   {new Date(item.deliveryDate).toLocaleDateString('en-IN')}
//                 </Text>
//               </View>
//             </View>

//             {/* Separator */}
//             <View className="h-px bg-slate-200 mb-4" />

//             {/* Market Info */}
//             <View>
//               <View className="flex-row items-center mb-2">
//                 <MapPin size={16} color="#3b82f6" />
//                 <Text className="text-slate-900 font-medium text-sm ml-2">Delivery Location</Text>
//               </View>
//               {item.marketDetails ? (
//                 <View className="ml-6">
//                   <Text className="text-blue-600 font-medium text-sm mb-1">{item.marketDetails.marketName}</Text>
//                   <Text className="text-slate-500 text-xs mb-1">{item.marketDetails.exactAddress}</Text>
//                   <Text className="text-slate-500 text-xs">
//                     {item.marketDetails.district}, {item.marketDetails.state} - {item.marketDetails.pincode}
//                   </Text>
//                 </View>
//               ) : (
//                 <Text className="text-slate-500 text-sm ml-6">{item.nearestMarket}</Text>
//               )}
//             </View>
//           </View>
//         ))}

//         {/* Transport Details */}
//         {!showActions && order.transporterDetails && (
//           <View className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mt-2">
//             <View className="flex-row items-center mb-3">
//               <Truck size={16} color="#059669" />
//               <Text className="text-emerald-900 font-medium text-sm ml-2">Transport Details</Text>
//             </View>
//             <View className="space-y-2">
//                 <View className="flex-row justify-between">
//                     <Text className="text-slate-500 text-xs">Vehicle</Text>
//                     <Text className="text-slate-900 text-xs font-medium">{order.transporterDetails.vehicleType} ({order.transporterDetails.vehicleNumber})</Text>
//                 </View>
//                 {order.transporterDetails.driverName && (
//                      <View className="flex-row justify-between">
//                         <Text className="text-slate-500 text-xs">Driver</Text>
//                         <Text className="text-slate-900 text-xs font-medium">{order.transporterDetails.driverName}</Text>
//                     </View>
//                 )}
//                  <View className="flex-row justify-between pt-2 border-t border-emerald-200">
//                     <Text className="text-emerald-700 text-xs">Accepted At</Text>
//                     <Text className="text-emerald-700 text-xs font-medium">{new Date(order.transporterDetails.acceptedAt).toLocaleString('en-IN')}</Text>
//                 </View>
//             </View>
//           </View>
//         )}

//         {/* Action Buttons */}
//         {showActions && (
//           <View className="flex-row space-x-3 mt-4">
//             <TouchableOpacity
//               className="flex-1 bg-slate-900 py-3 rounded-xl flex-row items-center justify-center active:bg-slate-800"
//               onPress={() => handleAcceptClick(order)}
//             >
//               <CheckCircle size={18} color="#fff" />
//               <Text className="text-white font-medium ml-2 text-sm">Accept Order</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="w-12 bg-red-50 rounded-xl items-center justify-center active:bg-red-100 border border-red-100"
//               onPress={() => handleRejectOrder(order.orderId)}
//             >
//               <XCircle size={20} color="#ef4444" />
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   if (loading && !refreshing) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color="#3b82f6" />
//         <Text className="text-slate-500 mt-4 font-medium">Loading orders...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       {/* Header */}
//       <View className="px-5 pt-4 pb-2">
//         <Text className="text-slate-900 text-2xl font-medium mb-1">Transporter Dashboard</Text>
//         <Text className="text-slate-500 text-sm mb-6">Manage your transport orders</Text>
        
//         {/* Tabs */}
//         <View className="flex-row bg-slate-100 p-1 rounded-xl mb-6">
//           <TouchableOpacity
//             className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
//                 activeTab === 'available' ? 'bg-white shadow-sm' : ''
//             }`}
//             onPress={() => setActiveTab('available')}
//           >
//              <Clock size={16} color={activeTab === 'available' ? '#3b82f6' : '#64748b'} />
//             <Text className={`ml-2 text-sm font-medium ${
//                 activeTab === 'available' ? 'text-slate-900' : 'text-slate-500'
//             }`}>
//               Available ({availableOrders.length})
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
//                 activeTab === 'accepted' ? 'bg-white shadow-sm' : ''
//             }`}
//             onPress={() => setActiveTab('accepted')}
//           >
//             <CheckCircle size={16} color={activeTab === 'accepted' ? '#10b981' : '#64748b'} />
//             <Text className={`ml-2 text-sm font-medium ${
//                 activeTab === 'accepted' ? 'text-slate-900' : 'text-slate-500'
//             }`}>
//               My Orders ({acceptedOrders.length})
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView
//         className="flex-1 bg-slate-50 pt-4"
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         contentContainerClassName="pb-20"
//       >
//         {activeTab === 'available' && (
//           <>
//             {availableOrders.length === 0 ? (
//               <View className="items-center justify-center py-20 px-8">
//                 <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
//                      <Package size={32} color="#94a3b8" />
//                 </View>
//                 <Text className="text-slate-900 text-lg font-medium mb-2">No available orders</Text>
//                 <Text className="text-slate-500 text-center text-sm">Check back later for new delivery requests from farmers.</Text>
//               </View>
//             ) : (
//                 availableOrders.map((order) => renderOrderCard(order, true))
//             )}
//           </>
//         )}

//         {activeTab === 'accepted' && (
//           <>
//             {acceptedOrders.length === 0 ? (
//               <View className="items-center justify-center py-20 px-8">
//                  <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
//                      <Truck size={32} color="#94a3b8" />
//                 </View>
//                 <Text className="text-slate-900 text-lg font-medium mb-2">No accepted orders yet</Text>
//                 <Text className="text-slate-500 text-center text-sm">Accept orders from the available tab to see your active deliveries here.</Text>
//               </View>
//             ) : (
//                 acceptedOrders.map((order) => renderOrderCard(order, false))
//             )}
//           </>
//         )}
//       </ScrollView>

//       {/* Accept Modal */}
//       <Modal
//         visible={showAcceptModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowAcceptModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center p-5">
//           <View className="bg-white rounded-3xl w-full max-h-[80%] overflow-hidden shadow-2xl">
//             {/* Modal Header */}
//             <View className="px-6 py-5 border-b border-slate-100 flex-row justify-between items-center bg-slate-50/50">
//               <View>
//                  <Text className="text-slate-900 text-lg font-medium">Accept Order</Text>
//                  <Text className="text-slate-500 text-xs">#{selectedOrder?.orderId}</Text>
//               </View>
//                <TouchableOpacity 
//                  onPress={() => setShowAcceptModal(false)}
//                  className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
//                >
//                  <XCircle size={20} color="#64748b" />
//                </TouchableOpacity>
//             </View>

//             <ScrollView className="p-6">
//               <View className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex-row items-start">
//                 <AlertCircle size={20} color="#3b82f6" className="mt-0.5" />
//                 <Text className="text-blue-800 text-sm ml-3 flex-1">
//                   Please provide your vehicle and driver details to confirm this acceptance.
//                 </Text>
//               </View>

//               <View className="space-y-4">
//                 <View>
//                     <Text className="text-slate-700 font-medium text-sm mb-2">Vehicle Type</Text>
//                     <TextInput
//                         className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
//                         value={transporterDetails.vehicleType}
//                         onChangeText={(text) =>
//                             setTransporterDetails({ ...transporterDetails, vehicleType: text })
//                         }
//                         placeholder="e.g., Truck, Van"
//                         placeholderTextColor="#94a3b8"
//                     />
//                 </View>

//                 <View>
//                     <Text className="text-slate-700 font-medium text-sm mb-2">Vehicle Number</Text>
//                     <TextInput
//                         className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
//                         value={transporterDetails.vehicleNumber}
//                         onChangeText={(text) =>
//                             setTransporterDetails({ ...transporterDetails, vehicleNumber: text })
//                         }
//                         placeholder="e.g., KA01AB1234"
//                         placeholderTextColor="#94a3b8"
//                     />
//                 </View>

//                  <View>
//                     <Text className="text-slate-700 font-medium text-sm mb-2">Capacity</Text>
//                     <TextInput
//                         className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
//                         value={transporterDetails.vehicleCapacity}
//                         onChangeText={(text) =>
//                             setTransporterDetails({ ...transporterDetails, vehicleCapacity: text })
//                         }
//                         placeholder="e.g., 5 tons"
//                         placeholderTextColor="#94a3b8"
//                     />
//                 </View>

//                 <View>
//                     <Text className="text-slate-700 font-medium text-sm mb-2">Driver Name</Text>
//                     <TextInput
//                         className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
//                         value={transporterDetails.driverName}
//                         onChangeText={(text) =>
//                             setTransporterDetails({ ...transporterDetails, driverName: text })
//                         }
//                         placeholder="Driver's full name"
//                         placeholderTextColor="#94a3b8"
//                     />
//                 </View>

//                 <View className="mb-4">
//                     <Text className="text-slate-700 font-medium text-sm mb-2">Driver Mobile</Text>
//                     <TextInput
//                         className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
//                         value={transporterDetails.driverMobile}
//                         onChangeText={(text) =>
//                             setTransporterDetails({ ...transporterDetails, driverMobile: text })
//                         }
//                         placeholder="10-digit mobile number"
//                         keyboardType="phone-pad"
//                         placeholderTextColor="#94a3b8"
//                     />
//                 </View>

//                 <TouchableOpacity
//                   className="bg-slate-900 py-4 rounded-xl flex-row items-center justify-center active:bg-slate-800 shadow-lg shadow-slate-200"
//                   onPress={handleAcceptOrder}
//                 >
//                   <CheckCircle size={20} color="#fff" />
//                   <Text className="text-white font-medium ml-2">Confirm Acceptance</Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default TransporterOrders;





import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Truck, Package, MapPin, Calendar, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MarketDetails {
  marketName: string;
  pincode: string;
  postOffice?: string;
  district?: string;
  state?: string;
  exactAddress: string;
  landmark?: string;
}

interface ProductItem {
  productId: string;
  productName: string;
  grade: string;
  quantity: number;
  deliveryDate: string;
  nearestMarket: string;
  marketDetails: MarketDetails | null;
}

interface TransporterDetails {
  transporterId: string;
  transporterName: string;
  transporterMobile?: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleCapacity?: string;
  driverName?: string;
  driverMobile?: string;
  acceptedAt: string;
}

interface Order {
  _id: string;
  orderId: string;
  traderName: string;
  farmerName: string;
  productItems: ProductItem[];
  orderStatus: string;
  transporterStatus?: string;
  transporterDetails?: TransporterDetails;
  createdAt: string;
}

interface Market {
  _id: string;
  marketId: string;
  marketName: string;
  pincode: string;
  postOffice?: string;
  district?: string;
  state?: string;
  exactAddress: string;
  landmark?: string;
}

const TransporterOrders: React.FC = () => {
  
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
  const [markets, setMarkets] = useState<MarketDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'available' | 'accepted'>('available');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [transporterDetails, setTransporterDetails] = useState({
    vehicleType: '',
    vehicleNumber: '',
    vehicleCapacity: '',
    driverName: '',
    driverMobile: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//     const transporterId= await AsyncStorage.getItem('transporterId');
//  console.log('Transporter ID for rejection:', transporterId);
//       // Fetch all markets
//       const marketsResponse = await fetch('https://kisan.etpl.ai/api/market/all');
//       const marketsData = await marketsResponse.json();

//       if (marketsData.success) {
//         setMarkets(marketsData.data);
//       }

//       const availableResponse = await fetch('https://kisan.etpl.ai/api/transporter/eligible-orders');
//       const availableData = await availableResponse.json();

//       const acceptedResponse = await fetch(`https://kisan.etpl.ai/api/transporter/${transporterId}/orders`);
//       const acceptedData = await acceptedResponse.json();

//       if (availableData.success) {
//         const ordersWithMarkets = availableData.data.map((order: Order) => ({
//           ...order,
//           productItems: order.productItems.map((item: ProductItem) => ({
//             ...item,
//             marketDetails: getMarketDetails(item.nearestMarket, marketsData.data)
//           }))
//         }));
//         setAvailableOrders(ordersWithMarkets);
//       }

//       if (acceptedData.success) {
//         const ordersWithMarkets = acceptedData.data.map((order: Order) => ({
//           ...order,
//           productItems: order.productItems.map((item: ProductItem) => ({
//             ...item,
//             marketDetails: getMarketDetails(item.nearestMarket, marketsData.data)
//           }))
//         }));
//         setAcceptedOrders(ordersWithMarkets);
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       Alert.alert('Error', 'Failed to fetch orders');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };


const fetchOrders = async () => {
  try {
    setLoading(true);
    const transporterId = await AsyncStorage.getItem('transporterId');
    console.log('Transporter ID for rejection:', transporterId);

    // Initialize markets data with empty array as fallback
    let marketsDataArray: Market[] = [];

    // Fetch all markets with error handling
    try {
      const marketsResponse = await fetch('https://kisan.etpl.ai/api/market/all');
      const marketsData = await marketsResponse.json();

      if (marketsData.success && Array.isArray(marketsData.data)) {
        setMarkets(marketsData.data);
        marketsDataArray = marketsData.data;
      }
    } catch (marketError) {
      console.error('Error fetching markets:', marketError);
      // Continue execution with empty markets array
    }

    // Fetch available orders
    const availableResponse = await fetch('https://kisan.etpl.ai/api/transporter/eligible-orders');
    const availableData = await availableResponse.json();

    // Fetch accepted orders
    const acceptedResponse = await fetch(`https://kisan.etpl.ai/api/transporter/${transporterId}/orders`);
    const acceptedData = await acceptedResponse.json();

    // Process available orders
    if (availableData.success && Array.isArray(availableData.data)) {
      const ordersWithMarkets = availableData.data.map((order: Order) => ({
        ...order,
        productItems: Array.isArray(order.productItems) 
          ? order.productItems.map((item: ProductItem) => ({
              ...item,
              marketDetails: getMarketDetails(item.nearestMarket, marketsDataArray)
            }))
          : []
      }));
      setAvailableOrders(ordersWithMarkets);
    } else {
      setAvailableOrders([]);
    }
console.log('Accepted Data:', acceptedData);
    // Process accepted orders
    if (acceptedData.success && Array.isArray(acceptedData.data)) {
      const ordersWithMarkets = acceptedData.data.map((order: Order) => ({
        ...order,
        productItems: Array.isArray(order.productItems)
          ? order.productItems.map((item: ProductItem) => ({
              ...item,
              marketDetails: getMarketDetails(item.nearestMarket, marketsDataArray)
            }))
          : []
      }));
      setAcceptedOrders(ordersWithMarkets);
    } else {
      setAcceptedOrders([]);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    Alert.alert('Error', 'Failed to fetch orders. Please try again.');
    // Set empty arrays on error
    setAvailableOrders([]);
    setAcceptedOrders([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

const getMarketDetails = (marketId: string, marketsData: Market[]): MarketDetails | null => {
  // Handle null/undefined marketId
  if (!marketId) return null;
  
  // Handle null/undefined marketsData array
  if (!Array.isArray(marketsData) || marketsData.length === 0) return null;
  
  const market = marketsData.find((m: Market) => m._id === marketId || m.marketId === marketId);
  
  if (market) {
    return {
      marketName: market.marketName || 'Unknown Market',
      pincode: market.pincode || '',
      postOffice: market.postOffice,
      district: market.district,
      state: market.state,
      exactAddress: market.exactAddress || '',
      landmark: market.landmark
    };
  }
  return null;
};


  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleAcceptClick = (order: Order) => {
    setSelectedOrder(order);
    setShowAcceptModal(true);
  };

  const handleAcceptOrder = async () => {
    if (!selectedOrder) return;
    const transporterId= await AsyncStorage.getItem('transporterId');
    //const transporterId = 'tran-01';
    const transporterName = 'Transporter';
    const transporterMobile = '';
    const transporterEmail = '';

    if (!transporterDetails.vehicleType || !transporterDetails.vehicleNumber) {
      Alert.alert('Required Fields', 'Please fill in vehicle type and number');
      return;
    }

    try {
      const response = await fetch(
        `https://kisan.etpl.ai/api/transporter/${selectedOrder.orderId}/accept`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transporterId,
            transporterName,
            transporterMobile,
            transporterEmail,
            ...transporterDetails,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Order accepted successfully!');
        setShowAcceptModal(false);
        setSelectedOrder(null);
        setTransporterDetails({
          vehicleType: '',
          vehicleNumber: '',
          vehicleCapacity: '',
          driverName: '',
          driverMobile: '',
        });
        fetchOrders();
        setActiveTab('accepted');
      } else {
        Alert.alert('Error', 'Failed to accept order: ' + data.message);
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      Alert.alert('Error', 'Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    Alert.alert(
      'Confirm Rejection',
      'Are you sure you want to reject this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            const transporterId = await AsyncStorage.getItem('transporterId');
            console.log('Transporter ID for rejection:', transporterId);
            //const transporterid=AsyncStorage.getItem('transporterId');

            try {
              const response = await fetch(
                `https://kisan.etpl.ai/api/transporter/${orderId}/reject`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ transporterId }),
                }
              );

              const data = await response.json();

              if (data.success) {
                Alert.alert('Success', 'Order rejected');
                fetchOrders();
              } else {
                Alert.alert('Error', 'Failed to reject order: ' + data.message);
              }
            } catch (error) {
              console.error('Error rejecting order:', error);
              Alert.alert('Error', 'Failed to reject order');
            }
          },
        },
      ]
    );
  };

  const renderOrderCard = (order: Order, showActions: boolean = true) => (
    <View key={order._id} style={styles.orderCard}>
      {/* Order Header */}
      <View style={[styles.orderHeader, showActions ? styles.orderHeaderAvailable : styles.orderHeaderAccepted]}>
        <View style={styles.orderHeaderContent}>
          <View>
            <Text style={styles.orderTitle}>Order #{order.orderId}</Text>
            <Text style={styles.orderSubtitle}>
              Trader: {order.traderName} | Farmer: {order.farmerName}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{order.orderStatus}</Text>
          </View>
        </View>
      </View>

      {/* Product Items */}
      <View style={styles.orderBody}>
        {order.productItems.map((item, index) => (
          <View key={index} style={styles.productItem}>
            {/* Product Info */}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.productName}</Text>
              
              <View style={styles.infoRow}>
                <Package size={16} color="#6B7280" />
                <Text style={styles.infoLabel}>Grade:</Text>
                <Text style={styles.infoValue}>{item.grade}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Package size={16} color="#6B7280" />
                <Text style={styles.infoLabel}>Quantity:</Text>
                <Text style={styles.infoValue}>{item.quantity}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.infoLabel}>Delivery Date:</Text>
                <Text style={styles.deliveryDate}>
                  {new Date(item.deliveryDate).toLocaleDateString('en-IN')}
                </Text>
              </View>
            </View>

            {/* Market Info */}
            <View style={styles.marketInfo}>
              <View style={styles.marketHeader}>
                <MapPin size={20} color="#2563EB" />
                <Text style={styles.marketTitle}>Delivery Location</Text>
              </View>
              {item.marketDetails ? (
                <View style={styles.marketDetails}>
                  <Text style={styles.marketName}>{item.marketDetails.marketName}</Text>
                  <Text style={styles.marketAddress}>{item.marketDetails.exactAddress}</Text>
                  {item.marketDetails.landmark && (
                    <Text style={styles.marketLandmark}>Landmark: {item.marketDetails.landmark}</Text>
                  )}
                  <Text style={styles.marketLocation}>
                    {item.marketDetails.postOffice && `${item.marketDetails.postOffice}, `}
                    {item.marketDetails.district}
                    {item.marketDetails.state && `, ${item.marketDetails.state}`}
                  </Text>
                  <Text style={styles.marketPin}>PIN: {item.marketDetails.pincode}</Text>
                </View>
              ) : (
                <Text style={styles.marketFallback}>Market ID: {item.nearestMarket}</Text>
              )}
            </View>
          </View>
        ))}

        {/* Transport Details */}
        {!showActions && order.transporterDetails && (
          <View style={styles.transportDetails}>
            <View style={styles.transportHeader}>
              <Truck size={20} color="#059669" />
              <Text style={styles.transportTitle}>Transport Details</Text>
            </View>
            <View style={styles.transportGrid}>
              <View style={styles.transportItem}>
                <Text style={styles.transportLabel}>Vehicle Type:</Text>
                <Text style={styles.transportValue}>{order.transporterDetails.vehicleType}</Text>
              </View>
              <View style={styles.transportItem}>
                <Text style={styles.transportLabel}>Vehicle Number:</Text>
                <Text style={styles.transportValue}>{order.transporterDetails.vehicleNumber}</Text>
              </View>
              {order.transporterDetails.vehicleCapacity && (
                <View style={styles.transportItem}>
                  <Text style={styles.transportLabel}>Capacity:</Text>
                  <Text style={styles.transportValue}>{order.transporterDetails.vehicleCapacity}</Text>
                </View>
              )}
              {order.transporterDetails.driverName && (
                <View style={styles.transportItem}>
                  <Text style={styles.transportLabel}>Driver:</Text>
                  <Text style={styles.transportValue}>{order.transporterDetails.driverName}</Text>
                </View>
              )}
              {order.transporterDetails.driverMobile && (
                <View style={styles.transportItem}>
                  <Text style={styles.transportLabel}>Driver Mobile:</Text>
                  <Text style={styles.transportValue}>{order.transporterDetails.driverMobile}</Text>
                </View>
              )}
              <View style={styles.transportItemFull}>
                <Text style={styles.transportLabel}>Accepted At:</Text>
                <Text style={styles.transportAcceptedAt}>
                  {new Date(order.transporterDetails.acceptedAt).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {showActions && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptClick(order)}
            >
              <CheckCircle size={20} color="#fff" />
              <Text style={styles.buttonText}>Accept Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleRejectOrder(order.orderId)}
            >
              <XCircle size={20} color="#fff" />
              <Text style={styles.buttonText}>Reject Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Truck size={32} color="#2563EB" />
            <Text style={styles.headerTitle}>Transporter Dashboard</Text>
          </View>
          <Text style={styles.headerSubtitle}>Manage your transport orders</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.tabActive]}
            onPress={() => setActiveTab('available')}
          >
            <Clock size={20} color={activeTab === 'available' ? '#fff' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'available' && styles.tabTextActive]}>
              Available ({availableOrders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'accepted' && styles.tabActiveGreen]}
            onPress={() => setActiveTab('accepted')}
          >
            <CheckCircle size={20} color={activeTab === 'accepted' ? '#fff' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'accepted' && styles.tabTextActive]}>
              My Orders ({acceptedOrders.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'available' && (
          <>
            {availableOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Package size={64} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No available orders</Text>
                <Text style={styles.emptySubtitle}>Check back later for new delivery requests</Text>
              </View>
            ) : (
              <View style={styles.ordersList}>
                {availableOrders.map((order) => renderOrderCard(order, true))}
              </View>
            )}
          </>
        )}

        {activeTab === 'accepted' && (
          <>
            {acceptedOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Truck size={64} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No accepted orders yet</Text>
                <Text style={styles.emptySubtitle}>Accept orders from the available tab to see them here</Text>
              </View>
            ) : (
              <View style={styles.ordersList}>
                {acceptedOrders.map((order) => renderOrderCard(order, false))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Accept Modal */}
      <Modal
        visible={showAcceptModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAcceptModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Truck size={24} color="#2563EB" />
                <Text style={styles.modalTitle}>
                  Accept Order #{selectedOrder?.orderId}
                </Text>
              </View>

              <View style={styles.modalAlert}>
                <AlertCircle size={20} color="#2563EB" />
                <Text style={styles.modalAlertText}>
                  Please provide your vehicle and driver details to accept this order.
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vehicle Type *</Text>
                <TextInput
                  style={styles.input}
                  value={transporterDetails.vehicleType}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, vehicleType: text })
                  }
                  placeholder="e.g., Truck, Van, Pickup"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vehicle Number *</Text>
                <TextInput
                  style={styles.input}
                  value={transporterDetails.vehicleNumber}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, vehicleNumber: text })
                  }
                  placeholder="e.g., KA01AB1234"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vehicle Capacity</Text>
                <TextInput
                  style={styles.input}
                  value={transporterDetails.vehicleCapacity}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, vehicleCapacity: text })
                  }
                  placeholder="e.g., 5 tons"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Driver Name</Text>
                <TextInput
                  style={styles.input}
                  value={transporterDetails.driverName}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, driverName: text })
                  }
                  placeholder="Driver's name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Driver Mobile</Text>
                <TextInput
                  style={styles.input}
                  value={transporterDetails.driverMobile}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, driverMobile: text })
                  }
                  placeholder="10-digit mobile number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowAcceptModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalAcceptButton}
                  onPress={handleAcceptOrder}
                >
                  <CheckCircle size={20} color="#fff" />
                  <Text style={styles.modalAcceptText}>Confirm Accept</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
  },
  header: {
    padding: 16,
    paddingTop: 48,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabs: {
    flexDirection: 'row',
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#2563EB',
  },
  tabActiveGreen: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  orderHeader: {
    padding: 16,
  },
  orderHeaderAvailable: {
    backgroundColor: '#2563EB',
  },
  orderHeaderAccepted: {
    backgroundColor: '#059669',
  },
  orderHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  orderSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  statusBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  orderBody: {
    padding: 16,
  },
  productItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  productInfo: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  deliveryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  marketInfo: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
  },
  marketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  marketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  marketDetails: {
    gap: 6,
  },
  marketName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 4,
  },
  marketAddress: {
    fontSize: 14,
    color: '#374151',
  },
  marketLandmark: {
    fontSize: 14,
    color: '#6B7280',
  },
  marketLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  marketPin: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  marketFallback: {
    fontSize: 14,
    color: '#6B7280',
  },
  transportDetails: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  transportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  transportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  transportGrid: {
    gap: 12,
  },
  transportItem: {
    flexDirection: 'row',
    gap: 8,
  },
  transportItemFull: {
    flexDirection: 'row',
    gap: 8,
  },
  transportLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  transportValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  transportAcceptedAt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalAlertText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  modalAcceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#059669',
  },
  modalAcceptText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default TransporterOrders;