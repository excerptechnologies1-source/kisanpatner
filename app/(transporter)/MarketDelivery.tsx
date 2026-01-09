

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

/* ================= Interfaces ================= */

interface ProductItem {
  productId: string;
  grade: string;
  quantity: number;
  nearestMarket: string;
  deliveryDate?: string;
}

interface MarketDetails {
  _id: string;
  marketName: string;
  exactAddress: string;
  landmark?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

interface TraderLocation {
  address: string;
  state: string;
  pincode: string;
  district: string;
  taluk: string;
  villageGramaPanchayat: string;
  post?: string;
}

interface TraderDetails {
  traderId: string;
  traderName: string;
  traderMobile: string;
  location: TraderLocation;
}

interface Order {
  _id: string;
  orderId: string;
  traderId: string;
  productItems: ProductItem[];
  createdAt: string;
  pickupMarket?: MarketDetails;
  traderDetails?: TraderDetails;
  journeyStatus?: "pending" | "started" | "completed";
  transporterAccepted?: boolean;
}

interface ProductDetails {
  [key: string]: string;
}

interface TransporterData {
  _id: string;
  personalInfo: {
    name: string;
    mobileNo: string;
  };
  transportInfo: {
    vehicles: Array<{
      vehicleType: string;
      vehicleNumber: string;
      vehicleCapacity: {
        value: number;
        unit: string;
      };
      driverInfo: {
        driverName?: string;
        driverMobileNo?: string;
      };
      primaryVehicle?: boolean;
    }>;
    vehicleType?: string;
    vehicleNumber?: string;
    vehicleCapacity?: {
      value: number;
      unit: string;
    };
    driverInfo?: {
      driverName?: string;
      driverMobileNo?: string;
    };
  };
}

/* ================= Component ================= */

const TransporterOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [productNames, setProductNames] = useState<ProductDetails>({});
  const [transporterData, setTransporterData] =
    useState<TransporterData | null>(null);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"start" | "complete">("start");
  const [secretKey, setSecretKey] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState("");

  /* ================= Fetch Transporter Data ================= */

