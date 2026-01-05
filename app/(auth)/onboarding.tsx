// // app/(role)/SelectRoleScreen.tsx
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import React from "react";
// import { Image, Text, TouchableOpacity, View } from "react-native";

// type Role = "farmer" | "trader" | "employee" | "partner" | "transport";

// const SelectRoleScreen: React.FC = () => {
//   const handleSelect = (role: Role) => {
//     router.push({
//       pathname: "/(auth)/Login",
//       params: { role },
//     });

//     if (role == "employee"){
//       router.replace("/labourscreen/AddLabourScreen")
//       return;
//     }
//   };

//   return (
//     <View className="flex-1 bg-white px-4 pt-10">
//       <View className="items-center mt-4">
//         <Image
//           source={require("../../assets/images/logo.png")}
//           className="w-28 h-28"
//           resizeMode="contain"
//         />
//       </View>


//       {/* Card container */}
//       <View className="bg-white px-5 py-10 ">
//         {/* Header */}
//         <View className="flex-row items-center mb-3">
//           <View className="h-10 w-10 rounded-full bg-emerald-500/10 items-center justify-center mr-3">
//             <MaterialCommunityIcons name="tractor" size={22} color="#16a34a" />
//           </View>
//           <View>
//             <Text className="text-lg font-heading text-slate-900 ">
//               Today Crops
//             </Text>
//             <Text className="text-xs text-slate-500 font-subheading">
//               Farmer · Trader · Partner · Employee · Transport
//             </Text>
//           </View>
//         </View>

//         <Text className="text-xs text-slate-500 mb-4">Choose your role</Text>

//         {/* Row 1: Farmer + Trader */}
//         <View className="flex-row mb-3">
//           <TouchableOpacity
//             className="flex-1 mr-2  px-4 py-3 bg-emerald-50"
//             activeOpacity={0.8}
//             onPress={() => handleSelect("farmer")}
//           >
//             <View className="flex-row items-center mb-2">
//               <View className="h-9 w-9 rounded-full bg-emerald-500 items-center justify-center mr-2">
//                 <MaterialCommunityIcons
//                   name="sprout"
//                   size={20}
//                   color="#ffffff"
//                 />
//               </View>
//               <Text className="text-base text-emerald-900 font-heading">
//                 Farmer
//               </Text>
//             </View>
//             <Text className="text-[11px] text-emerald-800 font-subheading">Grow · Sell</Text>
//             <Text className="text-[11px] text-emerald-800 font-subheading">Manage</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="flex-1 ml-2 px-4 py-3 bg-orange-50"
//             activeOpacity={0.8}
//             onPress={() => handleSelect("trader")}
//           >
//             <View className="flex-row items-center mb-2">
//               <View className="h-9 w-9 rounded-full bg-orange-500 items-center justify-center mr-2">
//                 <MaterialCommunityIcons
//                   name="scale-balance"
//                   size={20}
//                   color="#ffffff"
//                 />
//               </View>
//               <Text className="text-base font-heading text-orange-900 ">
//                 Trader
//               </Text>
//             </View>
//             <Text className="text-[11px] text-orange-800 font-subheading">Buy · Bid</Text>
//             <Text className="text-[11px] text-orange-800 font-subheading">Settle</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Row 2: Employee (full width) */}
//         <TouchableOpacity
//           className="w-full  px-4 py-3 bg-blue-50 mb-3"
//           activeOpacity={0.8}
//           onPress={() => handleSelect("employee")}
//         >
//           <View className="flex-row items-center mb-2">
//             <View className="h-9 w-9 rounded-full bg-blue-500 items-center justify-center mr-2">
//               <MaterialCommunityIcons
//                 name="badge-account"
//                 size={20}
//                 color="#ffffff"
//               />
//             </View>
//             <Text className="text-base font-heading text-blue-900 ">
//               Employee
//             </Text>
//           </View>
//           <Text className="text-[11px] text-blue-800 font-subheading">Work · Track</Text>
//           <Text className="text-[11px] text-blue-800 font-subheading">Assist</Text>
//         </TouchableOpacity>

//         {/* Row 3: Partner + Transport */}
//         <View className="flex-row">
//           <TouchableOpacity
//             className="flex-1 mr-2 px-4 py-3 bg-amber-50"
//             activeOpacity={0.8}
//             onPress={() => handleSelect("partner")}
//           >
//             <View className="flex-row items-center mb-2">
//               <View className="h-9 w-9 rounded-full bg-amber-500 items-center justify-center mr-2">
//                 <MaterialCommunityIcons
//                   name="handshake-outline"
//                   size={20}
//                   color="#ffffff"
//                 />
//               </View>
//               <Text className="text-base font-heading text-amber-900">
//                 Partner
//               </Text>
//             </View>
//             <Text className="text-[11px] text-amber-800 font-subheading">
//               Network &amp; Grow
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="flex-1 ml-2 px-4 py-3 bg-teal-50"
//             activeOpacity={0.8}
//             onPress={() => handleSelect("transport")}
//           >
//             <View className="flex-row items-center mb-2">
//               <View className="h-9 w-9 rounded-full bg-teal-500 items-center justify-center mr-2">
//                 <MaterialCommunityIcons
//                   name="truck-delivery-outline"
//                   size={20}
//                   color="#ffffff"
//                 />
//               </View>
//               <Text className="text-base font-heading text-teal-900">
//                 Transport
//               </Text>
//             </View>
//             <Text className="text-[11px] text-teal-800 font-subheading">
//               Fleet · Loads · POD
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
     
//     </View>
//   );
// };

// export default SelectRoleScreen;



// app/(role)/SelectRoleScreen.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type Role = "farmer" | "trader" | "employee" | "partner" | "transport";

const roleData: Record<Role, {
  title: string;
  icon: string;
  description: string[];
  gradient: [string, string];
  iconColor: string;
  features: string[];
}> = {
  farmer: {
    title: "Farmer",
    icon: "sprout",
    description: ["Grow", "Sell", "Manage"],
    gradient: ["#10b981", "#059669"],
    iconColor: "#047857",
    features: ["Crop Management", "Market Access"]
  },
  trader: {
    title: "Trader",
    icon: "scale-balance",
    description: ["Buy", "Bid", "Settle"],
    gradient: ["#f97316", "#ea580c"],
    iconColor: "#c2410c",
    features: ["Real-time Bidding", "Inventory", "Settlement"]
  },
  employee: {
    title: "Employee",
    icon: "badge-account",
    description: ["Work", "Track", "Assist"],
    gradient: ["#3b82f6", "#1d4ed8"],
    iconColor: "#1e40af",
    features: ["Task Management", "Reports"]
  },
  partner: {
    title: "Partner",
    icon: "handshake-outline",
    description: ["Network", "Grow"],
    gradient: ["#f59e0b", "#d97706"],
    iconColor: "#b45309",
    features: ["Collaboration", "Growth Tools", "Resources"]
  },
  transport: {
    title: "Transport",
    icon: "truck-delivery-outline",
    description: ["Fleet", "Loads", "POD"],
    gradient: ["#0d9488", "#0f766e"],
    iconColor: "#115e59",
    features: ["Load Tracking", "Delivery Proof"]
  }
};

const SelectRoleScreen: React.FC = () => {
  const handleSelect = (role: Role) => {
    if (role === "employee") {
      router.replace("/labourscreen/AddLabourScreen");
      return;
    }
    
    router.push({
      pathname: "/(auth)/Login",
      params: { role },
    });
  };

  const RoleCard = ({ role, index }: { role: Role; index: number }) => {
    const data = roleData[role];
    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
      >
        <TouchableOpacity
          className="mb-4"
          activeOpacity={0.7}
          onPress={() => handleSelect(role)}
        >
          <View className="relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/5">
            {/* Gradient Background */}
            <View 
              className="absolute top-0 left-0 right-0 h-full"
              style={{
                backgroundColor: data.gradient[0],
                opacity: 0.1
              }}
            />
            
            <View className="p-5">
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-row items-center">
                  <View 
                    className="h-14 w-14 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: data.gradient[0] + '20' }}
                  >
                    <MaterialCommunityIcons
                      name={data.icon as any}
                      size={28}
                      color={data.gradient[0]}
                    />
                  </View>
                  <View>
                    <Text className="text-xl font-medium text-gray-900">
                      {data.title}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1">
                      {data.description.join(" · ")}
                    </Text>
                  </View>
                </View>
                
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={data.gradient[0]}
                />
              </View>
              
              <View className="flex-row flex-wrap gap-2">
                {data.features.map((feature, idx) => (
                  <View
                    key={idx}
                    className="px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: data.gradient[0] + '15' }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{ color: data.gradient[0] }}
                    >
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative Background Elements */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-50/50 to-transparent" />
      
      <Animated.ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        entering={FadeIn.duration(500)}
      >
        {/* Header Section */}
        <View className="px-6 pt-16 pb-8 items-center">
          <Animated.View entering={FadeInDown.delay(200)}>
            <View className="h-24 w-24 rounded-2xl bg-white shadow-lg items-center justify-center mb-6">
              <Image
                source={require("../../assets/images/logo.png")}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(300)}>
            <Text className="text-3xl font-medium text-center text-gray-900 mb-2">
              Welcome to Kisan Partner
            </Text>
            <Text className="text-base text-center text-gray-600 mb-6 font-medium">
              Choose your role to continue
            </Text>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.delay(400)}
            className="flex-row items-center justify-center space-x-2"
          >
            <View className="h-2 w-2 rounded-full bg-emerald-500" />
            <View className="h-2 w-2 rounded-full bg-orange-500" />
            <View className="h-2 w-2 rounded-full bg-blue-500" />
            <View className="h-2 w-2 rounded-full bg-amber-500" />
            <View className="h-2 w-2 rounded-full bg-teal-500" />
          </Animated.View>
        </View>

        {/* Cards Section */}
        <View className="px-5 pb-10">
          <Animated.Text 
            entering={FadeInDown.delay(500)}
            className="text-lg font-medium text-gray-900 mb-4 ml-1"
          >
            Select Your Role
          </Animated.Text>
          
          {(["farmer", "trader", "employee", "partner", "transport"] as Role[]).map((role, index) => (
            <RoleCard key={role} role={role} index={index} />
          ))}
          
          {/* Help Text */}
          <Animated.View 
            entering={FadeInDown.delay(1000)}
            className="mt-8 p-4 rounded-xl bg-white shadow-sm"
          >
            <View className="flex-row items-start">
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color="#6b7280"
                style={{ marginTop: 2, marginRight: 8 }}
              />
              <Text className="text-sm text-gray-600 flex-1">
                Your role determines the features and dashboard you'll access. You can switch roles later in settings.
              </Text>
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>
      
      {/* Footer */}
      <View className="px-5 pb-8 pt-4 bg-white border-t border-gray-100">
        <Text className="text-xs text-center text-gray-500">
          © 2026 Kisan Partner. All rights reserved.
        </Text>
        <Text className="text-xs text-center text-gray-500 mt-1">
          Need help? Contact support@todaycrops.com
        </Text>
      </View>
    </View>
  );
};

export default SelectRoleScreen;