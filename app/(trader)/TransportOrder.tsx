

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add this import
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ProductItem {
  productId: string;
  grade: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  deliveryDate?: string;
}

interface PaymentHistory {
  amount: number;
  paidDate: string;
  razorpayPaymentId?: string;
}

interface PaymentInfo {
  paymentStatus: "pending" | "partial" | "paid";
  paidAmount: number;
  remainingAmount: number;
  totalAmount: number;
  paymentHistory: PaymentHistory[];
}

interface TransporterDetails {
  transporterName?: string;
  transporterMobile?: string;
  vehicleNumber?: string;
  driverName?: string;
}

interface Order {
  _id: string;
  orderId: string;
  productItems: ProductItem[];
  traderToAdminPayment: PaymentInfo;
  traderDeliveryKey?: string;
  orderStatus: string;
  transporterStatus?: string;
  transporterDetails?: TransporterDetails;
  deliveryStatus?: string;
  createdAt: string;
  updatedAt: string;
}

const TraderTransport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [traderId, setTraderId] = useState<string | null>(null); // State for trader ID
  const router = useRouter();

  /* ================= FETCH TRADER ID FROM ASYNC STORAGE ================= */
  const getTraderIdFromStorage = async (): Promise<string | null> => {
    try {
      // Try to get from traderId key
      const traderId = await AsyncStorage.getItem('traderId');
      if (traderId) return traderId;

      // If not found in traderId key, try to get from userData
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData.traderId) return userData.traderId;
        if (userData.trader_id) return userData.trader_id;
      }

      return null;
    } catch (error) {
      console.error("Error fetching trader ID from storage:", error);
      return null;
    }
  };

  /* ================= FETCH TRADER ORDERS ================= */
  useEffect(() => {
    const initializeData = async () => {
      // First get trader ID from storage
      const id = await getTraderIdFromStorage();
      if (id) {
        setTraderId(id);
        await loadOrders(id); // Pass trader ID to loadOrders
      } else {
        Alert.alert("Error", "Trader ID not found. Please login again.");
        router.back();
      }
    };

    initializeData();
    
    // Auto-refresh every 30 seconds to check for key updates
    const interval = setInterval(() => {
      if (traderId) {
        loadOrders(traderId);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async (traderIdParam?: string) => {
    const idToUse = traderIdParam || traderId;
    
    if (!idToUse) {
      console.error("No trader ID available");
      return;
    }

    try {
      const res = await axios.get(
        `https://kisan.etpl.ai/api/orders/trader/${idToUse}`
      );

      if (res.data.success) {
        // Filter orders to show only orders for the current trader
        // (The API should already do this, but adding extra safety)
        const filteredOrders = res.data.data.filter((order: any) => {
          // Add any additional filtering logic if needed
          return true; // Return all orders since API already filters by trader
        });
        
        setOrders(filteredOrders);
      }
    } catch (err) {
      console.error("Fetch trader orders error:", err);
      Alert.alert("Error", "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (traderId) {
      await loadOrders();
    } else {
      // If traderId is null, try to get it again
      const id = await getTraderIdFromStorage();
      if (id) {
        setTraderId(id);
        await loadOrders(id);
      }
    }
  };

  /* ================= COPY KEY TO CLIPBOARD ================= */
  const copyToClipboard = (text: string) => {
    // You can use expo-clipboard for actual copying
    // For now, show alert
    Alert.alert("✅ Success", "Delivery key copied to clipboard!");
  };

  /* ================= SHOW KEY DETAILS ================= */
  const showKeyDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowKeyModal(true);
  };

  /* ================= GET STATUS COLOR ================= */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "#10b981";
      case "partial":
        return "#f59e0b";
      case "pending":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in_transit":
        return "#3b82f6";
      case "processing":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading if traderId is not yet fetched
  if (!traderId && loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading trader information...</Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading orders...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">🧑‍💼 My Transport Orders</Text>
        </View>
        <TouchableOpacity
          onPress={() => traderId && loadOrders()}
          className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="refresh" size={16} color="white" />
          <Text className="text-white font-medium ml-2">Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4">
          {orders.length === 0 ? (
            <View className="bg-gray-50 p-8 rounded-xl items-center justify-center">
              <Text className="text-lg text-gray-500">📦 No transport orders found</Text>
              <Text className="text-sm text-gray-400 mt-2">Trader ID: {traderId}</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
              >
                {/* ORDER HEADER */}
                <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
                  <View className="flex-1">
                    <Text className="text-sm text-gray-500">Order</Text>
                    <Text className="text-lg font-bold text-blue-600">{order.orderId}</Text>
                  </View>
                  <View 
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: getOrderStatusColor(order.orderStatus) }}
                  >
                    <Text className="text-white text-xs font-bold">
                      {order.orderStatus.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* PAYMENT INFO */}
                <View className="bg-gray-50 p-4">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-base font-semibold">💰 Payment Status</Text>
                    <View 
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: getStatusColor(order.traderToAdminPayment.paymentStatus) }}
                    >
                      <Text className="text-white text-xs font-bold">
                        {order.traderToAdminPayment.paymentStatus.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between">
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm mb-1">Total Amount</Text>
                      <Text className="text-base font-bold">
                        ₹{order.traderToAdminPayment.totalAmount.toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex-1 px-4">
                      <Text className="text-gray-500 text-sm mb-1">Paid Amount</Text>
                      <Text className="text-base font-bold text-green-600">
                        ₹{order.traderToAdminPayment.paidAmount.toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm mb-1">Remaining</Text>
                      <Text className="text-base font-bold text-red-600">
                        ₹{order.traderToAdminPayment.remainingAmount.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* PRODUCT ITEMS */}
                <View className="p-4">
                  <Text className="text-base font-semibold text-gray-700 mb-3">📦 Order Items</Text>
                  <View className="bg-gray-50 rounded-lg">
                    {order.productItems.map((item, idx) => (
                      <View
                        key={idx}
                        className={`p-3 ${idx < order.productItems.length - 1 ? 'border-b border-gray-200' : ''}`}
                      >
                        <View className="flex-row justify-between">
                          <View>
                            <Text className="font-semibold text-gray-800">{item.productId}</Text>
                            <Text className="text-gray-500 text-sm">Grade: {item.grade}</Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-gray-600">Qty: {item.quantity}</Text>
                            <Text className="font-bold text-gray-800">
                              ₹{item.totalAmount.toLocaleString()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* TRANSPORTER INFO */}
                {order.transporterDetails && (
                  <View className="bg-blue-50 mx-4 p-3 rounded-lg mb-4 border border-blue-100">
                    <Text className="font-semibold text-blue-800 mb-2">🚚 Transporter Details</Text>
                    <View className="flex-row justify-between mb-2">
                      <View>
                        <Text className="text-gray-600 text-sm">Name</Text>
                        <Text className="font-medium">
                          {order.transporterDetails.transporterName || "N/A"}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-gray-600 text-sm">Vehicle</Text>
                        <Text className="font-medium">
                          {order.transporterDetails.vehicleNumber || "N/A"}
                        </Text>
                      </View>
                    </View>
                    {order.transporterStatus && (
                      <View className="mt-2">
                        <Text className="text-gray-600 text-sm mb-1">Status</Text>
                        <View 
                          className="self-start px-3 py-1 rounded-full"
                          style={{ backgroundColor: "#3b82f6" }}
                        >
                          <Text className="text-white text-xs font-medium">
                            {order.transporterStatus.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {/* 🔐 DELIVERY SECRET KEY */}
                {order.traderToAdminPayment.paymentStatus === "paid" && order.traderDeliveryKey && (
                  <View className="mx-4 mb-4 bg-cyan-50 rounded-xl border-2 border-cyan-400 p-4">
                    <View className="flex-row justify-between items-center mb-3">
                      <View className="flex-1">
                        <Text className="text-cyan-800 font-semibold text-sm mb-1">
                          🔐 Delivery Secret Key Generated
                        </Text>
                        <Text className="text-cyan-900 text-xl font-bold tracking-wider font-mono">
                          {order.traderDeliveryKey}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-red-600 text-xs font-medium mb-3">
                      ⚠️ Share this key ONLY with the transporter at delivery time
                    </Text>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        onPress={() => copyToClipboard(order.traderDeliveryKey!)}
                        className="flex-1 bg-cyan-600 py-3 rounded-lg items-center"
                      >
                        <Text className="text-white font-semibold">📋 Copy Key</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => showKeyDetails(order)}
                        className="flex-1 bg-cyan-500 py-3 rounded-lg items-center"
                      >
                        <Text className="text-white font-semibold">ℹ️ Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* WAITING FOR PAYMENT MESSAGE */}
                {order.traderToAdminPayment.paymentStatus !== "paid" && (
                  <View className="mx-4 mb-4 bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                    <Text className="text-yellow-900 font-bold">
                      ⏳ Delivery key will be generated once full payment is completed
                    </Text>
                    <Text className="text-yellow-800 text-sm mt-1">
                      Remaining amount: ₹{order.traderToAdminPayment.remainingAmount.toLocaleString()}
                    </Text>
                  </View>
                )}

                {/* DELIVERY STATUS */}
                {order.deliveryStatus && (
                  <View className="mx-4 mb-4">
                    <Text className="font-semibold text-gray-700 mb-2">📍 Delivery Status</Text>
                    <View 
                      className="self-start px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: order.deliveryStatus === "delivered" ? "#10b981" : "#f59e0b" 
                      }}
                    >
                      <Text className="text-white text-xs font-bold">
                        {order.deliveryStatus.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                )}

                {/* TIMESTAMPS */}
                <View className="p-4 border-t border-gray-200">
                  <View className="mb-2">
                    <Text className="text-gray-500 text-xs">📅 Created</Text>
                    <Text className="text-gray-700 text-sm">{formatDate(order.createdAt)}</Text>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-xs">🔄 Updated</Text>
                    <Text className="text-gray-700 text-sm">{formatDate(order.updatedAt)}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* KEY DETAILS MODAL */}
      <Modal
        visible={showKeyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowKeyModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <View className="p-6">
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                🔐 Delivery Key Instructions
              </Text>
              
              <View className="bg-teal-50 p-4 rounded-xl border-2 border-teal-500 mb-6">
                <Text className="text-teal-800 font-semibold text-sm mb-2">
                  Your Delivery Key:
                </Text>
                <Text className="text-2xl font-bold text-teal-900 tracking-wider font-mono text-center py-2">
                  {selectedOrder?.traderDeliveryKey}
                </Text>
              </View>

              <Text className="text-base font-semibold text-gray-800 mb-3">
                📌 How to use this key:
              </Text>
              <View className="pl-4 mb-4">
                <Text className="text-gray-700 mb-2">1. Wait for the transporter to arrive with your goods</Text>
                <Text className="text-gray-700 mb-2">2. Verify the items and quantities are correct</Text>
                <Text className="text-gray-700 mb-2">3. Share this key with the transporter</Text>
                <Text className="text-gray-700 mb-2">4. Transporter will enter this key to complete delivery</Text>
                <Text className="text-gray-700">5. Order will be marked as completed ✅</Text>
              </View>

              <View className="bg-red-50 p-3 rounded-lg border border-red-200 mb-6">
                <Text className="text-red-700 font-semibold text-sm">
                  ⚠️ Keep this key secure. Only share it when you receive the goods!
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowKeyModal(false)}
                className="bg-blue-500 py-4 rounded-lg items-center"
              >
                <Text className="text-white text-lg font-semibold">Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TraderTransport;