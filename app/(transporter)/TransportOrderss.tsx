// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   SafeAreaView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { ArrowLeft, Filter, Search } from 'lucide-react-native';

// interface Order {
//   id: string;
//   orderId: string;
//   status: 'new' | 'accepted' | 'ongoing' | 'completed' | 'rejected';
//   pickupLocation: string;
//   deliveryLocation: string;
//   cropName: string;
//   quantity: number;
//   unit: string;
//   price: number;
//   farmerName: string;
//   date: string;
// }

// const TransportOrders: React.FC = () => {
//   const navigation = useNavigation();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filter, setFilter] = useState<'all' | 'new' | 'ongoing' | 'completed'>('all');
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     // Mock data
//     const mockOrders: Order[] = [
//       {
//         id: '1',
//         orderId: 'ORD001',
//         status: 'new',
//         pickupLocation: 'Madurai',
//         deliveryLocation: 'Chennai',
//         cropName: 'Tomatoes',
//         quantity: 250,
//         unit: 'Boxes',
//         price: 8500,
//         farmerName: 'Rajesh Kumar',
//         date: '2024-01-15'
//       },
//       {
//         id: '2',
//         orderId: 'ORD002',
//         status: 'accepted',
//         pickupLocation: 'Coimbatore',
//         deliveryLocation: 'Bangalore',
//         cropName: 'Bananas',
//         quantity: 150,
//         unit: 'Bunches',
//         price: 6500,
//         farmerName: 'Suresh Babu',
//         date: '2024-01-16'
//       },
//       {
//         id: '3',
//         orderId: 'ORD003',
//         status: 'ongoing',
//         pickupLocation: 'Trichy',
//         deliveryLocation: 'Hyderabad',
//         cropName: 'Mangoes',
//         quantity: 100,
//         unit: 'Boxes',
//         price: 12000,
//         farmerName: 'Kumar Raja',
//         date: '2024-01-14'
//       },
//       {
//         id: '4',
//         orderId: 'ORD004',
//         status: 'completed',
//         pickupLocation: 'Salem',
//         deliveryLocation: 'Kochi',
//         cropName: 'Rice',
//         quantity: 500,
//         unit: 'Bags',
//         price: 25000,
//         farmerName: 'Mohan Singh',
//         date: '2024-01-10'
//       },
//       {
//         id: '5',
//         orderId: 'ORD005',
//         status: 'rejected',
//         pickupLocation: 'Erode',
//         deliveryLocation: 'Goa',
//         cropName: 'Cotton',
//         quantity: 300,
//         unit: 'Bales',
//         price: 18000,
//         farmerName: 'Anil Sharma',
//         date: '2024-01-12'
//       }
//     ];
    
//     setOrders(mockOrders);
//   };

//   const filteredOrders = orders.filter(order => {
//     if (filter !== 'all' && order.status !== filter) return false;
//     if (search && 
//         !order.orderId.toLowerCase().includes(search.toLowerCase()) && 
//         !order.farmerName.toLowerCase().includes(search.toLowerCase())) {
//       return false;
//     }
//     return true;
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'new': return '#e74c3c';
//       case 'accepted': return '#3498db';
//       case 'ongoing': return '#f39c12';
//       case 'completed': return '#27ae60';
//       case 'rejected': return '#95a5a6';
//       default: return '#666';
//     }
//   };

//   const handleViewOrder = (orderId: string) => {
//     navigation.navigate('OrderDetails' as never, { orderId });
//   };

//   const filterOptions: ('all' | 'new' | 'ongoing' | 'completed')[] = ['all', 'new', 'ongoing', 'completed'];

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <ArrowLeft size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Orders</Text>
//       </View>

//       {/* Filters and Search */}
//       <View style={styles.filterContainer}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color="#666" />
//           <TextInput
//             placeholder="Search by Order ID or Farmer Name..."
//             value={search}
//             onChangeText={setSearch}
//             style={styles.searchInput}
//           />
//         </View>

//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           style={styles.filterScroll}
//           contentContainerStyle={styles.filterScrollContent}
//         >
//           <Filter size={20} color="#666" />
//           {filterOptions.map((filterType) => (
//             <TouchableOpacity
//               key={filterType}
//               onPress={() => setFilter(filterType)}
//               style={[
//                 styles.filterButton,
//                 filter === filterType && styles.filterButtonActive
//               ]}
//             >
//               <Text style={[
//                 styles.filterButtonText,
//                 filter === filterType && styles.filterButtonTextActive
//               ]}>
//                 {filterType}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Orders List */}
//       <ScrollView style={styles.ordersList} contentContainerStyle={styles.ordersListContent}>
//         {filteredOrders.map((order) => (
//           <TouchableOpacity
//             key={order.id}
//             style={styles.orderCard}
//             onPress={() => handleViewOrder(order.id)}
//             activeOpacity={0.7}
//           >
//             <View style={styles.orderHeader}>
//               <View>
//                 <Text style={styles.orderId}>Order: {order.orderId}</Text>
//                 <Text style={styles.orderCrop}>
//                   {order.cropName} • {order.quantity} {order.unit}
//                 </Text>
//               </View>
              
