import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Bus,
  LogOut,
  Menu,
  MoreHorizontal,
  Train,
  TramFront
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface UserData {
  _id: string;
  personalInfo: {
    name: string;
    mobileNo: string;
  };
}

const API_BASE = "https://kisan.etpl.ai/transport";

const TransportHome: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              router.replace("/(auth)/onboarding");
            } catch (error) {
              console.error("Error clearing async storage:", error);
            }
          }
        }
      ]
    );
  };

  // Mock Data for "Your last trips"
  const lastTrips = [
    {
      id: 1,
      type: 'bus',
      name: 'Bus № 31',
      from: '72-74 Oxford St.',
      to: '20 Grosvenor Sq.',
      price: '£10.00'
    },
    {
      id: 2,
      type: 'metro',
      name: 'Central Line',
      from: 'Great Portland St.',
      to: 'Baker Street',
      price: '£5.00'
    },
    {
      id: 3,
      type: 'bus',
      name: 'Bus № 79',
      from: '103 Seymour Pl.',
      to: 'London NW1 5BR',
      price: '£7.00'
    },
    {
      id: 4,
      type: 'tram',
      name: 'Tram № 17',
      from: '377 Durnsford Rd.',
      to: '136 Buckhold Rd.',
      price: '£4.00'
    }
  ];

  const fetchUserData = useCallback(async () => {
    try {
      const storedMobile = await AsyncStorage.getItem("mobile");
      if (storedMobile) {
        const response = await axios.get(`${API_BASE}/mobile/${storedMobile}`);
        if (response?.data?.success) {
          setUser(response.data.data);
        }
      }
    } catch (err) {
      console.error("Failed to load user", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'bus': return <Bus size={24} color="#3b82f6" />; // blue-500
      case 'metro': return <Train size={24} color="#3b82f6" />;
      case 'tram': return <TramFront size={24} color="#3b82f6" />;
      default: return <Bus size={24} color="#3b82f6" />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView className="flex-1 px-5 pt-2" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8 mt-2 bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
          <View className="flex-row items-center">
             <Image 
                source={{ uri: "https://i.pravatar.cc/100?img=11" }} // Placeholder avatar
                className="w-10 h-10 rounded-xl bg-slate-200"
              />
          </View>
          <Text className="text-slate-800 font-medium text-base">
            Hey, {user?.personalInfo?.name?.split(" ")[0] || "Michael"}
          </Text>
          <View className="flex-row items-center">
            <TouchableOpacity className="p-2 mr-2" onPress={handleLogout}>
              <LogOut size={22} color="#ef4444" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <Bell size={22} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Blue Card */}
        <View className="bg-blue-500 rounded-3xl p-6 mb-6 shadow-lg shadow-blue-200 relative overflow-hidden">
          {/* Background circles decoration (optional, keeping it simple first) */}
          <View className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-30" />
          <View className="absolute bottom-0 right-10 w-32 h-32 bg-blue-400 rounded-full opacity-30" />

          <View className="flex-row justify-between items-start mb-10">
            <Text className="text-white text-xl font-medium">LondonRide</Text>
            <TouchableOpacity className="bg-blue-400/40 p-1.5 rounded-lg">
              <MoreHorizontal size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-blue-100 text-xs mb-1">Balance</Text>
              <Text className="text-white text-3xl font-medium">£5.00</Text>
            </View>
            <View className="items-end">
              <Text className="text-blue-100 text-xs mb-1">Pass id</Text>
              <Text className="text-white text-lg font-medium">798 014</Text>
            </View>
          </View>
        </View>


        {/* Your Last Trips */}
        <View className="mb-4 flex-row justify-between items-center">
            <Text className="text-slate-500 font-medium">Your last trips</Text>
            <TouchableOpacity>
                 <Menu size={20} color="#64748b" /> 
            </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between">
            {lastTrips.map((trip) => (
                <View key={trip.id} className="w-[48%] bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm">
                    <View className="bg-blue-50 w-10 h-10 rounded-xl items-center justify-center mb-3">
                        {getIcon(trip.type)}
                    </View>
                    
                    <Text className="text-slate-900 font-medium mb-3 text-base">{trip.name}</Text>
                    
                    <View className="mb-1 flex-row items-center">
                        <ArrowDownLeft size={12} color="#64748b" className="mr-1" />
                        <Text className="text-slate-400 text-xs ml-1" numberOfLines={1}>From: {trip.from}</Text>
                    </View>
                     <View className="mb-4 flex-row items-center">
                        <ArrowUpRight size={12} color="#64748b" className="mr-1" />
                        <Text className="text-slate-400 text-xs ml-1" numberOfLines={1}>To: {trip.to}</Text>
                    </View>

                    <View className="flex-row justify-between items-end">
                        <Text className="text-slate-400 text-xs">Price:</Text>
                        <Text className="text-slate-900 font-medium text-base">{trip.price}</Text>
                    </View>

                </View>
            ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default TransportHome;
