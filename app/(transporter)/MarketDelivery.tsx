

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// import Icon from 'react-native-vector-icons/FontAwesome';

// // Icon mapping
// const Icons = {
//   FaTruck: 'truck',
//   FaUser: 'user',
//   FaPhone: 'phone',
//   FaMapMarker: 'map-marker',
//   FaBox: 'cube',
//   FaCheck: 'check',
//   FaTimes: 'times',
//   FaClock: 'clock-o',
//   FaPlay: 'play',
//   FaFlag: 'flag',
//   FaArrowRight: 'arrow-right',
//   FaBuilding: 'building',
//   FaCalendar: 'calendar',
//   FaKey: 'key'
// };

// /* ================= Interfaces ================= */

// interface ProductItem {
//   productId: string;
//   grade: string;
//   quantity: number;
//   nearestMarket: string;
//   deliveryDate?: string;
// }

// interface MarketDetails {
//   _id: string;
//   marketName: string;
//   exactAddress: string;
//   landmark?: string;
//   district?: string;
//   state?: string;
//   pincode?: string;
// }

// interface TraderLocation {
//   address: string;
//   state: string;
//   pincode: string;
//   district: string;
//   taluk: string;
//   villageGramaPanchayat: string;
//   post?: string;
// }

// interface TraderDetails {
//   traderId: string;
//   traderName: string;
//   traderMobile: string;
//   location: TraderLocation;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   productItems: ProductItem[];
//   createdAt: string;
//   pickupMarket?: MarketDetails;
//   traderDetails?: TraderDetails;
//   journeyStatus?: "pending" | "started" | "completed";
//   transporterAccepted?: boolean;
// }

// interface ProductDetails {
//   [key: string]: string;
// }

// interface TransporterData {
//   _id: string;
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//   };
//   transportInfo: {
//     vehicles: Array<{
//       vehicleType: string;
//       vehicleNumber: string;
//       vehicleCapacity: {
//         value: number;
//         unit: string;
//       };
//       driverInfo: {
//         driverName?: string;
//         driverMobileNo?: string;
//       };
//       primaryVehicle?: boolean;
//     }>;
//     vehicleType?: string;
//     vehicleNumber?: string;
//     vehicleCapacity?: {
//       value: number;
//       unit: string;
//     };
//     driverInfo?: {
//       driverName?: string;
//       driverMobileNo?: string;
//     };
//   };
// }

// /* ================= Component ================= */

// const MakeDelivery: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [productNames, setProductNames] = useState<ProductDetails>({});
//   const [transporterData, setTransporterData] =
//     useState<TransporterData | null>(null);
  
//   // Modal states
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState<"start" | "complete">("start");
//   const [secretKey, setSecretKey] = useState("");
//   const [currentOrderId, setCurrentOrderId] = useState("");

//   /* ================= Fetch Transporter Data ================= */

//   const fetchTransporterData = async () => {
//     try {
//       const mongoId = await AsyncStorage.getItem("id");
//       const transporterId = await AsyncStorage.getItem("transporterId");

//       console.log("📦 AsyncStorage mongoId:", mongoId);
//       console.log("📦 AsyncStorage transporterId:", transporterId);

//       let res;

//       // ✅ Prefer Mongo ID
//       if (mongoId) {
//         res = await axios.get(
//           `https://kisan.etpl.ai/api/transporter/profile/${mongoId}`
//         );
//       }
//       // ✅ Fallback to transporterId (if backend supports search)
//       else if (transporterId) {
//         res = await axios.get(
//           `https://kisan.etpl.ai/api/transporter/profile`,
//           { params: { transporterId } }
//         );
//       } else {
//         console.error("❌ No transporter ID found in AsyncStorage");
//         return null;
//       }

//       console.log("✅ Transporter API response:", res.data);

//       if (res.data?.success && res.data?.data) {
//         setTransporterData(res.data.data);
//         return res.data.data;
//       }
//     } catch (err) {
//       console.error("❌ Transporter fetch error:", err);
//     }
//     return null;
//   };

//   /* ================= Get Primary Vehicle or First Vehicle ================= */

//   const getVehicleDetails = (transporter: TransporterData) => {
//     if (
//       transporter.transportInfo.vehicles &&
//       transporter.transportInfo.vehicles.length > 0
//     ) {
//       const primaryVehicle = transporter.transportInfo.vehicles.find(
//         (v) => v.primaryVehicle
//       );
//       const vehicle =
//         primaryVehicle || transporter.transportInfo.vehicles[0];

//       return {
//         vehicleType: vehicle.vehicleType,
//         vehicleNumber: vehicle.vehicleNumber,
//         vehicleCapacity: `${vehicle.vehicleCapacity.value} ${vehicle.vehicleCapacity.unit}`,
//         driverName: vehicle.driverInfo?.driverName || "N/A",
//         driverMobile: vehicle.driverInfo?.driverMobileNo || "N/A",
//       };
//     }

//     if (
//       transporter.transportInfo.vehicleType &&
//       transporter.transportInfo.vehicleNumber
//     ) {
//       return {
//         vehicleType: transporter.transportInfo.vehicleType,
//         vehicleNumber: transporter.transportInfo.vehicleNumber,
//         vehicleCapacity: transporter.transportInfo.vehicleCapacity
//           ? `${transporter.transportInfo.vehicleCapacity.value} ${transporter.transportInfo.vehicleCapacity.unit}`
//           : "N/A",
//         driverName: transporter.transportInfo.driverInfo?.driverName || "N/A",
//         driverMobile:
//           transporter.transportInfo.driverInfo?.driverMobileNo || "N/A",
//       };
//     }

//     return {
//       vehicleType: "N/A",
//       vehicleNumber: "N/A",
//       vehicleCapacity: "N/A",
//       driverName: "N/A",
//       driverMobile: "N/A",
//     };
//   };

//   /* ================= Fetch Product Names ================= */

//   const fetchProductNames = async (productIds: string[]) => {
//     const names: ProductDetails = {};

//     await Promise.all(
//       productIds.map(async (id) => {
//         try {
//           const res = await axios.get(`https://kisan.etpl.ai/product/${id}`);
//           names[id] =
//             res.data?.data?.productName ||
//             res.data?.data?.subCategoryId?.name ||
//             "Product";
//         } catch {
//           names[id] = "Product";
//         }
//       })
//     );

//     setProductNames(names);
//   };

//   /* ================= Fetch Market ================= */

//   const fetchMarket = async (marketId: string) => {
//     try {
//       const res = await axios.get(
//         `https://kisan.etpl.ai/api/market/${marketId}`
//       );
//       if (res.data?.data) return res.data.data;
//     } catch (err) {
//       console.error("Market fetch error:", err);
//     }
//     return null;
//   };

//   /* ================= Fetch Trader ================= */

//   const fetchTrader = async (traderId: string) => {
//     try {
//       const res = await axios.get(
//         `https://kisan.etpl.ai/farmer/register/all`,
//         {
//           params: { traderId, role: "trader" },
//         }
//       );

//       if (res.data.success && res.data.data.length > 0) {
//         const t = res.data.data[0];
//         return {
//           traderId,
//           traderName: t.personalInfo?.name || "N/A",
//           traderMobile: t.personalInfo?.mobileNo || "N/A",
//           location: {
//             address: t.personalInfo?.address || "",
//             state: t.personalInfo?.state || "",
//             pincode: t.personalInfo?.pincode || "",
//             district: t.personalInfo?.district || "",
//             taluk: t.personalInfo?.taluk || "",
//             villageGramaPanchayat:
//               t.personalInfo?.villageGramaPanchayat || "",
//             post: t.personalInfo?.post || "",
//           },
//         };
//       }
//     } catch (err) {
//       console.error("Trader fetch error:", err);
//     }
//     return null;
//   };

//   /* ================= Fetch Orders ================= */

//   useEffect(() => {
//     const loadOrders = async () => {
//       try {
//         setLoading(true);

//         const transporter = await fetchTransporterData();
//         if (!transporter) {
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get(`https://kisan.etpl.ai/api/orders`);

//         if (res.data.success) {
//           const orderList = res.data.data;

//           const enriched = await Promise.all(
//             orderList.map(async (o: any) => {
//               const marketId = o.productItems?.[0]?.nearestMarket;
//               const pickupMarket = marketId
//                 ? await fetchMarket(marketId)
//                 : null;
//               const traderDetails = await fetchTrader(o.traderId);

//               return {
//                 _id: o._id,
//                 orderId: o.orderId,
//                 traderId: o.traderId,
//                 productItems: o.productItems,
//                 createdAt: o.createdAt,
//                 pickupMarket,
//                 traderDetails,
//                 journeyStatus:
//                   o.transporterStatus === "started"
//                     ? "started"
//                     : o.transporterStatus === "completed"
//                     ? "completed"
//                     : "pending",
//                 transporterAccepted:
//                   o.transporterStatus === "accepted" ||
//                   o.transporterStatus === "approved",
//               };
//             })
//           );

//           const productIds: string[] = [];
//           enriched.forEach((o) =>
//             o.productItems.forEach((p) => {
//               if (!productIds.includes(p.productId))
//                 productIds.push(p.productId);
//             })
//           );

//           await fetchProductNames(productIds);
//           setOrders(enriched);
//         }
//       } catch (err) {
//         console.error("❌ Order fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadOrders();
//   }, []);

//   /* ================= ACTIONS ================= */

//   const handleAccept = async (order: Order) => {
//     try {
//       if (!transporterData) {
//         Alert.alert(
//           "Error",
//           "Transporter data not loaded. Please refresh the page."
//         );
//         return;
//       }

//       const vehicleDetails = getVehicleDetails(transporterData);

//       const transporterDetails = {
//         transporterId: transporterData._id,
//         transporterName: transporterData.personalInfo.name,
//         transporterMobile: transporterData.personalInfo.mobileNo,
//         vehicleType: vehicleDetails.vehicleType,
//         vehicleNumber: vehicleDetails.vehicleNumber,
//         vehicleCapacity: vehicleDetails.vehicleCapacity,
//         driverName: vehicleDetails.driverName,
//         driverMobile: vehicleDetails.driverMobile,
//       };

//       await axios.post(
//         `https://kisan.etpl.ai/api/orders/${order.orderId}/transporter-accept`,
//         { transporterDetails }
//       );

//       Alert.alert("Success", "Offer sent to Admin ✅ Waiting for approval");

//       setOrders((prev) =>
//         prev.map((o) =>
//           o.orderId === order.orderId
//             ? { ...o, transporterAccepted: true }
//             : o
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to accept order");
//     }
//   };

//   const handleStartJourney = async (orderId: string) => {
//     setCurrentOrderId(orderId);
//     setModalType("start");
//     setSecretKey("");
//     setModalVisible(true);
//   };

//   const handleCompleteDelivery = async (orderId: string) => {
//     setCurrentOrderId(orderId);
//     setModalType("complete");
//     setSecretKey("");
//     setModalVisible(true);
//   };

//   const submitSecretKey = async () => {
//     if (!secretKey.trim()) {
//       Alert.alert("Error", "Please enter a secret key");
//       return;
//     }

//     try {
//       if (modalType === "start") {
//         await axios.post(
//           `https://kisan.etpl.ai/api/orders/${currentOrderId}/start-journey`,
//           { pickupKey: secretKey }
//         );

//         Alert.alert("Success", "Journey Started 🚚");

//         setOrders((prev) =>
//           prev.map((o) =>
//             o.orderId === currentOrderId
//               ? { ...o, journeyStatus: "started" }
//               : o
//           )
//         );
//       } else {
//         await axios.post(
//           `https://kisan.etpl.ai/api/orders/${currentOrderId}/complete-delivery`,
//           { traderKey: secretKey }
//         );

//         Alert.alert("Success", "Delivery Completed ✅");

//         setOrders((prev) =>
//           prev.map((o) =>
//             o.orderId === currentOrderId
//               ? { ...o, journeyStatus: "completed" }
//               : o
//           )
//         );
//       }

//       setModalVisible(false);
//       setSecretKey("");
//     } catch (err: any) {
//       Alert.alert(
//         "Error",
//         err?.response?.data?.message || "Invalid Key ❌"
//       );
//     }
//   };

//   const handleReject = (orderId: string) => {
//     Alert.alert(
//       "Confirm Reject",
//       "Are you sure you want to reject this order?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Reject",
//           style: "destructive",
//           onPress: () => {
//             setOrders((prev) =>
//               prev.filter((o) => o.orderId !== orderId)
//             );
//           },
//         },
//       ]
//     );
//   };

//   /* ================= UI ================= */

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#3b82f6" />
//         <Text className="mt-4 text-lg text-gray-600">Loading Orders...</Text>
//       </View>
//     );
//   }

//   if (!transporterData) {
//     return (
//       <View className="flex-1 justify-center items-center p-10">
//         <Text className="text-2xl font-medium text-amber-600 mb-2">⚠️</Text>
//         <Text className="text-xl font-medium text-gray-800 mb-2">
//           Transporter Not Logged In
//         </Text>
//         <Text className="text-gray-600 text-center">
//           Please login to view orders.
//         </Text>
//       </View>
//     );
//   }

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case "pending":
//         return "text-amber-600 bg-amber-50 border-amber-200";
//       case "started":
//         return "text-blue-600 bg-blue-50 border-blue-200";
//       case "completed":
//         return "text-green-600 bg-green-50 border-green-200";
//       default:
//         return "text-gray-600 bg-gray-50 border-gray-200";
//     }
//   };

//   const getStatusIcon = (status?: string) => {
//     switch (status) {
//       case "pending":
//         return Icons.FaClock;
//       case "started":
//         return Icons.FaTruck;
//       case "completed":
//         return Icons.FaCheck;
//       default:
//         return Icons.FaClock;
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <ScrollView contentContainerClassName="p-5 pb-10">
//         <View className="flex-row items-center mb-6">
//           <View className="bg-white p-2 rounded-full mr-3 shadow-sm">
//             <Icon name={Icons.FaTruck} size={24} color="#5B5AF7" />
//           </View>
//           <Text className="text-2xl font-medium text-gray-800">
//             Delivery Orders
//           </Text>
//         </View>

//         {transporterData && (
//           <View className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm mb-6">
//             <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100">
//                <View className="bg-blue-50 p-2 rounded-full mr-3">
//                  <Icon name={Icons.FaUser} size={16} color="#5B5AF7" />
//                </View>
//                <Text className="text-lg font-medium text-gray-800">Transporter Profile</Text>
//             </View>
            
//             <View className="flex-row items-center mb-3">
//               <Icon name={Icons.FaUser} size={14} color="#64748b" style={{ width: 20 }} />
//               <Text className="text-gray-700 font-medium ml-2">{transporterData.personalInfo.name}</Text>
//             </View>
            
//             <View className="flex-row items-center mb-3">
//               <Icon name={Icons.FaPhone} size={14} color="#64748b" style={{ width: 20 }} />
//               <Text className="text-gray-700 ml-2">{transporterData.personalInfo.mobileNo}</Text>
//             </View>

//             {transporterData.transportInfo.vehicles &&
//               transporterData.transportInfo.vehicles.length > 0 && (
//                 <View className="flex-row items-center">
//                   <Icon name={Icons.FaTruck} size={14} color="#64748b" style={{ width: 20 }} />
//                   <Text className="text-gray-700 ml-2">
//                     {transporterData.transportInfo.vehicles.length} vehicle(s) registered
//                   </Text>
//                 </View>
//               )}
//           </View>
//         )}

//         {orders.length === 0 ? (
//           <View className="bg-white p-10 rounded-xl items-center border border-gray-100 shadow-sm">
//             <Icon name={Icons.FaBox} size={48} color="#cbd5e1" />
//             <Text className="text-lg text-gray-500 font-medium mt-4">
//               No orders available
//             </Text>
//             <Text className="text-sm text-gray-400 text-center mt-2 px-6">
//               When new delivery orders are assigned to you, they will appear here.
//             </Text>
//           </View>
//         ) : (
//           orders.map((order) => {
//              const statusColorBase = getStatusColor(order.journeyStatus);
             
//              return (
//             <View
//               key={order._id}
//               className="bg-white rounded-xl shadow-sm border border-slate-100 mb-5 overflow-hidden"
//             >
//               {/* Card Header */}
//               <View className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex-row justify-between items-center">
//                 <View>
//                   <Text className="text-xs text-gray-500 uppercase font-medium mb-1">Order ID</Text>
//                   <Text className="text-base font-medium text-gray-800">#{order.orderId}</Text>
//                 </View>
//                 <View
//                   className={`px-3 py-1.5 rounded-full border flex-row items-center gap-2 ${statusColorBase}`}
//                 >
//                   <Icon name={getStatusIcon(order.journeyStatus)} size={12} color={
//                     order.journeyStatus === 'started' ? '#2563eb' : 
//                     order.journeyStatus === 'completed' ? '#16a34a' : '#d97706'
//                   } />
//                   <Text className={`font-medium text-xs ${statusColorBase.split(' ')[0]}`}>
//                     {order.journeyStatus === "pending" && "Pending"}
//                     {order.journeyStatus === "started" && "On Journey"}
//                     {order.journeyStatus === "completed" && "Completed"}
//                   </Text>
//                 </View>
//               </View>

//               <View className="p-5">
//                 {/* Pickup Section */}
//                 <View className="flex-row mb-6 relative">
//                   {/* Connector Line */}
//                   <View className="absolute left-[15px] top-8 bottom-[-20px] w-[2px] bg-gray-200 z-0" />
                  
//                   <View className="bg-blue-50 w-8 h-8 rounded-full items-center justify-center mr-4 z-10 border-2 border-white shadow-sm">
//                     <Icon name={Icons.FaMapMarker} size={14} color="#3b82f6" />
//                   </View>
//                   <View className="flex-1">
//                     <Text className="text-xs text-gray-500 font-medium mb-1 uppercase">Pickup From</Text>
//                     {order.pickupMarket ? (
//                       <View>
//                         <Text className="text-gray-900 font-medium text-base mb-1">
//                           {order.pickupMarket.marketName}
//                         </Text>
//                         <Text className="text-gray-600 text-sm leading-5">
//                           {order.pickupMarket.exactAddress}, {order.pickupMarket.district}
//                         </Text>
//                       </View>
//                     ) : (
//                       <Text className="text-gray-400 italic">Location details unavailable</Text>
//                     )}
//                   </View>
//                 </View>

