import React, { useEffect, useState, useCallback } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Bell, Car, FileText, Phone, HelpCircle } from "lucide-react-native";

import Sidebar from "../transportscreen/Sidebar";
import StatsCards from "../transportscreen/StatsCard";
import NewOrdersList from "../transportscreen/NewOrdersList";
import OngoingDeliveries from "../transportscreen/OngoingDeliveries";
import BottomNavigation from "../transportscreen/BottomNavigation";

// Types
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

const TransportHome: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const [stats, setStats] = useState({
    newOrders: 5,
    ongoingDeliveries: 3,
    completedDeliveries: 42,
    earnings: 12500,
  });

  // Keep mock data as before (UI expects them)
  const [newOrders, setNewOrders] = useState<Order[]>([
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
    { icon: <Car size={28} color="#3498db" />, label: "Add Vehicle", action: () => console.log("Add Vehicle") },
    { icon: <FileText size={28} color="#3498db" />, label: "Update Docs", action: () => console.log("Update Documents") },
    { icon: <Phone size={28} color="#3498db" />, label: "Call Support", action: () => Linking.openURL("tel:+918888888888") },
    { icon: <HelpCircle size={28} color="#3498db" />, label: "Help / FAQ", action: () => console.log("Help") },
  ];

  // fetchUserData stable callback
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

      // persist normalized data
      await AsyncStorage.setItem("userId", userData._id || "");
      await AsyncStorage.setItem("transporter_data", JSON.stringify(userData));

      // update stats if backend provides totals
      if (userData.totalTrips) {
        setStats((prev) => ({ ...prev, completedDeliveries: userData.totalTrips }));
      }
    } catch (err: any) {
      console.error("TransportHome fetchUserData error:", err);
      // Map common server codes to friendly messages
      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => router.replace("/(auth)/Login"), 1200);
      } else if (err?.message?.includes("No user ID")) {
        setError("No user ID or mobile number found");
      } else {
        setError(err?.message || "Failed to load user data");
      }

      // fallback to transporter_data if present
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

  const handleEditProfile = () => router.push("/transportscreen/EditTransportProfile");
  const handleViewProfile = () => router.push("/transportscreen/TransportProfile");

  const handleAcceptOrder = (orderId: string) => {
    Alert.alert("Accept Order", "Are you sure you want to accept this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: () => {
          setNewOrders((prev) => prev.filter((o) => o.id !== orderId));
          setStats((s) => ({ ...s, newOrders: Math.max(0, s.newOrders - 1) }));
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
          setNewOrders((prev) => prev.filter((o) => o.id !== orderId));
          setStats((s) => ({ ...s, newOrders: Math.max(0, s.newOrders - 1) }));
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

  const handleNotificationClick = () => {
    console.log("Notification clicked");
    // could open notifications screen later
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Sidebar
        user={
          user
            ? {
                id: user._id,
                name: user.personalInfo.name,
                mobileNo: user.personalInfo.mobileNo,
                email: user.personalInfo.email,
                vehicleType: user.transportInfo?.vehicleType,
                vehicleNumber: user.transportInfo?.vehicleNumber,
              }
            : null
        }
        onLogout={handleLogout}
        onEditProfile={handleEditProfile}
        onViewProfile={handleViewProfile}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{user?.personalInfo.name || "Transporter"}</Text>
            <Text style={styles.headerDate}>{today}</Text>
          </View>

          <TouchableOpacity onPress={handleNotificationClick} style={styles.notificationButton}>
            <Bell size={24} color="#3498db" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <StatsCards {...stats} />

        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsScroll}>
            {quickActions.map((action, i) => (
              <TouchableOpacity key={i} onPress={action.action} style={styles.quickActionButton}>
                {action.icon}
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <NewOrdersList orders={newOrders} onAccept={handleAcceptOrder} onReject={handleRejectOrder} onViewDetails={handleViewDetails} />

        <OngoingDeliveries deliveries={ongoingDeliveries} onContinueDelivery={handleContinueDelivery} />
      </ScrollView>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
};

// Styles (kept same look & feel)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // space for bottom nav
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  headerDate: {
    marginTop: 5,
    fontSize: 14,
    color: "#7f8c8d",
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#e74c3c",
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  quickActionsContainer: {
    marginVertical: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  quickActionsScroll: {
    paddingRight: 20,
  },
  quickActionButton: {
    width: 120,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  quickActionText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});

export default TransportHome;
