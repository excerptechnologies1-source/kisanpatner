// import Ionicons from "@expo/vector-icons/Ionicons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { BlurView } from "expo-blur";
// import { router } from "expo-router";
// import { ShoppingCart } from "lucide-react-native";
// import React, { useRef, useState } from "react";
// import {
//   Alert,
//   Animated,
//   Dimensions,
//   Modal,
//   Pressable,
//   SafeAreaView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const { width } = Dimensions.get("window");

// type MenuItem = {
//   id: number;
//   icon: keyof typeof Ionicons.glyphMap;
//   label: string;
//   route: string;
// };

// const KisanHeader: React.FC = () => {
//   const [visible, setVisible] = useState(false);

//   // Sidebar slide animation
//   const slideAnim = useRef(new Animated.Value(width)).current;

//   const openSidebar = () => {
//     setVisible(true);

//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 250,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeSidebar = () => {
//     Animated.timing(slideAnim, {
//       toValue: width,
//       duration: 250,
//       useNativeDriver: true,
//     }).start(() => setVisible(false));
//   };

//   const menuItems: MenuItem[] = [
//     { id: 1, icon: "person-outline", label: "Profile", route: "/profile" },
//     { id: 2, icon: "home-outline", label: "Home", route: "/home" },
//     { id: 3, icon: "cart-outline", label: "My Orders", route: "/orders" },
//     // { id: 4, icon: "settings-outline", label: "Settings", route: "/settings" },
//     // { id: 5, icon: "help-circle-outline", label: "Help & Support", route: "/help" },
//     { id: 6, icon: "log-out-outline", label: "Logout", route: "/logout" },
//   ];

//   const handleMenuItemPress = async (item: MenuItem) => {
//     closeSidebar();

//     // Small delay to let sidebar close animation complete
//     setTimeout(async () => {
//       switch (item.label) {
//         case "Profile":
//           router.push("/(trader)/profile");
//           break;

//         case "Home":
//           router.push("/(trader)/home");
//           break;

//         case "My Orders":
//           router.push("/(traderscreen)/TraderOrder");
//           break;

//         case "Settings":
//           Alert.alert(
//             "Coming Soon",
//             "Settings page is under development.",
//             [{ text: "OK" }]
//           );
//           break;

//         case "Help & Support":
//           Alert.alert(
//             "Coming Soon",
//             "Help & Support page is under development.",
//             [{ text: "OK" }]
//           );
//           break;

//         case "Logout":
//           Alert.alert(
//             "Logout",
//             "Are you sure you want to logout?",
//             [
//               { text: "Cancel", style: "cancel" },
//               {
//                 text: "Logout",
//                 style: "destructive",
//                 onPress: async () => {
//                   try {
//                     // Clear authentication data
//                     const keysToRemove = [
//                       "userData",
//                       "userId",
//                       "userName",
//                       "userMobile",
//                       "userRole",
//                       "traderId",
//                       "isLoggedIn",
//                     ];
//                     await AsyncStorage.multiRemove(keysToRemove);

//                     // Navigate to login
//                     router.replace({
//                       pathname: "/(auth)/Login",
//                       params: { role: "trader" },
//                     });
//                   } catch (error) {
//                     console.error("Logout error:", error);
//                     Alert.alert("Error", "Failed to logout. Please try again.");
//                   }
//                 },
//               },
//             ]
//           );
//           break;

//         default:
//           console.log("Unknown menu item:", item.label);
//       }
//     }, 300);
//   };

//   return (
//     <View className="relative w-full bg-[#68D75D]">
//       {/* Header */}
//       <SafeAreaView>
//         <View className="h-28 justify-end">
//           <View className="h-16 px-4 flex-row items-center justify-between bg-black/20">

//             {/* Menu Button */}
//             <TouchableOpacity onPress={openSidebar} className="p-2">
//               <Ionicons name="menu" size={28} color="white" />
//             </TouchableOpacity>