//               <View style={styles.orderRightSection}>
//                 <View style={[
//                   styles.statusBadge, 
//                   { backgroundColor: getStatusColor(order.status) }
//                 ]}>
//                   <Text style={styles.statusText}>{order.status}</Text>
//                 </View>
                
//                 <View style={styles.farmerInfo}>
//                   <Text style={styles.farmerLabel}>Farmer</Text>
//                   <Text style={styles.farmerName}>{order.farmerName}</Text>
//                 </View>
                
//                 <View style={styles.priceInfo}>
//                   <Text style={styles.priceLabel}>Price</Text>
//                   <Text style={styles.priceValue}>₹{order.price}</Text>
//                 </View>
//               </View>
//             </View>
            
//             <View style={styles.orderDetails}>
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Pickup</Text>
//                 <Text style={styles.detailValue}>{order.pickupLocation}</Text>
//               </View>
              
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Delivery</Text>
//                 <Text style={styles.detailValue}>{order.deliveryLocation}</Text>
//               </View>
              
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Date</Text>
//                 <Text style={styles.detailValue}>{order.date}</Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   backButton: {
//     marginRight: 15,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   filterContainer: {
//     padding: 20,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#333',
//   },
//   filterScroll: {
//     marginLeft: -5,
//   },
//   filterScrollContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   filterButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 20,
//   },
//   filterButtonActive: {
//     backgroundColor: '#3498db',
//   },
//   filterButtonText: {
//     fontSize: 14,
//     color: '#666',
//     textTransform: 'capitalize',
//   },
//   filterButtonTextActive: {
//     color: 'white',
//   },
//   ordersList: {
//     flex: 1,
//   },
//   ordersListContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   orderCard: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   orderId: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   orderCrop: {
//     fontSize: 14,
//     color: '#666',
//   },
//   orderRightSection: {
//     alignItems: 'flex-end',
//   },
//   statusBadge: {
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     borderRadius: 20,
//     marginBottom: 10,
//   },
//   statusText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//     textTransform: 'capitalize',
//   },
//   farmerInfo: {
//     alignItems: 'flex-end',
//     marginBottom: 5,
//   },
//   farmerLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   farmerName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginTop: 2,
//   },
//   priceInfo: {
//     alignItems: 'flex-end',
//   },
//   priceLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   priceValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#27ae60',
//     marginTop: 2,
//   },
//   orderDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 15,
//     paddingTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   detailItem: {
//     flex: 1,
//   },
//   detailLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 5,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#333',
//   },
// });

// export default TransportOrders;







// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { 
//   ArrowLeft, 
//   Filter, 
//   Search, 
//   Calendar,
//   Truck,
//   User,
//   Package,
//   MapPin,
//   ChevronRight,
//   DollarSign
// } from 'lucide-react-native';

// interface Order {
//   id: string;
//   orderId: string;
//   status: 'new' | 'accepted' | 'ongoing' | 'completed' | 'rejected';
//   pickupLocation: string;
//   deliveryLocation: string;
//   cropName: string;
//   quantity: number;
//   unit: string;
//   price: number;
//   farmerName: string;
//   date: string;
// }

// const TransportOrders: React.FC = () => {
//   const navigation = useNavigation();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filter, setFilter] = useState<'all' | 'new' | 'ongoing' | 'completed'>('all');
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     // Mock data
//     const mockOrders: Order[] = [
//       {
//         id: '1',
//         orderId: 'ORD001',
//         status: 'new',
//         pickupLocation: 'Madurai',
//         deliveryLocation: 'Chennai',
//         cropName: 'Tomatoes',
//         quantity: 250,
//         unit: 'Boxes',
//         price: 8500,
//         farmerName: 'Rajesh Kumar',
//         date: '2024-01-15'
//       },
//       {
//         id: '2',
//         orderId: 'ORD002',
//         status: 'accepted',
//         pickupLocation: 'Coimbatore',
//         deliveryLocation: 'Bangalore',
//         cropName: 'Bananas',
//         quantity: 150,
//         unit: 'Bunches',
//         price: 6500,
//         farmerName: 'Suresh Babu',
//         date: '2024-01-16'
//       },
//       {
//         id: '3',
//         orderId: 'ORD003',
//         status: 'ongoing',
//         pickupLocation: 'Trichy',
//         deliveryLocation: 'Hyderabad',
//         cropName: 'Mangoes',
//         quantity: 100,
//         unit: 'Boxes',
//         price: 12000,
//         farmerName: 'Kumar Raja',
//         date: '2024-01-14'
//       },
//       {
//         id: '4',
//         orderId: 'ORD004',
//         status: 'completed',
//         pickupLocation: 'Salem',
//         deliveryLocation: 'Kochi',
//         cropName: 'Rice',
//         quantity: 500,
//         unit: 'Bags',
//         price: 25000,
//         farmerName: 'Mohan Singh',
//         date: '2024-01-10'
//       },
//       {
//         id: '5',
//         orderId: 'ORD005',
//         status: 'rejected',
//         pickupLocation: 'Erode',
//         deliveryLocation: 'Goa',
//         cropName: 'Cotton',
//         quantity: 300,
//         unit: 'Bales',
//         price: 18000,
//         farmerName: 'Anil Sharma',
//         date: '2024-01-12'
//       }
//     ];
    
