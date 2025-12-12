import {
  Banknote,
  Bell,
  ClipboardList,
  MapPin,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Store,
  Users
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


const { width } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    title: "Premium Quality",
    subtitle: "Get more profit here",
    image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg",
  },
  {
    id: "2",
    title: "Fresh Vegetables",
    subtitle: "Direct from farm to market",
    image:
      "https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "3",
    title: "Fresh Vegetables",
    subtitle: "Direct from farm to market",
    image:
      "https://images.pexels.com/photos/1087894/pexels-photo-1087894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "4",
    title: "Fresh Vegetables",
    subtitle: "Direct from farm to market",
    image:
      "https://images.pexels.com/photos/12098988/pexels-photo-12098988.jpeg?auto=compress&cs=tinysrgb&w=1200&loading=lazy",
  },
  {
    id: "5",
    title: "Fresh Vegetables",
    subtitle: "Direct from farm to market",
    image:
      "https://images.pexels.com/photos/1087894/pexels-photo-1087894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const categories = [
  { id: "1", label: "My Crop", icon: ShoppingBag },
  { id: "2", label: "Market", icon: Store },
  { id: "3", label: "Loan", icon: Banknote },
  { id: "4", label: "My Orders", icon: ClipboardList },
  { id: "5", label: "Labour", icon: Users },
];

const recentCrops = [
  {
    id: "1",
    title: "Red Capsicum",
    price: 99,
    rating: 4.3,
    image:
      "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "2",
    title: "Fresh Tomato",
    price: 89,
    rating: 4.5,
    image:
      "https://images.pexels.com/photos/6227174/pexels-photo-6227174.jpeg?auto=compress&cs=tinysrgb&w=1200&loading=lazy",
  },
  {
    id: "3",
    title: "Yellow Pepper",
    price: 99,
    rating: 4.1,
    image:
      "https://images.pexels.com/photos/15143967/pexels-photo-15143967/free-photo-of-closeup-of-one-tomato-on-the-vine.jpeg?auto=compress&cs=tinysrgb&w=1200&loading=lazy",
  },
  {
    id: "4",
    title: "Yellow Pepper",
    price: 99,
    rating: 4.1,
    image:
      "https://images.pexels.com/photos/5202194/pexels-photo-5202194.jpeg?auto=compress&cs=tinysrgb&w=1200&loading=lazy",
  },
  {
    id: "5",
    title: "Yellow Pepper",
    price: 99,
    rating: 4.1,
    image:
      "https://images.pexels.com/photos/1087894/pexels-photo-1087894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

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
      <View className="flex-row items-center justify-between px-4 pt-5 pb-3 py-5 mt-5">
        {/* Logo */}
        <View className="flex-row items-center">
          <View className="items-center justify-center mr-2">
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
          <Text className="text-base font-inter-semibold text-gray-800">
            Kisan Partner
          </Text>
        </View>

        {/* Icons right */}
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center relative">
            <Bell size={18} color="#4B5563" />
            <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border border-white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH BAR */}
      <View className="px-4 mb-3">
        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 border border-gray-200 font-semibold">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm text-gray-800 "
          />
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
                    <Text className="text-xl text-white text-center mb-1 font-inter-semibold">
                      {banner.title}
                    </Text>
                    <Text className="text-xs text-center text-gray-100 font-inter-semibold">
                      {banner.subtitle}
                    </Text>
                  </View>

                  {/* 🔵 DOTS INSIDE IMAGE (bottom center) */}
                  <View className="absolute bottom-2 left-0 right-0 flex-row justify-center">
                    {banners.map((_, i) => (
                      <View
                        key={i}
                        className={`w-5 h-2 rounded-2xl mx-1 ${
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
        <View className="px-4 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.id}
                  className="mr-3 items-center font-semibold"
                >
                  <View className="w-16 h-16  rounded-lg bg-green-50 border-[#1FAD4E]/30 items-center justify-center mb-1">
                    <Icon size={22} color="#1FAD4E" />
                  </View>
                  <Text className="text-xs text-gray-700 font-inter-semibold">
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* RECENT CROP TITLE */}
        <View className="px-4 mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-inter-semibold text-gray-800">
            Recent Crop
          </Text>
          <TouchableOpacity>
            <Text className="text-xs text-[#1FAD4E] font-inter-semibold">
              View all
            </Text>
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
                className="w-32 mr-3 rounded-lg bg-white border border-gray-100 shadow-sm overflow-hidden"
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-20"
                  resizeMode="cover"
                />
                <View className="p-2">
                  <Text
                    className="text-[11px] font-medium text-gray-800 font-inter-semibold"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>

                  {/* rating */}
                  <View className="flex-row items-center mt-1">
                    <Star size={10} color="#FACC15" fill="#FACC15" />
                    <Text className="text-[10px] text-gray-600 ml-1 font-inter-semibold">
                      {item.rating}
                    </Text>
                  </View>

                  {/* price */}
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-xs font-inter-semibold text-gray-900 font-inter-semibold">
                      ${item.price}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* MAP CARD */}
        <View className="px-4 mt-2">
  <View className="rounded-lg bg-[#EAF8EE] h-44 relative overflow-hidden border border-gray-200">

    {/* Background gradient */}
    <View className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-100 opacity-60" />

    {/* FAKE MAP LINES */}
    <View className="absolute inset-0">
      {/* horizontal major roads */}
      <View className="absolute top-8 left-5 right-5 h-[3px] bg-gray-300 rounded-full" />
      <View className="absolute top-16 left-7 right-7 h-[2px] bg-gray-200 rounded-full" />
      <View className="absolute bottom-14 left-10 right-6 h-[2px] bg-gray-200 rounded-full" />

      {/* vertical major roads */}
      <View className="absolute left-10 top-5 bottom-10 w-[3px] bg-gray-300 rounded-full" />
      <View className="absolute right-14 top-10 bottom-5 w-[2px] bg-gray-200 rounded-full" />

      {/* small blocks / farms */}
      <View className="absolute left-16 top-6 w-12 h-10 bg-white rounded-lg border border-gray-300 opacity-90" />
      <View className="absolute right-10 top-20 w-14 h-10 bg-white rounded-lg border border-gray-300 opacity-90" />
      <View className="absolute left-10 bottom-12 w-14 h-12 bg-white rounded-lg border border-gray-300 opacity-90" />
      <View className="absolute right-16 bottom-6 w-12 h-9 bg-white rounded-lg border border-gray-300 opacity-90" />

      {/* fake market pins */}
      <View className="absolute left-24 top-12 w-5 h-5 rounded-full bg-orange-500 items-center justify-center">
        <View className="w-2 h-2 rounded-full bg-white" />
      </View>
      <View className="absolute right-16 top-24 w-5 h-5 rounded-full bg-orange-400 items-center justify-center">
        <View className="w-2 h-2 rounded-full bg-white" />
      </View>
      <View className="absolute left-12 bottom-16 w-5 h-5 rounded-full bg-orange-400 items-center justify-center">
        <View className="w-2 h-2 rounded-full bg-white" />
      </View>
    </View>

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