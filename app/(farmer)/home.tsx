import {
  Banknote,
  Bell,
  ClipboardList,
  Leaf,
  ShoppingBag,
  MapPin,
  Search,
  Plus,
  Star,
  Store,
  Users,
} from "lucide-react-native";

import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    title: "Premium Quality",
    subtitle: "Get more profit here",
    image:
      "https://images.pexels.com/photos/9856/pexels-photo-9856.jpeg?_gl=1*16z3ufb*_ga*MTQzMjM5ODk3Mi4xNzY1NTEzNzQy*_ga_8JE65Q40S6*czE3NjU4ODQzODEkbzQkZzEkdDE3NjU4ODQ3MzIkajYwJGwwJGgw",
  },
  {
    id: "2",
    title: "Fresh Vegetables",
    subtitle: "Direct from farm to market",
    image:
      "https://images.pexels.com/photos/35164363/pexels-photo-35164363.jpeg?_gl=1*ge8l72*_ga*MTQzMjM5ODk3Mi4xNzY1NTEzNzQy*_ga_8JE65Q40S6*czE3NjU4ODQzODEkbzQkZzEkdDE3NjU4ODQ3OTckajU5JGwwJGgw",
  },
  {
    id: "3",
    title: "Fresh Vegetables",
    subtitle: "Direct from farm to market",
    image:
      "https://images.pexels.com/photos/27643476/pexels-photo-27643476.jpeg?_gl=1*jt8wc5*_ga*MTQzMjM5ODk3Mi4xNzY1NTEzNzQy*_ga_8JE65Q40S6*czE3NjU4ODQzODEkbzQkZzEkdDE3NjU4ODQ4NTAkajYkbDAkaDA.",
  },
];

const categories = [
  { id: "0", label: "Post Crop", icon: Plus },
  { id: "1", label: "My Crop", icon: Leaf },
  { id: "2", label: "Market", icon: Store },
  { id: "3", label: "Loan", icon: Banknote },
  { id: "4", label: "My Orders", icon: ClipboardList },
  { id: "5", label: "Crop Care", icon: Users },
  { id: "6", label: "Shopping", icon: ShoppingBag },
  { id: "7", label: "Gov. Scheme", icon: Star },
  { id: "8", label: "Notifications", icon: Bell },
];

const recentCrops = [
  {
    id: "1",
    title: "Red Capsicum",
    
    image:
      "https://images.pexels.com/photos/164504/pexels-photo-164504.jpeg?_gl=1*1n8z0un*_ga*MTQzMjM5ODk3Mi4xNzY1NTEzNzQy*_ga_8JE65Q40S6*czE3NjU4ODQzODEkbzQkZzEkdDE3NjU4ODQ1ODIkajYkbDAkaDA.",
  },
  {
    id: "2",
    title: "Fresh Tomato",
   
    image:
      "https://images.pexels.com/photos/298696/pexels-photo-298696.jpeg?_gl=1*dnzk42*_ga*MTQzMjM5ODk3Mi4xNzY1NTEzNzQy*_ga_8JE65Q40S6*czE3NjU4ODQzODEkbzQkZzEkdDE3NjU4ODQ1NzAkajE4JGwwJGgw",
  },
  {
    id: "3",
    title: "Yellow Pepper",
    
    image:
      "https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?_gl=1*yjiqct*_ga*MTQzMjM5ODk3Mi4xNzY1NTEzNzQy*_ga_8JE65Q40S6*czE3NjU4ODQzODEkbzQkZzEkdDE3NjU4ODQ1NTQkajM0JGwwJGgw",
  },
  {
    id: "4",
    title: "Yellow Pepper",
    
    image:
      "https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?_gl=1*c2ybxq*_ga*MTQzMjM5ODk3Mi4xNzY1NTEzNzQy*_ga_8JE65Q40S6*czE3NjU4ODQzODEkbzQkZzEkdDE3NjU4ODQ1MzckajUxJGwwJGgw",
  },
  {
    id: "5",
    title: "Yellow Pepper",
    
    image:
      "https://images.pexels.com/photos/1087894/pexels-photo-1087894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const showBadgeFor = ["1", "4"]; // My Crop (1), My Orders (4)

const FarmerHomeScreen: React.FC = () => {
  const [activeBanner, setActiveBanner] = useState(0);

  const handleBannerScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== activeBanner) {
      setActiveBanner(slide);
    }
  };

  return (
    <View className="flex-1 bg-white py-2">
      {/* TOP BAR */}
      <View className="flex-row items-center justify-between px-4 pt-5 pb-3 mt-5 mb-3 bg-white">
        {/* Left: Logo + App name */}
        <View className="flex-row items-center">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-11 h-11 mr-2"
            resizeMode="contain"
          />
          <Text className="text-lg font-heading text-gray-900">
            Kisan Partner
          </Text>
        </View>
        <View className="flex-row items-center me-2">
          {/* Center: Search */}
          <TouchableOpacity
            className="w-9 h-9 rounded-full items-center justify-center me-2"
            activeOpacity={0.7}
          >
            <Search size={18} color="#6B7280" />
          </TouchableOpacity>

          {/* Right: Notification */}
          <TouchableOpacity
            className="w-9 h-9 rounded-full items-center justify-center relative"
            activeOpacity={0.7}
          >
            <Bell size={18} color="#374151" />
            <View className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#1FAD4E] border border-white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* BANNER SLIDER */}
        {/* BANNER SLIDER */}
        <View className="mb-4">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleBannerScroll}
            scrollEventThrottle={16}
          >
            {banners.map((banner, index) => (
              <View key={banner.id} style={{ width }} className="px-4">
                <View className="rounded-lg overflow-hidden h-40 relative">
                  <Image
                    source={{ uri: banner.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />

                  {/* overlay */}
                  <View className="absolute inset-0 bg-black/25" />

                  {/* TEXT */}
                  <View className="absolute inset-0 justify-center px-5">
                    <Text className="text-xl text-white text-center mb-1 font-heading">
                      {banner.title}
                    </Text>
                    <Text className="text-xs text-center text-gray-100 font-subheading">
                      {banner.subtitle}
                    </Text>
                  </View>

                  {/* 🔵 DOTS INSIDE IMAGE (bottom center) */}
                  <View className="absolute bottom-2 left-0 right-0 flex-row justify-center">
                    {banners.map((_, i) => (
                      <View
                        key={i}
                        className={`w-2 h-2 rounded-2xl mx-1 ${
                          i === activeBanner ? "bg-[#1FAD4E]" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* CATEGORY TABS */}
        <View className="mb-4 px-3">
          <View className="flex-row flex-wrap">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const showBadge = showBadgeFor.includes(cat.id);

              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.85}
                  className="w-1/3 px-2 mb-3"
                >
                  {/* Card */}
                  <View className="relative bg-[#ECFDF3] border border-[#A7F3D0] rounded-lg items-center py-4">
                    {/* 🔴 Red Dot Badge */}
                    {showBadge && (
                      <View className="absolute -top-1.0 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white" />
                    )}

                    {/* Icon circle */}
                    <View className="w-10 h-10 rounded-full bg-[#D1FAE5] items-center justify-center mb-2">
                      <Icon size={18} color="#15803D" />
                    </View>

                    {/* Label */}
                    <Text className="text-xs font-medium text-[#065F46] text-center">
                      {cat.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* RECENT CROP TITLE */}
        <View className="px-5 mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-heading text-gray-800">
            Recent Crop
          </Text>
          <TouchableOpacity>
            <Text className="text-xs text-[#1FAD4E] font-medium">View all</Text>
          </TouchableOpacity>
        </View>

        {/* RECENT CROP CARDS */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {recentCrops.map((item) => (
              <View
                key={item.id}
                className="w-32 mr-3 p-1 rounded-lg bg-white border border-gray-100 shadow-sm overflow-hidden"
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-20 rounded-lg"
                  resizeMode="cover"
                />
                <View className="p-2">
                  <Text
                    className="text-[11px] text-gray-800 font-subheading"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* MAP CARD */}
        <View className="px-5 mt-2">
          <View className="rounded-lg bg-[#EAF8EE] h-44 relative overflow-hidden border border-gray-200">
            {/* Background gradient */}
            <View className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-100 opacity-60" />

            {/* FAKE MAP LINES */}
            <MapView
              style={{ width: "100%", height: 250 }}
              initialRegion={{
                latitude: 12.9995192,
                longitude: 77.6961841,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 12.9995192,
                  longitude: 77.6961841,
                }}
                title="Excerpt Technologies"
              />
            </MapView>

            {/* CENTER MAIN PIN */}
            <View className="flex-1 items-center justify-center">
              <View className="w-11 h-11 rounded-full bg-[#1FAD4E] items-center justify-center shadow-lg">
                <MapPin size={22} color="#fff" />
              </View>

              <Text className="text-[11px] text-gray-700 mt-2 font-medium">
                Your farm & nearby markets
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        className="w-12 h-12 rounded-full bg-[#1FAD4E] items-center justify-center absolute bottom-6 right-6 shadow-lg"
        onPress={() => {
          // handle add action
        }}
      >
        <Plus size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default FarmerHomeScreen;