//             {/* Title */}
//             <View className="items-center">
//               <Text className="text-white text-xl font-medium">Kisan Partner</Text>
//               <Text className="text-white/80 text-xs">
//                 Connecting Farmers & Buyers
//               </Text>
//             </View>

//             {/* Notification */}
//             <TouchableOpacity className="p-2 relative">
//               <Ionicons name="notifications-outline" size={28} color="white" />
//               <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-white items-center justify-center">
//                 <Text className="text-white text-[10px] font-medium">3</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               className="w-9 h-9 rounded-full items-center justify-center me-2 border border-gray-300 relative"
//               activeOpacity={0.7}
//               onPress={() => router.push("/(traderscreen)/TraderOrder")}
//             >
//               <ShoppingCart size={18} color="#374151" />
//               {/* Cart item count badge - optional */}
//               <View className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border border-white items-center justify-center">
//                 <Text className="text-[10px] font-bold text-white">3</Text>
//               </View>
//             </TouchableOpacity>

//           </View>
//         </View>
//       </SafeAreaView>

//       {/* RIGHT → LEFT SLIDING SIDEBAR MODAL */}
//       <Modal transparent visible={visible} animationType="none">
//         <View className="flex-1 flex-row-reverse">

//           {/* Sidebar Sliding Panel */}
//           <Animated.View
//             style={{
//               width: width * 0.75,
//               transform: [{ translateX: slideAnim }],
//             }}
//             className="h-full bg-white shadow-xl"
//           >
//             {/* Sidebar Header */}
//             <View className="h-40 bg-[#68D75D] pt-12 px-6">
//               <TouchableOpacity
//                 onPress={closeSidebar}
//                 className="absolute top-12 right-4 p-2"
//               >
//                 <Ionicons name="close" size={26} color="white" />
//               </TouchableOpacity>

//               <View className="items-center mt-8">
//                 <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-2">
//                   <Ionicons name="person" size={40} color="#68D75D" />
//                 </View>
//                 <Text className="text-white text-lg font-medium">John Farmer</Text>
//                 <Text className="text-white/80 text-sm">john@example.com</Text>
//               </View>
//             </View>

//             {/* Menu Items */}
//             <View className="flex-1 px-4 pt-4">
//               {menuItems.map((item) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   onPress={() => handleMenuItemPress(item)}
//                   className="flex-row items-center py-4 border-b border-gray-200"
//                 >
//                   <Ionicons
//                     name={item.icon}
//                     size={24}
//                     color="#68D75D"
//                     style={{ marginRight: 15 }}
//                   />
//                   <Text className="text-gray-700 text-base">{item.label}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {/* Footer */}
//             <View className="p-5 border-t border-gray-200">
//               <Text className="text-gray-500 text-center text-sm">Version 1.0.0</Text>
//               <Text className="text-gray-400 text-center text-xs">
//                 © 2024 Kisan Partner
//               </Text>
//             </View>
//           </Animated.View>

//           {/* Blur Backdrop (Touchable to Close) */}
//           <Pressable className="flex-1" onPress={closeSidebar}>
//             <BlurView intensity={40} className="flex-1 bg-black/40" />
//           </Pressable>

//         </View>
//       </Modal>

//     </View>
//   );
// };

// export default KisanHeader;




import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type MenuItem = {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
};

