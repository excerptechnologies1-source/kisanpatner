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







import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  ArrowLeft, 
  Filter, 
  Search, 
  Calendar,
  Truck,
  User,
  Package,
  MapPin,
  ChevronRight,
  DollarSign
} from 'lucide-react-native';

interface Order {
  id: string;
  orderId: string;
  status: 'new' | 'accepted' | 'ongoing' | 'completed' | 'rejected';
  pickupLocation: string;
  deliveryLocation: string;
  cropName: string;
  quantity: number;
  unit: string;
  price: number;
  farmerName: string;
  date: string;
}

const TransportOrders: React.FC = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'ongoing' | 'completed'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // Mock data
    const mockOrders: Order[] = [
      {
        id: '1',
        orderId: 'ORD001',
        status: 'new',
        pickupLocation: 'Madurai',
        deliveryLocation: 'Chennai',
        cropName: 'Tomatoes',
        quantity: 250,
        unit: 'Boxes',
        price: 8500,
        farmerName: 'Rajesh Kumar',
        date: '2024-01-15'
      },
      {
        id: '2',
        orderId: 'ORD002',
        status: 'accepted',
        pickupLocation: 'Coimbatore',
        deliveryLocation: 'Bangalore',
        cropName: 'Bananas',
        quantity: 150,
        unit: 'Bunches',
        price: 6500,
        farmerName: 'Suresh Babu',
        date: '2024-01-16'
      },
      {
        id: '3',
        orderId: 'ORD003',
        status: 'ongoing',
        pickupLocation: 'Trichy',
        deliveryLocation: 'Hyderabad',
        cropName: 'Mangoes',
        quantity: 100,
        unit: 'Boxes',
        price: 12000,
        farmerName: 'Kumar Raja',
        date: '2024-01-14'
      },
      {
        id: '4',
        orderId: 'ORD004',
        status: 'completed',
        pickupLocation: 'Salem',
        deliveryLocation: 'Kochi',
        cropName: 'Rice',
        quantity: 500,
        unit: 'Bags',
        price: 25000,
        farmerName: 'Mohan Singh',
        date: '2024-01-10'
      },
      {
        id: '5',
        orderId: 'ORD005',
        status: 'rejected',
        pickupLocation: 'Erode',
        deliveryLocation: 'Goa',
        cropName: 'Cotton',
        quantity: 300,
        unit: 'Bales',
        price: 18000,
        farmerName: 'Anil Sharma',
        date: '2024-01-12'
      }
    ];
    
    setOrders(mockOrders);
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (search && 
        !order.orderId.toLowerCase().includes(search.toLowerCase()) && 
        !order.farmerName.toLowerCase().includes(search.toLowerCase()) &&
        !order.cropName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#FF6B6B';
      case 'accepted': return '#4D96FF';
      case 'ongoing': return '#FFA41B';
      case 'completed': return '#06D6A0';
      case 'rejected': return '#A0AEC0';
      default: return '#666';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'new': return '#FFF5F5';
      case 'accepted': return '#F0F7FF';
      case 'ongoing': return '#FFF9F0';
      case 'completed': return '#F0FFF8';
      case 'rejected': return '#F7FAFC';
      default: return '#F7FAFC';
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigation.navigate('OrderDetails' as never, { orderId });
  };

  const filterOptions: {value: 'all' | 'new' | 'ongoing' | 'completed', label: string}[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'new', label: 'New' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#4A5568" />
          </TouchableOpacity>
          <Text className="text-2xl font-heading text-gray-900">Profile Edit</Text>
          <View className="w-10" />
        </View>

        {/* Search Bar */}
        <View className="relative">
         
          <TextInput
            placeholder="Search orders..."
            value={search}
            onChangeText={setSearch}
            className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-800 border border-gray-200 focus:border-blue-500"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="px-6 py-4">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="space-x-3"
        >
          {filterOptions.map((filterType) => (
            <TouchableOpacity
              key={filterType.value}
              onPress={() => setFilter(filterType.value)}
              className={`px-5 m-2 py-2.5 rounded-full flex-row items-center ${
                filter === filterType.value 
                  ? 'bg-blue-500' 
                  : 'bg-white border border-gray-200'
              }`}
              activeOpacity={0.7}
            >
              <Filter 
                size={16} 
                color={filter === filterType.value ? '#FFFFFF' : '#4A5568'} 
                className="mr-2"
              />
              <Text className={`text-sm font-medium ${
                filter === filterType.value 
                  ? 'text-white' 
                  : 'text-gray-700'
              }`}>
                {filterType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
      >
        {filteredOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className="bg-white rounded-xl p-5 mb-4 border border-gray-100"
            onPress={() => handleViewOrder(order.id)}
            activeOpacity={0.9}
          >
            {/* Order Header */}
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Package size={16} color="#4A5568" className="mr-2" />
                  <Text className="text-sm font-medium text-gray-700">
                    {order.orderId}
                  </Text>
                </View>
                <Text className="text-sm font-heading text-gray-900">
                  {order.cropName}
                </Text>
              </View>
              
              <View 
                className="px-3 py-1.5 rounded-full"
                style={{ 
                  backgroundColor: getStatusBgColor(order.status),
                  borderWidth: 1,
                  borderColor: getStatusColor(order.status)
                }}
              >
                <Text 
                  className="text-xs font-medium capitalize"
                  style={{ color: getStatusColor(order.status) }}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            {/* Order Details */}
            <View className="space-y-4 mb-5">
              <View className="flex-row items-center">
                <User size={18} color="#718096" className="mr-3" />
                <View className='me-3'>
                  <Text className="text-sm text-gray-500">Farmer</Text>
                  <Text className="text-sm font-medium text-gray-800">{order.farmerName}</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Truck size={18} color="#718096" className="mr-3" />
                  <View>
                    <Text className="text-sm text-gray-500">Quantity</Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {order.quantity} {order.unit}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center">
                  <DollarSign size={18} color="#718096" className="mr-3" />
                  <View>
                    <Text className="text-sm text-gray-500">Price</Text>
                    <Text className="text-base font-bold text-green-600">
                      ₹{order.price.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Route */}
              <View className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                    <Text className="text-sm font-medium text-gray-700">Pickup</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <Text className="text-sm font-medium text-gray-700">Delivery</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-gray-900">{order.pickupLocation}</Text>
                  <View className="flex-row items-center">
                    <View className="w-12 h-0.5 bg-gray-300 mx-2" />
                    <Truck size={16} color="#A0AEC0" />
                    <View className="w-12 h-0.5 bg-gray-300 mx-2" />
                  </View>
                  <Text className="text-sm font-medium text-gray-900">{order.deliveryLocation}</Text>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
              <View className="flex-row items-center">
                <Calendar size={16} color="#718096" className="mr-2" />
                <Text className="text-sm text-gray-600">{formatDate(order.date)}</Text>
              </View>
              
              <View className="flex-row items-center">
                <Text className="text-sm font-medium text-blue-600 mr-2">View Details</Text>
                <ChevronRight size={18} color="#4D96FF" />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && (
          <View className="items-center justify-center py-12">
            <Package size={64} color="#CBD5E0" />
            <Text className="text-xl font-semibold text-gray-400 mt-4 mb-2">
              No orders found
            </Text>
            <Text className="text-gray-400 text-center">
              {search 
                ? `No orders matching "${search}"`
                : `No ${filter !== 'all' ? filter : ''} orders available`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransportOrders;