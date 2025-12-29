// import React, { useEffect, useState, useCallback } from "react";
// import { router } from "expo-router";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Linking,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { Bell, Car, FileText, Phone, HelpCircle } from "lucide-react-native";

// import Sidebar from "../transportscreen/Sidebar";
// import StatsCards from "../transportscreen/StatsCard";
// import NewOrdersList from "../transportscreen/NewOrdersList";
// import OngoingDeliveries from "../transportscreen/OngoingDeliveries";
// import BottomNavigation from "../transportscreen/BottomNavigation";

// // Types
// interface UserData {
//   _id: string;
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//     email?: string;
//     address?: string;
//     state?: string;
//     district?: string;
//   };
//   transportInfo?: {
//     vehicleType?: string;
//     vehicleNumber?: string;
//   };
//   rating?: number;
//   totalTrips?: number;
// }

// interface Order {
//   id: string;
//   pickupLocation: string;
//   deliveryLocation: string;
//   cropName: string;
//   quantity: number;
//   unit: string;
//   distance?: number;
//   farmerName: string;
//   price: number;
// }

// interface Delivery {
//   id: string;
//   orderId: string;
//   status: "Picked Up" | "In Transit" | "Reached";
//   pickupLocation: string;
//   deliveryLocation: string;
//   cropName: string;
//   progress: number;
// }

// const API_BASE = "https://kisan.etpl.ai/transport";

// const TransportHome: React.FC = () => {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<string>("dashboard");

//   const [stats, setStats] = useState({
//     newOrders: 5,
//     ongoingDeliveries: 3,
//     completedDeliveries: 42,
//     earnings: 12500,
//   });

//   // Keep mock data as before (UI expects them)
//   const [newOrders, setNewOrders] = useState<Order[]>([
//     {
//       id: "ORD001",
//       pickupLocation: "Madurai, Tamil Nadu",
//       deliveryLocation: "Chennai, Tamil Nadu",
//       cropName: "Tomatoes",
//       quantity: 250,
//       unit: "Boxes",
//       distance: 450,
//       farmerName: "Rajesh Kumar",
//       price: 8500,
//     },
//     {
//       id: "ORD002",
//       pickupLocation: "Coimbatore, Tamil Nadu",
//       deliveryLocation: "Bangalore, Karnataka",
//       cropName: "Bananas",
//       quantity: 150,
//       unit: "Bunches",
//       distance: 350,
//       farmerName: "Suresh Babu",
//       price: 6500,
//     },
//   ]);

//   const [ongoingDeliveries] = useState<Delivery[]>([
//     {
//       id: "DLV001",
//       orderId: "ORD003",
//       status: "In Transit",
//       pickupLocation: "Trichy, Tamil Nadu",
//       deliveryLocation: "Hyderabad, Telangana",
//       cropName: "Mangoes",
//       progress: 65,
//     },
//     {
//       id: "DLV002",
//       orderId: "ORD004",
//       status: "Picked Up",
//       pickupLocation: "Salem, Tamil Nadu",
//       deliveryLocation: "Kochi, Kerala",
//       cropName: "Rice",
//       progress: 20,
//     },
//   ]);

//   const quickActions = [
//     { icon: <Car size={28} color="#3498db" />, label: "Add Vehicle", action: () => console.log("Add Vehicle") },
//     { icon: <FileText size={28} color="#3498db" />, label: "Update Docs", action: () => console.log("Update Documents") },
//     { icon: <Phone size={28} color="#3498db" />, label: "Call Support", action: () => Linking.openURL("tel:+918888888888") },
//     { icon: <HelpCircle size={28} color="#3498db" />, label: "Help / FAQ", action: () => console.log("Help") },
//   ];

//   // fetchUserData stable callback
//   const fetchUserData = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const storedUserId = await AsyncStorage.getItem("userId");
//       const storedMobile = await AsyncStorage.getItem("mobile");

//       if (!storedUserId && !storedMobile) {
//         throw new Error("No user ID or mobile number found");
//       }

//       let response;
//       if (storedUserId && storedUserId !== "undefined") {
//         try {
//           response = await axios.get(`${API_BASE}/profile/${storedUserId}`);
//         } catch (idErr) {
//           if (storedMobile) {
//             response = await axios.get(`${API_BASE}/mobile/${storedMobile}`);
//           } else {
//             throw idErr;
//           }
//         }
//       } else if (storedMobile) {
//         response = await axios.get(`${API_BASE}/mobile/${storedMobile}`);
//       } else {
//         throw new Error("No user ID or mobile number found");
//       }

//       if (!response?.data?.success) {
//         throw new Error(response?.data?.message || "Failed to fetch profile");
//       }

//       const userData: UserData = response.data.data;

//       setUser(userData);

//       // persist normalized data
//       await AsyncStorage.setItem("userId", userData._id || "");
//       await AsyncStorage.setItem("transporter_data", JSON.stringify(userData));

//       // update stats if backend provides totals
//       if (userData.totalTrips) {
//         setStats((prev) => ({ ...prev, completedDeliveries: userData.totalTrips }));
//       }
//     } catch (err: any) {
//       console.error("TransportHome fetchUserData error:", err);
//       // Map common server codes to friendly messages
//       if (err?.response?.status === 401) {
//         setError("Session expired. Please login again.");
//         setTimeout(() => router.replace("/(auth)/Login"), 1200);
//       } else if (err?.message?.includes("No user ID")) {
//         setError("No user ID or mobile number found");
//       } else {
//         setError(err?.message || "Failed to load user data");
//       }

//       // fallback to transporter_data if present
//       const fallback = await AsyncStorage.getItem("transporter_data");
//       if (fallback) {
//         try {
//           const parsed = JSON.parse(fallback);
//           setUser(parsed);
//         } catch (parseErr) {
//           console.warn("Failed to parse transporter_data fallback", parseErr);
//         }
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUserData();
//   }, [fetchUserData]);

//   const handleLogout = async () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: async () => {
//           await AsyncStorage.multiRemove([
//             "transporter_token",
//             "transporter_data",
//             "userId",
//             "mobile",
//             "role",
//             "isLoggedIn",
//           ]);
//           router.replace("/(auth)/Login");
//         },
//       },
//     ]);
//   };

//   const handleEditProfile = () => router.push("/transportscreen/EditTransportProfile");
//   const handleViewProfile = () => router.push("/transportscreen/TransportProfile");

//   const handleAcceptOrder = (orderId: string) => {
//     Alert.alert("Accept Order", "Are you sure you want to accept this order?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Accept",
//         onPress: () => {
//           setNewOrders((prev) => prev.filter((o) => o.id !== orderId));
//           setStats((s) => ({ ...s, newOrders: Math.max(0, s.newOrders - 1) }));
//         },
//       },
//     ]);
//   };

//   const handleRejectOrder = (orderId: string) => {
//     Alert.alert("Reject Order", "Are you sure you want to reject this order?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Reject",
//         onPress: () => {
//           setNewOrders((prev) => prev.filter((o) => o.id !== orderId));
//           setStats((s) => ({ ...s, newOrders: Math.max(0, s.newOrders - 1) }));
//         },
//       },
//     ]);
//   };

//   const handleViewDetails = (orderId: string) => {
//     router.push({
//       pathname: "/transportscreen/OrderDetails",
//       params: { orderId },
//     });
//   };

//   const handleContinueDelivery = (deliveryId: string) => {
//     router.push({
//       pathname: "/transportscreen/Livetrack",
//       params: { deliveryId },
//     });
//   };

//   const handleNotificationClick = () => {
//     console.log("Notification clicked");
//     // could open notifications screen later
//   };