//     setOrders(mockOrders);
//   };

//   const filteredOrders = orders.filter(order => {
//     if (filter !== 'all' && order.status !== filter) return false;
//     if (search && 
//         !order.orderId.toLowerCase().includes(search.toLowerCase()) && 
//         !order.farmerName.toLowerCase().includes(search.toLowerCase()) &&
//         !order.cropName.toLowerCase().includes(search.toLowerCase())) {
//       return false;
//     }
//     return true;
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'new': return '#FF6B6B';
//       case 'accepted': return '#4D96FF';
//       case 'ongoing': return '#FFA41B';
//       case 'completed': return '#06D6A0';
//       case 'rejected': return '#A0AEC0';
//       default: return '#666';
//     }
//   };

//   const getStatusBgColor = (status: string) => {
//     switch (status) {
//       case 'new': return '#FFF5F5';
//       case 'accepted': return '#F0F7FF';
//       case 'ongoing': return '#FFF9F0';
//       case 'completed': return '#F0FFF8';
//       case 'rejected': return '#F7FAFC';
//       default: return '#F7FAFC';
//     }
//   };

//   const handleViewOrder = (orderId: string) => {
//     navigation.navigate('OrderDetails' as never, { orderId });
//   };

//   const filterOptions: {value: 'all' | 'new' | 'ongoing' | 'completed', label: string}[] = [
//     { value: 'all', label: 'All Orders' },
//     { value: 'new', label: 'New' },
//     { value: 'ongoing', label: 'Ongoing' },
//     { value: 'completed', label: 'Completed' }
//   ];

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
//       {/* Header */}
//       <View className="px-6 pt-6 pb-4 bg-white shadow-sm">
//         <View className="flex-row items-center justify-between mb-6">
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
//             activeOpacity={0.7}
//           >
//             <ArrowLeft size={20} color="#4A5568" />
//           </TouchableOpacity>
//           <Text className="text-2xl font-heading text-gray-900">Profile Edit</Text>
//           <View className="w-10" />
//         </View>

//         {/* Search Bar */}
//         <View className="relative">
         
//           <TextInput
//             placeholder="Search orders..."
//             value={search}
//             onChangeText={setSearch}
//             className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-800 border border-gray-200 focus:border-blue-500"
//             placeholderTextColor="#94A3B8"
//           />
//         </View>
//       </View>

//       {/* Filter Tabs */}
//       <View className="px-6 py-4">
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           className="space-x-3"
//         >
//           {filterOptions.map((filterType) => (
//             <TouchableOpacity
//               key={filterType.value}
//               onPress={() => setFilter(filterType.value)}
//               className={`px-5 m-2 py-2.5 rounded-full flex-row items-center ${
//                 filter === filterType.value 
//                   ? 'bg-blue-500' 
//                   : 'bg-white border border-gray-200'
//               }`}
//               activeOpacity={0.7}
//             >
//               <Filter 
//                 size={16} 
//                 color={filter === filterType.value ? '#FFFFFF' : '#4A5568'} 
//                 className="mr-2"
//               />
//               <Text className={`text-sm font-medium ${
//                 filter === filterType.value 
//                   ? 'text-white' 
//                   : 'text-gray-700'
//               }`}>
//                 {filterType.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Orders List */}
//       <ScrollView 
//         className="flex-1 px-6"
//         showsVerticalScrollIndicator={false}
//         contentContainerClassName="pb-8"
//       >
//         {filteredOrders.map((order) => (
//           <TouchableOpacity
//             key={order.id}
//             className="bg-white rounded-xl p-5 mb-4 border border-gray-100"
//             onPress={() => handleViewOrder(order.id)}
//             activeOpacity={0.9}
//           >
//             {/* Order Header */}
//             <View className="flex-row justify-between items-start mb-4">
//               <View className="flex-1">
//                 <View className="flex-row items-center mb-2">
//                   <Package size={16} color="#4A5568" className="mr-2" />
//                   <Text className="text-sm font-medium text-gray-700">
//                     {order.orderId}
//                   </Text>
//                 </View>
//                 <Text className="text-sm font-heading text-gray-900">
//                   {order.cropName}
//                 </Text>
//               </View>
              