  const fetchTransporterData = async () => {
    try {
      const mongoId = await AsyncStorage.getItem("id");
      const transporterId = await AsyncStorage.getItem("transporterId");

      console.log("📦 AsyncStorage mongoId:", mongoId);
      console.log("📦 AsyncStorage transporterId:", transporterId);

      let res;

      // ✅ Prefer Mongo ID
      if (mongoId) {
        res = await axios.get(
          `https://kisan.etpl.ai/api/transporter/profile/${mongoId}`
        );
      }
      // ✅ Fallback to transporterId (if backend supports search)
      else if (transporterId) {
        res = await axios.get(
          `https://kisan.etpl.ai/api/transporter/profile`,
          { params: { transporterId } }
        );
      } else {
        console.error("❌ No transporter ID found in AsyncStorage");
        return null;
      }

      console.log("✅ Transporter API response:", res.data);

      if (res.data?.success && res.data?.data) {
        setTransporterData(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.error("❌ Transporter fetch error:", err);
    }
    return null;
  };

  /* ================= Get Primary Vehicle or First Vehicle ================= */

  const getVehicleDetails = (transporter: TransporterData) => {
    if (
      transporter.transportInfo.vehicles &&
      transporter.transportInfo.vehicles.length > 0
    ) {
      const primaryVehicle = transporter.transportInfo.vehicles.find(
        (v) => v.primaryVehicle
      );
      const vehicle =
        primaryVehicle || transporter.transportInfo.vehicles[0];

      return {
        vehicleType: vehicle.vehicleType,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleCapacity: `${vehicle.vehicleCapacity.value} ${vehicle.vehicleCapacity.unit}`,
        driverName: vehicle.driverInfo?.driverName || "N/A",
        driverMobile: vehicle.driverInfo?.driverMobileNo || "N/A",
      };
    }

    if (
      transporter.transportInfo.vehicleType &&
      transporter.transportInfo.vehicleNumber
    ) {
      return {
        vehicleType: transporter.transportInfo.vehicleType,
        vehicleNumber: transporter.transportInfo.vehicleNumber,
        vehicleCapacity: transporter.transportInfo.vehicleCapacity
          ? `${transporter.transportInfo.vehicleCapacity.value} ${transporter.transportInfo.vehicleCapacity.unit}`
          : "N/A",
        driverName: transporter.transportInfo.driverInfo?.driverName || "N/A",
        driverMobile:
          transporter.transportInfo.driverInfo?.driverMobileNo || "N/A",
      };
    }

    return {
      vehicleType: "N/A",
      vehicleNumber: "N/A",
      vehicleCapacity: "N/A",
      driverName: "N/A",
      driverMobile: "N/A",
    };
  };

  /* ================= Fetch Product Names ================= */

  const fetchProductNames = async (productIds: string[]) => {
    const names: ProductDetails = {};

    await Promise.all(
      productIds.map(async (id) => {
        try {
          const res = await axios.get(`https://kisan.etpl.ai/product/${id}`);
          names[id] =
            res.data?.data?.productName ||
            res.data?.data?.subCategoryId?.name ||
            "Product";
        } catch {
          names[id] = "Product";
        }
      })
    );

    setProductNames(names);
  };

  /* ================= Fetch Market ================= */

  const fetchMarket = async (marketId: string) => {
    try {
      const res = await axios.get(
        `https://kisan.etpl.ai/api/market/${marketId}`
      );
      if (res.data?.data) return res.data.data;
    } catch (err) {
      console.error("Market fetch error:", err);
    }
    return null;
  };

  /* ================= Fetch Trader ================= */

  const fetchTrader = async (traderId: string) => {
    try {
      const res = await axios.get(
        `https://kisan.etpl.ai/farmer/register/all`,
        {
          params: { traderId, role: "trader" },
        }
      );

      if (res.data.success && res.data.data.length > 0) {
        const t = res.data.data[0];
        return {
          traderId,
          traderName: t.personalInfo?.name || "N/A",
          traderMobile: t.personalInfo?.mobileNo || "N/A",
          location: {
            address: t.personalInfo?.address || "",
            state: t.personalInfo?.state || "",
            pincode: t.personalInfo?.pincode || "",
            district: t.personalInfo?.district || "",
            taluk: t.personalInfo?.taluk || "",
            villageGramaPanchayat:
              t.personalInfo?.villageGramaPanchayat || "",
            post: t.personalInfo?.post || "",
          },
        };
      }
    } catch (err) {
      console.error("Trader fetch error:", err);
    }
    return null;
  };

  /* ================= Fetch Orders ================= */

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        const transporter = await fetchTransporterData();
        if (!transporter) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`https://kisan.etpl.ai/api/orders`);

        if (res.data.success) {
          const orderList = res.data.data;

          const enriched = await Promise.all(
            orderList.map(async (o: any) => {
              const marketId = o.productItems?.[0]?.nearestMarket;
              const pickupMarket = marketId
                ? await fetchMarket(marketId)
                : null;
              const traderDetails = await fetchTrader(o.traderId);

              return {
                _id: o._id,
                orderId: o.orderId,
                traderId: o.traderId,
                productItems: o.productItems,
                createdAt: o.createdAt,
                pickupMarket,
                traderDetails,
                journeyStatus:
                  o.transporterStatus === "started"
                    ? "started"
                    : o.transporterStatus === "completed"
                    ? "completed"
                    : "pending",
                transporterAccepted:
                  o.transporterStatus === "accepted" ||
                  o.transporterStatus === "approved",
              };
            })
          );

          const productIds: string[] = [];
          enriched.forEach((o) =>
            o.productItems.forEach((p) => {
              if (!productIds.includes(p.productId))
                productIds.push(p.productId);
            })
          );

          await fetchProductNames(productIds);
          setOrders(enriched);
        }
      } catch (err) {
        console.error("❌ Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  /* ================= ACTIONS ================= */

  const handleAccept = async (order: Order) => {
    try {
      if (!transporterData) {
        Alert.alert(
          "Error",
          "Transporter data not loaded. Please refresh the page."
        );
        return;
      }

      const vehicleDetails = getVehicleDetails(transporterData);

      const transporterDetails = {
        transporterId: transporterData._id,
        transporterName: transporterData.personalInfo.name,
        transporterMobile: transporterData.personalInfo.mobileNo,
        vehicleType: vehicleDetails.vehicleType,
        vehicleNumber: vehicleDetails.vehicleNumber,
        vehicleCapacity: vehicleDetails.vehicleCapacity,
        driverName: vehicleDetails.driverName,
        driverMobile: vehicleDetails.driverMobile,
      };

      await axios.post(
        `https://kisan.etpl.ai/api/orders/${order.orderId}/transporter-accept`,
        { transporterDetails }
      );

      Alert.alert("Success", "Offer sent to Admin ✅ Waiting for approval");

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === order.orderId
            ? { ...o, transporterAccepted: true }
            : o
        )
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to accept order");
    }
  };

  const handleStartJourney = async (orderId: string) => {
    setCurrentOrderId(orderId);
    setModalType("start");
    setSecretKey("");
    setModalVisible(true);
  };

  const handleCompleteDelivery = async (orderId: string) => {
    setCurrentOrderId(orderId);
    setModalType("complete");
    setSecretKey("");
    setModalVisible(true);
  };

  const submitSecretKey = async () => {
    if (!secretKey.trim()) {
      Alert.alert("Error", "Please enter a secret key");
      return;
    }

    try {
      if (modalType === "start") {
        await axios.post(
          `https://kisan.etpl.ai/api/orders/${currentOrderId}/start-journey`,
          { pickupKey: secretKey }
        );

        Alert.alert("Success", "Journey Started 🚚");

        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === currentOrderId
              ? { ...o, journeyStatus: "started" }
              : o
          )
        );
      } else {
        await axios.post(
          `https://kisan.etpl.ai/api/orders/${currentOrderId}/complete-delivery`,
          { traderKey: secretKey }
        );

        Alert.alert("Success", "Delivery Completed ✅");

        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === currentOrderId
              ? { ...o, journeyStatus: "completed" }
              : o
          )
        );
      }

      setModalVisible(false);
      setSecretKey("");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Invalid Key ❌"
      );
    }
  };

  const handleReject = (orderId: string) => {
    Alert.alert(
      "Confirm Reject",
      "Are you sure you want to reject this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setOrders((prev) =>
              prev.filter((o) => o.orderId !== orderId)
            );
          },
        },
      ]
    );
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-lg text-gray-600">Loading Orders...</Text>
      </View>
    );
  }

  if (!transporterData) {
    return (
      <View className="flex-1 justify-center items-center p-10">
        <Text className="text-2xl font-bold text-amber-600 mb-2">⚠️</Text>
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Transporter Not Logged In
        </Text>
        <Text className="text-gray-600 text-center">
          Please login to view orders.
        </Text>
      </View>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "started":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "pending":
        return "🟡";
      case "started":
        return "🟢";
      case "completed":
        return "✅";
      default:
        return "⚪";
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          🚚 Transporter Orders
        </Text>

        <View className="bg-amber-50 p-4 rounded-xl border-2 border-amber-300 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            👤 {transporterData.personalInfo.name}
          </Text>
          <Text className="text-gray-600 mb-2">
            📱 {transporterData.personalInfo.mobileNo}
          </Text>
          {transporterData.transportInfo.vehicles &&
            transporterData.transportInfo.vehicles.length > 0 && (
              <Text className="text-gray-600">
                🚗 {transporterData.transportInfo.vehicles.length} vehicle(s)
                registered
              </Text>
            )}
        </View>

        {orders.length === 0 ? (
          <View className="bg-white p-8 rounded-xl items-center">
            <Text className="text-lg text-gray-500">
              No orders available
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <View
              key={order._id}
              className="bg-white p-5 rounded-xl shadow-sm mb-4"
            >
              <Text className="text-xl font-bold text-gray-800 mb-3">
                Order ID: {order.orderId}
              </Text>

              <View
                className={`px-3 py-1.5 rounded-full self-start mb-4 ${getStatusColor(
                  order.journeyStatus
                )}`}
              >
                <Text className="font-medium">
                  {getStatusIcon(order.journeyStatus)}{" "}
                  {order.journeyStatus === "pending" && "Waiting"}
                  {order.journeyStatus === "started" &&
                    "Journey Started"}
                  {order.journeyStatus === "completed" &&
                    "Completed"}
                </Text>
              </View>

              {/* Pickup */}
              <View className="bg-cyan-50 p-4 rounded-xl mb-3 border border-cyan-100">
                <Text className="font-bold text-gray-700 mb-2">
                  📍 Pickup
                </Text>
                {order.pickupMarket ? (
                  <View>
                    <Text className="text-gray-800 font-medium">
                      {order.pickupMarket.marketName}
                    </Text>
                    <Text className="text-gray-600">
                      {order.pickupMarket.exactAddress}
                    </Text>
                    <Text className="text-gray-600">
                      {order.pickupMarket.district},{" "}
                      {order.pickupMarket.state}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-gray-500">
                    Not Available
                  </Text>
                )}
              </View>

              {/* Delivery */}
              <View className="bg-green-50 p-4 rounded-xl mb-3 border border-green-100">
                <Text className="font-bold text-gray-700 mb-2">
                  🏠 Delivery
                </Text>
                {order.traderDetails ? (
                  <View>
                    <Text className="text-gray-800 font-medium">
                      {order.traderDetails.traderName} —{" "}
                      {order.traderDetails.traderMobile}
                    </Text>
                    <Text className="text-gray-600">
                      {order.traderDetails.location.address}
                    </Text>
                    <Text className="text-gray-600">
                      {order.traderDetails.location.taluk},{" "}
                      {order.traderDetails.location.district}
                    </Text>
                    <Text className="text-gray-600">
                      {order.traderDetails.location.state} -{" "}
                      {order.traderDetails.location.pincode}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-gray-500">
                    Not Available
                  </Text>
                )}
              </View>

              {/* Items */}
              <View className="mt-4">
                <Text className="font-bold text-gray-700 mb-2">
                  📦 Items
                </Text>
                {order.productItems.map((item, idx) => (
                  <View
                    key={idx}
                    className="bg-gray-50 p-3 rounded-lg mb-2"
                  >
                    <Text className="font-bold text-gray-800 mb-1">
                      {productNames[item.productId] ||
                        item.productId}
                    </Text>
                    <View className="flex-row">
                      <Text className="text-gray-600 mr-4">
                        Grade: {item.grade}
                      </Text>
                      <Text className="text-gray-600">
                        Qty: {item.quantity}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* ACTIONS */}
              <View className="mt-6 flex-row flex-wrap gap-2">
                {order.journeyStatus === "pending" && (
                  <>
                    <TouchableOpacity
                      disabled={order.transporterAccepted}
                      onPress={() => handleAccept(order)}
                      className={`px-4 py-3 rounded-lg ${
                        order.transporterAccepted
                          ? "bg-gray-300"
                          : "bg-green-500"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          order.transporterAccepted
                            ? "text-gray-500"
                            : "text-white"
                        }`}
                      >
                        Accept Offer
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={order.transporterAccepted}
                      onPress={() =>
                        handleReject(order.orderId)
                      }
                      className={`px-4 py-3 rounded-lg ${
                        order.transporterAccepted
                          ? "bg-gray-300"
                          : "bg-red-500"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          order.transporterAccepted
                            ? "text-gray-500"
                            : "text-white"
                        }`}
                      >
                        Reject
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={!order.transporterAccepted}
                      onPress={() =>
                        handleStartJourney(order.orderId)
                      }
                      className={`px-4 py-3 rounded-lg ${
                        !order.transporterAccepted
                          ? "bg-gray-300"
                          : "bg-blue-500"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          !order.transporterAccepted
                            ? "text-gray-500"
                            : "text-white"
                        }`}
                      >
                        Start Journey
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {order.journeyStatus === "started" && (
                  <TouchableOpacity
                    onPress={() =>
                      handleCompleteDelivery(order.orderId)
                    }
                    className="px-4 py-3 rounded-lg bg-purple-500"
                  >
                    <Text className="font-medium text-white">
                      Complete Delivery
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Secret Key Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSecretKey("");
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <Text className="text-2xl font-bold text-gray-800 mb-1">
              {modalType === "start" ? "🚚 Start Journey" : "✅ Complete Delivery"}
            </Text>
            <Text className="text-gray-600 mb-6">
              {modalType === "start" 
                ? "Enter Admin Pickup Secret Key to start the journey" 
                : "Enter Trader Delivery Secret Key to complete delivery"}
            </Text>
            
            <TextInput
              className="border-2 border-gray-200 p-4 rounded-xl text-lg mb-6"
              placeholder="Enter secret key..."
              value={secretKey}
              onChangeText={setSecretKey}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSecretKey("");
                }}
                className="px-6 py-3 rounded-xl bg-gray-100"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitSecretKey}
                className="px-6 py-3 rounded-xl bg-blue-500"
              >
                <Text className="text-white font-medium">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default TransporterOrders;