//   const today = new Date().toLocaleDateString("en-IN", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3498db" />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Sidebar
//         user={
//           user
//             ? {
//                 id: user._id,
//                 name: user.personalInfo.name,
//                 mobileNo: user.personalInfo.mobileNo,
//                 email: user.personalInfo.email,
//                 vehicleType: user.transportInfo?.vehicleType,
//                 vehicleNumber: user.transportInfo?.vehicleNumber,
//               }
//             : null
//         }
//         onLogout={handleLogout}
//         onEditProfile={handleEditProfile}
//         onViewProfile={handleViewProfile}
//       />

//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.headerTitle}>{user?.personalInfo.name || "Transporter"}</Text>
//             <Text style={styles.headerDate}>{today}</Text>
//           </View>

//           <TouchableOpacity onPress={handleNotificationClick} style={styles.notificationButton}>
//             <Bell size={24} color="#3498db" />
//             <View style={styles.notificationBadge}>
//               <Text style={styles.notificationBadgeText}>3</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         <StatsCards {...stats} />

//         <View style={styles.quickActionsContainer}>
//           <Text style={styles.quickActionsTitle}>Quick Actions</Text>

//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsScroll}>
//             {quickActions.map((action, i) => (
//               <TouchableOpacity key={i} onPress={action.action} style={styles.quickActionButton}>
//                 {action.icon}
//                 <Text style={styles.quickActionText}>{action.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         <NewOrdersList orders={newOrders} onAccept={handleAcceptOrder} onReject={handleRejectOrder} onViewDetails={handleViewDetails} />

//         <OngoingDeliveries deliveries={ongoingDeliveries} onContinueDelivery={handleContinueDelivery} />
//       </ScrollView>

     
//     </SafeAreaView>
//   );
// };

