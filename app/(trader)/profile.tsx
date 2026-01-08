// TraderProfileScreen.tsx
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
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface TraderData {
    id: string;
    name: string;
    email: string;
    mobileNo: string;
    traderId: string;
    state: string;
    district: string;
    role: string;
    isActive: boolean;
    registrationStatus: string;
}

const TraderProfileScreen: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [traderData, setTraderData] = useState<TraderData | null>(null);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    useEffect(() => {
        fetchTraderProfile();
    }, []);

    const fetchTraderProfile = async () => {
        try {
            setFetchingProfile(true);

            // Get trader data from AsyncStorage
            const userData = await AsyncStorage.getItem("userData");

            if (userData) {
                const parsedData = JSON.parse(userData);
                setTraderData(parsedData);
            } else {
                Alert.alert("Error", "No trader data found. Please login again.");
                router.replace("/(auth)/Login");
            }
        } catch (error) {
            console.error("Error fetching trader profile:", error);
            Alert.alert("Error", "Failed to load profile data.");
        } finally {
            setFetchingProfile(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                  try {
                    // Clear authentication data
                    const keysToRemove = [
                      "userData",
                      "userId",
                      "userName",
                      "userMobile",
                      "userRole",
                      "traderId",
                      "isLoggedIn",
                    ];
                    await AsyncStorage.multiRemove(keysToRemove);

                    // Navigate to login
                    router.replace({
                      pathname: "/(auth)/Login",
                      params: { role: "trader" },
                    });
                  } catch (error) {
                    console.error("Logout error:", error);
                    Alert.alert("Error", "Failed to logout. Please try again.");
                  }
                },
              },
            ]
        );
    };

    // Mock data for notifications, pending, and messages
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
            subtitle: "20kg Potatoes from Farmer A",
            time: "1 day ago",
        },
    ];

    const messages = [
        {
            id: 1,
            title: "Farmer X: New Message",
            subtitle: "When can you pick up the order?",
            time: "20 mins ago",
        },
    ];

    if (fetchingProfile) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#68D75D" />
                <Text className="mt-4 text-gray-600">Loading profile...</Text>
            </View>
        );
    }

    return (
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
                        <View className="w-14 h-14 rounded-full mr-3 bg-[#68D75D] items-center justify-center">
                            <Text className="text-white text-2xl font-bold">
                                {traderData?.name?.charAt(0).toUpperCase() || "T"}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-medium text-gray-800">
                                {traderData?.name || "Trader"}
                            </Text>
                            <Text className="text-xs text-gray-500 mt-0.5 font-medium">
                                {traderData?.district}, {traderData?.state}
                            </Text>
                            <Text className="text-xs text-gray-500 mt-0.5 font-medium">
                                ID: {traderData?.traderId}
                            </Text>
                        </View>

                        <TouchableOpacity
                            className="bg-gray-100 rounded-full p-2"
                            onPress={() => {
                                Alert.alert("Coming Soon", "Edit profile feature is under development.");
                            }}
                        >
                            <Edit size={16} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    {/* Contact Info */}
                    <View className="mt-4 pt-4 border-t border-gray-100">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-xs text-gray-500 w-20">Email:</Text>
                            <Text className="text-sm text-gray-800 font-medium flex-1">
                                {traderData?.email || "N/A"}
                            </Text>
                        </View>
                        <View className="flex-row items-center mb-2">
                            <Text className="text-xs text-gray-500 w-20">Phone:</Text>
                            <Text className="text-sm text-gray-800 font-medium flex-1">
                                +91 {traderData?.mobileNo || "N/A"}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 w-20">Status:</Text>
                            <View className="flex-row items-center">
                                <View className={`w-2 h-2 rounded-full mr-2 ${traderData?.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                <Text className="text-sm text-gray-800 font-medium">
                                    {traderData?.isActive ? "Active" : "Inactive"} • {traderData?.registrationStatus}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Wallet */}
                    {/* <View className="mt-4 bg-emerald-50 rounded-lg p-3">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-xs text-gray-600 font-medium">
                                    Wallet Balance
                                </Text>
                                <Text className="text-2xl text-emerald-700 mt-1 font-medium">
                                    ₹ 0.00
                                </Text>
                            </View>
                            <TouchableOpacity
                                className="bg-emerald-700 px-3 py-2 rounded-md font-medium"
                                onPress={() => {
                                    Alert.alert("Coming Soon", "Transaction history is under development.");
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
                                onPress={() => router.push("/(traderscreen)/PostRequirement")}
                            >
                                <Plus size={18} color="#10B981" />
                                <Text className="text-xs text-gray-700 mt-1 font-medium">
                                    Post Requirement
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 bg-white border border-gray-200 rounded-lg py-3 items-center justify-center"
                                onPress={() => router.push("/(traderscreen)/TraderOrder")}
                            >
                                <FileText size={18} color="#10B981" />
                                <Text className="text-xs text-gray-700 mt-1 font-medium">
                                    My Orders
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
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
                                View All
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
                                View All
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
                                View All
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

                    <TouchableOpacity
                        className="flex-row items-center justify-between py-3 border-t border-gray-100"
                        onPress={() => Alert.alert("Coming Soon", "Language settings is under development.")}
                    >
                        <View className="flex-row items-center">
                            <Globe size={18} color="#374151" />
                            <Text className="ml-3 text-sm text-gray-800 font-medium">
                                Language Settings
                            </Text>
                        </View>
                        <Text className="text-xs text-gray-400 font-medium">EN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center justify-between py-3 border-t border-gray-100"
                        onPress={() => Alert.alert("Coming Soon", "PIN & Security management is under development.")}
                    >
                        <View className="flex-row items-center">
                            <Lock size={18} color="#374151" />
                            <Text className="ml-3 text-sm text-gray-800 font-medium">
                                Manage PIN & Security
                            </Text>
                        </View>
                        <ChevronRightIcon />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center justify-between py-3 border-t border-gray-100"
                        onPress={() => Alert.alert("Coming Soon", "Offline drafts is under development.")}
                    >
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
                            onPress={handleLogout}
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
    );
};

// small chevron component to avoid importing extra lib
const ChevronRightIcon = () => (
    <View className="ml-2">
        <Text className="text-gray-400">›</Text>
    </View>
);

export default TraderProfileScreen;