//               <View 
//                 className="px-3 py-1.5 rounded-full"
//                 style={{ 
//                   backgroundColor: getStatusBgColor(order.status),
//                   borderWidth: 1,
//                   borderColor: getStatusColor(order.status)
//                 }}
//               >
//                 <Text 
//                   className="text-xs font-medium capitalize"
//                   style={{ color: getStatusColor(order.status) }}
//                 >
//                   {order.status}
//                 </Text>
//               </View>
//             </View>

//             {/* Order Details */}
//             <View className="space-y-4 mb-5">
//               <View className="flex-row items-center">
//                 <User size={18} color="#718096" className="mr-3" />
//                 <View className='me-3'>
//                   <Text className="text-sm text-gray-500">Farmer</Text>
//                   <Text className="text-sm font-medium text-gray-800">{order.farmerName}</Text>
//                 </View>
//               </View>

//               <View className="flex-row items-center justify-between">
//                 <View className="flex-row items-center flex-1">
//                   <Truck size={18} color="#718096" className="mr-3" />
//                   <View>
//                     <Text className="text-sm text-gray-500">Quantity</Text>
//                     <Text className="text-sm font-medium text-gray-800">
//                       {order.quantity} {order.unit}
//                     </Text>
//                   </View>
//                 </View>
                
//                 <View className="flex-row items-center">
//                   <DollarSign size={18} color="#718096" className="mr-3" />
//                   <View>
//                     <Text className="text-sm text-gray-500">Price</Text>
//                     <Text className="text-base font-bold text-green-600">
//                       ₹{order.price.toLocaleString()}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               {/* Route */}
//               <View className="bg-gray-50 rounded-xl p-4">
//                 <View className="flex-row items-center justify-between mb-3">
//                   <View className="flex-row items-center">
//                     <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
//                     <Text className="text-sm font-medium text-gray-700">Pickup</Text>
//                   </View>
//                   <View className="flex-row items-center">
//                     <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
//                     <Text className="text-sm font-medium text-gray-700">Delivery</Text>
//                   </View>
//                 </View>
//                 <View className="flex-row items-center justify-between">
//                   <Text className="text-sm font-medium text-gray-900">{order.pickupLocation}</Text>
//                   <View className="flex-row items-center">
//                     <View className="w-12 h-0.5 bg-gray-300 mx-2" />
//                     <Truck size={16} color="#A0AEC0" />
//                     <View className="w-12 h-0.5 bg-gray-300 mx-2" />
//                   </View>
//                   <Text className="text-sm font-medium text-gray-900">{order.deliveryLocation}</Text>
//                 </View>
//               </View>
//             </View>

//             {/* Footer */}
//             <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
//               <View className="flex-row items-center">
//                 <Calendar size={16} color="#718096" className="mr-2" />
//                 <Text className="text-sm text-gray-600">{formatDate(order.date)}</Text>
//               </View>
              
//               <View className="flex-row items-center">
//                 <Text className="text-sm font-medium text-blue-600 mr-2">View Details</Text>
//                 <ChevronRight size={18} color="#4D96FF" />
//               </View>
//             </View>
//           </TouchableOpacity>
//         ))}

//         {filteredOrders.length === 0 && (
//           <View className="items-center justify-center py-12">
//             <Package size={64} color="#CBD5E0" />
//             <Text className="text-xl font-semibold text-gray-400 mt-4 mb-2">
//               No orders found
//             </Text>
//             <Text className="text-gray-400 text-center">
//               {search 
//                 ? `No orders matching "${search}"`
//                 : `No ${filter !== 'all' ? filter : ''} orders available`
//               }
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default TransportOrders;






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

const TransporterOrders: React.FC = () => {
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const transporterId = 'tran-01';

      const availableResponse = await fetch('https://kisan.etpl.ai/api/transporter/eligible-orders');
      const availableData = await availableResponse.json();

      const acceptedResponse = await fetch(`https://kisan.etpl.ai/api/transporter/${transporterId}/orders`);
      const acceptedData = await acceptedResponse.json();

      if (availableData.success) {
        setAvailableOrders(availableData.data);
      }

      if (acceptedData.success) {
        setAcceptedOrders(acceptedData.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

    const transporterId = 'tran-01';
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
            const transporterId = 'tran-01';

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
                <Text style={styles.marketFallback}>{item.nearestMarket}</Text>
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