// // Styles (kept same look & feel)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f7fa",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     padding: 20,
//     paddingBottom: 100, // space for bottom nav
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: "#666",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   errorText: {
//     color: "#e74c3c",
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   retryButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: "#3498db",
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: "white",
//     fontSize: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2c3e50",
//   },
//   headerDate: {
//     marginTop: 5,
//     fontSize: 14,
//     color: "#7f8c8d",
//   },
//   notificationButton: {
//     position: "relative",
//   },
//   notificationBadge: {
//     position: "absolute",
//     top: -5,
//     right: -5,
//     backgroundColor: "#e74c3c",
//     borderRadius: 9,
//     width: 18,
//     height: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   notificationBadgeText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   quickActionsContainer: {
//     marginVertical: 20,
//   },
//   quickActionsTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: 15,
//   },
//   quickActionsScroll: {
//     paddingRight: 20,
//   },
//   quickActionButton: {
//     width: 120,
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "white",
//     borderRadius: 10,
//     marginRight: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   quickActionText: {
//     marginTop: 10,
//     fontSize: 14,
//     textAlign: "center",
//   },
// });

// export default TransportHome;


import React, { useEffect, useState, useCallback } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { 
  Bell, 
  Car, 
  FileText, 
  Phone, 
  HelpCircle, 
  MapPin, 
  Package, 
  Wallet, 
  TrendingUp,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Calendar,
  Clock,
  Truck,
  Navigation,
  Map,
  ArrowRight,
  CheckCircle,
  XCircle,
  MoreVertical,
  ShoppingCart,
  Star,
  Route,
  Timer
} from "lucide-react-native";

// Types (keep same as before)
interface UserData {
  _id: string;
  personalInfo: {
    name: string;
    mobileNo: string;
    email?: string;
    address?: string;
    state?: string;
    district?: string;
  };
  transportInfo?: {
    vehicleType?: string;
    vehicleNumber?: string;
  };
  rating?: number;
  totalTrips?: number;
}

interface Order {
  id: string;
  pickupLocation: string;
  deliveryLocation: string;
  cropName: string;
  quantity: number;
  unit: string;
  distance?: number;
  farmerName: string;
  price: number;
}

interface Delivery {
  id: string;
  orderId: string;
  status: "Picked Up" | "In Transit" | "Reached";
  pickupLocation: string;
  deliveryLocation: string;
  cropName: string;
  progress: number;
}

const API_BASE = "https://kisan.etpl.ai/transport";
const { width } = Dimensions.get('window');

const TransportHome: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const [stats, setStats] = useState({
    newOrders: 5,
    ongoingDeliveries: 3,
    completedDeliveries: 42,
    earnings: 12500,
  });

  const [newOrders] = useState<Order[]>([
    {
      id: "ORD001",
      pickupLocation: "Madurai, Tamil Nadu",
      deliveryLocation: "Chennai, Tamil Nadu",
      cropName: "Tomatoes",
      quantity: 250,
      unit: "Boxes",
      distance: 450,
      farmerName: "Rajesh Kumar",
      price: 8500,
    },
    {
      id: "ORD002",
      pickupLocation: "Coimbatore, Tamil Nadu",
      deliveryLocation: "Bangalore, Karnataka",
      cropName: "Bananas",
      quantity: 150,
      unit: "Bunches",
      distance: 350,
      farmerName: "Suresh Babu",
      price: 6500,
    },
  ]);

  const [ongoingDeliveries] = useState<Delivery[]>([
    {
      id: "DLV001",
      orderId: "ORD003",
      status: "In Transit",
      pickupLocation: "Trichy, Tamil Nadu",
      deliveryLocation: "Hyderabad, Telangana",
      cropName: "Mangoes",
      progress: 65,
    },
    {
      id: "DLV002",
      orderId: "ORD004",
      status: "Picked Up",
      pickupLocation: "Salem, Tamil Nadu",
      deliveryLocation: "Kochi, Kerala",
      cropName: "Rice",
      progress: 20,
    },
  ]);

const quickActions = [
  { 
    icon: <Car size={20} color="#fa5102ff" />, 
    label: "Add Vehicle", 
    action: () => console.log("Add Vehicle"),
    bgColor: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700"
  },
  { 
    icon: <FileText size={20} color="#0d0274ff" />, 
    label: "Documents", 
    action: () => console.log("Update Documents"),
    bgColor: "bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800"
  },
  { 
    icon: <Phone size={20} color="#0e7700ff" />, 
    label: "Support", 
    action: () => Linking.openURL("tel:+918888888888"),
    bgColor: "bg-gradient-to-br from-green-600 via-green-700 to-green-800"
  },
  { 
    icon: <HelpCircle size={20} color="#510674ff" />, 
    label: "Help", 
    action: () => console.log("Help"),
    bgColor: "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800"
  },
];

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedMobile = await AsyncStorage.getItem("mobile");

      if (!storedUserId && !storedMobile) {
        throw new Error("No user ID or mobile number found");
      }

      let response;
      if (storedUserId && storedUserId !== "undefined") {
        try {
          response = await axios.get(`${API_BASE}/profile/${storedUserId}`);
        } catch (idErr) {
          if (storedMobile) {
            response = await axios.get(`${API_BASE}/mobile/${storedMobile}`);
          } else {
            throw idErr;
          }
        }
      } else if (storedMobile) {
        response = await axios.get(`${API_BASE}/mobile/${storedMobile}`);
      } else {
        throw new Error("No user ID or mobile number found");
      }

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to fetch profile");
      }

      const userData: UserData = response.data.data;
      setUser(userData);

      await AsyncStorage.setItem("userId", userData._id || "");
      await AsyncStorage.setItem("transporter_data", JSON.stringify(userData));

      if (userData.totalTrips) {
        setStats((prev) => ({ ...prev, completedDeliveries: userData.totalTrips }));
      }
    } catch (err: any) {
      console.error("TransportHome fetchUserData error:", err);
      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => router.replace("/(auth)/Login"), 1200);
      } else if (err?.message?.includes("No user ID")) {
        setError("No user ID or mobile number found");
      } else {
        setError(err?.message || "Failed to load user data");
      }

      const fallback = await AsyncStorage.getItem("transporter_data");
      if (fallback) {
        try {
          const parsed = JSON.parse(fallback);
          setUser(parsed);
        } catch (parseErr) {
          console.warn("Failed to parse transporter_data fallback", parseErr);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove([
            "transporter_token",
            "transporter_data",
            "userId",
            "mobile",
            "role",
            "isLoggedIn",
          ]);
          router.replace("/(auth)/Login");
        },
      },
    ]);
  };

  const handleAcceptOrder = (orderId: string) => {
    Alert.alert("Accept Order", "Are you sure you want to accept this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: () => {
          // Handle accept logic
        },
      },
    ]);
  };

  const handleRejectOrder = (orderId: string) => {
    Alert.alert("Reject Order", "Are you sure you want to reject this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        onPress: () => {
          // Handle reject logic
        },
      },
    ]);
  };

  const handleViewDetails = (orderId: string) => {
    router.push({
      pathname: "/transportscreen/OrderDetails",
      params: { orderId },
    });
  };

  const handleContinueDelivery = (deliveryId: string) => {
    router.push({
      pathname: "/transportscreen/Livetrack",
      params: { deliveryId },
    });
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (loading) {
    return (
      <View className="flex-1 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View className="items-center">
          <View className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6" />
          <Text className="text-black text-lg font-medium tracking-wide">Loading Dashboard</Text>
          <Text className="text-black/60 text-sm mt-2">Preparing your transporter workspace</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center p-8">
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
          <XCircle size={48} color="#dc2626" />
        </View>
        <Text className="text-slate-800 text-lg font-semibold text-center mb-3">{error}</Text>
        <Text className="text-slate-500 text-center text-sm mb-8">
          We couldn't load your dashboard information
        </Text>
        <TouchableOpacity 
          className="bg-slate-800 px-8 py-4 rounded-xl shadow-lg active:scale-95"
          onPress={fetchUserData}
        >
          <Text className="text-black font-semibold tracking-wide">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      {/* Header */}
      <View className="bg-white px-6 py-5 shadow-sm border-b border-slate-200">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => setShowMenu(!showMenu)}
              className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center mr-4 active:bg-slate-200"
            >
              <Menu size={22} color="#475569" />
            </TouchableOpacity>
            <View>
              <Text className="text-slate-500 text-sm font-medium tracking-wide">GOOD {new Date().getHours() < 12 ? 'MORNING' : new Date().getHours() < 18 ? 'AFTERNOON' : 'EVENING'},</Text>
              <Text className="text-slate-900 text-xl font-medium tracking-tight">
                {user?.personalInfo.name?.split(" ")[0] || "Transporter"}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center space-x-3">

         

            <TouchableOpacity className="relative">
              <View className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center">
                <Bell size={20} color="#475569" />
              </View>
              <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-5 h-5 items-center justify-center border-2 border-white">
                <Text className="text-white text-[10px] font-medium">3</Text>
              </View>
            </TouchableOpacity>
            
            {user?.rating && (
              <View className="flex-row items-center bg-amber-50 px-3 py-1.5 rounded-lg">
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <Text className="text-amber-700 font-bold ml-1.5">{user.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View className="flex-row items-center">
          <View className="flex-row items-center mr-6">
            <Calendar size={16} color="#64748b" />
            <Text className="text-slate-600 text-sm font-medium ml-2">{today.split(',')[0]}</Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={16} color="#64748b" />
            <Text className="text-slate-600 text-sm font-medium ml-2">{time}</Text>
          </View>
          {user?.transportInfo?.vehicleNumber && (
            <View className="ml-auto flex-row items-center bg-green-50 px-3 py-1.5 rounded-lg">
              <Truck size={14} color="#047a4dff" />
              <Text className="text-green-700 text-sm font-medium ml-2">{user.transportInfo.vehicleNumber}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Side Menu */}
      {showMenu && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50">
          <TouchableOpacity 
            className="absolute inset-0 bg-black/60"
            onPress={() => setShowMenu(false)}
          />
          <View className="absolute top-0 left-0 w-[280px] h-full bg-white shadow-2xl">
            <View className="p-8 border-b border-slate-200">
              <View className="flex-row items-center">
                <View className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl items-center justify-center">
                  <Text className="text-black text-2xl font-bold tracking-wide">
                    {user?.personalInfo.name?.charAt(0) || "T"}
                  </Text>
                </View>
                <View className="ml-4">
                  <Text className="text-slate-900 text-xl font-bold tracking-tight">{user?.personalInfo.name || "Transporter"}</Text>
                  <Text className="text-slate-500 text-sm mt-1">{user?.personalInfo.mobileNo}</Text>
                  {user?.transportInfo?.vehicleType && (
                    <View className="flex-row items-center mt-2">
                      <Truck size={12} color="#64748b" />
                      <Text className="text-slate-500 text-xs ml-1.5">{user.transportInfo.vehicleType}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            <ScrollView className="flex-1 p-6">
              <TouchableOpacity className="flex-row items-center py-4 px-3 rounded-xl active:bg-slate-50 mb-2">
                <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                  <User size={18} color="#475569" />
                </View>
                <Text className="text-slate-800 font-medium ml-4">Profile</Text>
                <ChevronRight size={16} color="#94a3b8" className="ml-auto" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center py-4 px-3 rounded-xl active:bg-slate-50 mb-2">
                <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                  <Settings size={18} color="#475569" />
                </View>
                <Text className="text-slate-800 font-medium ml-4">Settings</Text>
                <ChevronRight size={16} color="#94a3b8" className="ml-auto" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center py-4 px-3 rounded-xl active:bg-slate-50 mb-2">
                <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                  <Truck size={18} color="#475569" />
                </View>
                <Text className="text-slate-800 font-medium ml-4">My Vehicles</Text>
                <ChevronRight size={16} color="#94a3b8" className="ml-auto" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center py-4 px-3 rounded-xl active:bg-slate-50 mb-2">
                <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                  <Wallet size={18} color="#475569" />
                </View>
                <Text className="text-slate-800 font-medium ml-4">Earnings</Text>
                <ChevronRight size={16} color="#94a3b8" className="ml-auto" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center py-4 px-3 rounded-xl active:bg-slate-50 mb-2">
                <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                  <Map size={18} color="#475569" />
                </View>
                <Text className="text-slate-800 font-medium ml-4">Live Tracking</Text>
                <ChevronRight size={16} color="#94a3b8" className="ml-auto" />
              </TouchableOpacity>
              
              <View className="h-px bg-slate-200 my-6" />
              
              <TouchableOpacity 
                onPress={handleLogout}
                className="flex-row items-center py-4 px-3 rounded-xl active:bg-red-50"
              >
                <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center">
                  <LogOut size={18} color="#dc2626" />
                </View>
                <Text className="text-red-600 font-medium ml-4">Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}

      <ScrollView 
        className="flex-1" 
        contentContainerClassName="pb-28"
        showsVerticalScrollIndicator={false}
      >
        {/* Earnings Card */}
        
          <View className="bg-emerald-500 rounded-xl border border-slate-100 p-6 border m-4">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white text-sm font-medium tracking-wide">TOTAL EARNINGS</Text>
                <Text className="text-white text-2xl font-medium tracking-tight mt-2">₹{stats.earnings.toLocaleString()}</Text>
              </View>
              <View className="w-16 h-16 bg-white/10 rounded-xl items-center justify-center">
                <Wallet size={28} color="#1b813dff" />
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-white text-2xl font-medium">{stats.newOrders}</Text>
                <Text className="text-xs text-white font-medium mt-1">New Orders</Text>
              </View>
              <View className="h-10 w-px bg-white-700" />
              <View className="items-center">
                <Text className="text-white text-2xl font-medium">{stats.ongoingDeliveries}</Text>
                <Text className="text-white text-xs font-medium mt-1">Ongoing</Text>
              </View>
              <View className="h-10 w-px bg-white-700" />
              <View className="items-center">
                <Text className="text-white text-2xl font-medium">{stats.completedDeliveries}</Text>
                <Text className="text-white text-xs font-medium mt-1 text-white">Completed</Text>
              </View>
            </View>
          </View>

        {/* Active Deliveries */}
        <View className="px-5">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-slate-900 text-lg font-heading tracking-tight">Active Deliveries</Text>
              <Text className="text-slate-500 text-sm mt-1 font-medium">Currently transporting shipments</Text>
            </View>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-blue-600 font-medium text-sm mr-2">View All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          
          {ongoingDeliveries.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="pb-4"
            >
              {ongoingDeliveries.map((delivery) => (
                <View 
                  key={delivery.id}
                  className="w-[280px] mr-4 bg-white rounded-xl border border-slate-100"
                >
                  {/* Status Bar */}
                  <View className={`h-1 rounded-t-2xl ${
                    delivery.status === "In Transit" ? "bg-blue-500" :
                    delivery.status === "Picked Up" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  
                  <View className="p-5">
                    <View className="flex-row justify-between items-start mb-5">
                      <View>
                        <Text className="text-slate-900 font-medium text-lg">{delivery.cropName}</Text>
                        <Text className="text-slate-500 text-xs mt-1">#{delivery.orderId}</Text>
                      </View>
                      <View className={`px-3 py-1.5 rounded-lg ${
                        delivery.status === "In Transit" ? "bg-blue-50" :
                        delivery.status === "Picked Up" ? "bg-amber-50" : "bg-emerald-50"
                      }`}>
                        <Text className={`text-xs font-semibold ${
                          delivery.status === "In Transit" ? "text-blue-700" :
                          delivery.status === "Picked Up" ? "text-amber-700" : "text-emerald-700"
                        }`}>
                          {delivery.status}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Progress */}
                    <View className="mb-6">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-700 text-sm font-medium text-sm">Journey Progress</Text>
                        <Text className="text-slate-900 font-bold">{delivery.progress}%</Text>
                      </View>
                      <View className="h-2 bg-slate-200 rounded-full overflow-hidden text-sm">
                        <View 
                          className={`h-full rounded-full ${
                            delivery.status === "In Transit" ? "bg-blue-500" :
                            delivery.status === "Picked Up" ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${delivery.progress}%` }}
                        />
                      </View>
                    </View>
                    
                    {/* Locations */}
                    <View className="space-y-3 mb-6">
                      <View className="flex-row items-center">
                        <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center mr-3">
                          <MapPin size={14} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-slate-900 font-medium text-sm">Pickup</Text>
                          <Text className="text-slate-600 text-xs mt-0.5" numberOfLines={1}>
                            {delivery.pickupLocation}
                          </Text>
                        </View>
                      </View>
                      
                      <View className="h-6 w-px bg-slate-300 ml-4" />
                      
                      <View className="flex-row items-center">
                        <View className="w-8 h-8 bg-emerald-100 rounded-lg items-center justify-center mr-3">
                          <MapPin size={14} color="#10b981" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-slate-900 font-medium text-sm">Delivery</Text>
                          <Text className="text-slate-600 text-xs mt-0.5" numberOfLines={1}>
                            {delivery.deliveryLocation}
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => handleContinueDelivery(delivery.id)}
                      className="bg-slate-900 py-3.5 rounded-xl flex-row items-center justify-center active:bg-slate-800"
                    >
                      <Navigation size={18} color="#FFFFFF" />
                      <Text className="text-white font-medium ml-2.5 tracking-wide text-sm">Open Live Map</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center border border-dashed border-slate-300">
              <View className="w-20 h-20 bg-slate-100 rounded-2xl items-center justify-center mb-5">
                <Truck size={32} color="#94a3b8" />
              </View>
              <Text className="text-slate-900 font-bold text-lg mb-2">No Active Deliveries</Text>
              <Text className="text-slate-500 text-center text-sm mb-6">
                You're not currently delivering any shipments
              </Text>
              <TouchableOpacity className="bg-slate-900 px-6 py-3 rounded-xl">
                <Text className="text-black font-medium tracking-wide">Find Shipments</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* New Orders */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-slate-900 text-lg font-heading tracking-tight">Available Orders</Text>
              <Text className="text-slate-500 text-sm mt-1 font-medium">Ready for transportation</Text>
            </View>
            <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-lg">
              <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              <Text className="text-blue-700 font-subheading text-sm">
                {newOrders.length} Available
              </Text>
            </View>
          </View>
          
          {newOrders.map((order) => (
            <View 
              key={order.id}
              className="bg-white rounded-xl border border-slate-100 mb-3 overflow-hidden"
            >
              <View className="p-6">
                <View className="flex-row justify-between items-start mb-5">
                  <View>
                    <View className="flex-row items-center mb-2">
                      <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      <Text className="text-slate-900 font-subheading text-lg">{order.cropName}</Text>
                    </View>
                    <Text className="text-slate-500 text-xs">Order #{order.id}</Text>
                  </View>
                  <View className="bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 rounded-lg">
                    <Text className="text-blue-700 font-bold text-lg">₹{order.price.toLocaleString()}</Text>
                  </View>
                </View>
                
                {/* Route */}
                <View className="mb-5">
                  <View className="flex-row items-center mb-4">
                    <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-4">
                      <MapPin size={18} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-700 text-xs font-medium mb-1">PICKUP LOCATION</Text>
                      <Text className="text-slate-900 font-medium">{order.pickupLocation}</Text>
                    </View>
                  </View>
                  
                  <View className="h-6 w-px bg-slate-300 ml-5 mb-1" />
                  
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-emerald-50 rounded-xl items-center justify-center mr-4">
                      <MapPin size={18} color="#10b981" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-700 text-xs font-medium mb-1">DELIVERY LOCATION</Text>
                      <Text className="text-slate-900 font-medium">{order.deliveryLocation}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Details */}
                <View className="bg-slate-50 rounded-xl p-4 mb-6">
                  <View className="flex-row justify-between">
                    <View className="items-center flex-1">
                      <Text className="text-slate-500 text-xs font-medium mb-2">Quantity</Text>
                      <Text className="text-slate-900 font-bold">{order.quantity} {order.unit}</Text>
                    </View>
                    <View className="h-8 w-px bg-slate-300" />
                    <View className="items-center flex-1">
                      <Text className="text-slate-500 text-xs font-medium mb-2">Distance</Text>
                      <Text className="text-slate-900 font-bold">{order.distance || '450'} km</Text>
                    </View>
                    <View className="h-8 w-px bg-slate-300" />
                    <View className="items-center flex-1">
                      <Text className="text-slate-500 text-xs font-medium mb-2">Farmer</Text>
                      <Text className="text-slate-900 font-bold text-sm" numberOfLines={1}>
                        {order.farmerName.split(' ')[0]}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* Actions */}
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => handleViewDetails(order.id)}
                    className="flex-1 flex-row items-center justify-center py-3.5 bg-slate-100 rounded-xl active:bg-slate-200"
                  >
                    <Text className="text-slate-700 font-medium tracking-wide">View Details</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleRejectOrder(order.id)}
                    className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl items-center justify-center"
                  >
                    <XCircle size={20} color="#ec030fff" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleAcceptOrder(order.id)}
                    className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl items-center justify-center"
                  >
                    <CheckCircle size={20} color="#047e19ff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransportHome;