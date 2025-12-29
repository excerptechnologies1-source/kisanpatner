// ProfileScreen.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Bell,
  CreditCard,
  Edit,
  FileText,
  Globe,
  Inbox,
  Lock,
  MessageSquare,
  Plus,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from '../../components/CustomAlert';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
const [alertTitle, setAlertTitle] = useState("");
const [alertMessage, setAlertMessage] = useState("");
const [alertAction, setAlertAction] = useState<null | (() => void)>(null);
const showAppAlert = (title: string, message: string, action?: () => void) => {
  setAlertTitle(title);
  setAlertMessage(message);
 setAlertAction(() => handleLogout);
  setShowAlert(true);
};


  // mock data
  const user = {
    name: "Rajesh Kumar",
    location: "Village: Rampur, Block: Kolar",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
    wallet: "12,500.00",
  };

  const notifications = [
    {
      id: 1,
      title: "Order #123 Confirmed",
      subtitle: "Your recent order for 50kg tomatoes",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Price Alert: Wheat",
      subtitle: "Wheat prices increased by 5% in your area",
      time: "Yesterday",
    },
  ];

  const pending = [
    {
      id: 1,
      title: "Confirm Order #456",
      subtitle: "20kg Potatoes from Buyer A",
      time: "1 day ago",
    },
  ];

  const messages = [
    {
      id: 1,
      title: "Buyer Z: New Message",
      subtitle: "Are you available to deliver?",
      time: "20 mins ago",
    },
  ];

  const confirmLogout = () => {
    showAppAlert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      // remove only the keys you previously used
      const keysToRemove = [
        "isLoggedIn",
        "role",
        "farmerPhone",
        "farmerId",
        "farmerData",
        // add other keys you use for auth tokens here, e.g. "authToken"
      ];
      await AsyncStorage.multiRemove(keysToRemove);

      // Replace nav stack with auth/login so user can't go back
      router.replace("/(auth)/Login");
    } catch (err) {
      console.error("Logout error:", err);
      showAppAlert("Error", "Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <View className="flex-1 bg-gray-50">
      {/* TOP HEADER */}
      <View className="bg-white border-b border-gray-200 px-5 pt-5 pb-5 mt-6">
        <Text className="text-xl font-medium text-gray-900">My Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4 py-4"
      >
        {/* Header / Profile card */}
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <View className="flex-row items-center">
            <Image
              source={{ uri: user.avatar }}
              className="w-14 h-14 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-800">
                {user.name}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5 font-medium">
                {user.location}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              onPress={() => {
                /* edit profile */
              }}
            >
              <Edit size={16} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Wallet */}
          <View className="mt-4 bg-emerald-50 rounded-lg p-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs text-gray-600 font-medium">
                  Wallet Balance
                </Text>
                <Text className="text-2xl text-emerald-700 mt-1 font-medium">
                  ₹ {user.wallet}
                </Text>
              </View>
              <TouchableOpacity
                className="bg-emerald-700 px-3 py-2 rounded-md font-medium"
                onPress={() => {
                  /* view transactions */
                }}
              >
                <Text className="text-white text-sm font-medium">
                  View Transactions
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-2 mt-3 space-x-3">
              <TouchableOpacity
                className="flex-1 bg-white border border-gray-200 rounded-lg py-3 items-center justify-center"
                onPress={() => {}}
              >
                <Plus size={18} color="#10B981" />
                <Text className="text-xs text-gray-700 mt-1 font-medium">
                  New Listing
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-white border border-gray-200 rounded-lg py-3 items-center justify-center"
                onPress={() => {}}
              >
                <FileText size={18} color="#10B981" />
                <Text className="text-xs text-gray-700 mt-1 font-medium">
                  Post Crop
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Bell size={18} color="#111827" />
              <Text className="ml-2 text-sm font-medium text-gray-800">
                Notifications
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-xs text-emerald-600 font-medium">
                View All Notifications
              </Text>
            </TouchableOpacity>
          </View>

          {notifications.map((n) => (
            <View
              key={n.id}
              className="flex-row items-start py-2 border-t border-gray-100"
            >
              <View className="w-9 h-9 rounded-md bg-emerald-50 items-center justify-center mr-3">
                <Inbox size={16} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-800 font-medium font-medium">
                  {n.title}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5 font-medium">
                  {n.subtitle}
                </Text>
              </View>
              <Text className="text-xs text-gray-400 ml-2">{n.time}</Text>
            </View>
          ))}
        </View>

        {/* Pending Actions */}
        <View className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-medium text-gray-800">
              Pending Actions
            </Text>
            <TouchableOpacity>
              <Text className="text-xs text-emerald-600 font-medium">
                View All Pending
              </Text>
            </TouchableOpacity>
          </View>

          {pending.map((p) => (
            <View
              key={p.id}
              className="flex-row items-start py-2 border-t border-gray-100"
            >
              <View className="w-9 h-9 rounded-md bg-orange-50 items-center justify-center mr-3">
                <CreditCard size={16} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-800 font-medium">
                  {p.title}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5 font-medium">
                  {p.subtitle}
                </Text>
              </View>
              <Text className="text-xs text-gray-400 ml-2 font-medium">
                {p.time}
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Messages */}
        <View className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <MessageSquare size={18} color="#111827" />
              <Text className="ml-2 text-sm font-medium text-gray-800">
                Recent Messages
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-xs text-emerald-600 font-medium">
                View All Messages
              </Text>
            </TouchableOpacity>
          </View>

          {messages.map((m) => (
            <View
              key={m.id}
              className="flex-row items-start py-2 border-t border-gray-100"
            >
              <View className="w-9 h-9 rounded-md bg-blue-50 items-center justify-center mr-3">
                <User size={16} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-800 font-medium font-medium">
                  {m.title}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5 font-medium">
                  {m.subtitle}
                </Text>
              </View>
              <Text className="text-xs text-gray-400 ml-2 font-medium">
                {m.time}
              </Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <View className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <Text className="text-sm font-medium text-gray-800 mb-3">
            Settings & More
          </Text>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <Globe size={18} color="#374151" />
              <Text className="ml-3 text-sm text-gray-800 font-medium">
                Language Settings
              </Text>
            </View>
            <Text className="text-xs text-gray-400 font-medium">EN</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <Lock size={18} color="#374151" />
              <Text className="ml-3 text-sm text-gray-800 font-medium">
                Manage PIN & Security
              </Text>
            </View>
            <ChevronRightIcon />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <FileText size={18} color="#374151" />
              <Text className="ml-3 text-sm text-gray-800 font-medium">
                Offline Drafts
              </Text>
            </View>
            <ChevronRightIcon />
          </TouchableOpacity>

          {/* Logout Button */}
          <View className="mt-4 border-t border-gray-100 pt-4">
            <TouchableOpacity
              className="flex-row items-center justify-center py-3 rounded-lg bg-red-600"
              onPress={confirmLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-medium">Logout</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
     
     <CustomAlert
  visible={showAlert}
  title={alertTitle}
  message={alertMessage}
  onClose={() => {
    setShowAlert(false);
    if (alertAction) alertAction();   // optional navigation callback
  }}
/>

    </>
  );
};

// small chevron component to avoid importing extra lib
const ChevronRightIcon = () => (
  <View className="ml-2">
    <Text className="text-gray-400">›</Text>
  </View>
);

export default ProfileScreen;