//                 {/* Delivery Section */}
//                 <View className="flex-row mb-6">
//                   <View className="bg-green-50 w-8 h-8 rounded-full items-center justify-center mr-4 z-10 border-2 border-white shadow-sm">
//                     <Icon name={Icons.FaFlag} size={12} color="#22c55e" />
//                   </View>
//                   <View className="flex-1">
//                     <Text className="text-xs text-gray-500 font-medium mb-1 uppercase">Deliver To</Text>
//                     {order.traderDetails ? (
//                       <View>
//                         <Text className="text-gray-900 font-medium text-base mb-1">
//                           {order.traderDetails.traderName}
//                         </Text>
//                         <View className="flex-row items-center mb-1">
//                           <Icon name={Icons.FaPhone} size={10} color="#64748b" className="mr-1" />
//                           <Text className="text-slate-500 text-xs ml-1">{order.traderDetails.traderMobile}</Text>
//                         </View>
//                         <Text className="text-gray-600 text-sm leading-5">
//                           {order.traderDetails.location.address}, {order.traderDetails.location.district}
//                         </Text>
//                       </View>
//                     ) : (
//                       <Text className="text-gray-400 italic">Recipient details unavailable</Text>
//                     )}
//                   </View>
//                 </View>

//                 {/* Items Section */}
//                 <View className="bg-slate-50 rounded-lg p-4 border border-slate-100">
//                   <View className="flex-row items-center gap-2 mb-3">
//                     <Icon name={Icons.FaBox} size={14} color="#64748b" />
//                     <Text className="font-medium text-gray-700 text-sm">Cargo Contents</Text>
//                   </View>
                  
//                   {order.productItems.map((item, idx) => (
//                     <View
//                       key={idx}
//                       className="bg-white p-3 rounded border border-gray-100 mb-2 last:mb-0 flex-row justify-between items-center"
//                     >
//                       <View>
//                         <Text className="font-medium text-gray-800">
//                           {productNames[item.productId] || item.productId}
//                         </Text>
//                         <Text className="text-xs text-gray-500 mt-1">Grade: {item.grade}</Text>
//                       </View>
//                       <View className="bg-blue-50 px-3 py-1 rounded text-center">
//                         <Text className="text-blue-700 font-medium text-sm">
//                           {item.quantity}
//                         </Text>
//                         <Text className="text-[10px] text-blue-500 text-center">Qty</Text>
//                       </View>
//                     </View>
//                   ))}
//                 </View>

//                 {/* Actions */}
//                 <View className="mt-6 pt-5 border-t border-gray-100 flex-row gap-3">
//                   {order.journeyStatus === "pending" && (
//                     <>
//                       <TouchableOpacity
//                         disabled={order.transporterAccepted}
//                         onPress={() => handleAccept(order)}
//                         className={`flex-1 py-3 rounded-lg flex-row justify-center items-center gap-2 ${
//                           order.transporterAccepted
//                             ? "bg-gray-100 border border-gray-200"
//                             : "bg-green-600 shadow-sm shadow-green-200"
//                         }`}
//                       >
//                          {order.transporterAccepted ? (
//                            <>
//                              <Icon name={Icons.FaCheck} size={14} color="#9ca3af" />
//                              <Text className="text-gray-400 font-medium">Accepted</Text>
//                            </>
//                          ) : (
//                            <>
//                              <Icon name={Icons.FaCheck} size={14} color="white" />
//                              <Text className="text-white font-medium">Accept Job</Text>
//                            </>
//                          )}
//                       </TouchableOpacity>

//                       {!order.transporterAccepted && (
//                         <TouchableOpacity
//                           onPress={() => handleReject(order.orderId)}
//                           className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 items-center justify-center shadow-sm"
//                         >
//                           <Icon name={Icons.FaTimes} size={16} color="#ef4444" />
//                         </TouchableOpacity>
//                       )}

//                       <TouchableOpacity
//                         disabled={!order.transporterAccepted}
//                         onPress={() => handleStartJourney(order.orderId)}
//                         className={`flex-1 py-3 rounded-lg flex-row justify-center items-center gap-2 ${
//                           !order.transporterAccepted
//                             ? "bg-gray-100 border border-gray-200 opacity-50"
//                             : "bg-blue-600 shadow-sm shadow-blue-200"
//                         }`}
//                       >
//                         <Icon name={Icons.FaPlay} size={14} color={!order.transporterAccepted ? "#9ca3af" : "white"} />
//                         <Text
//                           className={`font-medium ${
//                             !order.transporterAccepted ? "text-gray-400" : "text-white"
//                           }`}
//                         >
//                           Start Journey
//                         </Text>
//                       </TouchableOpacity>
//                     </>
//                   )}

//                   {order.journeyStatus === "started" && (
//                     <TouchableOpacity
//                       onPress={() => handleCompleteDelivery(order.orderId)}
//                       className="flex-1 py-4 rounded-xl bg-purple-600 shadow-md shadow-purple-200 flex-row justify-center items-center gap-2"
//                     >
//                       <Icon name={Icons.FaCheck} size={16} color="white" />
//                       <Text className="font-medium text-white text-base">
//                         Complete Delivery
//                       </Text>
//                     </TouchableOpacity>
//                   )}
                  
//                   {order.journeyStatus === "completed" && (
//                      <View className="flex-1 bg-green-50 py-3 rounded-lg flex-row justify-center items-center gap-2 border border-green-100">
//                         <Icon name={Icons.FaCheck} size={14} color="#16a34a" />
//                         <Text className="text-green-700 font-medium">Delivery Successful</Text>
//                      </View>
//                   )}
//                 </View>
//               </View>
//             </View>
//           );
//         })
//         )}
//       </ScrollView>

//       {/* Secret Key Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(false);
//           setSecretKey("");
//         }}
//         statusBarTranslucent
//       >
//         <View className="flex-1 justify-center items-center bg-black/60 px-6">
//           <View className="bg-white rounded-2xl w-full max-w-sm p-0 overflow-hidden shadow-2xl">
//             <View className={`p-6 pb-8 ${modalType === 'start' ? 'bg-blue-600' : 'bg-purple-600'}`}>
//                <View className="mb-4 bg-white/20 self-start p-3 rounded-xl">
//                  <Icon name={modalType === 'start' ? Icons.FaPlay : Icons.FaCheck} size={24} color="white" />
//                </View>
//                <Text className="text-2xl font-medium text-white">
//                  {modalType === "start" ? "Start Journey" : "Complete Delivery"}
//                </Text>
//                <Text className="text-white/80 mt-2 text-sm leading-5">
//                  {modalType === "start" 
//                    ? "Ask the admin for the secret pickup key to begin the transport." 
//                    : "Ask the trader for the secret delivery key to complete this order."}
//                </Text>
//             </View>
            
//             <View className="p-6">
//               <Text className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Enter Secret Key</Text>
//               <View className="border border-gray-300 rounded-xl px-4 py-3 flex-row items-center mb-6 bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors">
//                 <Icon name={Icons.FaKey} size={16} color="#9ca3af" />
//                 <TextInput
//                   className="flex-1 ml-3 text-lg font-medium text-gray-800"
//                   placeholder="e.g. 123456"
//                   placeholderTextColor="#cbd5e1"
//                   value={secretKey}
//                   onChangeText={setSecretKey}
//                   secureTextEntry
//                   keyboardType="numeric"
//                   autoCapitalize="none"
//                 />
//               </View>
              
//               <View className="flex-row gap-3">
//                 <TouchableOpacity
//                   onPress={() => {
//                     setModalVisible(false);
//                     setSecretKey("");
//                   }}
//                   className="flex-1 py-3.5 rounded-xl bg-white border border-gray-300 items-center"
//                 >
//                   <Text className="text-gray-700 font-medium">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={submitSecretKey}
//                   className={`flex-1 py-3.5 rounded-xl items-center shadow-lg shadow-blue-200 ${
//                     modalType === 'start' ? 'bg-blue-600' : 'bg-purple-600'
//                   }`}
//                 >
//                   <Text className="text-white font-medium">Submit Key</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default MakeDelivery;





//updated product details 




import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';


// Icon mapping
const Icons = {
  FaTruck: 'truck',
  FaUser: 'user',
  FaPhone: 'phone',
  FaMapMarker: 'map-marker',
  FaBox: 'cube',
  FaCheck: 'check',
  FaTimes: 'times',
  FaClock: 'clock-o',
  FaPlay: 'play',
  FaFlag: 'flag',
  FaArrowRight: 'arrow-right',
  FaBuilding: 'building',
  FaCalendar: 'calendar',
  FaKey: 'key',
  FaEye: 'eye',
  FaTag: 'tag',
  FaSeedling: 'leaf',
  FaPackage: 'archive',
  FaInfoCircle: 'info-circle',
  FaImage: 'image',
  FaTimesCircle: 'times-circle'
};

const { width } = Dimensions.get('window');

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

/* ================= New Interfaces for Product Details ================= */

interface GradePrice {
  grade: string;
  pricePerUnit: number;
  totalQty: number;
  quantityType: string;
  priceType: string;
  status: string;
}

interface FullProductDetails {
  productId: string;
  categoryId?: {
    _id: string;
    name: string;
  };
  subCategoryId?: string | {
    _id: string;
    name: string;
  };
  productName?: string;
  cropBriefDetails?: string;
  farmingType?: string;
  typeOfSeeds?: string;
  packagingType?: string;
  packageMeasurement?: string;
  unitMeasurement?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  nearestMarket?: string;
  cropPhotos?: string[];
  gradePrices?: GradePrice[];
  status?: string;
}

interface SubCategory {
  _id: string;
  subCategoryId: string;
  subCategoryName: string;
  categoryId: string;
  image?: string;
}

/* ================= Component ================= */

const MakeDelivery: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [productNames, setProductNames] = useState<ProductDetails>({});
  const [transporterData, setTransporterData] = useState<TransporterData | null>(null);
  
  // New states for product details
  const [allProducts, setAllProducts] = useState<FullProductDetails[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{
    orderId: string;
    productId: string;
    grade: string;
    quantity: number;
  } | null>(null);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [productDetails, setProductDetails] = useState<FullProductDetails | null>(null);
  
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

  /* ================= Fetch All Products ================= */
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`https://kisan.etpl.ai/product/all`);
      if (res.data?.data) {
        setAllProducts(res.data.data);
        
        // Extract product names
        const names: ProductDetails = {};
        res.data.data.forEach((product: FullProductDetails) => {
          let productName = "Product";
          if (product.subCategoryId) {
            if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
              productName = product.subCategoryId.name;
            }
          } else if (product.categoryId?.name) {
            productName = product.categoryId.name;
          } else if (product.productName) {
            productName = product.productName;
          }
          names[product.productId] = productName;
        });
        setProductNames(names);
      }
    } catch (err) {
      console.error("Products fetch error:", err);
    }
  };

  /* ================= Fetch All SubCategories ================= */
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`https://kisan.etpl.ai/subcategory/all`);
      if (res.data?.data) {
        setSubCategories(res.data.data);
      }
    } catch (err) {
      console.error("SubCategories fetch error:", err);
    }
  };

  /* ================= Get SubCategory Name Helper ================= */
  const getSubCategoryNameForProduct = (product: FullProductDetails): string => {
    if (!product.subCategoryId) return "N/A";

    if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
      return product.subCategoryId.name;
    }

    const subCatId = typeof product.subCategoryId === 'string' 
      ? product.subCategoryId 
      : product.subCategoryId._id;
    
    const subCat = subCategories.find(sc => sc._id === subCatId || sc.subCategoryId === subCatId);
    return subCat?.subCategoryName || product.productName || "N/A";
  };

  /* ================= Get Product Details by ID and Grade ================= */
  const getProductDetails = (productId: string, grade: string) => {
    const product = allProducts.find(p => p.productId === productId);
    if (!product) return null;

    const gradeInfo = product.gradePrices?.find(g => g.grade === grade);
    
    return {
      ...product,
      selectedGrade: gradeInfo
    };
  };

  /* ================= View Product Details ================= */
  const viewProductDetails = (orderId: string, productId: string, grade: string, quantity: number) => {
    const details = getProductDetails(productId, grade);
    setSelectedProduct({ orderId, productId, grade, quantity });
    setProductDetails(details);
    setProductModalVisible(true);
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

        // First fetch subcategories and products
        await fetchSubCategories();
        await fetchAllProducts();

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
        <Text className="text-2xl font-medium text-amber-600 mb-2">⚠️</Text>
        <Text className="text-xl font-medium text-gray-800 mb-2">
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
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "started":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "pending":
        return Icons.FaClock;
      case "started":
        return Icons.FaTruck;
      case "completed":
        return Icons.FaCheck;
      default:
        return Icons.FaClock;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
       <View className="flex-row items-center mb-6">
          <View className="bg-white p-2 rounded-full mr-3 shadow-sm">
            <Icon name={Icons.FaTruck} size={24} color="#5B5AF7" />
          </View>
          <Text className="text-2xl font-medium text-gray-800">
            Delivery Orders
          </Text>
        </View>
      <ScrollView contentContainerClassName="p-5 pb-10">
       

        {transporterData && (
          <View className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm mb-6">
            <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100">
               <View className="bg-blue-50 p-2 rounded-full mr-3">
                 <Icon name={Icons.FaUser} size={16} color="#5B5AF7" />
               </View>
               <Text className="text-lg font-medium text-gray-800">Transporter Profile</Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Icon name={Icons.FaUser} size={14} color="#64748b" style={{ width: 20 }} />
              <Text className="text-gray-700 font-medium ml-2">{transporterData.personalInfo.name}</Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Icon name={Icons.FaPhone} size={14} color="#64748b" style={{ width: 20 }} />
              <Text className="text-gray-700 ml-2">{transporterData.personalInfo.mobileNo}</Text>
            </View>

            {transporterData.transportInfo.vehicles &&
              transporterData.transportInfo.vehicles.length > 0 && (
                <View className="flex-row items-center">
                  <Icon name={Icons.FaTruck} size={14} color="#64748b" style={{ width: 20 }} />
                  <Text className="text-gray-700 ml-2">
                    {transporterData.transportInfo.vehicles.length} vehicle(s) registered
                  </Text>
                </View>
              )}
          </View>
        )}

        {orders.length === 0 ? (
          <View className="bg-white p-10 rounded-xl items-center border border-gray-100 shadow-sm">
            <Icon name={Icons.FaBox} size={48} color="#cbd5e1" />
            <Text className="text-lg text-gray-500 font-medium mt-4">
              No orders available
            </Text>
            <Text className="text-sm text-gray-400 text-center mt-2 px-6">
              When new delivery orders are assigned to you, they will appear here.
            </Text>
          </View>
        ) : (
          orders.map((order) => {
             const statusColorBase = getStatusColor(order.journeyStatus);
             
             return (
            <View
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 mb-5 overflow-hidden"
            >
              {/* Card Header */}
              <View className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex-row justify-between items-center">
                <View>
                  <Text className="text-xs text-gray-500 uppercase font-medium mb-1">Order ID</Text>
                  <Text className="text-base font-medium text-gray-800">#{order.orderId}</Text>
                </View>
                <View
                  className={`px-3 py-1.5 rounded-full border flex-row items-center gap-2 ${statusColorBase}`}
                >
                  <Icon name={getStatusIcon(order.journeyStatus)} size={12} color={
                    order.journeyStatus === 'started' ? '#2563eb' : 
                    order.journeyStatus === 'completed' ? '#16a34a' : '#d97706'
                  } />
                  <Text className={`font-medium text-xs ${statusColorBase.split(' ')[0]}`}>
                    {order.journeyStatus === "pending" && "Pending"}
                    {order.journeyStatus === "started" && "On Journey"}
                    {order.journeyStatus === "completed" && "Completed"}
                  </Text>
                </View>
              </View>

              <View className="p-5">
                {/* Pickup Section */}
                <View className="flex-row mb-6 relative">
                  {/* Connector Line */}
                  <View className="absolute left-[15px] top-8 bottom-[-20px] w-[2px] bg-gray-200 z-0" />
                  
                  <View className="bg-blue-50 w-8 h-8 rounded-full items-center justify-center mr-4 z-10 border-2 border-white shadow-sm">
                    <Icon name={Icons.FaMapMarker} size={14} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-gray-500 font-medium mb-1 uppercase">Pickup From</Text>
                    {order.pickupMarket ? (
                      <View>
                        <Text className="text-gray-900 font-medium text-base mb-1">
                          {order.pickupMarket.marketName}
                        </Text>
                        <Text className="text-gray-600 text-sm leading-5">
                          {order.pickupMarket.exactAddress}, {order.pickupMarket.district}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-gray-400 italic">Location details unavailable</Text>
                    )}
                  </View>
                </View>

                {/* Delivery Section */}
                <View className="flex-row mb-6">
                  <View className="bg-green-50 w-8 h-8 rounded-full items-center justify-center mr-4 z-10 border-2 border-white shadow-sm">
                    <Icon name={Icons.FaFlag} size={12} color="#22c55e" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-gray-500 font-medium mb-1 uppercase">Deliver To</Text>
                    {order.traderDetails ? (
                      <View>
                        <Text className="text-gray-900 font-medium text-base mb-1">
                          {order.traderDetails.traderName}
                        </Text>
                        <View className="flex-row items-center mb-1">
                          <Icon name={Icons.FaPhone} size={10} color="#64748b" className="mr-1" />
                          <Text className="text-slate-500 text-xs ml-1">{order.traderDetails.traderMobile}</Text>
                        </View>
                        <Text className="text-gray-600 text-sm leading-5">
                          {order.traderDetails.location.address}, {order.traderDetails.location.district}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-gray-400 italic">Recipient details unavailable</Text>
                    )}
                  </View>
                </View>

                {/* Items Section */}
                <View className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                      <Icon name={Icons.FaBox} size={14} color="#64748b" />
                      <Text className="font-medium text-gray-700 text-sm">Cargo Contents</Text>
                    </View>
                    <Text className="text-xs text-gray-500">{order.productItems.length} item(s)</Text>
                  </View>
                  
                  {order.productItems.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => viewProductDetails(order.orderId, item.productId, item.grade, item.quantity)}
                      className="bg-white p-3 rounded border border-gray-100 mb-2 last:mb-0 flex-row justify-between items-center active:bg-blue-50/30"
                    >
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Text className="font-medium text-gray-800 flex-1">
                            {productNames[item.productId] || item.productId}
                          </Text>
                          <Icon name={Icons.FaEye} size={12} color="#6b7280" />
                        </View>
                        <View className="flex-row items-center gap-4">
                          <View className="flex-row items-center gap-1">
                            <Icon name={Icons.FaTag} size={10} color="#8b5cf6" />
                            <Text className="text-xs text-gray-600">Grade: {item.grade}</Text>
                          </View>
                          <Text className="text-xs text-gray-500">|</Text>
                          <Text className="text-xs text-gray-600">Quantity: {item.quantity}</Text>
                        </View>
                      </View>
                      <View className="bg-blue-50 px-3 py-1 rounded text-center ml-3">
                        <Text className="text-blue-700 font-medium text-sm">
                          {item.quantity}
                        </Text>
                        <Text className="text-[10px] text-blue-500 text-center">Qty</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Actions */}
                <View className="mt-6 pt-5 border-t border-gray-100 flex-row gap-3">
                  {order.journeyStatus === "pending" && (
                    <>
                      <TouchableOpacity
                        disabled={order.transporterAccepted}
                        onPress={() => handleAccept(order)}
                        className={`flex-1 py-3 rounded-lg flex-row justify-center items-center gap-2 ${
                          order.transporterAccepted
                            ? "bg-gray-100 border border-gray-200"
                            : "bg-green-600 shadow-sm shadow-green-200"
                        }`}
                      >
                         {order.transporterAccepted ? (
                           <>
                             <Icon name={Icons.FaCheck} size={14} color="#9ca3af" />
                             <Text className="text-gray-400 font-medium">Accepted</Text>
                           </>
                         ) : (
                           <>
                             <Icon name={Icons.FaCheck} size={14} color="white" />
                             <Text className="text-white font-medium">Accept Job</Text>
                           </>
                         )}
                      </TouchableOpacity>

                      {!order.transporterAccepted && (
                        <TouchableOpacity
                          onPress={() => handleReject(order.orderId)}
                          className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 items-center justify-center shadow-sm"
                        >
                          <Icon name={Icons.FaTimes} size={16} color="#ef4444" />
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        disabled={!order.transporterAccepted}
                        onPress={() => handleStartJourney(order.orderId)}
                        className={`flex-1 py-3 rounded-lg flex-row justify-center items-center gap-2 ${
                          !order.transporterAccepted
                            ? "bg-gray-100 border border-gray-200 opacity-50"
                            : "bg-blue-600 shadow-sm shadow-blue-200"
                        }`}
                      >
                        <Icon name={Icons.FaPlay} size={14} color={!order.transporterAccepted ? "#9ca3af" : "white"} />
                        <Text
                          className={`font-medium ${
                            !order.transporterAccepted ? "text-gray-400" : "text-white"
                          }`}
                        >
                          Start Journey
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {order.journeyStatus === "started" && (
                    <TouchableOpacity
                      onPress={() => handleCompleteDelivery(order.orderId)}
                      className="flex-1 py-4 rounded-xl bg-purple-600 shadow-md shadow-purple-200 flex-row justify-center items-center gap-2"
                    >
                      <Icon name={Icons.FaCheck} size={16} color="white" />
                      <Text className="font-medium text-white text-base">
                        Complete Delivery
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {order.journeyStatus === "completed" && (
                     <View className="flex-1 bg-green-50 py-3 rounded-lg flex-row justify-center items-center gap-2 border border-green-100">
                        <Icon name={Icons.FaCheck} size={14} color="#16a34a" />
                        <Text className="text-green-700 font-medium">Delivery Successful</Text>
                     </View>
                  )}
                </View>
              </View>
            </View>
          );
        })
        )}
      </ScrollView>

      {/* Secret Key Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSecretKey("");
        }}
        statusBarTranslucent
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white rounded-2xl w-full max-w-sm p-0 overflow-hidden shadow-2xl">
            <View className={`p-6 pb-8 ${modalType === 'start' ? 'bg-blue-600' : 'bg-purple-600'}`}>
               <View className="mb-4 bg-white/20 self-start p-3 rounded-xl">
                 <Icon name={modalType === 'start' ? Icons.FaPlay : Icons.FaCheck} size={24} color="white" />
               </View>
               <Text className="text-2xl font-medium text-white">
                 {modalType === "start" ? "Start Journey" : "Complete Delivery"}
               </Text>
               <Text className="text-white/80 mt-2 text-sm leading-5">
                 {modalType === "start" 
                   ? "Ask the admin for the secret pickup key to begin the transport." 
                   : "Ask the trader for the secret delivery key to complete this order."}
               </Text>
            </View>
            
            <View className="p-6">
              <Text className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Enter Secret Key</Text>
              <View className="border border-gray-300 rounded-xl px-4 py-3 flex-row items-center mb-6 bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors">
                <Icon name={Icons.FaKey} size={16} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-lg font-medium text-gray-800"
                  placeholder="e.g. 123456"
                  placeholderTextColor="#cbd5e1"
                  value={secretKey}
                  onChangeText={setSecretKey}
                  secureTextEntry
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
              </View>
              
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setSecretKey("");
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-white border border-gray-300 items-center"
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={submitSecretKey}
                  className={`flex-1 py-3.5 rounded-xl items-center shadow-lg shadow-blue-200 ${
                    modalType === 'start' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}
                >
                  <Text className="text-white font-medium">Submit Key</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Product Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={productModalVisible}
        onRequestClose={() => {
          setProductModalVisible(false);
          setSelectedProduct(null);
          setProductDetails(null);
        }}
        statusBarTranslucent
      >
        <View className="flex-1 bg-black/70">
          <View className="flex-1 mt-20 bg-white rounded-t-3xl overflow-hidden">
            <View className="bg-blue-600 px-6 pt-6 pb-4">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-white text-lg font-medium">
                    Product Details
                  </Text>
                  {selectedProduct && (
                    <Text className="text-white/80 text-sm">
                      Order: #{selectedProduct.orderId}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setProductModalVisible(false);
                    setSelectedProduct(null);
                    setProductDetails(null);
                  }}
                  className="bg-white/20 p-2 rounded-full"
                >
                  <Icon name={Icons.FaTimes} size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 p-6">
              {productDetails ? (
                <>
                  {/* Product Header */}
                  <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-1">
                        <Text className="text-2xl font-bold text-gray-900 mb-1">
                          {getSubCategoryNameForProduct(productDetails)}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          ID: {productDetails.productId}
                        </Text>
                      </View>
                      <View className="bg-blue-100 px-3 py-1 rounded-full">
                        <Text className="text-blue-800 font-semibold text-sm">
                          Grade: {selectedProduct?.grade}
                        </Text>
                      </View>
                    </View>

                    {productDetails.cropBriefDetails && (
                      <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                          <Icon name={Icons.FaInfoCircle} size={14} color="#4b5563" />
                          <Text className="text-gray-700 font-medium">Description</Text>
                        </View>
                        <Text className="text-gray-600 leading-6">
                          {productDetails.cropBriefDetails}
                        </Text>
                      </View>
                    )}

                    {/* Order Quantity */}
                    <View className="bg-blue-50 rounded-lg p-4 mb-5">
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="text-blue-800 text-sm font-medium uppercase">Ordered Quantity</Text>
                          <Text className="text-blue-900 text-2xl font-bold mt-1">
                            {selectedProduct?.quantity} {productDetails.unitMeasurement || 'units'}
                          </Text>
                        </View>
                        <View className="bg-white p-3 rounded-lg">
                          <Icon name={Icons.FaPackage} size={24} color="#3b82f6" />
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Product Details Grid */}
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Product Information</Text>
                    
                    <View className="bg-white rounded-xl border border-gray-200 p-5">
                      {/* Farming Details */}
                      <View className="mb-5">
                        <Text className="text-gray-700 font-medium mb-3 flex-row items-center gap-2">
                          <Icon name={Icons.FaSeedling} size={14} color="#10b981" />
                          <Text>Farming Details</Text>
                        </Text>
                        <View className="flex-row flex-wrap gap-3">
                          <View className="bg-green-50 px-3 py-2 rounded-lg flex-1 min-w-[48%]">
                            <Text className="text-gray-500 text-xs uppercase">Farming Type</Text>
                            <Text className="text-gray-900 font-medium mt-1">
                              {productDetails.farmingType || "N/A"}
                            </Text>
                          </View>
                          <View className="bg-green-50 px-3 py-2 rounded-lg flex-1 min-w-[48%]">
                            <Text className="text-gray-500 text-xs uppercase">Seeds Type</Text>
                            <Text className="text-gray-900 font-medium mt-1">
                              {productDetails.typeOfSeeds || "N/A"}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Packaging Details */}
                      <View className="mb-5">
                        <Text className="text-gray-700 font-medium mb-3 flex-row items-center gap-2">
                          <Icon name={Icons.FaPackage} size={14} color="#8b5cf6" />
                          <Text>Packaging Details</Text>
                        </Text>
                        <View className="flex-row flex-wrap gap-3">
                          <View className="bg-purple-50 px-3 py-2 rounded-lg flex-1 min-w-[48%]">
                            <Text className="text-gray-500 text-xs uppercase">Packaging Type</Text>
                            <Text className="text-gray-900 font-medium mt-1">
                              {productDetails.packagingType || "N/A"}
                            </Text>
                          </View>
                          <View className="bg-purple-50 px-3 py-2 rounded-lg flex-1 min-w-[48%]">
                            <Text className="text-gray-500 text-xs uppercase">Package Size</Text>
                            <Text className="text-gray-900 font-medium mt-1">
                              {productDetails.packageMeasurement || "N/A"}
                            </Text>
                          </View>
                          <View className="bg-purple-50 px-3 py-2 rounded-lg flex-1 min-w-[48%]">
                            <Text className="text-gray-500 text-xs uppercase">Unit</Text>
                            <Text className="text-gray-900 font-medium mt-1">
                              {productDetails.unitMeasurement || "N/A"}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Grade Details */}
                      {productDetails.selectedGrade && (
                        <View className="mb-5">
                          <Text className="text-gray-700 font-medium mb-3">Grade Information</Text>
                          <View className="flex-row flex-wrap gap-3">
                            <View className="bg-amber-50 px-3 py-2 rounded-lg flex-1 min-w-[48%]">
                              <Text className="text-gray-500 text-xs uppercase">Quantity Type</Text>
                              <Text className="text-gray-900 font-medium mt-1">
                                {productDetails.selectedGrade.quantityType || "N/A"}
                              </Text>
                            </View>
                            <View className="bg-amber-50 px-3 py-2 rounded-lg flex-1 min-w-[48%]">
                              <Text className="text-gray-500 text-xs uppercase">Available Quantity</Text>
                              <Text className="text-gray-900 font-medium mt-1">
                                {productDetails.selectedGrade.totalQty || "N/A"}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Status */}
                      <View>
                        <Text className="text-gray-700 font-medium mb-3">Product Status</Text>
                        <View className={`px-4 py-3 rounded-lg ${productDetails.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Text className={`font-semibold ${productDetails.status === 'active' ? 'text-green-800' : 'text-red-800'}`}>
                            {productDetails.status?.toUpperCase() || "N/A"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Crop Photos */}
                  {productDetails.cropPhotos && productDetails.cropPhotos.length > 0 && (
                    <View className="mb-8">
                      <Text className="text-lg font-bold text-gray-900 mb-4 flex-row items-center gap-2">
                        <Icon name={Icons.FaImage} size={16} color="#f59e0b" />
                        <Text>Product Images</Text>
                      </Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-4">
                        {productDetails.cropPhotos.map((photo, index) => (
                          <View key={index} className="mr-4">
                            <Image
                              source={{ uri: photo }}
                              className="w-32 h-32 rounded-xl border border-gray-200"
                              resizeMode="cover"
                            />
                          </View>
                        ))}
                      </ScrollView>
                      <Text className="text-gray-500 text-sm text-center mt-2">
                        {productDetails.cropPhotos.length} image(s)
                      </Text>
                    </View>
                  )}

                  {/* Delivery Info */}
                  {(productDetails.deliveryDate || productDetails.deliveryTime) && (
                    <View className="bg-gray-50 rounded-xl p-5 mb-6">
                      <Text className="text-lg font-bold text-gray-900 mb-4">Delivery Information</Text>
                      <View className="flex-row flex-wrap gap-4">
                        {productDetails.deliveryDate && (
                          <View className="flex-row items-center gap-3 bg-white px-4 py-3 rounded-lg flex-1 min-w-[48%]">
                            <Icon name={Icons.FaCalendar} size={16} color="#3b82f6" />
                            <View>
                              <Text className="text-gray-500 text-xs uppercase">Delivery Date</Text>
                              <Text className="text-gray-900 font-medium">
                                {new Date(productDetails.deliveryDate).toLocaleDateString()}
                              </Text>
                            </View>
                          </View>
                        )}
                        {productDetails.deliveryTime && (
                          <View className="flex-row items-center gap-3 bg-white px-4 py-3 rounded-lg flex-1 min-w-[48%]">
                            <Icon name={Icons.FaClock} size={16} color="#3b82f6" />
                            <View>
                              <Text className="text-gray-500 text-xs uppercase">Delivery Time</Text>
                              <Text className="text-gray-900 font-medium">
                                {productDetails.deliveryTime}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <View className="flex-1 justify-center items-center py-20">
                  <Icon name={Icons.FaTimesCircle} size={48} color="#d1d5db" />
                  <Text className="text-gray-500 text-lg font-medium mt-4">
                    Product details not available
                  </Text>
                  <Text className="text-gray-400 text-center mt-2 px-6">
                    Unable to load detailed information for this product.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MakeDelivery;