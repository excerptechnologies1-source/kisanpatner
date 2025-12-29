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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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
  });

  useEffect(() => {
    fetchTraderInfo();
  }, []);

  const fetchTraderInfo = async () => {
    try {
      const [id, name, mobile] = await Promise.all([
        AsyncStorage.getItem('traderId'),
        AsyncStorage.getItem('userName'),
        AsyncStorage.getItem('userMobile'),
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
        `http://localhost:8080/api/orders/history/trader/${traderId}`
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

      // Create Razorpay order
      const orderResponse = await axios.post(
        'http://localhost:8080/api/orders/history/create-trader-payment',
        {
          orderId: orderId,
          amount: amount,
        }
      );

      const { data: razorpayOrder, key_id } = orderResponse.data;

      // For React Native, we'll use deep linking to open Razorpay
      // Alternatively, use react-native-razorpay package
      const razorpayUrl = `https://razorpay.com/payment-page/${razorpayOrder.id}`;
      
      Alert.alert(
        'Complete Payment',
        `Please complete payment of ₹${amount.toFixed(2)} for Order ${orderId}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setProcessingPayment(null),
          },
          {
            text: 'Open Payment',
            onPress: async () => {
              try {
                // Open Razorpay in browser
                // Note: In production, use react-native-razorpay or WebView
                const canOpen = await Linking.canOpenURL(razorpayUrl);
                if (canOpen) {
                  Linking.openURL(razorpayUrl);
                } else {
                  Alert.alert('Error', 'Cannot open payment link');
                }
              } catch (error) {
                console.error('Error opening payment link:', error);
                Alert.alert('Error', 'Failed to open payment');
              } finally {
                setProcessingPayment(null);
              }
            },
          },
        ]
      );

      // Note: In a real app, you would need to handle payment verification
      // This typically involves a webhook or polling the server

    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      Alert.alert(
        'Payment Failed',
        error.response?.data?.message || 'Failed to initiate payment'
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

import { Linking } from 'react-native';

export default TraderOrderHistory;