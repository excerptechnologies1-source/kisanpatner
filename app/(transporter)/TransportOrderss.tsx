import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertCircle, Calendar, CheckCircle, MapPin, Package, Truck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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
    <View key={order._id} className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 overflow-hidden">
      {/* Order Header - Clean & Minimal */}
      <View className="p-5 border-b border-gray-100">
        <View className="flex-row justify-between items-start mb-1">
          <View>
            <Text className="text-lg font-bold text-gray-900">Order #{order.orderId}</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${order.orderStatus === 'Pending' ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <Text className={`text-xs font-semibold ${order.orderStatus === 'Pending' ? 'text-yellow-800' : 'text-green-800'}`}>
              {order.orderStatus}
            </Text>
          </View>
        </View>
        
        {/* Trader/Farmer Info minimal */}
        <View className="flex-row items-center mt-3 gap-4">
          <View className="flex-1">
            <Text className="text-xs text-gray-400 uppercase tracking-wider font-medium">Trader</Text>
            <Text className="text-sm font-semibold text-gray-700">{order.traderName}</Text>
          </View>
          <View className="w-[1px] h-8 bg-gray-200" />
          <View className="flex-1">
            <Text className="text-xs text-gray-400 uppercase tracking-wider font-medium">Farmer</Text>
            <Text className="text-sm font-semibold text-gray-700">{order.farmerName}</Text>
          </View>
        </View>
      </View>

      {/* Product Items */}
      <View className="p-5">
        {order.productItems.map((item, index) => (
          <View key={index} className="mb-6 last:mb-0">
            {/* Product Header */}
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center">
                <Package size={20} color="#4F46E5" />
              </View>
              <View>
                <Text className="text-base font-bold text-gray-900">{item.productName}</Text>
                <Text className="text-sm text-gray-500">{item.grade} • {item.quantity} units</Text>
              </View>
            </View>

            {/* Delivery Details Card */}
            <View className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              {/* Date */}
              <View className="flex-row items-center gap-2 mb-3">
                <Calendar size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600">
                  Delivery by <Text className="font-semibold text-gray-900">{new Date(item.deliveryDate).toLocaleDateString('en-IN')}</Text>
                </Text>
              </View>

              {/* Location Line */}
              <View className="flex-row gap-2">
                <MapPin size={16} color="#6B7280" />
                <View className="flex-1">
                  {item.marketDetails ? (
                    <>
                      <Text className="text-sm font-semibold text-gray-900">{item.marketDetails.marketName}</Text>
                      <Text className="text-xs text-gray-500 mt-0.5 leading-4">
                        {item.marketDetails.district}, {item.marketDetails.state} • {item.marketDetails.pincode}
                      </Text>
                    </>
                  ) : (
                    <Text className="text-sm text-gray-500">Market ID: {item.nearestMarket}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Transport Details (if assigned) */}
        {/* Transport Details (if assigned) */}
        {!showActions && order.transporterDetails && (
          <View style={{ marginTop: 16, backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#dcfce7' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Truck size={18} color="#059669" />
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#166534' }}>Assigned Transport</Text>
            </View>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: '#15803d' }}>Vehicle</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#14532d' }}>
                  {order.transporterDetails.vehicleType} ({order.transporterDetails.vehicleNumber})
                </Text>
              </View>
              {order.transporterDetails.driverName && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: '#15803d' }}>Driver</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#14532d' }}>{order.transporterDetails.driverName}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {showActions && (
          <View className="flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 bg-gray-100 py-3 rounded-xl active:bg-gray-200"
              onPress={() => handleRejectOrder(order.orderId)}
            >
              <Text className="text-gray-700 text-sm font-semibold">Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 bg-black py-3 rounded-xl active:bg-gray-800"
              onPress={() => handleAcceptClick(order)}
            >
              <Text className="text-white text-sm font-semibold">Accept Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-500 text-base">Loading orders...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-8">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Modern Header */}
        <View className="px-5 pt-6 pb-6 bg-white border-b border-gray-100">
          <View className="flex-row justify-between items-center mb-1">
            <View>
              <Text className="text-3xl font-bold text-gray-900 tracking-tight">Orders</Text>
              <Text className="text-base text-gray-500 font-medium">Manage logistics & delivery</Text>
            </View>
            <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center">
              <Truck size={24} color="#4F46E5" />
            </View>
          </View>
        </View>

        {/* Segmented Control Tabs */}
        <View className="px-5 py-4">
          <View className="flex-row bg-gray-200 p-1 rounded-xl">
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: activeTab === 'available' ? '#ffffff' : 'transparent',
                shadowColor: activeTab === 'available' ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: activeTab === 'available' ? 0.05 : 0,
                shadowRadius: 1,
                elevation: activeTab === 'available' ? 1 : 0,
              }}
              onPress={() => setActiveTab('available')}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: activeTab === 'available' ? '#111827' : '#6B7280'
              }}>
                Available
              </Text>
              {availableOrders.length > 0 && (
                <View style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                  backgroundColor: activeTab === 'available' ? '#e0e7ff' : '#d1d5db'
                }}>
                  <Text style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: activeTab === 'available' ? '#4338ca' : '#4b5563'
                  }}>
                    {availableOrders.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: activeTab === 'accepted' ? '#ffffff' : 'transparent',
                shadowColor: activeTab === 'accepted' ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: activeTab === 'accepted' ? 0.05 : 0,
                shadowRadius: 1,
                elevation: activeTab === 'accepted' ? 1 : 0,
              }}
              onPress={() => setActiveTab('accepted')}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: activeTab === 'accepted' ? '#111827' : '#6B7280'
              }}>
                My Orders
              </Text>
              {acceptedOrders.length > 0 && (
                <View style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                  backgroundColor: activeTab === 'accepted' ? '#e0e7ff' : '#d1d5db'
                }}>
                  <Text style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: activeTab === 'accepted' ? '#4338ca' : '#4b5563'
                  }}>
                    {acceptedOrders.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {activeTab === 'available' && (
          <>
            {availableOrders.length === 0 ? (
              <View className="items-center justify-center py-20 mx-5">
                <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
                  <Package size={40} color="#9CA3AF" />
                </View>
                <Text className="text-xl font-bold text-gray-900 mb-2">No orders available</Text>
                <Text className="text-base text-gray-500 text-center px-8">
                  There are no delivery requests matching your criteria at the moment.
                </Text>
              </View>
            ) : (
              <View className="px-5 pb-8">
                {availableOrders.map((order) => renderOrderCard(order, true))}
              </View>
            )}
          </>
        )}

        {activeTab === 'accepted' && (
          <>
            {acceptedOrders.length === 0 ? (
              <View className="items-center justify-center py-20 mx-5">
                 <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
                  <Truck size={40} color="#9CA3AF" />
                </View>
                <Text className="text-xl font-bold text-gray-900 mb-2">No active deliveries</Text>
                <Text className="text-base text-gray-500 text-center px-8">
                  You haven't accepted any orders yet. Switch to the Available tab to find work.
                </Text>
              </View>
            ) : (
              <View className="px-5 pb-8">
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
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[90%] p-6">
            <ScrollView>
              <View className="flex-row items-center gap-3 mb-4">
                <Truck size={24} color="#2563EB" />
                <Text className="text-2xl font-bold text-gray-900">
                  Accept Order #{selectedOrder?.orderId}
                </Text>
              </View>

              <View className="flex-row items-start gap-3 bg-blue-50 p-4 rounded-xl mb-5">
                <AlertCircle size={20} color="#2563EB" />
                <Text className="flex-1 text-sm text-blue-800">
                  Please provide your vehicle and driver details to accept this order.
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Vehicle Type *</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-white focus:border-blue-500"
                  value={transporterDetails.vehicleType}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, vehicleType: text })
                  }
                  placeholder="e.g., Truck, Van, Pickup"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Vehicle Number *</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-white focus:border-blue-500"
                  value={transporterDetails.vehicleNumber}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, vehicleNumber: text })
                  }
                  placeholder="e.g., KA01AB1234"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Vehicle Capacity</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-white focus:border-blue-500"
                  value={transporterDetails.vehicleCapacity}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, vehicleCapacity: text })
                  }
                  placeholder="e.g., 5 tons"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Driver Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-white focus:border-blue-500"
                  value={transporterDetails.driverName}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, driverName: text })
                  }
                  placeholder="Driver's name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Driver Mobile</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-white focus:border-blue-500"
                  value={transporterDetails.driverMobile}
                  onChangeText={(text) =>
                    setTransporterDetails({ ...transporterDetails, driverMobile: text })
                  }
                  placeholder="10-digit mobile number"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                  className="flex-1 py-3.5 rounded-xl border border-gray-300 items-center justify-center bg-white"
                  onPress={() => {
                    setShowAcceptModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  <Text className="text-base font-medium text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-2 bg-green-600 py-3.5 rounded-xl text-white"
                  onPress={handleAcceptOrder}
                >
                  <CheckCircle size={20} color="#fff" />
                  <Text className="text-base font-semibold text-white">Confirm Accept</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};



export default TransporterOrders;