import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const FarmerOrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [farmerId, setFarmerId] = useState<string | null>(null);

  useEffect(() => {
    loadFarmerIdAndFetch();
  }, []);

  const loadFarmerIdAndFetch = async () => {
    try {
      const id = await AsyncStorage.getItem('farmerId');
      setFarmerId(id);
      if (id) {
        fetchOrderHistory(id);
      } else {
        setError('Farmer ID not found. Please login again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load farmer ID');
      setLoading(false);
    }
  };

  const fetchOrderHistory = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `https://kisan.etpl.ai/api/orders/history/farmer/${id}`
      );

      if (response.data.success) {
        setOrders(response.data.data);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order history');
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    if (!farmerId) return;
    setRefreshing(true);
    try {
      await fetchOrderHistory(farmerId);
    } finally {
      setRefreshing(false);
    }
  }, [farmerId]);

  const handleManualRefresh = () => {
    if (farmerId) fetchOrderHistory(farmerId);
    else Alert.alert('Error', 'Farmer ID not found');
  };

  const getStatusColor = (status: string): string => {
    const statusColors: { [key: string]: string } = {
      pending: '#ffc107',
      processing: '#17a2b8',
      in_transit: '#007bff',
      completed: '#28a745',
      cancelled: '#dc3545',
      partial: '#ffc107',
      paid: '#28a745',
    };
    return statusColors[status] || '#6c757d';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#007bff" />
        <Text className="mt-4 text-base text-gray-500">
          Loading order history...
        </Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View className="flex-1 bg-gray-100">
        <View className="m-5 p-4 bg-red-200 rounded-lg border border-red-300">
          <Text className="text-red-900 text-sm">{error}</Text>
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-3 mx-4 rounded-lg items-center"
          onPress={handleManualRefresh}
        >
          <Text className="text-white text-lg font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    /*  NOTE:
    This uses NativeWind Tailwind
    npm i nativewind tailwindcss
*/

<ScrollView
  className="flex-1 bg-white"
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>

  {/* -------- Breadcrumb + Header -------- */}
  <View className="px-4 pt-5 pb-2">

    <Text className="text-2xl font-medium text-gray-900 mt-2">
      Order History
    </Text>

    <Text className="text-gray-500 mt-1 font-medium text-sm">
      Check your past orders, delivery status & payment details
    </Text>
  </View>

  {/* -------- Order Cards -------- */}
  {orders.map(order => (
    <View
      key={order._id}
      className="mx-4 mt-4 bg-white border border-gray-200 rounded-lg shadow-sm"
    >

      {/* Summary Row */}
      <View className="flex-row justify-between px-4 py-3 border-b border-gray-200">
        <Text className="w-[40%] text-gray-800">
          #{order.orderId}
        </Text>

        <Text className="w-[30%] text-gray-700">
          {formatDate(order.createdAt)}
        </Text>

        <Text className="w-[30%] text-right font-medium text-gray-900">
          {formatCurrency(order.adminToFarmerPayment?.totalAmount || 0)}
        </Text>
      </View>


      {/* Content */}
      {order.productItems
        .filter(item => item.farmerId === farmerId)
        .map((item, index, arr) => (
          <View key={item._id} className={`p-4 flex-row gap-4 ${
        index !== arr.length - 1 ? 'border-b border-gray-200' : ''
      }`}>

            {/* Product Image */}
            <View className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden">
              <Text className="text-xs text-center mt-7 text-gray-500">
                Image
              </Text>
            </View>

            {/* Middle Details */}
            <View className="flex-1">

  {/* Product Title / Grade */}
  <Text className="text-gray-900 font-medium text-[15px]">
    Grade – {item.grade}
  </Text>

  {/* Sub Text */}
  <Text className="text-gray-500 mt-1 text-[13px]">
    Quantity • {item.quantity}
  </Text>

  {/* Product ID */}
  <Text className="text-gray-500 text-[13px]">
    ID • {item.productId}
  </Text>

  {/* Delivered Status Row */}
  <View className="flex-row items-center mt-2">
    <View className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2" />
    <Text className="text-gray-700 font-medium text-[13px]">
      Delivered on{" "}
      <Text className="text-gray-900">
        {formatDate(order.updatedAt)}
      </Text>
    </Text>
  </View>

</View>



            {/* Right Price Section */}
            <View className="items-end justify-between">
              <Text className="text-gray-900 font-medium text-lg">
                {formatCurrency(item.totalAmount)}
              </Text>

              
            </View>

          </View>
        ))}

    </View>
  ))}

</ScrollView>

  );
};

export default FarmerOrderHistory;