const KisanHeader: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // Sidebar slide animation
  const slideAnim = useRef(new Animated.Value(width)).current;

  const openSidebar = () => {
    setVisible(true);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const menuItems: MenuItem[] = [
    { id: 1, icon: "person-outline", label: "Profile", route: "/profile" },
    { id: 2, icon: "home-outline", label: "Home", route: "/home" },
    { id: 3, icon: "cart-outline", label: "My Orders", route: "/orders" },
    // { id: 4, icon: "settings-outline", label: "Settings", route: "/settings" },
    // { id: 5, icon: "help-circle-outline", label: "Help & Support", route: "/help" },
    { id: 6, icon: "log-out-outline", label: "Logout", route: "/logout" },
  ];

  const handleMenuItemPress = async (item: MenuItem) => {
    closeSidebar();

    // Small delay to let sidebar close animation complete
    setTimeout(async () => {
      switch (item.label) {
        case "Profile":
          router.push("/(trader)/profile");
          break;

        case "Home":
          router.push("/(trader)/home");
          break;

        case "My Orders":
          router.push("/(traderscreen)/TraderOrder");
          break;

        case "Settings":
          Alert.alert(
            "Coming Soon",
            "Settings page is under development.",
            [{ text: "OK" }]
          );
          break;

        case "Help & Support":
          Alert.alert(
            "Coming Soon",
            "Help & Support page is under development.",
            [{ text: "OK" }]
          );
          break;

        case "Logout":
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
          break;

        default:
          console.log("Unknown menu item:", item.label);
      }
    }, 300);
  };

  return (
    <View className="relative w-full bg-[#68D75D]">
      {/* Header */}
      <SafeAreaView>
        <View className="h-28 justify-end">
          <View className="h-16 px-4 flex-row items-center justify-between bg-black/20">

            {/* Menu Button */}
            <TouchableOpacity onPress={openSidebar} className="p-2">
              <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>

            {/* Title */}
            <View className="items-center">
              <Text className="text-white text-xl font-medium">Kisan Partner</Text>
              <Text className="text-white/80 text-xs">
                Connecting Farmers & Buyers
              </Text>
            </View>

            {/* Notification */}
            <TouchableOpacity onPress={() => router.push('/(traderscreen)/TraderNotifications')} className="p-2 relative">
              <Ionicons name="notifications-outline" size={28} color="white" />
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-white items-center justify-center">
                <Text className="text-white text-[10px] font-medium">3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-9 h-9 rounded-full items-center justify-center me-2 border border-gray-300 relative"
              activeOpacity={0.7}
              onPress={() => router.push("/(traderscreen)/TraderOrder")}
            >
              <ShoppingCart size={18} color="#374151" />
              {/* Cart item count badge - optional */}
              <View className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border border-white items-center justify-center">
                <Text className="text-[10px] font-bold text-white">3</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </SafeAreaView>

      {/* RIGHT → LEFT SLIDING SIDEBAR MODAL */}
      <Modal transparent visible={visible} animationType="none">
        <View className="flex-1 flex-row-reverse">

          {/* Sidebar Sliding Panel */}
          <Animated.View
            style={{
              width: width * 0.75,
              transform: [{ translateX: slideAnim }],
            }}
            className="h-full bg-white shadow-xl"
          >
            {/* Sidebar Header */}
            <View className="h-40 bg-[#68D75D] pt-12 px-6">
              <TouchableOpacity
                onPress={closeSidebar}
                className="absolute top-12 right-4 p-2"
              >
                <Ionicons name="close" size={26} color="white" />
              </TouchableOpacity>

              <View className="items-center mt-8">
                <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-2">
                  <Ionicons name="person" size={40} color="#68D75D" />
                </View>
                <Text className="text-white text-lg font-medium">John Farmer</Text>
                <Text className="text-white/80 text-sm">john@example.com</Text>
              </View>
            </View>

            {/* Menu Items */}
            <View className="flex-1 px-4 pt-4">
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleMenuItemPress(item)}
                  className="flex-row items-center py-4 border-b border-gray-200"
                >
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color="#68D75D"
                    style={{ marginRight: 15 }}
                  />
                  <Text className="text-gray-700 text-base">{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer */}
            <View className="p-5 border-t border-gray-200">
              <Text className="text-gray-500 text-center text-sm">Version 1.0.0</Text>
              <Text className="text-gray-400 text-center text-xs">
                © 2024 Kisan Partner
              </Text>
            </View>
          </Animated.View>

          {/* Blur Backdrop (Touchable to Close) */}
          <Pressable className="flex-1" onPress={closeSidebar}>
            <BlurView intensity={40} className="flex-1 bg-black/40" />
          </Pressable>

        </View>
      </Modal>

    </View>
  );
};

export default KisanHeader;